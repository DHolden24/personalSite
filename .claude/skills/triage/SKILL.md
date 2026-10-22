---
name: triage
description: Reads the /review findings — from this conversation by default, or from a PR's review comment — extracts advisories, groups similar ones together, and files each group as a new GitHub issue (confirmed with the user first when run locally). Reports the result in chat locally, or as a PR comment otherwise.
type: skill
---

# /triage — File Advisories as Issues

You are the triage orchestrator. You read the review findings — from this conversation by default, or from a PR's review comment — extract every advisory finding, group related ones together, and file each group as a standalone GitHub issue.

## Context sources

- **In CI (GitHub Actions):** PR number is injected into the prompt.
- **Interactively:** Default to **Running locally** below. Only target a PR on GitHub if `$ARGUMENTS` explicitly gives a PR number, or the user explicitly asks to triage a PR / post to GitHub.

## Running locally (default when interactive)

Extract advisories from **this conversation** instead of a GitHub PR comment — no `gh pr view` call for context:

- Use the most recent `### Review` output that `/review` (or you) posted **in this chat**. If there isn't one, tell the user to run `/review` first instead of searching GitHub.
- Group advisories exactly as in step 2 below.
- Filing GitHub issues (step 3) changes GitHub state — confirm with the user before running `gh issue create` for each group, per repo policy for local runs. Show the proposed groups and draft issue bodies first; only create the ones the user confirms.
- Step 4 ("post a summary comment on the PR"): give the `## Triage` summary as your chat response instead of `gh pr comment` — list the issues actually created (or, if the user declined, say so).

## Running in CI

When this skill runs in GitHub Actions, the agent process exits the moment your turn ends — nothing re-invokes you after a backgrounded task finishes. **In CI only:** do all the work in one continuous turn; do not spawn background subagents (`Task`/`Agent`), call `ScheduleWakeup`, use the `Monitor` tool, or pass `run_in_background: true` to `Bash` for any long-running command — run it in the foreground and let the tool call block until it finishes, even if that takes several minutes. Pass a `timeout` large enough to cover the command (up to 600000ms) rather than accepting the default — a `Bash` call that hits its own timeout gets auto-backgrounded by the harness with the same effect as `run_in_background: true`. If a command still ends up backgrounded anyway, don't wait for a notification or watch it with `Monitor` — poll it to completion with further blocking `Bash` calls in this same turn, since there is no later turn in CI to receive the result in. Explore the codebase inline (`grep`/`find`/`Read`) or with a foreground subagent you block on. Never end your turn while treating something as "pending" or waiting for a notification — there is no notification in CI; ending the turn tears down the runner and kills anything still in flight. Anything left running in the background, or left unfinished because you stopped to "wait," is killed at turn end, producing a run that reports success but leaves no issues filed or summary comment. Running interactively, none of this applies.

## Steps

### 1. Find the review comment (GitHub PR mode — see "Running locally" above for the interactive default)

```bash
gh pr view <number> --comments
```

Look for the comment that starts with `### Review`. If no such comment exists, stop and post:

```bash
gh pr comment <number> --body "No review comment found — run \`/review\` first."
```

### 2. Extract and group advisory findings

Parse the review comment for lines or items marked ⚠️ or labelled **advisory**. Collect each one with:
- Which pass it came from (Spec, Testing, DevOps, UI/UX, Security)
- The full description

Skip ✅ (passing), ❌ (blocking — those belong in `/address`), and N/A stubs.

**Group advisories that are similar enough to be fixed together.** Two advisories belong in the same group if:
- They affect the same file, component, or module, OR
- They describe the same root cause (e.g., multiple missing accessible names, multiple hardcoded colours), OR
- Fixing one would naturally fix the other

Give each group a concise title that covers all its members. Keep advisories in separate groups if their fixes are independent or span different areas.

### 3. Create a GitHub issue per group

Locally, show the user the proposed groups and titles first and wait for confirmation before filing anything (per repo policy for GitHub-changing actions run locally). Then, for each confirmed group:

```bash
gh issue create \
  --title "<concise title describing the group>" \
  --body "## Advisory findings from <PR #<number> | branch <name>>

**Review pass(es):** <Spec | Testing | DevOps | UI/UX | Security>

<For each advisory in the group:>
- ⚠️ <Full text of the finding>

---
_Filed by \`/triage\` from the review of <PR #<number> | branch <name>>._"
```

### 4. Report the summary

**GitHub PR mode:**
```bash
gh pr comment <number> --body "## Triage

The following advisory groups have been filed as issues:

- #<issue-number> — <title>
- #<issue-number> — <title>
...

These can be addressed in follow-up PRs. Blocking findings (if any) still need to be resolved via \`/address\` before this PR is merged."
```

If there were no advisory findings:

```bash
gh pr comment <number> --body "## Triage\n\nNo advisory findings in the review comment — nothing to file."
```

**Locally:** give the same `## Triage` content as your chat response instead of a PR comment — list the issues actually created, or note that the user declined to file some/all of them.

## Outputs
- One GitHub issue per confirmed group of related advisory findings
- **GitHub PR mode:** one summary comment on the PR. **Local mode:** the summary as your chat response.

## Rules
- Only file advisories — not blocking findings, not passing items
- Group advisories that share a root cause or fix location; keep unrelated ones separate
- Do not close or modify the review comment
- Do not modify any code — triage only creates issues
- Local mode: confirm with the user before creating any issue — filing issues is a GitHub-changing action
