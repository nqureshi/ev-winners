# Data pipeline

Source data and the script that turns it into the embeddings the site serves.

- `data/ev-winners.csv` is the source of truth for every winner. Edit this, never the JSON.
- `scripts/generate-embeddings.py` reads the CSV and writes `../app/data/ev-winners-with-embeddings.json`.
- `scripts/validate.py` checks the CSV and JSON agree and are well formed. Run it before committing.
- `scripts/search_winners.py` is a command-line search for spot checks.

The embedding model is `all-MiniLM-L6-v2` here and `Xenova/all-MiniLM-L6-v2` in
`app/api/similarity/route.ts`. They must stay the same model.

## Setup (once)

```bash
cd pipeline
uv venv --python 3.11 .venv
uv pip install --python .venv/bin/python -r requirements.txt
```

## Adding a cohort

The easy way: open Claude Code in the repo root and run `/add-cohort <marginalrevolution URL>`.

By hand:

1. Append rows to `data/ev-winners.csv`. Columns:
   ```
   id,name,batch,date_announced,link,description,type,career_stage,personal_links,personal_info,mr_posts,project_links
   ```
   - `id` continues from the last row
   - `batch` is the cohort number (or a name, e.g. `India 2`, for special tranches)
   - `date_announced` is `YYYY-MM-DD`
   - `link` is the Marginal Revolution announcement URL
   - `description` is the winner's text with their name removed from the front, wrapped in
     double quotes; literal quotes inside are doubled (`""`)
   - the remaining six columns are left empty (`,,,,,,`)
2. Regenerate and validate, from the repo root:
   ```bash
   pipeline/.venv/bin/python pipeline/scripts/generate-embeddings.py
   python3 pipeline/scripts/validate.py
   npm run build
   ```
3. Commit the CSV and JSON together and push. Vercel deploys `main`.

## History

This folder started life as the separate `nqureshi/ev-search-python` repo, merged in
September 2026. Its full commit history is still there.
