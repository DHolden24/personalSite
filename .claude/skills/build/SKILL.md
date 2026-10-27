---
name: build
description: Build + Test orchestrator. TDD implementation from a tech spec on an issue. Delivers an open PR with green CI. Use /address to handle review feedback on an existing PR.
type: skill
---

# /build — Build + Test

You are the build orchestrator. You implement features using TDD from a tech spec, targeting an open PR with green CI. This skill is for **issues only** — to address review feedback on an existing PR, use `/address`.

## Context sources

- **In CI (GitHub Actions):** number and an `Is PR:` flag are injected into the prompt.
  - `Is PR: false` → initial implementation mode (build from spec).
  - `Is PR: true` → review feedback loop mode (address review comments on an existing PR).
- **Interactively:** `$ARGUMENTS` may contain an issue number, a slug, or a plain feature description. Build from `feature/<slug>/spec.md` — that's a local file, not a GitHub lookup, so this works the same whether or not an issue exists on GitHub. If review feedback needs addressing on an existing PR, use `/build`'s sibling `/address` instead — don't re-enter a feedback loop here.

## Running locally

Steps 1-3 (find the spec, branch, implement TDD) are already local — no `gh` calls needed there. The GitHub-visible actions are steps 4 and 5:
- **Opening the PR** (`gh pr create`) and **pushing** the branch are GitHub-changing actions — confirm with the user before doing either, per repo policy for local runs. Show the diff/summary of what was implemented first.
- Without a pushed PR there's no CI to poll — treat the local `npm test && npm run build` run as the gate, and only move to the CI-polling loop in step 5 once the user has confirmed pushing.

## Running in CI

When this skill runs in GitHub Actions, the agent process exits the moment your turn ends — nothing re-invokes you after a backgrounded task finishes. **In CI only:** do all the work in one continuous turn; do not spawn background subagents (`Task`/`Agent`), call `ScheduleWakeup`, use the `Monitor` tool, or pass `run_in_background: true` to `Bash` (this includes `npm test`, `npm run build`, or any other long-running command — run them in the foreground and let the tool call block until they finish, even if that takes several minutes). Pass a `timeout` large enough to cover the command (up to 600000ms) rather than accepting the default — a `Bash` call that hits its own timeout gets auto-backgrounded by the harness with the same effect as `run_in_background: true`. If a command still ends up backgrounded anyway, don't wait for a notification or watch it with `Monitor` — poll it to completion with further blocking `Bash` calls in this same turn, since there is no later turn in CI to receive the result in. Explore the codebase inline (`grep`/`find`/`Read`) or with a foreground subagent you block on. Never end your turn while treating something as "pending" or waiting for a notification — there is no notification in CI; ending the turn tears down the runner and kills anything still in flight. Anything left running in the background, or left unfinished because you stopped to "wait," is killed at turn end, producing a run that reports success but leaves no branch, commit, or comment. Running interactively, none of this applies.

## Steps

### 1. Find the tech spec
- Identify the feature slug from the issue or branch name
- Read `feature/<slug>/spec.md` fully before writing any code
- If the tech spec doesn't exist yet, stop and tell the user to run `/plan` first
- If `LESSONS.md` exists at the repo root, skim it — it holds coarse, project-wide patterns and gotchas from past `/learn` cycles (e.g. a data-modeling pitfall, a test-writing mistake). Apply anything relevant while implementing.

### 2. Checkout the feature branch
```bash
git checkout feature/<slug>
# or create it if implementing fresh:
git checkout -b feature/<slug>
```
Always merge `main` into the working branch before making any changes, to start from the latest upstream state and surface conflicts early:
```bash
git fetch origin main
git merge origin/main
```
Resolve any conflicts before proceeding to implementation.

### 3. Implement TDD by tech spec section
For each item in the implementation plan:
1. Write the test first (or alongside) — never at the end
2. Run the test to confirm it fails (red)
3. Implement the minimum code to pass (green)
4. Refactor if needed
5. Commit with a message referencing the tech spec section

Project specifics:
- Tests live in `tests/` (Vitest + Vue Test Utils). Run just the affected files while iterating: `npx vitest run tests/<file>.test.js`
- For pages and routing, mount the whole app at a URL with `tests/mountAt.js`
- New project routes must also be emitted by the `staticRoutes` plugin in `vite.config.js`, or the clean URL 404s on GitHub Pages
- Changes to `src/` views, components or styles follow the Floor in `.claude/skills/hallmark/SKILL.md` (read it and `references/craft.md` before writing UI). Run `node .claude/skills/hallmark/scripts/sloplint.mjs <changed files> --genre editorial` and fix every `FAIL`, dismissing the gates its § Not applicable lists
- Run `npm test && npm run build` before each commit — both must pass

### 4. Open a PR
```bash
gh pr create \
  --title "<Feature name>" \
  --body "Closes #<issue-number>

## Changes
<!-- Summary of implementation -->

## Tech spec
\`feature/<slug>/spec.md\`

## Acceptance criteria
<!-- Copy from tech spec, check off as implemented -->" \
  --base main
```

CI must be green (`.github/workflows/ci.yml`) before handing off to `/review`.

### 5. Iterate until CI is green

**Before pushing**, always run locally first:
```bash
npm test && npm run build
```
Fix any local failures before pushing — don't send a commit you already know is broken.

**After each push**, wait for CI and act on the result (up to 5 iterations):

```bash
# Wait for the CI run on this PR to finish (times out after ~10 min)
gh run list --branch "$(git branch --show-current)" --workflow ci.yml \
  --limit 1 --json databaseId,status,conclusion \
  --jq '.[0] | .databaseId, .status, .conclusion'

# Once a run ID is known, watch it to completion:
gh run watch <run-id>

# If CI failed, read what broke:
gh run view <run-id> --log-failed
```

On CI failure:
1. Parse the failure output — identify the failing test(s) or build error(s)
2. Fix the root cause (never delete or skip a failing test to make CI green)
3. Run `npm test && npm run build` locally to confirm the fix
4. Commit and push the fix
5. Repeat from the top of this step

Stop and surface the issue to the user (don't keep looping) if:
- The same failure recurs after two fix attempts
- The failure is in a file outside the feature scope (possible pre-existing breakage)
- CI infrastructure itself appears to be the problem (runner errors, network failures)

## Output

Code and tests implementing the tech spec, committed locally. Open PR + green CI once the user confirms pushing (see "Running locally").

## Rules
- TDD: no "finish all code then add tests"
- Do not modify existing tests unless there is no other option — prefer adding new tests alongside existing ones
- If an existing test must be changed, list every modified test, what changed, and why it was unavoidable (a PR comment after pushing, or your chat response if not pushed yet)
- Reference spec sections in commit messages (e.g. `feat: add screenshots field to project.js (spec §data-model)`)
- Don't merge the PR — that's a human decision
- Don't push or open the PR without the user's go-ahead when running locally — that's a GitHub-visible action
