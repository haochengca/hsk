import base64
import io
import os
import tempfile
from difflib import SequenceMatcher
from typing import Any, Optional

import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from PIL import Image, ImageOps
from paddleocr import TextRecognition


MODEL_NAME = os.getenv("OCR_MODEL_NAME", "PP-OCRv5_server_rec").strip() or "PP-OCRv5_server_rec"
VARIANT_LIMIT = max(1, int(os.getenv("OCR_VARIANT_LIMIT", "4") or "4"))
PASS_THRESHOLD = float(os.getenv("OCR_PASS_THRESHOLD", "0.82") or "0.82")
FUZZY_THRESHOLD = float(os.getenv("OCR_FUZZY_THRESHOLD", "0.92") or "0.92")

app = FastAPI(title="HSK PaddleOCR Service", version="1.0.0")
recognizer: Optional[TextRecognition] = None


class RecognizeRequest(BaseModel):
    image: str
    target: str = ""
    candidates: list[str] = Field(default_factory=list)
    variantLimit: int | None = None


class JudgeRequest(BaseModel):
    image: str
    target: str
    type: str = "char"
    candidates: list[str] = Field(default_factory=list)


def strip_data_url(image: str) -> bytes:
    raw = str(image or "").strip()
    if not raw:
        raise ValueError("image is empty")
    if "," in raw and raw.startswith("data:"):
        raw = raw.split(",", 1)[1]
    return base64.b64decode(raw)


def load_pil_image(image_value: str) -> Image.Image:
    try:
        payload = strip_data_url(image_value)
        image = Image.open(io.BytesIO(payload))
        return image.convert("RGB")
    except Exception as exc:
        raise ValueError("invalid image payload") from exc


def normalize_text(value: str) -> str:
    text = str(value or "").strip()
    return "".join(ch for ch in text if not ch.isspace() and ch not in ",.;:!?，。；：！？'\"()[]{}")


def similarity(a: str, b: str) -> float:
    left = normalize_text(a)
    right = normalize_text(b)
    if not left or not right:
        return 0.0
    if left == right:
        return 1.0
    return SequenceMatcher(None, left, right).ratio()


def crop_ink_area(np_img: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    inverted = 255 - gray
    _, thresh = cv2.threshold(inverted, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    points = cv2.findNonZero(thresh)
    if points is None:
        return np_img
    x, y, w, h = cv2.boundingRect(points)
    pad = max(8, int(max(w, h) * 0.18))
    x0 = max(0, x - pad)
    y0 = max(0, y - pad)
    x1 = min(np_img.shape[1], x + w + pad)
    y1 = min(np_img.shape[0], y + h + pad)
    return np_img[y0:y1, x0:x1]


def center_on_white(np_img: np.ndarray, size: int = 256) -> np.ndarray:
    h, w = np_img.shape[:2]
    canvas = np.full((size, size, 3), 255, dtype=np.uint8)
    if h == 0 or w == 0:
        return canvas
    scale = min((size * 0.82) / w, (size * 0.82) / h)
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))
    resized = cv2.resize(np_img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    off_x = (size - new_w) // 2
    off_y = (size - new_h) // 2
    canvas[off_y:off_y + new_h, off_x:off_x + new_w] = resized
    return canvas


def build_variants(image: Image.Image, limit: int) -> list[dict[str, Any]]:
    base = np.array(image.convert("RGB"))
    cropped = crop_ink_area(base)
    gray = cv2.cvtColor(cropped, cv2.COLOR_RGB2GRAY)
    auto = np.array(ImageOps.autocontrast(Image.fromarray(gray)).convert("RGB"))
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    binary_rgb = cv2.cvtColor(binary, cv2.COLOR_GRAY2RGB)
    inverted_rgb = cv2.cvtColor(255 - binary, cv2.COLOR_GRAY2RGB)

    variants = [
        {"name": "cropped", "image": center_on_white(cropped)},
        {"name": "autocontrast", "image": center_on_white(auto)},
        {"name": "binary", "image": center_on_white(binary_rgb)},
        {"name": "binary_inverted", "image": center_on_white(inverted_rgb)}
    ]
    return variants[: max(1, limit)]


def extract_best_text(result: Any) -> tuple[str, float]:
    if result is None:
        return "", 0.0
    if isinstance(result, dict):
        text = result.get("rec_text") or result.get("text") or ""
        score = result.get("rec_score") or result.get("score") or 0.0
        return str(text or ""), float(score or 0.0)
    text = getattr(result, "rec_text", None)
    score = getattr(result, "rec_score", None)
    if text is not None or score is not None:
        return str(text or ""), float(score or 0.0)
    if hasattr(result, "to_json"):
        try:
            return extract_best_text(result.to_json())
        except Exception:
            return "", 0.0
    return "", 0.0


def recognize_variant(np_img: np.ndarray, variant_name: str) -> dict[str, Any]:
    assert recognizer is not None
    with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp:
        Image.fromarray(np_img).save(tmp.name)
        outputs = recognizer.predict(input=tmp.name)
    best_text = ""
    best_score = 0.0
    for item in outputs or []:
        text, score = extract_best_text(item)
        if score >= best_score:
            best_text = text
            best_score = score
    return {
        "variant": variant_name,
        "text": normalize_text(best_text),
        "score": round(float(best_score), 4)
    }


def sort_candidates(results: list[dict[str, Any]], target: str, candidates: list[str]) -> list[dict[str, Any]]:
    normalized_target = normalize_text(target)
    candidate_set = {normalize_text(item) for item in candidates if normalize_text(item)}

    def rank(item: dict[str, Any]) -> tuple[float, float, float]:
        text = normalize_text(item.get("text", ""))
        score = float(item.get("score", 0.0) or 0.0)
        exact = 1.0 if normalized_target and text == normalized_target else 0.0
        hint = 1.0 if text and text in candidate_set else 0.0
        sim = similarity(text, normalized_target) if normalized_target else 0.0
        return (exact * 10.0 + hint * 2.0 + sim, score, -len(text))

    return sorted(results, key=rank, reverse=True)


def judge_from_result(best: dict[str, Any], target: str) -> dict[str, Any]:
    recognized = normalize_text(best.get("text", ""))
    normalized_target = normalize_text(target)
    score = float(best.get("score", 0.0) or 0.0)
    sim = similarity(recognized, normalized_target)
    exact = recognized == normalized_target and bool(recognized)
    fuzzy = sim >= FUZZY_THRESHOLD and score >= PASS_THRESHOLD
    passed = exact or fuzzy
    reason = "exact_match" if exact else "fuzzy_match" if fuzzy else "ocr_mismatch"
    return {
        "ok": True,
        "target": target,
        "recognizedText": recognized,
        "normalizedTarget": normalized_target,
        "systemResult": passed,
        "finalResult": passed,
        "accuracyPercent": int(round(max(score, sim if passed else 0.0) * 100)),
        "judgeDetail": {
            "version": "paddleocr-v1",
            "engine": MODEL_NAME,
            "decision": "pass" if passed else "fail",
            "decisionScore": round(score, 4),
            "similarity": round(sim, 4),
            "variant": best.get("variant", ""),
            "reason": reason,
            "ocrFirst": True,
            "thresholds": {
                "passConfidence": PASS_THRESHOLD,
                "fuzzySimilarity": FUZZY_THRESHOLD
            }
        }
    }


def run_recognition(
    image_value: str,
    target: str = "",
    candidates: Optional[list[str]] = None,
    variant_limit: Optional[int] = None
) -> dict[str, Any]:
    image = load_pil_image(image_value)
    variants = build_variants(image, min(VARIANT_LIMIT, variant_limit or VARIANT_LIMIT))
    results = [recognize_variant(item["image"], item["name"]) for item in variants]
    ranked = sort_candidates(results, target, candidates or [])
    best = ranked[0] if ranked else {"text": "", "score": 0.0, "variant": ""}
    return {
        "ok": True,
        "engine": MODEL_NAME,
        "bestText": best.get("text", ""),
        "bestScore": best.get("score", 0.0),
        "bestVariant": best.get("variant", ""),
        "results": ranked
    }


@app.on_event("startup")
def startup_event() -> None:
    global recognizer
    recognizer = TextRecognition(model_name=MODEL_NAME)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "service": "paddle-ocr",
        "model": MODEL_NAME,
        "ready": recognizer is not None
    }


@app.post("/ocr/recognize")
def recognize(request: RecognizeRequest) -> dict[str, Any]:
    try:
        return run_recognition(
            image_value=request.image,
            target=request.target,
            candidates=request.candidates,
            variant_limit=request.variantLimit
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"ocr failed: {exc}") from exc


@app.post("/ocr/judge")
def judge(request: JudgeRequest) -> dict[str, Any]:
    try:
        recognized = run_recognition(
            image_value=request.image,
            target=request.target,
            candidates=request.candidates,
            variant_limit=VARIANT_LIMIT
        )
        best = {
            "text": recognized.get("bestText", ""),
            "score": recognized.get("bestScore", 0.0),
            "variant": recognized.get("bestVariant", "")
        }
        payload = judge_from_result(best, request.target)
        payload["type"] = "word" if request.type == "word" else "char"
        payload["candidates"] = recognized.get("results", [])
        return payload
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"ocr judge failed: {exc}") from exc
