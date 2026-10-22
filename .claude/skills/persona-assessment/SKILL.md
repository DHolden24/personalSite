---
name: persona-assessment
description: Simulates a panel of visitor personas using this personal site, grounded in its real current pages and content, and reports scored feedback (reviews, pain points, favorites, wishlist items) as an HTML dashboard saved to assessments/. Use when asked to dogfood the site, gather persona-based UX feedback, or redo/refresh the persona assessment.
type: skill
---

# /persona-assessment — Simulated Persona Feedback

You generate a panel of fictional visitor personas, simulate each one using **this personal site** (the project list, project pages, and privacy policies), and publish their scored feedback as a single self-contained HTML report.

- **Interactively:** `$ARGUMENTS` may contain a persona count (default 20) and/or a focus note (e.g. "15, focus on app-store reviewers and app users"); otherwise use the defaults below.

## Steps

### 1. Survey the site's current, real content

Do not reuse feature lists from a past run or from memory — the site changes between runs. Spend an Explore pass (or read directly if you already know the code well) covering:
- Every route in `src/router.js` and what each page shows (home list, project page, privacy policy, not-found)
- Every project in `src/projects/`: its `project.js` metadata, links, and whether it has a `privacy.md` — read each policy in full
- Site-wide elements: header, owner links (`src/site.js`), dark mode toggle, page titles, favicon
- Tech and hosting constraints: static site on GitHub Pages, no backend (so no contact form, search, comments, or analytics), clean URLs via the `staticRoutes` plugin in `vite.config.js`
- Anything visibly incomplete or placeholder (e.g. `[CONTACT EMAIL]` in a policy, missing store links, a project with no screenshots), plus decisions recorded in `adr/` and `LESSONS.md`

Every pain point and favorite you later write must trace back to something real found in this step. Invented features are not allowed; invented *gaps* are fine only if they're genuine absences you actually confirmed (e.g. "no way to contact the developer" only if you checked there isn't one).

### 2. Generate the persona panel

Default to 20 personas (or the count from `$ARGUMENTS`). Vary them deliberately across:
- **Why they arrived**: app-store reviewer checking a privacy policy URL, existing app user checking what happens to their data, prospective app user deciding whether to install, privacy-conscious user, recruiter or hiring manager, fellow developer browsing source links, potential collaborator, friend or club member who heard about a project, someone who followed a link from GitHub
- **Device and context**: phone on a slow connection, desktop, tablet; arriving on the home page vs. deep-linked straight to a project or policy
- **Domain familiarity**: from knows the projects' domains well (e.g. a HEMA practitioner for Liechtenoter) to has never heard of them
- **Technical comfort**: from developer to non-technical
- **Accessibility needs and preferences**: include, for example, a screen-reader user, someone who needs larger text, and someone who prefers dark mode
- **Collision with the site's real limits**: include at least a few personas whose goal runs into a genuine gap (e.g. wants to contact the developer, wants screenshots before installing, wants a store link that isn't there) so the panel isn't uniformly flattering

Each persona needs: a fictional full name, a one-line role/context eyebrow, and a one-sentence bio establishing why they're visiting and what they need from the site.

### 3. Simulate each persona's review

For every persona, grounded in step 1's actual content, produce:
- **Review**: a 1–2 sentence first-person quote in their voice
- **Pain point**: one concrete, specific gap or friction they hit — name the actual page/element involved
- **Favorite**: one concrete, specific thing they liked — name the actual page/element involved
- **Wishlist item**: one thing they'd want added or changed — it doesn't need to solve their own pain point (though it can), and it's fine for a persona to have none if nothing genuinely fits their voice; don't force one onto every single persona
- **Rating**: 1–5

Vary ratings honestly based on genuine fit between the persona's goal and what the site actually offers. A persona whose core goal the site can't meet (e.g. contacting the developer when no contact method exists) should score low (2s) even if the site is otherwise well-built — don't inflate scores to be nice. A realistic panel lands around a 3.5–4.5 average with a real spread, not all 5s.

### 4. Aggregate honestly

Compute, without exaggeration:
- Average rating and the 1–5 distribution (counts must sum to the persona count)
- **All pain points**, grouped only where two or more personas raised genuinely the same issue, ranked by occurrence count descending, each entry listing which personas raised it
- **All highlights**, same treatment
- **All wishlist items**, same treatment — the count here sums to however many personas actually had one (note in the list's subheading how many that is out of the total, e.g. "16 distinct requests across 19 of 20 personas")

Only merge two personas' items into one theme if they're really the same underlying issue/feature — most items will end up as singletons, and that's expected and fine. Never round a count up to make a "recurring theme" list look richer than it is.

### 5. Build the report

Load the `artifact-design` skill and follow it. This is a utilitarian report, not a marketing page — polished typographic hierarchy and a considered palette, no oversized hero. If a prior report exists under `assessments/`, skim its most recent file first and keep the same visual system (palette tokens, type pairing, card/ledger layout) for run-over-run consistency, but regenerate all content fresh from steps 1–4 — never copy old persona content forward.

Layout, top to bottom:
1. Header: eyebrow, title, one-sentence intro, and a short methodology note stating plainly that this is a **simulated feedback exercise with fictional personas**, not real user research — grounded in the site's real content as verified in step 1.
2. Summary dashboard tiles: average rating, rating distribution, and (at most) the top 2–3 *genuinely* recurring themes on the pain-point and highlight sides, pointing to the full lists below.
3. The persona review cards (name, role/eyebrow, bio, review quote, pain point, favorite, wishlist item when it has one, star rating) — **this comes first**, before the aggregate lists.
4. At the bottom, just above the footer: the three full ranked lists from step 4 (all pain points, all highlights, all wishlist items), each entry showing its count and attributed persona names.
5. Footer disclaimer restating that this is simulated, fictional feedback.

Give the wishlist its own visual identity on cards and in its ledger list — distinct from the pain (critical/warning) and favorite (positive) colors, since a wishlist item is aspirational rather than a verdict on the site as it stands today.

Support light/dark theme per the artifact-design token pattern. Publish it with the Artifact tool (pick a fitting title/description/icon) so there's a shareable link.

### 6. Persist to the repo

- Ensure an `assessments/` directory exists at the repo root (create it if missing).
- Save the report there as `assessments/persona_assessment_<YYYY-MM-DD>.html`, using the actual current date.
- If a file for today's date already exists, ask the user before overwriting rather than silently replacing it.
- Do not `git add`/commit/push this file unless the user explicitly asks — saving it locally is not itself a request to commit.

## Outputs
- A published Artifact link to the report
- The report saved at `assessments/persona_assessment_<date>.html`

## Rules
- Every pain point and favorite must be traceable to a real, currently-verified page/element or a real, currently-verified gap — no invented functionality. Wishlist items are the one exception allowed to be aspirational/not-yet-real, since they're requests, not claims about the current site.
- Ratings must vary honestly; don't let every persona love the site.
- Don't force a wishlist item onto a persona it doesn't fit — an honest "no wishlist item" is better than a padded one.
- Persona names and bios are clearly fictional — never modeled on or attributed to a real, identifiable person.
- Keep the "reviews above, full ranked lists below" ordering unless the user asks otherwise.
