import base64
import json
import os
import threading
import time
from functools import lru_cache
from io import BytesIO
from typing import Literal

import numpy as np
import paddle
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from paddleocr import TextRecognition, __version__ as paddleocr_version
from PIL import Image, ImageOps
from pydantic import BaseModel, Field, model_validator


APP_NAME = "hsk-paddleocr-api"
APP_VERSION = "1.0.0"
DEVICE = os.getenv("PADDLE_OCR_DEVICE", "cpu").strip() or "cpu"
REC_MODEL_NAME = os.getenv("PADDLEOCR_REC_MODEL_NAME", "PP-OCRv5_server_rec").strip() or "PP-OCRv5_server_rec"
DEFAULT_MAX_IMAGES = max(1, int(os.getenv("PADDLE_OCR_MAX_IMAGES", "12")))
PREDICT_LOCK = threading.Lock()


class RecognizeRequest(BaseModel):
    images: list[str] = Field(..., min_length=1, max_length=DEFAULT_MAX_IMAGES)
    expected_texts: list[str] | None = None
    mode: Literal["single_char", "single_line"] = "single_char"

    @model_validator(mode="after")
    def validate_lengths(self):
        if self.expected_texts is not None and len(self.expected_texts) != len(self.images):
            raise ValueError("expected_texts length must equal images length")
        return self


app = FastAPI(title=APP_NAME, version=APP_VERSION)


@app.exception_handler(HTTPException)
async def http_exception_handler(_request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"ok": False, "message": str(exc.detail)})


@app.exception_handler(Exception)
async def unexpected_exception_handler(_request, exc: Exception):
    return JSONResponse(status_code=500, content={"ok": False, "message": str(exc)})


@lru_cache(maxsize=1)
def get_recognizer():
    return TextRecognition(model_name=REC_MODEL_NAME, device=DEVICE)


@app.on_event("startup")
def warmup_model():
    get_recognizer()


def decode_data_url(data: str) -> Image.Image:
    payload = str(data or "").strip()
    if not payload:
        raise HTTPException(status_code=400, detail="image is required")
    if payload.startswith("data:"):
        try:
            payload = payload.split(",", 1)[1]
        except IndexError as exc:
            raise HTTPException(status_code=400, detail="invalid data url") from exc
    try:
        binary = base64.b64decode(payload, validate=True)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="invalid base64 image") from exc
    try:
        image = Image.open(BytesIO(binary))
        return image.convert("L")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="unsupported image") from exc


def crop_foreground(image: Image.Image, threshold: int = 245) -> Image.Image:
    mask = image.point(lambda value: 255 if value < threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return image.copy()
    return image.crop(bbox)


def square_pad(image: Image.Image, pad_ratio: float = 0.22) -> Image.Image:
    width, height = image.size
    side = max(width, height)
    padding = max(8, int(round(side * pad_ratio)))
    canvas = Image.new("L", (side + padding * 2, side + padding * 2), color=255)
    offset_x = (canvas.width - width) // 2
    offset_y = (canvas.height - height) // 2
    canvas.paste(image, (offset_x, offset_y))
    return canvas


def line_pad(image: Image.Image, pad_x_ratio: float = 0.12, pad_y_ratio: float = 0.2) -> Image.Image:
    width, height = image.size
    pad_x = max(8, int(round(width * pad_x_ratio)))
    pad_y = max(8, int(round(height * pad_y_ratio)))
    canvas = Image.new("L", (width + pad_x * 2, height + pad_y * 2), color=255)
    canvas.paste(image, (pad_x, pad_y))
    return canvas


def normalize_handwriting_image(image: Image.Image, mode: str) -> Image.Image:
    normalized = ImageOps.autocontrast(image)
    normalized = crop_foreground(normalized)
    if mode == "single_char":
        normalized = square_pad(normalized, pad_ratio=0.28)
    else:
        normalized = line_pad(normalized)
    return normalized


def make_binary_variant(image: Image.Image) -> Image.Image:
    return image.point(lambda value: 0 if value < 196 else 255)


def build_variants(image: Image.Image, mode: str) -> list[tuple[str, Image.Image]]:
    normalized = normalize_handwriting_image(image, mode)
    variants = [
        ("raw", image.convert("RGB")),
        ("normalized", normalized.convert("RGB"))
    ]
    if mode == "single_char":
        variants.append(("binary", make_binary_variant(normalized).convert("RGB")))
    return variants


def prepare_predict_inputs(request: RecognizeRequest):
    images = [decode_data_url(item) for item in request.images]
    expected_texts = request.expected_texts or [""] * len(images)
    predict_inputs: list[np.ndarray] = []
    meta: list[dict] = []
    for index, image in enumerate(images):
        for variant_name, variant in build_variants(image, request.mode):
            predict_inputs.append(np.asarray(variant))
            meta.append(
                {
                    "index": index,
                    "expected_text": str(expected_texts[index] or "").strip(),
                    "variant": variant_name
                }
            )
    return predict_inputs, meta


def result_to_dict(output) -> dict:
    if isinstance(output, dict):
        return output
    if hasattr(output, "json"):
        payload = output.json() if callable(output.json) else output.json
        if isinstance(payload, str):
            try:
                return json.loads(payload)
            except json.JSONDecodeError:
                return {}
        if isinstance(payload, dict):
            return payload
    if hasattr(output, "res") and isinstance(output.res, dict):
        return {"res": output.res}
    return {}


def extract_prediction(output) -> tuple[str, float]:
    parsed = result_to_dict(output)
    result = parsed.get("res", parsed)
    text = str(result.get("rec_text") or "").strip()
    score = result.get("rec_score")
    try:
        confidence = max(0.0, min(1.0, float(score)))
    except (TypeError, ValueError):
        confidence = 0.0
    return text, confidence


def rank_candidates(predictions: list[dict]) -> list[dict]:
    best_by_text: dict[str, dict] = {}
    for item in predictions:
        text = str(item.get("text") or "").strip()
        if not text:
            continue
        current = best_by_text.get(text)
        if current is None or float(item.get("confidence") or 0) > float(current.get("confidence") or 0):
            best_by_text[text] = {
                "text": text,
                "confidence": max(0.0, min(1.0, float(item.get("confidence") or 0))),
                "variant": str(item.get("variant") or "")
            }
    ranked = sorted(
        best_by_text.values(),
        key=lambda item: (float(item.get("confidence") or 0), item.get("text") == ""),
        reverse=True
    )
    return ranked


def choose_best_prediction(predictions: list[dict], expected_text: str) -> dict:
    candidates = rank_candidates(predictions)
    if expected_text:
        expected_match = [item for item in candidates if item["text"] == expected_text]
        if expected_match:
            best = expected_match[0].copy()
            best["match"] = True
            return best
    if candidates:
        best = candidates[0].copy()
        best["match"] = bool(expected_text) and best["text"] == expected_text
        return best
    return {"text": "", "confidence": 0.0, "variant": "", "match": False}


def recognize_batch(request: RecognizeRequest) -> dict:
    predict_inputs, meta = prepare_predict_inputs(request)
    started_at = time.perf_counter()
    with PREDICT_LOCK:
        outputs = list(get_recognizer().predict(input=predict_inputs, batch_size=len(predict_inputs)))
    grouped: dict[int, list[dict]] = {index: [] for index in range(len(request.images))}
    for output, item_meta in zip(outputs, meta, strict=True):
        text, confidence = extract_prediction(output)
        grouped[item_meta["index"]].append(
            {
                "text": text,
                "confidence": confidence,
                "variant": item_meta["variant"],
                "expected_text": item_meta["expected_text"]
            }
        )

    results = []
    for index in range(len(request.images)):
        predictions = grouped.get(index, [])
        expected_text = str((request.expected_texts or [""] * len(request.images))[index] or "").strip()
        best = choose_best_prediction(predictions, expected_text)
        results.append(
            {
                "index": index,
                "text": best["text"],
                "confidence": best["confidence"],
                "match": best["match"],
                "expectedText": expected_text,
                "variant": best["variant"],
                "candidates": rank_candidates(predictions)[:3]
            }
        )
    elapsed_ms = round((time.perf_counter() - started_at) * 1000, 2)
    return {
        "ok": True,
        "engine": {
            "provider": "PaddleOCR",
            "modelName": REC_MODEL_NAME,
            "device": DEVICE,
            "paddleVersion": paddle.__version__,
            "paddleocrVersion": paddleocr_version,
            "mode": request.mode,
            "variants": ["raw", "normalized", "binary"] if request.mode == "single_char" else ["raw", "normalized"]
        },
        "elapsedMs": elapsed_ms,
        "results": results
    }


@app.get("/health")
def health():
    recognizer = get_recognizer()
    return {
        "ok": True,
        "service": APP_NAME,
        "version": APP_VERSION,
        "ready": recognizer is not None,
        "engine": {
            "provider": "PaddleOCR",
            "modelName": REC_MODEL_NAME,
            "device": DEVICE,
            "paddleVersion": paddle.__version__,
            "paddleocrVersion": paddleocr_version
        }
    }


@app.post("/ocr/recognize")
def recognize(request: RecognizeRequest):
    return recognize_batch(request)
