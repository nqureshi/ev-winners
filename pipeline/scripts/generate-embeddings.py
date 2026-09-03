"""Regenerate description embeddings for every EV winner.

Reads  pipeline/data/ev-winners.csv
Writes app/data/ev-winners-with-embeddings.json   (the file the site serves)

Paths are resolved relative to this file, so it can be run from anywhere:
    pipeline/.venv/bin/python pipeline/scripts/generate-embeddings.py

The model MUST stay in sync with the one the API route uses
(app/api/similarity/route.ts -> Xenova/all-MiniLM-L6-v2). Changing one
without the other silently breaks search ranking.
"""
import io
import json
import sys
from pathlib import Path

import pandas as pd
from sentence_transformers import SentenceTransformer

MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'

PIPELINE_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = PIPELINE_DIR.parent
CSV_PATH = PIPELINE_DIR / 'data' / 'ev-winners.csv'
JSON_PATH = REPO_ROOT / 'app' / 'data' / 'ev-winners-with-embeddings.json'


def main() -> int:
    df = pd.read_csv(CSV_PATH)
    print(f'Loaded {len(df)} winners from {CSV_PATH.relative_to(REPO_ROOT)}')

    missing = df['description'].isna()
    if missing.any():
        # Two legacy rows (ids 101, 105) have no description. validate.py
        # allow-lists them; anything else is a data-entry error.
        print(f'WARNING: {int(missing.sum())} rows have an empty description '
              f'(ids: {df.loc[missing, "id"].tolist()})', file=sys.stderr)

    model = SentenceTransformer(MODEL_NAME)
    # astype(str) turns NaN into the text "nan", which is what the original
    # pipeline embedded for those rows; keeping it makes output reproducible.
    embeddings = model.encode(df['description'].astype(str).to_numpy(), show_progress_bar=True)
    df['embedding_description'] = embeddings.tolist()

    # Round-trip through CSV text on purpose: it is what the original pipeline
    # did, and it fixes the column dtypes the site expects (e.g. `batch` is a
    # string because some cohorts are named rather than numbered).
    buf = io.StringIO()
    df.to_csv(buf, index=False)
    buf.seek(0)
    df2 = pd.read_csv(buf)
    df2['embedding_description'] = df2['embedding_description'].apply(json.loads)

    JSON_PATH.write_text(df2.to_json(orient='records', lines=False))
    print(f'Wrote {len(df2)} winners with {embeddings.shape[1]}-dim embeddings to '
          f'{JSON_PATH.relative_to(REPO_ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
