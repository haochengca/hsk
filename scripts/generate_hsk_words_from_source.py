from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "data" / "hsk_source"
OUTPUT_FILE = ROOT / "data" / "hsk_words_1_6.json"
JS_OUTPUT_FILE = ROOT / "data" / "hsk_words_1_6.js"


def normalize_meaning(columns: list[str]) -> str:
    parts = [part.strip() for part in columns[4:] if part.strip()]
    return sanitize_meaning(" ".join(parts))


def sanitize_meaning(text: str) -> str:
    value = str(text or "").strip()
    if not value:
        return "-"
    value = re.sub(r"[\u3400-\u4dbf\u4e00-\u9fff]+", "", value)
    value = re.sub(r"[，。；：、“”‘’（）《》【】〈〉「」『』]", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"\s+([,.;:!?])", r"\1", value)
    return value or "-"


def build_items() -> list[dict[str, object]]:
    items: list[dict[str, object]] = []
    seen: set[str] = set()
    for path in sorted(SOURCE_DIR.glob("L*.txt"), key=lambda p: int(p.stem[1:])):
        level = int(path.stem[1:])
        for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
            line = raw_line.strip()
            if not line:
                continue
            columns = [part.strip() for part in raw_line.split("\t")]
            word = columns[0] if len(columns) > 0 else ""
            pinyin = columns[3] if len(columns) > 3 else (columns[2] if len(columns) > 2 else "")
            meaning = normalize_meaning(columns)
            if not word or len(word) <= 1 or word in seen:
                continue
            seen.add(word)
            items.append(
                {
                    "word": word,
                    "pinyin": pinyin,
                    "meaning": meaning,
                    "level": level,
                    "phrase": word,
                    "prompt1": word,
                    "prompt2": meaning,
                    "sentence": f"我正在学习“{word}”。",
                }
            )
    return items


def main() -> None:
    items = build_items()
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    OUTPUT_FILE.write_text(payload + "\n", encoding="utf-8")
    JS_OUTPUT_FILE.write_text(f"window.HSK_WORDS = {payload};\n", encoding="utf-8")
    counts: dict[int, int] = {}
    for item in items:
        level = int(item["level"])
        counts[level] = counts.get(level, 0) + 1
    print(f"Generated {len(items)} items -> {OUTPUT_FILE}")
    print(f"Generated browser bundle -> {JS_OUTPUT_FILE}")
    print("Level counts:", counts)


if __name__ == "__main__":
    main()
