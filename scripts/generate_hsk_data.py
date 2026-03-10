from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = [
    ROOT / "scripts" / "generate_hsk_chars_from_source.py",
    ROOT / "scripts" / "generate_hsk_words_from_source.py",
]


def main() -> None:
    for script in SCRIPTS:
        print(f"Running {script.name} ...")
        subprocess.run([sys.executable, str(script)], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
