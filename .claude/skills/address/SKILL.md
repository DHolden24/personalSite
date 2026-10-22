---
name: address
description: Address /review findings — from this conversation by default, or from an open PR's review comments. Fixes blocking findings, handles advisories, keeps tests/CI green, and reports what changed. Use /build for initial feature implementation.
type: skill
---

# /address — Address Review Findings

You are the review feedback orchestrator. You address findings from `/review` — read from this conversation by default, or from an open PR's review comments — keep tests/CI green, and document what changed. This skill is for review feedback only — to implement a feature from scratch, use `/build`.

## Context sources

- **In CI (GitHub Actions):** PR number is injected into the prompt.
- **Interactively:** Default to **Running locally** below. Only target a PR on GitHub if `$ARGUMENTS` explicitly gives a PR number/branch that has an open PR, or the user explicitly asks to address a PR / post to GitHub.

## Running locally (default when interactive)

Address the review findings from **this conversation** instead of a GitHub PR thread — no `gh pr` calls for context:

- Findings to address are whatever `/review` (or the user) most recently posted **in this chat**. If nothing was reviewed yet in this conversation, ask the user what to address, or run `/review` first.
- Skip the "was `/triage` already run" check against GitHub comments — instead check whether `/triage` was run earlier **in this conversation**. If so, skip its advisories (already filed as issues); if not, handle each advisory per step 2 below.
- There's no PR thread to reply on: as you fix each finding, say so directly in your chat response instead of `gh pr comment`/replying on a thread.
- There's no CI to push to and poll — step 3 becomes: run `npm test && npm run build` locally until green, iterating on failures the same way.
- Step 4 ("Post an Address comment"): give the `## Address` summary as your chat response instead of `gh pr comment`.
- Filing a new issue for an out-of-scope advisory (step 2) is a GitHub-changing action — confirm with the user before running `gh issue create`, per repo policy for local runs.
- Only commit; don't push unless the user asks — pushing is a GitHub-visible action reserved for when a PR is actually being updated.

## Running in CI

When this skill runs in GitHub Actions, the agent process exits the moment your turn ends — nothing re-invokes you after a backgrounded task finishes. **In CI only:** do all the work in one continuous turn; do not spawn background subagents (`Task`/`Agent`), call `ScheduleWakeup`, use the `Monitor` tool, or pass `run_in_background: true` to `Bash` for any long-running command — run it in the foreground and let the tool call block until it finishes, even if that takes several minutes. Pass a `timeout` large enough to cover the command (up to 600000ms) rather than accepting the default — a `Bash` call that hits its own timeout gets auto-backgrounded by the harness with the same effect as `run_in_background: true`. If a command still ends up backgrounded anyway, don't wait for a notification or watch it with `Monitor` — poll it to completion with further blocking `Bash` calls in this same turn, since there is no later turn in CI to receive the result in. Explore the codebase inline (`grep`/`find`/`Read`) or with a foreground subagent you block on. Never end your turn while treating something as "pending" or waiting for a notification — there is no notification in CI; ending the turn tears down the runner and kills anything still in flight. Anything left running in the background, or left unfinished because you stopped to "wait," is killed at turn end, producing a run that reports success but leaves no branch, commit, or comment. Running interactively, none of this applies.

## Steps

### 1. Read all open review threads (GitHub PR mode — see "Running locally" above for the interactive default)
```bash
gh pr view <number> --comments
```

Check whether `/triage` has already been run by looking for a comment starting with `## Triage`. This determines how advisories are handled in the next step.

### 2. For each finding, decide

**Blocking findings** must be resolved before the PR is ready:
- Implement the fix. GitHub PR mode: push a commit, reply on the thread describing what changed. Local mode: commit, and say what changed in your chat response.

**Advisory findings** — behaviour depends on whether `/triage` has already been run:
- **If `/triage` was run first:** advisories are already filed as issues. Skip them entirely — do not implement, do not comment, do not re-file.
- **If `/triage` was NOT run:** handle each advisory explicitly:
  - If the fix is small and in scope: implement it (commit; push and reply on the thread in PR mode, or just report it in chat locally)
  - If the fix is out of scope or better handled separately: create a GitHub issue (`gh issue create --title "..." --body "..."` — confirm with the user first if running locally), reply on the thread (PR mode) or note the issue number in chat (local), then leave it

**Invalid / won't fix:** explain the rationale (cite the spec section, intentional scope, or why it's a false positive) — reply on the thread and resolve it in PR mode, or just state it in chat locally.

Every blocking finding and every untriaged advisory gets either a code change or a documented reply — no silent ignores.

### 3. Iterate until green

Always run locally first, and treat this as the gate in local mode (no PR to push to):
```bash
npm test && npm run build
```
Fix any local failures before proceeding — or, in GitHub PR mode, before pushing.

**GitHub PR mode only** — after each push, wait for CI and act on the result (up to 5 iterations):

```bash
# Wait for the CI run on this PR to finish
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

Don't report done until tests are green (CI, in PR mode; local run, otherwise).

### 4. Report the Address summary

Always give this after completing the feedback loop — as a `gh pr comment` in GitHub PR mode, or as your chat response locally.

```
## Address

### Changed
- <one line per fix implemented, referencing the finding it addresses>

### Not changed
- <one line per finding that was skipped, with reason: already triaged / invalid / won't fix / out of scope>
```

If nothing was skipped, omit the **Not changed** section.

## Output
- **GitHub PR mode:** same PR with all review threads addressed or replied-to, CI still green, Address comment posted.
- **Local mode:** findings from this conversation addressed via local commits, tests green, Address summary given in chat.

## Rules
- Do not modify existing tests unless there is no other option — prefer adding new tests alongside existing ones
- If an existing test must be changed, list every modified test, what changed, and why it was unavoidable (a PR comment in PR mode, your chat response locally)
- Reference spec sections in commit messages (e.g. `fix: clamp value to valid range (spec §validation)`)
- Don't merge or push (beyond an already-open PR the user is actively updating) without checking with the user first
- Filing GitHub issues and posting comments are GitHub-visible actions — in local mode, confirm with the user before running `gh issue create` or `gh pr comment`, per repo policy
