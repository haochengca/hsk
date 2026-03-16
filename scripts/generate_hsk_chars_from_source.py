from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "data" / "hsk_source"
OUTPUT_FILE = ROOT / "data" / "hsk_chars_1_6.json"
JS_OUTPUT_FILE = ROOT / "data" / "hsk_chars_1_6.js"


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


ACCENTED_TO_PLAIN = {
    "ā": "a",
    "á": "a",
    "ǎ": "a",
    "à": "a",
    "ē": "e",
    "é": "e",
    "ě": "e",
    "è": "e",
    "ī": "i",
    "í": "i",
    "ǐ": "i",
    "ì": "i",
    "ō": "o",
    "ó": "o",
    "ǒ": "o",
    "ò": "o",
    "ū": "u",
    "ú": "u",
    "ǔ": "u",
    "ù": "u",
    "ǖ": "ü",
    "ǘ": "ü",
    "ǚ": "ü",
    "ǜ": "ü",
    "ü": "ü",
}

COMMON_SUFFIXES = {"de", "ma", "ne", "ba", "le", "zi", "men", "r"}
TONE_MARKS = {
    "a": ["a", "ā", "á", "ǎ", "à"],
    "e": ["e", "ē", "é", "ě", "è"],
    "i": ["i", "ī", "í", "ǐ", "ì"],
    "o": ["o", "ō", "ó", "ǒ", "ò"],
    "u": ["u", "ū", "ú", "ǔ", "ù"],
    "ü": ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
}


def normalize_pinyin_token(token: str, strip_tone: bool = False) -> str:
    out = []
    for ch in str(token or "").strip().lower():
        if "a" <= ch <= "z":
            out.append(ch)
        elif ch == "'":
            continue
        elif ch in ACCENTED_TO_PLAIN:
            value = ACCENTED_TO_PLAIN[ch]
            out.append("v" if strip_tone and value == "ü" else (value if strip_tone else ch))
        elif strip_tone and ch == "ü":
            out.append("v")
        elif not strip_tone and ch == "ü":
            out.append("ü")
    return "".join(out)


def split_raw_tokens(pinyin: str) -> list[str]:
    return [part for part in str(pinyin or "").strip().split() if part]


def numbered_syllable_to_accented(token: str) -> str:
    raw = str(token or "").strip().lower().replace("u:", "ü").replace("v", "ü")
    if not raw:
        return ""
    tone = 5
    if raw[-1].isdigit():
        tone = int(raw[-1])
        raw = raw[:-1]
    if tone == 5 or tone == 0:
        return raw
    vowel_positions = [idx for idx, ch in enumerate(raw) if ch in TONE_MARKS]
    if not vowel_positions:
        return raw
    if "a" in raw:
        pos = raw.index("a")
    elif "e" in raw:
        pos = raw.index("e")
    elif "ou" in raw:
        pos = raw.index("o")
    else:
        pos = vowel_positions[-1]
    vowel = raw[pos]
    return raw[:pos] + TONE_MARKS[vowel][tone] + raw[pos + 1 :]


def split_numbered_pinyin(word: str, numbered_pinyin: str) -> list[str] | None:
    chars = list(word)
    if not chars:
        return None
    compact = str(numbered_pinyin or "").strip().replace(" ", "").replace("'", "")
    if not compact:
        return None
    tokens = []
    current = []
    for ch in compact:
        current.append(ch)
        if ch.isdigit():
            tokens.append("".join(current))
            current = []
    if current:
        tokens.append("".join(current))
    if len(tokens) != len(chars):
        return None
    return [numbered_syllable_to_accented(token) for token in tokens]


def split_compact_pinyin(chars: list[str], pinyin: str, known_plain_by_char: dict[str, str]) -> list[str] | None:
    raw_compact = normalize_pinyin_token(pinyin, False)
    plain_compact = normalize_pinyin_token(pinyin, True)
    if not raw_compact or not plain_compact or len(raw_compact) != len(plain_compact):
        return None

    valid_syllables = {plain for plain in known_plain_by_char.values() if plain}
    total_chars = len(chars)
    memo: dict[tuple[int, int], tuple[int, list[int]] | None] = {}

    def solve(idx_char: int, idx_pos: int) -> tuple[int, list[int]] | None:
        key = (idx_char, idx_pos)
        if key in memo:
            return memo[key]
        if idx_char == total_chars and idx_pos == len(plain_compact):
            return (0, [])
        if idx_char >= total_chars or idx_pos >= len(plain_compact):
            return None

        remain_chars = total_chars - idx_char
        remain_len = len(plain_compact) - idx_pos
        if remain_len < remain_chars or remain_len > remain_chars * 7:
            return None

        best: tuple[int, list[int]] | None = None
        max_len = min(7, remain_len - (remain_chars - 1))
        for seg_len in range(1, max_len + 1):
            seg = plain_compact[idx_pos : idx_pos + seg_len]
            next_result = solve(idx_char + 1, idx_pos + seg_len)
            if not next_result:
                continue
            score, lens = next_result
            known = known_plain_by_char.get(chars[idx_char])

            if seg in valid_syllables:
                score += 8
            elif 2 <= seg_len <= 6:
                score += 2
            else:
                score -= 2

            if known:
                score += 12 if seg == known else -6

            if seg in COMMON_SUFFIXES:
                score += 1

            candidate = (score, [seg_len, *lens])
            if best is None or candidate[0] > best[0]:
                best = candidate

        memo[key] = best
        return best

    result = solve(0, 0)
    if not result or len(result[1]) != total_chars:
        return None

    tokens: list[str] = []
    pos = 0
    for seg_len in result[1]:
        tokens.append(raw_compact[pos : pos + seg_len])
        pos += seg_len
    return tokens


def split_word_pinyin(word: str, pinyin: str, known_plain_by_char: dict[str, str]) -> list[str] | None:
    chars = list(word)
    if not chars:
        return None
    raw_tokens = split_raw_tokens(pinyin)
    if len(raw_tokens) == len(chars):
        return [normalize_pinyin_token(token, False) for token in raw_tokens]
    return split_compact_pinyin(chars, pinyin, known_plain_by_char)


def resolve_char_position(ch: str, word_text: str) -> str:
    chars = list(word_text)
    try:
        idx = chars.index(ch)
    except ValueError:
        return "none"
    if idx == 0:
        return "start"
    if idx == len(chars) - 1:
        return "end"
    return "middle"


def score_prompt_candidate(ch: str, word: dict[str, object]) -> int:
    text = str(word.get("word", "")).strip()
    chars = list(text)
    if not chars:
        return -999
    level = max(1, int(word.get("level", 6)))
    length = len(chars)
    unique_count = len(set(chars))
    repeats = length - unique_count
    score = 0
    score += max(0, 8 - level) * 20
    if length == 2:
        score += 40
    elif length == 3:
        score += 26
    elif length == 4:
        score += 12
    else:
        score -= (length - 4) * 6
    pos = resolve_char_position(ch, text)
    if pos == "start":
        score += 14
    elif pos == "end":
        score += 10
    elif pos == "middle":
        score += 8
    if unique_count == length:
        score += 6
    if unique_count == 1:
        score -= 30
    score -= repeats * 6
    if chars[0] == chars[-1]:
        score -= 4
    return score


def score_prompt_diversity(ch: str, first_text: str, candidate_text: str) -> int:
    first = str(first_text or "")
    candidate = str(candidate_text or "")
    if not first or not candidate or first == candidate:
        return -999 if first == candidate else 0
    first_chars = list(first)
    candidate_chars = list(candidate)
    overlap = sum(1 for c in candidate_chars if c in first_chars)
    score = -overlap * 3
    if len(first_chars) != len(candidate_chars):
        score += 2
    pos_a = resolve_char_position(ch, first)
    pos_b = resolve_char_position(ch, candidate)
    if pos_a != "none" and pos_b != "none" and pos_a != pos_b:
        score += 8
    return score


FALLBACK_PROMPT_MAP: dict[str, list[str]] = {
    "一": ["一个", "一起"],
    "二": ["二月", "二十"],
    "三": ["三个", "三天"],
    "四": ["四个", "四季"],
    "五": ["五个", "五月"],
    "六": ["六个", "六月"],
    "七": ["七天", "七个"],
    "八": ["八个", "八月"],
    "九": ["九个", "九月"],
    "十": ["十个", "十天"],
    "吗": ["是吗", "好吗"],
    "呢": ["你呢", "在哪儿呢"],
    "吧": ["好吧", "走吧"],
    "啊": ["好啊", "啊？"],
    "呀": ["对呀", "是呀"],
    "嘛": ["干嘛", "好嘛"],
    "了": ["好了", "来了"],
    "的": ["我的", "你的"],
    "地": ["地方", "地铁"],
    "得": ["记得", "得到"],
    "些": ["一些", "这些"],
    "这": ["这里", "这个"],
    "那": ["那里", "那个"],
    "哪": ["哪里", "哪个"],
    "每": ["每天", "每次"],
    "很": ["很好", "很多"],
    "太": ["太好了", "太大了"],
    "不": ["不是", "不对"],
    "有": ["有的", "有人"],
    "在": ["在家", "在学校"],
    "和": ["我和你", "你和他"],
    "给": ["给你", "送给"],
    "从": ["从前", "从来"],
    "向": ["向前", "向上"],
}


def get_default_fallback_prompts(ch: str, source_word: str = "") -> tuple[str, str]:
    pair = FALLBACK_PROMPT_MAP.get(ch)
    if pair and len(pair) >= 2:
        return pair[0], pair[1]
    preferred = str(source_word or "").strip()
    options: list[str] = []
    if preferred:
        options.append(preferred)
    if ch and ch not in options:
        options.append(ch)
    if not options:
        options = [ch, ch]
    if len(options) == 1:
        options.append(options[0])
    return options[0], options[1]


def build_char_prompt_map(
    char_order: list[str],
    rows: list[dict[str, object]],
    source_word_map: dict[str, str],
) -> dict[str, list[str]]:
    candidate_map: dict[str, list[dict[str, object]]] = {char: [] for char in char_order}
    for row in rows:
        word = str(row.get("word", "")).strip()
        if len(word) < 2:
            continue
        for ch in set(word):
            if ch in candidate_map:
                candidate_map[ch].append(row)

    prompt_map: dict[str, list[str]] = {}
    for ch in char_order:
        seen: set[str] = set()
        candidates: list[dict[str, object]] = []
        for row in candidate_map.get(ch, []):
            text = str(row.get("word", "")).strip()
            if not text or text in seen:
                continue
            seen.add(text)
            candidates.append(row)

        ranked = sorted(
            (
                {
                    "text": str(row["word"]),
                    "level": int(row["level"]),
                    "len": len(str(row["word"])),
                    "score": score_prompt_candidate(ch, row),
                }
                for row in candidates
            ),
            key=lambda item: (-item["score"], item["level"], item["len"], item["text"]),
        )

        selected: list[str] = []
        if ranked:
            selected.append(str(ranked[0]["text"]))

        if len(ranked) > 1 and selected:
            best_second: dict[str, object] | None = None
            for item in ranked[1:]:
                merged_score = int(item["score"]) + score_prompt_diversity(ch, selected[0], str(item["text"]))
                candidate = {
                    "text": str(item["text"]),
                    "merged_score": merged_score,
                    "level": int(item["level"]),
                    "len": int(item["len"]),
                }
                if best_second is None or (
                    candidate["merged_score"],
                    -candidate["level"],
                    -candidate["len"],
                    candidate["text"],
                ) > (
                    best_second["merged_score"],
                    -int(best_second["level"]),
                    -int(best_second["len"]),
                    str(best_second["text"]),
                ):
                    best_second = candidate
            if best_second and str(best_second["text"]) not in selected:
                selected.append(str(best_second["text"]))

        fallback_a, fallback_b = get_default_fallback_prompts(ch, source_word_map.get(ch, ""))
        if len(selected) < 1 and fallback_a not in selected:
            selected.append(fallback_a)
        if len(selected) < 2 and fallback_b not in selected:
            selected.append(fallback_b)
        if len(selected) < 2 and selected:
            selected.append(selected[0])
        prompt_map[ch] = selected[:2]
    return prompt_map


def build_word_rows() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for path in sorted(SOURCE_DIR.glob("L*.txt"), key=lambda p: int(p.stem[1:])):
        level = int(path.stem[1:])
        for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
            if not raw_line.strip():
                continue
            columns = [part.strip() for part in raw_line.split("\t")]
            word = columns[0] if len(columns) > 0 else ""
            pinyin = columns[3] if len(columns) > 3 else (columns[2] if len(columns) > 2 else "")
            numbered_pinyin = columns[2] if len(columns) > 2 else ""
            meaning = normalize_meaning(columns)
            if not word:
                continue
            rows.append(
                {
                    "word": word,
                    "numbered_pinyin": numbered_pinyin,
                    "pinyin": pinyin,
                    "meaning": meaning,
                    "level": level,
                }
            )
    return rows


def build_items() -> list[dict[str, object]]:
    rows = build_word_rows()
    known_plain_by_char: dict[str, str] = {}
    direct_char_rows: dict[str, dict[str, object]] = {}

    for row in rows:
        word = str(row["word"])
        if len(word) != 1:
            continue
        char = word
        plain = normalize_pinyin_token(str(row["pinyin"]), True)
        if plain and char not in known_plain_by_char:
            known_plain_by_char[char] = plain
        direct_char_rows.setdefault(char, row)

    char_pinyin_hints: dict[str, str] = {}
    char_first_seen: dict[str, dict[str, object]] = {}
    char_first_word: dict[str, str] = {}

    for row in rows:
        word = str(row["word"])
        parts = split_numbered_pinyin(word, str(row.get("numbered_pinyin", "")))
        if not parts:
            parts = split_word_pinyin(word, str(row["pinyin"]), known_plain_by_char)
        if parts and len(parts) == len(word):
            for idx, char in enumerate(word):
                char_pinyin_hints.setdefault(char, parts[idx])
                known_plain_by_char.setdefault(char, normalize_pinyin_token(parts[idx], True))

        for char in word:
            if char not in char_first_seen:
                char_first_seen[char] = row
                char_first_word[char] = word

    ordered_chars = [char for char, _ in sorted(char_first_seen.items(), key=lambda item: (int(item[1]["level"]), item[0]))]
    prompt_map = build_char_prompt_map(ordered_chars, rows, char_first_word)

    items: list[dict[str, object]] = []
    for char in ordered_chars:
        row = char_first_seen[char]
        direct = direct_char_rows.get(char)
        source_word = char_first_word[char]
        prompt1, prompt2 = prompt_map.get(char, list(get_default_fallback_prompts(char, source_word)))
        if direct:
            pinyin = str(direct["pinyin"]) or char_pinyin_hints.get(char, "-")
            meaning = sanitize_meaning(str(direct["meaning"]))
            phrase = char
        else:
            pinyin = char_pinyin_hints.get(char, "-")
            meaning = sanitize_meaning(str(row["meaning"]))
            phrase = source_word
        items.append(
            {
                "char": char,
                "pinyin": pinyin,
                "meaning": meaning,
                "level": int(row["level"]),
                "phrase": phrase,
                "prompt1": prompt1,
                "prompt2": prompt2,
                "sentence": f"这是“{char}”字。",
            }
        )
    return items


def main() -> None:
    items = build_items()
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    OUTPUT_FILE.write_text(payload + "\n", encoding="utf-8")
    JS_OUTPUT_FILE.write_text(f"window.HSK_CHARS = {payload};\n", encoding="utf-8")
    counts: dict[int, int] = {}
    for item in items:
        level = int(item["level"])
        counts[level] = counts.get(level, 0) + 1
    print(f"Generated {len(items)} items -> {OUTPUT_FILE}")
    print(f"Generated browser bundle -> {JS_OUTPUT_FILE}")
    print("Level counts:", counts)


if __name__ == "__main__":
    main()
