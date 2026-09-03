"""Command-line semantic search over the winners, for spot checks.

Uses the embeddings the site serves (app/data/...json), so results match
evwinners.org. Run from anywhere:
    pipeline/.venv/bin/python pipeline/scripts/search_winners.py "podcast" 5
"""
import json
import sys
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer, util

MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
JSON_PATH = Path(__file__).resolve().parent.parent.parent / 'app' / 'data' / 'ev-winners-with-embeddings.json'


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print('Usage: search_winners.py "query" [number-of-results]')
        return 1
    query = sys.argv[1]
    number = int(sys.argv[2]) if len(sys.argv) == 3 else 10

    winners = json.loads(JSON_PATH.read_text(encoding='utf-8'))
    embeddings = np.array([w['embedding_description'] for w in winners], dtype=np.float32)
    query_embedding = SentenceTransformer(MODEL_NAME).encode(query)
    scores = util.cos_sim(query_embedding, embeddings)[0].numpy()

    print(f'Top {number} matches for: {query}\n')
    for rank, i in enumerate(np.argsort(-scores)[:number], start=1):
        w = winners[i]
        print(f'{rank}. {w["name"]} (cohort {w["batch"]}, {scores[i]:.3f}): {w["description"]}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
