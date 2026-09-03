# ev-winners

Next.js 14 site (evwinners.org, deployed on Vercel from `main`) listing Emergent Ventures grantees with semantic search.

- `pipeline/data/ev-winners.csv` is the source of truth for winners. Never edit `app/data/ev-winners-with-embeddings.json` by hand; it is generated.
- `app/data/ev-winners-with-embeddings.json` is the only data file the site reads (`app/lib/winners.ts`).
- Regenerate it with `pipeline/.venv/bin/python pipeline/scripts/generate-embeddings.py`, then check with `python3 pipeline/scripts/validate.py` and `npm run build`.
- The embedding model must be the same on both sides: `all-MiniLM-L6-v2` in the Python script and `Xenova/all-MiniLM-L6-v2` in `app/api/similarity/route.ts`.
- Adding a cohort: when asked to add a new cohort (with or without the `/add-cohort` command), follow the steps in `.claude/commands/add-cohort.md` exactly, including the review pause before committing. Details in `pipeline/README.md`.
- `pipeline/.venv` is gitignored; create it with `uv` per `pipeline/README.md`.
