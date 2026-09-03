"""Sanity-check the winners CSV and the generated JSON before committing.

Standard library only, so it runs with any python3:
    python3 pipeline/scripts/validate.py

Exits non-zero and prints every problem it finds.
"""
import csv
import json
import math
import re
import sys
from pathlib import Path

PIPELINE_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = PIPELINE_DIR.parent
CSV_PATH = PIPELINE_DIR / 'data' / 'ev-winners.csv'
JSON_PATH = REPO_ROOT / 'app' / 'data' / 'ev-winners-with-embeddings.json'

COLUMNS = ['id', 'name', 'batch', 'date_announced', 'link', 'description', 'type',
           'career_stage', 'personal_links', 'personal_info', 'mr_posts', 'project_links']
EMBEDDING_DIM = 384
# Legacy rows that have never had a description; every other row must have one.
LEGACY_EMPTY_DESCRIPTION_IDS = {'101', '105'}
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')


def main() -> int:
    problems: list[str] = []

    with CSV_PATH.open(newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        if reader.fieldnames != COLUMNS:
            problems.append(f'CSV header is {reader.fieldnames}, expected {COLUMNS}')
        rows = list(reader)
        if any(None in r or r.get(None) for r in rows):
            bad = [r['id'] for r in rows if None in r]
            problems.append(f'CSV rows with wrong column count (ids): {bad[:10]}')

    ids = []
    seen = set()
    for r in rows:
        try:
            ids.append(int(r['id']))
        except (TypeError, ValueError):
            problems.append(f'Non-integer id: {r["id"]!r}')
            continue
        if not r['name'].strip():
            problems.append(f'id {r["id"]}: empty name')
        if not r['batch'].strip():
            problems.append(f'id {r["id"]}: empty batch')
        if not DATE_RE.match(r['date_announced'] or ''):
            problems.append(f'id {r["id"]}: date_announced {r["date_announced"]!r} is not YYYY-MM-DD')
        if not (r['description'] or '').strip() and r['id'] not in LEGACY_EMPTY_DESCRIPTION_IDS:
            problems.append(f'id {r["id"]}: empty description')
        if r['link'] and 'marginalrevolution.com' not in r['link']:
            problems.append(f'id {r["id"]}: link does not look like an MR post: {r["link"]}')
        key = (r['name'].strip().lower(), r['batch'].strip())
        if key in seen and r['name'].strip().lower() != 'anonymous':
            problems.append(f'id {r["id"]}: duplicate name within batch: {r["name"]} / {r["batch"]}')
        seen.add(key)

    if ids != list(range(1, len(ids) + 1)):
        problems.append(f'CSV ids are not contiguous 1..{len(ids)} (first mismatch near '
                        f'{next((i for i, v in enumerate(ids, 1) if v != i), "?")})')

    if not JSON_PATH.exists():
        problems.append(f'{JSON_PATH} does not exist')
    else:
        try:
            data = json.loads(JSON_PATH.read_text(encoding='utf-8'))
        except json.JSONDecodeError as e:
            problems.append(f'JSON does not parse: {e}')
            data = []
        if len(data) != len(rows):
            problems.append(f'JSON has {len(data)} rows but CSV has {len(rows)} '
                            f'(did you run generate-embeddings.py?)')
        for r, j in zip(rows, data):
            jid = j.get('id')
            if str(jid) != r['id']:
                problems.append(f'Row order mismatch: CSV id {r["id"]} vs JSON id {jid}')
                break
            for col in ('name', 'batch', 'date_announced', 'description'):
                if (j.get(col) if j.get(col) is not None else '') != r[col]:
                    problems.append(f'id {r["id"]}: {col} differs between CSV and JSON')
            emb = j.get('embedding_description')
            if not isinstance(emb, list) or len(emb) != EMBEDDING_DIM:
                problems.append(f'id {jid}: embedding has length '
                                f'{len(emb) if isinstance(emb, list) else "n/a"}, expected {EMBEDDING_DIM}')
            elif not all(isinstance(x, (int, float)) and math.isfinite(x) for x in emb):
                problems.append(f'id {jid}: embedding contains non-finite values')

    if problems:
        print(f'FAILED: {len(problems)} problem(s)')
        for p in problems[:50]:
            print(f'  - {p}')
        if len(problems) > 50:
            print(f'  ... and {len(problems) - 50} more')
        return 1

    batches = sorted({r['batch'] for r in rows}, key=lambda b: (not b.isdigit(), int(b) if b.isdigit() else 0, b))
    print(f'OK: {len(rows)} winners, ids 1..{len(rows)}, latest numbered cohort {batches[-1] if batches[-1].isdigit() else [b for b in batches if b.isdigit()][-1]}, '
          f'all embeddings {EMBEDDING_DIM}-dim, CSV and JSON agree')
    return 0


if __name__ == '__main__':
    sys.exit(main())
