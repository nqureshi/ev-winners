# Emergent Ventures Embeddings-Based Search

Emergent Ventures (https://www.mercatus.org/emergent-ventures) is a grant program run by [Tyler Cowen](https://en.wikipedia.org/wiki/Tyler_Cowen) (an economist who writes Marginal Revolution) at the Mercatus Center.

This repo has a CSV of all EV winners. In addition, there is a Python file (search_winners.py) that uses Sentence Transformers to generate embeddings for each of their project descriptions. This enables easy semantic search for EV-funded projects, e.g. you can search for all funding relating to writing a book, or starting a podcast, or working on climate change, for example.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Searching

```bash
source venv/bin/activate
python3 scripts/search_winners.py [query] [number-of-results]
```

The number-of-results argument is optional and defaults to 10.

## Adding a new cohort

1. Open `data/ev-winners.csv` and append new rows. The columns are:
   ```
   id,name,batch,date_announced,link,description,type,career_stage,personal_links,personal_info,mr_posts,project_links
   ```
   - `id` continues from the last entry (check the last row)
   - `batch` is the cohort number
   - `link` is the Marginal Revolution announcement URL
   - The remaining columns (`type` through `project_links`) can be left empty (just trailing commas: `,,,,,,`)
   - Descriptions containing commas must be wrapped in double quotes
   - Descriptions containing literal double quotes must escape them as `""` (e.g. `"to be a ""defense influencer."""`)

2. Regenerate embeddings:
   ```bash
   source venv/bin/activate
   python3 scripts/generate-embeddings.py
   ```
   This reads `data/ev-winners.csv` and outputs `data/ev-winners-with-embeddings.csv` and `data/ev-winners-with-embeddings.json`.