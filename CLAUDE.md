# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academic personal website for Haoming Wang (AI & Education researcher) built on the **al-folio** Jekyll theme. Beyond the standard academic pages (publications, blog, CV), it has two custom data-driven sections:

- **Call for Papers (CFP)** — scraped from publisher websites, auto-updated every 2 days
- **Journal Rankings** — aggregated from EasyScholar, Scopus, and publisher sites, updated on the 5th/25th of each month

Live site: https://frank-haoming.github.io

## Build & Serve

```bash
# Local Jekyll serve (requires Ruby + Bundler)
bundle exec jekyll serve --livereload

# Python scripts require the conda environment
/Users/aspiriner/opt/anaconda3/envs/ai-agent/bin/python bin/<script>.py
# System Python does NOT have pyyaml — always use the conda env
```

## Data Pipeline Architecture

### Two parallel pipelines, each with: JSON config → Python scraper → YAML output → Jekyll page

**CFP Pipeline:**
```
_data/journal_cfp.json  →  bin/scrape_cfps.py  →  _data/cfps.yml  →  _pages/cfp.md
  (246 journals, url+tag)    (curl_cffi + FlareSolverr + DrissionPage)    (206 CFP entries)
```

**Journal Rankings Pipeline:**
```
_data/journal_rank.json  →  bin/journal_ranking_updater.py  →  _data/jrank.yml  →  _pages/journal_rankings.md
  (319 journals, url+tag+sourceid)   ↓                          (319 journal metrics)
                              bin/journal_data_manager.py (orchestrator, called by CI)
                              bin/update_scopus_metrics.py (DrissionPage for Scopus)
```

### journal_ranking_updater.py — key internals

Data sources flow through 7 crawlers in sequence:
1. **EasyScholar API** → purple_quartile (JCR), purple_score (IF), red_division (CAS)
   - Queries by ISSN extracted from URLs; SSCI first, falls back to SCI
2. **Scopus (via DrissionPage)** → orange_quartile, orange_score (CiteScore), orange_percentile, documents
3. **WileyCrawler** (FlareSolverr) → acceptance_rate, review times
   - URL must be `/journal/{ISSN}/journal-metrics` format
4. **SageCrawler** (FlareSolverr) → acceptance_rate, review times
   - Config URL is `/home/{code}`, crawler derives `/overview-metric/{code}` (changed 2026-06: `/home/` no longer shows metrics)
5. **TandFCrawler** (FlareSolverr) → acceptance_rate, review times
6. **APACrawler** (FlareSolverr) → first_decision_time, acceptance_rate, publication_time
   - Fetches `/pubs/journals/{code}/about`; bypasses Incapsula via FlareSolverr
7. **NatureCrawler** (plain requests, no FlareSolverr) → first_decision_time, acceptance_time
   - Fetches `nature.com/{slug}/journal-impact`; 4 of 6 Nature journals have data

**Data preservation rule:** empty crawler results never overwrite existing non-empty values in jrank.yml. This is intentional — prevents bad scrape runs from erasing good data.

**Rotating window + incremental save (added 2026-06):** a full re-scrape of all ~390 journals
through the Scopus *headless browser* exceeds GitHub's 6h job ceiling → the run is `cancelled` →
the final-only save committed nothing (silently wasted a 6h run on 2026-06-11). Fixes:
- **Incremental save**: both the Scopus script and the publisher/EasyScholar updater write
  jrank.yml every 10 journals (`--save-every`), so a cancelled run keeps partial progress.
- **Rotating window (`--batch-size N`)**: each run processes N journals starting from a persisted
  cursor `_data/.rank_cursor`, then advances it (wrapping around). The workflow default is
  `--batch-size 250`, so the 5th+25th schedule covers all ~390 journals ~monthly — including
  acceptance rate / review times / IF that DO drift — while no single run nears 6h. The cursor
  file is committed alongside jrank.yml. `journal_data_manager.py` owns the cursor and passes the
  same `--batch-offset/--batch-size` window to both sub-scripts.
- `--only-missing` (skip journals that already have data) also exists for one-off fast gap-fills,
  and `full_refresh=true` on manual dispatch forces the old all-at-once scrape.

**HM Score** ("友好性指数" / friendliness index): composite score where acceptance_rate is additive (higher rate = friendlier = higher score). This is intentional, NOT inverse.

### scrape_cfps.py — CFP scraper

Scrapes publisher special-issue/collection pages. Uses FlareSolverr for Cloudflare-protected sites, falls back to curl_cffi. Outputs sorted by `fullpaper_deadline_sort`.

Routing notes (2026-06): **Springer must go through FlareSolverr** — link.springer.com
added an idp.springer.com cookie/JS gate, so curl_cffi only gets a 3 KB challenge stub
(HTTP 200, looks like success, parses 0). **Elsevier/ScienceDirect must too** — curl_cffi
gets 403 from cloud IPs; via FlareSolverr the /about/call-for-papers page loads and
parses fine (journals with no active calls redirect to the journal homepage → legitimate 0).
UChicago journal homepages genuinely list no CFPs (parser kept for the future).

### FlareSolverr

Docker container for Cloudflare bypass, port 8191. Works from GitHub Actions cloud IPs but **times out locally** for Wiley/SAGE/T&F — local testing of publisher crawlers is unreliable.

## GitHub Actions Workflows

| Workflow | Schedule | Trigger | Output |
|---|---|---|---|
| `daily_cfp.yml` | Every 2 days 21:00 UTC | `workflow_dispatch` | `_data/cfps.yml` |
| `update_journal_rankings.yml` | 5th & 25th of month, 02:00 UTC | `workflow_dispatch` | `_data/jrank.yml` + `_data/jaims.yml` |
| `update-citations.yml` | Mon/Wed/Fri 00:00 UTC | `workflow_dispatch` | `_data/citations.yml` |

The citations workflow needs `permissions: contents: write` + the `PAGE` PAT checkout
(both added 2026-06); without them its push fails with HTTP 403 and the run rots silently.

Secrets: `PAGE` (CFP workflow PAT), `JOU` (journal rankings PAT), `EASYSCHOLAR_KEY` (API key).

Both data workflows use FlareSolverr as a service container and auto-commit changes.

## Key Data Files

| File | Format | Purpose |
|---|---|---|
| `_data/journal_rank.json` | JSON | Journal master list: name, publisher URL, tags, Scopus sourceid |
| `_data/journal_cfp.json` | JSON | CFP journal list: name, collections URL, tags |
| `_data/jrank.yml` | YAML | Computed journal metrics (output of ranking pipeline) |
| `_data/cfps.yml` | YAML | Scraped CFP entries (output of CFP pipeline) |
| `_data/jaims.yml` | YAML | Journal aims & scope (bin/scrape_aims.py; feeds the venue recommender's topical matching) |
| `_bibliography/papers.bib` | BibTeX | Publications (rendered via jekyll-scholar) |

### URL conventions in journal_rank.json

URLs must point to the correct metrics page per publisher:
- **Springer**: `https://link.springer.com/journal/{id}` (default journal page)
- **Elsevier**: `https://www.sciencedirect.com/journal/{slug}/about/insights` (must have `/about/insights`)
- **Wiley**: `https://onlinelibrary.wiley.com/journal/{ISSN}/journal-metrics`
- **SAGE**: `https://journals.sagepub.com/home/{code}` (crawler derives `/overview-metric/{code}` automatically)
- **Taylor & Francis**: varies by journal (no uniform pattern)
- **APA**: `https://www.apa.org/pubs/journals/{code}` (crawler appends `/about`)
- **Nature**: `https://www.nature.com/{slug}/` (crawler appends `journal-impact`)

## Page Architecture

Both CFP and Journal Rankings pages are standalone Markdown files with embedded `<style>`, `<script>`, and Liquid templates — no external JS libraries. Filtering and search happen client-side.

- `_pages/cfp.md` — Tag pill-button filter (single-select), 4-column table, `<details>` expandable rows
- `_pages/journal_rankings.md` — Search box + quartile/publisher dropdowns, 9-column table, HM score color coding, dynamic statistics section

Both pages include an identical WeChat QR code floating button (duplicated code).

## Git Conventions

- Data auto-commits use emoji prefixes: `🤖 Auto-update journal rankings`, `🤖 Auto-update CFP list`
- Do NOT auto-push unless explicitly asked — user prefers to review before pushing
- Remote is `origin` → `https://github.com/ConCon222/sece.git`, branch `main`
- GitHub API auth: use `git credential fill` to get token for REST API calls (no `gh` CLI installed)
