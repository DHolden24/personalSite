---
name: refine
description: Issue breakdown — reads a GitHub issue and the codebase, creates only the child issues genuinely needed with explicit dependency ordering, and triggers /plan on any issue that can start immediately.
type: skill
---

# /refine — Issue Breakdown

You are the refinement orchestrator. Given a GitHub issue, you read the relevant codebase, judge whether it needs decomposing, and either create a dependency-ordered set of child issues or hand off directly to `/plan`.

## Context sources

- **In CI (GitHub Actions):** issue number, title, and body are injected into the prompt.
- **Interactively:** `$ARGUMENTS` may contain an issue number — use `gh issue view` only if that issue hasn't already been discussed in this conversation, otherwise use what's already in the chat. Otherwise ask the user to describe the issue/feature directly.

## Running locally

Steps 1-3 (read the issue, read the codebase, judge whether breakdown is needed) can run entirely from this conversation's context plus local code — no `gh issue view` needed if the issue was already discussed here. Steps 4-6 all create or comment on GitHub issues, which are GitHub-changing actions: show the user the proposed breakdown (or the single-issue hand-off) first and confirm before running any `gh issue create` / `gh issue comment`, per repo policy for local runs.

## Running in CI

When this skill runs in GitHub Actions, the agent process exits the moment your turn ends — nothing re-invokes you after a backgrounded task finishes. **In CI only:** do all the work in one continuous turn; do not spawn background subagents (`Task`/`Agent`), call `ScheduleWakeup`, use the `Monitor` tool, or pass `run_in_background: true` to `Bash` for any long-running command — run it in the foreground and let the tool call block until it finishes, even if that takes several minutes. Pass a `timeout` large enough to cover the command (up to 600000ms) rather than accepting the default — a `Bash` call that hits its own timeout gets auto-backgrounded by the harness with the same effect as `run_in_background: true`. If a command still ends up backgrounded anyway, don't wait for a notification or watch it with `Monitor` — poll it to completion with further blocking `Bash` calls in this same turn, since there is no later turn in CI to receive the result in. Explore the codebase inline (`grep`/`find`/`Read`) or with a foreground subagent you block on. Never end your turn while treating something as "pending" or waiting for a notification — there is no notification in CI; ending the turn tears down the runner and kills anything still in flight. Anything left running in the background, or left unfinished because you stopped to "wait," is killed at turn end, producing a run that reports success but leaves no child issues or comments. Running interactively, none of this applies.

## Steps

### 1. Read the issue

Use what's already in this conversation if the issue was already discussed here; otherwise:
```bash
gh issue view <number>
```
Note the labels, current assignee, and any linked issues.

### 2. Read the codebase
Use `find` and `grep` to understand the code areas the issue touches. Do not invent structure — read first. Focus on:
- Files and components directly named or implied by the issue
- Existing tests that cover adjacent behavior
- Data model or API surfaces that would change

### 3. Judge whether breakdown is needed

Ask: can this issue be implemented and reviewed in a single PR without being unwieldy?

- **If yes** (already single-PR scope): skip to step 6 — no child issues needed.
- **If no**: plan the full set of sub-tasks and their dependencies before creating any issues.

  For each sub-task, determine:
  - What it implements (referencing real file paths)
  - Which other sub-tasks, if any, must be completed first
  - A **root task** is one with no prerequisites — plan runs on these immediately

  Only add dependencies where the ordering genuinely matters. Do not create artificial sequencing. 8 sub-tasks maximum; if more are needed, note that the issue is too broad.

### 4. Create child issues in dependency order (roots first)

Present the planned breakdown (titles + dependency order) to the user and confirm before creating anything, when running locally. Then create root tasks first so you have their issue numbers before creating tasks that depend on them.

For a **root task** (no dependencies):

```bash
gh issue create \
  --title "<sub-task title>" \
  --label "child-issue" \
  --body "Part of #<parent-number>

## What to do
<Concrete description referencing actual file paths and component names.>

## Acceptance criteria
- [ ] <criterion 1>
- [ ] <criterion 2>"
```

For a task **with dependencies** — include a `Depends on:` line at the end of the body and the `blocked` label:

```bash
gh issue create \
  --title "<sub-task title>" \
  --label "child-issue" \
  --label "blocked" \
  --body "Part of #<parent-number>

## What to do
<Concrete description referencing actual file paths and component names.>

## Acceptance criteria
- [ ] <criterion 1>
- [ ] <criterion 2>

Depends on: #<issue-number>[, #<issue-number>]"
```

Record each created issue number before proceeding to the next.

### 5. Trigger plan on root tasks and post parent summary

For each root task, post a `/plan` comment so planning starts immediately:
```bash
gh issue comment <root-issue-number> --body "/plan"
```

Then post a single summary comment on the parent:
```bash
gh issue comment <parent-number> --body "## /refine complete

N sub-tasks in dependency order:

- [ ] #<issue1> — <title> _(no dependencies — planning started)_
- [ ] #<issue2> — <title> _(depends on #<issue1>)_
- [ ] #<issue3> — <title> _(depends on #<issue2>)_

Each issue will be planned automatically when its dependencies close."
```

### 6. No breakdown needed — hand off to /plan

If the issue is already single-PR scope, tell the user so and confirm before posting (locally), then:
```bash
gh issue comment <number> --body "/plan"
```
Locally, once confirmed, you can just run `/plan` directly instead of posting a comment to trigger it.

## Outputs
- **Breakdown path:** N child issues with `Depends on:` lines where needed + `/plan` comments on root tasks + summary comment on parent
- **No-breakdown path:** a `/plan` comment on the issue (or, locally, running `/plan` directly)

## Rules
- Read the codebase before deciding — don't decompose from imagination
- Local runs: confirm with the user before creating any issue or posting any comment — these are GitHub-changing actions
- Only create as many sub-tasks as the work genuinely requires
- Only add `Depends on:` where ordering truly matters — prefer parallelism
- 8 sub-tasks maximum
- Don't start implementation — that belongs in `/plan` or `/build`
- Each child issue body must be self-contained enough to act on without reading the parent
