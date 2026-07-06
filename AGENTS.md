# Repository Guidelines

## Project Structure & Module Organization

This is a Jekyll academic personal site based on al-folio. Core configuration lives in `_config.yml`. Pages are in `_pages/`, posts in `_posts/`, news in `_news/`, Liquid partials in `_includes/`, layouts in `_layouts/`, Sass in `_sass/`, and custom Ruby plugins in `_plugins/`. Static media and front-end assets live under `assets/`; generated output belongs in `_site/`.

Data-driven sections use `_data/`. Key files include `_data/journal_rank.json`, `_data/journal_cfp.json`, `_data/jrank.yml`, `_data/cfps.yml`, and `_bibliography/papers.bib`. Python maintenance scripts are in `bin/`.

## Build, Test, and Development Commands

- `bundle install`: install Ruby/Jekyll dependencies from `Gemfile`.
- `bundle exec jekyll serve --livereload`: run the site locally with live reload.
- `bundle exec jekyll build`: build the production site into `_site/`.
- `bin/cibuild`: CI-style Jekyll build wrapper.
- `docker compose up`: run the documented Docker setup.
- `npm install`: install Prettier and the Liquid plugin.
- `npx prettier . --check`: check formatting; use `--write` to fix.
- `pre-commit run --all-files`: run whitespace, EOF, YAML, and large-file checks.

For Python data scripts, use the conda Python noted in `CLAUDE.md`, for example `/Users/aspiriner/opt/anaconda3/envs/ai-agent/bin/python bin/scrape_cfps.py`.

## Coding Style & Naming Conventions

Use 2-space indentation for Markdown front matter, YAML, Liquid, JavaScript, and Sass unless a file has a stronger local convention. Keep Liquid includes small and named by purpose, for example `_includes/selected_papers.liquid`. Name posts `YYYY-MM-DD-title.md`. Keep generated data in `_data/`; avoid hand-editing scraper outputs unless documenting a one-off correction.

Formatting is governed by `.prettierrc` with `@shopify/prettier-plugin-liquid`, `printWidth: 150`, and ES5 trailing commas.

## Testing Guidelines

There is no dedicated unit-test suite. Treat `bundle exec jekyll build`, `npx prettier . --check`, and `pre-commit run --all-files` as baseline validation. For UI or accessibility-sensitive changes, use GitHub Actions workflows such as `axe.yml`, `broken-links-site.yml`, and Lighthouse results where relevant.

## Commit & Pull Request Guidelines

Follow the existing history: short, imperative commits such as `Add NatureCrawler...`, `Fix SageCrawler...`, and `Update CLAUDE.md...`. Automated data refreshes use `🤖 Auto-update ...`.

Pull requests should describe the user-visible change, list validation commands, link related issues, and include screenshots for visual changes. For data pipeline changes, mention affected files in `_data/`, required secrets, and whether results came from local runs or GitHub Actions.

## Security & Configuration Tips

Do not commit secrets from `.env` or GitHub Actions. FlareSolverr-dependent scrapers can behave differently locally and in CI, so preserve existing non-empty data unless a source is verified.
