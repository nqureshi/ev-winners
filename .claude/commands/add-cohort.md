---
description: Add a new Emergent Ventures cohort from a Marginal Revolution post, regenerate embeddings, validate, build, commit and push
argument-hint: <marginalrevolution.com announcement URL>
---

Add the Emergent Ventures cohort announced at $ARGUMENTS to this site. Do every step below in order and stop at the first failure. Do not skip the review step.

## 1. Fetch and extract

Fetch the Marginal Revolution post at the URL. Extract, in the order they appear in the post:

- Each winner's **name** (the leading name, before the comma or the word "is"/"of"/"for"/"to"). For anonymous winners use the name `Anonymous`.
- Each winner's **description**: the rest of their entry with the name removed from the front, as one line, original punctuation kept. Keep the leading location if there is one (e.g. `London, matching donors and projects.`). Do not invent, shorten, or "clean up" wording.
- The **cohort number** from the post title (e.g. "59th cohort" -> `59`). If the post is a named tranche (e.g. an India or Ukraine cohort) use that name as the batch, matching the style of existing named batches in the CSV.
- The **announcement date** from the post, as `YYYY-MM-DD`.

Entries are usually one paragraph or one bullet per winner. Watch for winners split across two lines, joint grants to two people (one row with both names), and trailing paragraphs that are not winners (closing remarks, links to apply). Skip those.

## 2. Append to the CSV

Read the last row of `pipeline/data/ev-winners.csv` to get the last `id` and confirm this cohort is not already present (check the `link` column). Then append one row per winner:

```
id,name,batch,date_announced,link,description,type,career_stage,personal_links,personal_info,mr_posts,project_links
```

- `id` continues from the last row, incrementing by 1
- `link` is the post URL, identical for every row
- `description` wrapped in double quotes; any literal `"` inside doubled to `""`
- the last six columns empty, i.e. the row ends with `,,,,,,`
- keep the file's existing line endings and end the file with a newline

## 3. Regenerate embeddings and validate

From the repo root run, in order, and show me the output of each:

```bash
pipeline/.venv/bin/python pipeline/scripts/generate-embeddings.py
python3 pipeline/scripts/validate.py
npm run build
```

If the venv is missing, create it first with the two `uv` commands in `pipeline/README.md`. If any command fails, fix the CSV rows and rerun; do not commit.

## 4. Review with me

Print a table of the new rows (id, name, description) and the count, and ask me to confirm they look right before committing. Also run one spot-check search using a distinctive phrase from one of the new descriptions:

```bash
pipeline/.venv/bin/python pipeline/scripts/search_winners.py "<phrase>" 3
```

and confirm that winner is the top result.

## 5. Commit and push

Only after I confirm. Stage exactly `pipeline/data/ev-winners.csv` and `app/data/ev-winners-with-embeddings.json`, commit on `main` with the message `Add Emergent Ventures cohort <N> winners` (or `Add Emergent Ventures <name> cohort winners` for a named tranche), and push. Vercel deploys from `main` automatically. Tell me the commit hash and the number of winners added.
