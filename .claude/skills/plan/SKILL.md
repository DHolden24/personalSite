---
name: plan
description: Plan phase — single combined spec from a GitHub issue. Covers problem, outcomes, acceptance criteria, and implementation detail in one document. Headless-friendly (runs in CI from issue body). Not for quick bugfixes.
type: skill
---

# /plan — Plan + Design

You are the planning orchestrator. Given a GitHub issue, you produce a single combined spec, commit it to a feature branch, and comment back on the issue.

## Context sources

- **In CI (GitHub Actions):** issue number, title, and body are injected into the prompt — use them directly.
- **Interactively:** `$ARGUMENTS` may contain an issue number or slug; if it's an issue number, use `gh issue view` only when the issue wasn't already discussed in this conversation — otherwise use what's already in the chat. Otherwise ask the user for the feature description directly, no GitHub lookup needed.

## Running locally

Steps 1-4 (slug, feature directory, codebase read, spec draft) are already local. Step 5 (commit + push) and step 6 (comment on the issue, if one exists) are GitHub-visible actions — confirm with the user before pushing the branch, and skip the issue comment entirely unless an issue number is actually in play (nothing to comment on otherwise). Showing the draft spec and asking for feedback (already required below when interactive) doubles as that confirmation step for the spec content itself.

## Running in CI

When this skill runs in GitHub Actions, the agent process exits the moment your turn ends — nothing re-invokes you after a backgrounded task finishes. **In CI only:** do all the work in one continuous turn; do not spawn background subagents (`Task`/`Agent`), call `ScheduleWakeup`, use the `Monitor` tool, or pass `run_in_background: true` to `Bash` for any long-running command — run it in the foreground and let the tool call block until it finishes, even if that takes several minutes. Pass a `timeout` large enough to cover the command (up to 600000ms) rather than accepting the default — a `Bash` call that hits its own timeout gets auto-backgrounded by the harness with the same effect as `run_in_background: true`. If a command still ends up backgrounded anyway, don't wait for a notification or watch it with `Monitor` — poll it to completion with further blocking `Bash` calls in this same turn, since there is no later turn in CI to receive the result in. Explore the codebase inline (`grep`/`find`/`Read`) or with a foreground subagent you block on. Never end your turn while treating something as "pending" or waiting for a notification — there is no notification in CI; ending the turn tears down the runner and kills anything still in flight. Anything left running in the background, or left unfinished because you stopped to "wait," is killed at turn end, producing a run that reports success but leaves no branch, commit, or comment. Running interactively, none of this applies.

## Steps

### 1. Derive a feature slug
From the issue title: lowercase, spaces → `-`, strip punctuation, max 30 chars.
Example: "Add project screenshots" → `project-screenshots`

### 2. Create the feature directory
```
feature/<slug>/
```
Create it if it doesn't exist.

### 3. Read the codebase first
Before writing anything, use `find` and `grep` to understand:
- Directory structure and key entry points
- Existing data models and patterns relevant to this feature
- Any existing tests that touch adjacent code

This step is required — do not write a spec from imagination.

If `LESSONS.md` exists at the repo root, skim it. It holds coarse, project-wide patterns and gotchas from past `/learn` cycles — if one is relevant to this feature (e.g. a data-modeling pitfall, a workflow rule), let it shape the implementation plan or an acceptance criterion up front.

### 4. Write `feature/<slug>/spec.md`

```markdown
# Spec: <Feature Name>

## Problem
<!-- What user need does this address? -->

## Outcomes
<!-- Measurable signs of success -->

## Acceptance criteria
1. <!-- Each item independently testable -->

## Out of scope
<!-- Explicit exclusions -->

## Constraints
<!-- Static hosting (no backend), URL stability (published links like privacy policies must keep working), performance -->

---

## Overview
<!-- One paragraph — architecture fit, key approach -->

## Data model changes
<!-- Field names and types; "None" if not applicable -->

## API / interface changes
<!-- Routes, component props/emits, exported functions, project.js fields -->

## Implementation plan
1. <!-- Ordered work items, each ~1 day or one PR's worth -->

## Testing strategy
<!-- Unit (Vitest) / page or component (Vue Test Utils, tests/mountAt.js) per work item -->
```

Reference actual file paths and class names from the codebase you read in step 3.
Mark any unresolved question with `> ❓ Open:` so it's easy to find in review.

If running interactively: show the draft and ask for feedback before committing.
If running in CI: write from the issue body; note open questions inline; the issue comment will invite feedback.

### 5. Commit, and push once confirmed
```bash
git checkout feature/<slug> 2>/dev/null || git checkout -b feature/<slug>
git add feature/<slug>/
git commit -m "feat(<slug>): add spec"
```
Pushing (`git push -u origin feature/<slug>`) is a GitHub-visible action — in CI it always runs; running locally, confirm with the user first (this is on top of, not instead of, the interactive feedback pass on the draft content itself in step 4).

### 6. Comment on the issue (only if an issue is in play)

Write a 1–2 paragraph plain-English summary of the spec — what the feature does, the key implementation approach, and any open questions.

- **If there's a GitHub issue** (CI mode, or an issue number was given interactively): post it along with the spec link, after confirming with the user when running locally:
```bash
gh issue comment <number> --body "## /plan complete

Branch: \`feature/<slug>\`
Spec: \`feature/<slug>/spec.md\`

<1–2 paragraph summary of what the spec proposes and how it will be implemented>

Review and reply with any changes. Comment \`/build\` when ready to implement."
```
- **If there's no issue** (plain feature description given locally): give that same summary as your chat response instead — there's nothing to comment on.

## Outputs
- `feature/<slug>/spec.md`
- Branch `feature/<slug>`, pushed to remote once confirmed
- A summary of the spec — as an issue comment when a GitHub issue is in play, otherwise as your chat response

## Rules
- Read the codebase before writing the spec
- Spec should fit on one screen — concise beats exhaustive
- Don't start implementation — that belongs in `/build`
- Reference real file paths; don't invent structure
- Don't push, or comment on a GitHub issue, without the user's go-ahead when running locally
