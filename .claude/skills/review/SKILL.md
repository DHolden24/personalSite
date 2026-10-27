---
name: review
description: Review — spec compliance, testing, DevOps, UI/UX, security. Locally, diffs the current branch against main and posts findings in chat; in CI or against a named PR, posts five structured PR comments. Hands off to /address for fixes.
type: skill
---

# /review — Review

You are the review orchestrator. You review the diff against its tech spec and report structured feedback — in chat by default when run locally, or as GitHub PR comments in CI or when targeting a specific PR. You do not merge — you hand off to `/address` for fixes.

## Context sources

- **In CI (GitHub Actions):** PR number is injected into the prompt. If the prompt also contains `CI: confirmed green`, skip the CI status check — it was triggered by a passing CI run and the status is already known.
- **Interactively:** Default to **Running locally** below. Only target a PR on GitHub if `$ARGUMENTS` explicitly gives a PR number/URL, or the user explicitly asks to review a PR / post to GitHub — then follow step 1 as written.

## Running locally (default when interactive)

Review the live diff on the current branch instead of a GitHub PR — no `gh pr` calls:

```bash
git fetch origin main
git diff origin/main...HEAD
```

Find `feature/<slug>/spec.md` from the current branch name, same as step 1 below — that part is already local.

There's no CI run to check for uncommitted local work, so the local test suite is the gate instead:
```bash
npm test && npm run build
```
Report that result in the Testing pass in place of a CI status.

For "prior review" context (used by the re-review consistency rule at the bottom of this file): look earlier in **this conversation** for your own previous `### Review` response instead of `gh pr comments`. If none exists yet in this conversation, treat the whole diff as new.

**Output:** post the review as your chat response (the `### Review` structure from step 2) instead of running `gh pr comment`. Only post to GitHub if the user explicitly asks for it.

## Running in CI

When this skill runs in GitHub Actions, the agent process exits the moment your turn ends — nothing re-invokes you after a backgrounded task finishes. **In CI only:** do all the work in one continuous turn; do not spawn background subagents (`Task`/`Agent`), call `ScheduleWakeup`, use the `Monitor` tool, or pass `run_in_background: true` to `Bash` for any long-running command — run it in the foreground and let the tool call block until it finishes, even if that takes several minutes. Pass a `timeout` large enough to cover the command (up to 600000ms) rather than accepting the default — a `Bash` call that hits its own timeout gets auto-backgrounded by the harness with the same effect as `run_in_background: true`. If a command still ends up backgrounded anyway, don't wait for a notification or watch it with `Monitor` — poll it to completion with further blocking `Bash` calls in this same turn, since there is no later turn in CI to receive the result in. Explore the codebase inline (`grep`/`find`/`Read`) or with a foreground subagent you block on. Never end your turn while treating something as "pending" or waiting for a notification — there is no notification in CI; ending the turn tears down the runner and kills anything still in flight. Anything left running in the background, or left unfinished because you stopped to "wait," is killed at turn end, producing a run that reports success but leaves no review comment. Running interactively, none of this applies.

## Steps

### 1. Gather context (GitHub PR mode — see "Running locally" above for the interactive default)
```bash
# Get the PR info and branch
gh pr view <number>

# Get the full diff
gh pr diff <number>

# Get current CI status — skip if prompt contains "CI: confirmed green"
gh pr checks <number>

# Check for prior review comments from this skill
gh pr comments <number>
```

Find `feature/<slug>/spec.md` using the branch name as the slug source. This is the source of truth for "done."

If `LESSONS.md` exists at the repo root, skim it too — it holds coarse, project-wide patterns and gotchas from past `/learn` cycles. If this PR repeats one (e.g. a data-modeling pitfall, a test-fixture mistake it specifically warns about), raise it in the relevant pass below.

If a prior review comment exists (look for the `### Review` header):
- Note which files/lines were already flagged and what was said
- Identify which parts of the diff are **new** (added in commits after the prior review) vs **unchanged**

### 2. Run five review passes and post the findings

Run all five passes internally, then deliver the findings as **one** unit:
- **Locally (default):** your chat response, in the structure below.
- **GitHub PR mode:** one PR comment via `gh pr comment <number> --body "..."`.

Structure the comment as:

```
### Review

#### Spec
<!-- Walk each acceptance criterion in the spec:
     ✅ satisfied — cite the file and line range
     ❌ gap — mark **blocking**
     ⚠️ partial — mark **advisory** with what's missing
     Note any implementation that goes beyond stated scope. -->

#### Testing
<!-- Judge whether tests prove the right behaviors (not just coverage numbers):
     - Are the acceptance criteria exercised?
     - Are edge cases from the spec covered?
     - Flag missing test cases, skipped tests, or flaky patterns
     CI must be green for a PASS verdict. If triggered automatically by a passing CI run
     (prompt contains "CI: confirmed green"), note CI as confirmed green without re-checking. -->

#### DevOps
<!-- Check:
     - Changes to .github/workflows/ — do they break or weaken CI (ci.yml) or the Pages deploy (deploy.yml)?
     - Changes to vite.config.js — base path and the staticRoutes plugin still produce a page per route?
     - New dependencies in package.json — genuinely needed? license acceptable? lockfile updated? noticeable bundle-size cost?
     - No new secrets or credentials hardcoded
     If no DevOps surface: "N/A — no workflow or dependency changes." -->

#### UI/UX
<!-- Trigger if the PR touches src/ views, components or styles, or the spec lists UI acceptance criteria.
     Check: component behavior matches spec, accessible names on interactive elements and alt text on images,
     no hardcoded colors that break dark/light theme (prefer Naive UI theme values), layout at phone widths,
     page titles set via usePageTitle, .vue blocks ordered template → script → style.
     Design floor: run `node .claude/skills/hallmark/scripts/sloplint.mjs <changed .vue/.css files> --genre editorial`,
     dismiss the gates in .claude/skills/hallmark/references/gates.md § Not applicable, and walk the Floor in
     .claude/skills/hallmark/SKILL.md for the judged gates (eyebrows, tracked caps, dotted meta strings, emoji icons,
     invented facts, generated-voice copy, both themes). Any Floor finding is blocking; Reflex findings are advisory.
     If no UI surface: "N/A — no UI changes." -->

#### Security
<!-- Check: everything in src/ and public/ ships publicly (no secrets or private data),
     v-html only renders trusted repo content, new third-party scripts/CDNs or network calls,
     external links, and privacy-policy text still accurate for the app it describes.
     For docs-only or pure-logic PRs: "N/A." -->

---

#### Blockers
<!-- List every ❌ finding in one line each:
     - ❌ **[Pass]** Description -->

#### Advisories
<!-- List every ⚠️ finding in one line each:
     - ⚠️ **[Pass]** Description
     If none: "None." -->

---

**Blocking findings:** N
**Advisory findings:** N

**Verdict:** PASS | PASS WITH ADVISORY | NEEDS WORK

Next step: run `/address` to address blocking findings, or `/triage` to file advisories as issues, or request merge if PASS.
<!-- GitHub PR mode only: prefix this line with "@<author> — comment" instead of "run". -->
```

## Outputs
- One PR comment with all five passes and a summary verdict

## Rules
- Every finding is blocking or advisory — no ambiguous findings
- CI must be green for a PASS verdict
- Don't approve or merge the PR — post findings and stop
- Hand off to `/address` for fixes, not another full review pass
- **Consistency across re-reviews:** When a prior review comment exists, apply different standards by code age:
  - **New code** (in commits after the prior review): report all findings as normal
  - **Unchanged code** (already present when the prior review ran): only raise a *new* finding if you can cite a concrete risk — data loss, security vulnerability, or broken contract. Suppress style, preference, and speculative concerns on unchanged code. If the prior review already flagged something, do not re-derive it — quote the original finding verbatim instead of rewording it.
