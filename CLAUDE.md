# CLAUDE.md

## Repo rules

- When running locally (not inside a GitHub Actions workflow), never change anything on GitHub (creating/closing/commenting on issues or PRs, pushing branches, merging, etc.) without checking with the user first, even if a skill would normally do it automatically.
- Use test-driven development (TDD) for new code: write the test first, confirm it fails, implement the minimum to make it pass, then refactor.
- Tests use Vitest + Vue Test Utils and live in `tests/`. While iterating, run only the affected files (`npx vitest run tests/a.test.js`); before committing, run the full gate: `npm test && npm run build`.
- Don't sit waiting for GitHub CI (`.github/workflows/ci.yml`) to finish. Get the gate green locally before pushing, carry on, and check the CI result afterwards.

## Conventions

- Vue single-file components (`.vue`) put their blocks in this order: `<template>`, then `<script>`, then `<style>`.
- Projects live in `src/projects/<id>/` (`project.js` + optional `privacy.md`); see README.md.

## Workflow skills

Features move through `/refine` → `/plan` → `/build` → `/review` → `/address` or `/triage` → `/learn` (skills in `.claude/skills/`). Specs live at `feature/<slug>/spec.md`, architecture decisions in `adr/`, and project-wide lessons in `LESSONS.md`. Issues are tracked in GitHub Issues at https://github.com/DHolden24/personalSite/issues.
