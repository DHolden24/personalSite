---
name: learn
description: Learn phase — given a closed issue, mines its spec, PR(s), commits, and child issues for durable decisions. Appends coarse, project-wide lessons to LESSONS.md, writes ADRs where warranted, and adds a spec retrospective — via a PR. Run after merge, not during build/review.
type: skill
---

# /learn — Learn

You are the learn orchestrator. Given a completed GitHub issue, you gather everything decided while it was worked — the spec, the PR(s) that closed it, their commits and review history, and any child issues — and distill it into durable documentation: ADRs for architectural decisions, a retrospective on the spec, and — only when something generalizes beyond this one feature — an entry in the repo's single running `LESSONS.md`. You open a PR for the result; you do not merge it, and you do not touch application code.

Bias toward less output. A cycle that produces zero ADRs and zero lesson entries is a normal, good outcome, not a failure — the retrospective alone (step 6) is often the whole yield.

## Context sources

- **In CI (GitHub Actions):** issue number, title, and body are injected into the prompt.
- **Interactively:** `$ARGUMENTS` must contain an issue number — `/learn` always targets a specific issue. If the build/review/address cycle for it already happened in this conversation, prefer that chat history over re-fetching it from GitHub (step 2) — fall back to `gh` only for what isn't already known from this session.

## Running locally

Steps 1-7 (reading the issue/PRs/spec, judging ADRs and lessons, writing the retrospective) can draw on this conversation's history wherever the relevant cycle happened here, instead of re-querying GitHub. Steps 8-9 push a branch, open a PR, and comment on the issue — all GitHub-changing actions. Show the user the drafted ADRs/lessons/retrospective first and confirm before pushing or posting, per repo policy for local runs.

## Running in CI

When this skill runs in GitHub Actions, the agent process exits the moment your turn ends — nothing re-invokes you after a backgrounded task finishes. **In CI only:** do all the work in one continuous turn; do not spawn background subagents (`Task`/`Agent`), call `ScheduleWakeup`, use the `Monitor` tool, or pass `run_in_background: true` to `Bash` for any long-running command — run it in the foreground and let the tool call block until it finishes, even if that takes several minutes. Pass a `timeout` large enough to cover the command (up to 600000ms) rather than accepting the default — a `Bash` call that hits its own timeout gets auto-backgrounded by the harness with the same effect as `run_in_background: true`. If a command still ends up backgrounded anyway, don't wait for a notification or watch it with `Monitor` — poll it to completion with further blocking `Bash` calls in this same turn, since there is no later turn in CI to receive the result in. Explore the codebase inline (`grep`/`find`/`Read`) or with a foreground subagent you block on. Never end your turn while treating something as "pending" or waiting for a notification — there is no notification in CI; ending the turn tears down the runner and kills anything still in flight. Anything left running in the background, or left unfinished because you stopped to "wait," is killed at turn end, producing a run that reports success but leaves no branch, commit, or comment. Running interactively, none of this applies.

## Steps

### 1. Read the issue and confirm it's actually done

```bash
gh issue view <number> --json title,body,state,labels,closedByPullRequestsReferences
```

If the issue is still open, stop and post: `/learn runs after an issue (and any child issues) are closed — this one is still open.`

If the issue's body contains child-issue references (i.e. it's a parent that `/refine` broke down), find them:

```bash
gh issue list --state all --search "\"Part of #<number>\" in:body" --json number,title,state,closedByPullRequestsReferences
```

If any child issue is still open, stop and list which ones — do not produce a partial learn cycle.

### 2. Collect the PR(s) and commits

For the issue itself and every closed child issue, read `closedByPullRequestsReferences` to find the PR(s) that closed it. For each PR:

```bash
gh pr view <pr-number> --json title,body,mergedAt,mergeCommit,commits,files
gh pr diff <pr-number>
gh pr view <pr-number> --comments
```

Read every commit message (per `/build`, they reference spec sections) and the `/review` / `/address` comment history. Look for:
- Places the implementation diverged from the spec's plan, and why
- Non-obvious workarounds or bugs found mid-cycle
- Review findings that changed the approach (blocking fixes, advisories addressed)

Also watch for follow-up issues mentioned in a review/triage comment thread (e.g. "filed as #113") that fix a bug in this feature's own code. These won't always carry a `Part of #<parent>` back-link, so the child-issue search in step 1 can miss them. If one turns up, pull its closing PR into this same cycle too.

### 3. Read the spec(s)

Find `feature/<slug>/spec.md` for the issue (and for each child issue, if they carry distinct slugs). This is the "planned" side to diff the PR's "actual" side against.

### 4. Judge whether any decision earns an ADR

Write an ADR only when a decision:
- affects how the system is structured, or how components interact, or
- a future agent would regret not having written down ("why did we do it this way?"), or
- is stable — not a one-off, ticket-specific choice.

Skip small features and routine bug fixes — most cycles produce zero ADRs.

If warranted, add `adr/NNNN-title.md` (next free number after the highest in `adr/`, starting at `0001`), matching any existing ADRs' format. The format is: table header (Status/Date/Deciders/Related), Context, Decision, Options considered, Consequences (Positive/Negative/Neutral), Compliance & verification, References. Link `Related` to `feature/<slug>/spec.md` and the issue/PR — this repo uses one combined `spec.md` per feature, not separate product-spec/tech-spec files.

### 5. Distill 0-2 coarse lessons into `LESSONS.md`

`LESSONS.md` (repo root) is a single running log across every `/learn` cycle — not a file per feature. Skim its existing entries first so you don't repeat a lesson already captured.

A lesson clears the bar only if it would change how a future agent approaches **different**, unrelated work — a pattern, workflow rule, or gotcha with reach across the codebase or pipeline. Reject anything scoped to the one feature or file just touched — that belongs in the spec's retrospective (step 6), not here. Concretely:
- **Keep:** structural rules about how a whole category of data/decision should be handled ("a published URL is permanent — never rename a route or project folder that an app store links to"); pipeline/workflow rules about when to file a follow-up issue vs. fix inline; recurring gate friction likely to bite the next cycle too.
- **Drop:** one library's API quirk, a bug fix specific to one component/module, anything already fully captured by an ADR.

Hard cap: **2 lessons per cycle**. If more seem to qualify, keep the two with the broadest reach. Each is one or two sentences — state the rule, not the story: no PR numbers, no code snippets, no walkthrough of what happened. The common case is **zero** lessons — if none clear the bar, skip this step entirely; do not pad the file with a "nothing to report" entry.

If `LESSONS.md` doesn't exist yet, create it:

```markdown
# Lessons

Coarse, project-wide takeaways from `/learn` cycles — rules that change how *future*, *different* work should be approached. Not a changelog: most cycles add nothing. Feature-specific detail lives in each `feature/<slug>/spec.md` retrospective; architectural decisions live in `adr/`.

---
```

Then append (never edit or remove prior entries):

```markdown
## <YYYY-MM-DD> — #<issue>: <Feature Name>
- <coarse lesson>
```

### 6. Append a retrospective to the spec(s)

At the bottom of each `feature/<slug>/spec.md` touched, add a `## Retrospective` section: what differed from the plan and why, in 3-5 bullets. Do not rewrite the original spec content above it.

### 7. Update repo documentation, if warranted

Only touch `README.md` or `CLAUDE.md` if the cycle changed a convention, the stack, or the pipeline itself — not for routine feature additions.

### 8. Open a PR

Committing is local; pushing and opening the PR are GitHub-changing actions — confirm with the user first when running locally, showing the drafted ADRs/lessons/retrospective before doing either.

```bash
git checkout -b learn/<slug>
git add adr/ feature/ LESSONS.md README.md CLAUDE.md 2>/dev/null
git commit -m "docs(learn): capture learnings from #<number> — <title>"
git push -u origin learn/<slug>
gh pr create \
  --title "Learn: <Feature Name> (#<number>)" \
  --body "Captures decisions from #<number>.

## ADRs
<list, or \"None.\">

## Lessons added to LESSONS.md
<list, or \"None — nothing this cycle generalized beyond the feature itself.\">" \
  --base main
```

If the cycle produced only spec retrospectives (no ADR, no lesson), the PR is still worth opening — the retrospectives are real signal even when nothing rose to project-wide.

### 9. Comment on the issue

Also confirm before posting, when running locally.

```bash
gh issue comment <number> --body "## /learn complete

PR: <link>

<1-2 sentences: what was captured — ADRs written, lessons added, or \"retrospective only, nothing rose to a project-wide lesson\">"
```

## Outputs
- `LESSONS.md`, only if 1-2 coarse lessons cleared the bar this cycle
- `adr/NNNN-*.md`, only if a decision was durable enough to warrant one
- `## Retrospective` appended to each `feature/<slug>/spec.md` touched — always
- A PR against `main` with the above, once the user confirms pushing (local runs)
- A comment on the original issue linking the PR, once confirmed (local runs)

## Rules
- Only run against closed issues — with all child issues also closed, if any
- Most cycles produce zero ADRs and zero `LESSONS.md` entries — don't force either
- A lesson must generalize beyond the single feature; if it's really feature-specific detail, it belongs in the spec retrospective, not `LESSONS.md`
- Never edit or remove a prior `LESSONS.md` entry — append only
- Cite real files, commits, and PR comments (or this conversation's history, if the cycle happened here) — don't invent lessons from imagination
- Don't touch `src/` or `tests/` — this is documentation only
- Don't merge the PR — that's a human decision
- Don't push or comment on GitHub without the user's go-ahead when running locally
