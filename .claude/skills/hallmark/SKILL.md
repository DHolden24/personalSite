---
name: hallmark
description: Design floor for this site's UI, so pages look made, not generated. Use when designing a new page or component, or when the user names Hallmark (`/hallmark audit <target>`, `/hallmark polish <target>`, `/hallmark redesign <target>`). /build and /review apply its Floor to any change in src/ views, components or styles. Never restyle an existing design under this skill unless the user names Hallmark.
argument-hint: "<what to design> | audit <target> | polish <target> | redesign <target>"
type: skill
---

# /hallmark — Design floor

Adapted from [Hallmark](https://github.com/Nutlope/hallmark) (MIT, see `LICENSE`; adapted from commit `6033bab`). Hallmark builds standalone landing pages from a catalogue of themes; this copy keeps only its floor, its gates and its linter, mapped onto this site: Vue single-file components, Naive UI, light and dark themes, a narrow single-column layout, a few project pages and their privacy policies.

The site's own system wins: Naive UI components, the theme set in `src/App.vue`, `src/styles.css`. This skill never swaps the component library, adds a font service or brings in a theme catalogue.

`$ARGUMENTS`: empty or a description → design that new page or component. `audit <target>` → report only. `polish <target>` → fix only the tells. `redesign <target>` → recompose, behind an approved plan. A target is a file, a folder, or a route (`/projects/liechtenoter`).

## The Floor

Binds every UI change, none of it waivable. Gate numbers match upstream Hallmark and `references/gates.md`.

1. **Colours and fonts come from the theme.** Naive UI's theme (the light and `darkTheme` pair on `n-config-provider`, plus any `themeOverrides` there), read in components with `useThemeVars()`, or a custom property declared on `:root` in `src/styles.css` with its dark value beside it. No colour or `font-family` literal anywhere else. A project's own `color` in `project.js` is data and may be used, as long as text on it still meets contrast. (48)
2. **Both themes are designed.** Every new colour pairing is checked in light and dark mode; never `filter: invert()`, never pure `#000` or `#fff` as a surface. (7a, 40, 41)
3. Never `transition: all`. Never animate `width`, `height`, `top` or `left`; `transform` and `opacity` only. (10a)
4. Every animation and transition has a `prefers-reduced-motion: reduce` fallback, and content is visible with scripting off or before a reveal runs. (27, 62)
5. Every interactive element has a visible, instant `:focus-visible` ring at 3:1 contrast. Naive UI controls bring their own; a `router-link` card or a custom clickable needs one. (26a, 15)
6. No horizontal scroll at any width from 320 to 1920: `overflow-x: clip` on `html` and `body` (never `hidden`, never `100vw`), grid tracks holding images use `minmax(0, 1fr)`, long headings carry `overflow-wrap: break-word; min-width: 0`. (34, 50)
7. Text contrast 4.5:1 for body, 3:1 for large text, icons and field edges, in both themes. Body text 16px or more. (40, 75)
8. Never an invented metric, download count, rating, testimonial, logo or review. A fact nobody gave is absent, or a visible placeholder the owner fills (like the screenshot placeholders in `project.js`). (46a)
9. Never an eyebrow (small inert text above a heading that only names it), and never a label, tag, caption, table head or nav link in tracked capitals or small caps: the body face, a step smaller, sentence case, untracked. (54, 67)
10. Never middle-dot-joined meta strings (`iOS · Android · Free`), arrows glued to link text (`Read more →`), or decorative status dots. (63)
11. Never a purple-to-blue gradient, a card inside a card (an `n-card` in an `n-card` counts), an emoji standing in for an icon, or a hand-drawn browser or phone frame around a screenshot. (2a, 4, 30a, 47a)
12. Never one italic or coloured word inside an otherwise plain heading. (38i, 38iii)
13. No generated-voice copy: buzzwords (*seamless, robust, empower, elevate, effortless, unlock, next-generation*), filler openers, stock second actions (*Learn more*, *Get started*), em or en dashes in UI copy. Say what the project does in its own nouns. Privacy policy wording is legal text: never reworded without the owner. (19)
14. A form or control never reports success without something real behind it. There is no backend; nothing pretends to send. (70)

Above the Floor, a **Reflex** gate is a default a model falls into, fixed or waived with a reason, and a **Finish** check is craft detail, reported and never blocking (`references/gates.md`).

## Running the linter

`scripts/sloplint.mjs` is upstream's checker, unmodified: Node 18+, no dependencies for the static tier. It reads `.vue`, `.css` and `.html`.

```bash
node .claude/skills/hallmark/scripts/sloplint.mjs src --genre editorial
```

The render tier (computed contrast, overflow at eight widths, screenshots) needs `puppeteer-core` and Chrome, which are not project dependencies; never add them to `package.json` without asking. With them installed globally, start `npm run dev` and pass each route:

```bash
node .claude/skills/hallmark/scripts/sloplint.mjs src --genre editorial --render \
  --url http://localhost:5173/ --url http://localhost:5173/projects/<id> --url http://localhost:5173/projects/<id>/privacy
```

The render tier only sees the default theme; check dark-mode pairings by toggling the theme in the browser or by reading the Naive UI dark values. Screenshots and records go to `.hallmark/` (git-ignored).

**Upstream's landing-page bookkeeping does not apply here.** Dismiss every finding for the gates in `references/gates.md` § Not applicable, without asking. Findings on a Naive UI component's internals (its own focus ring, its own transitions) are dismissed only after checking the rendered result. Every other `FAIL` is fixed; every `REFLEX` is fixed or waived with a reason in the report. Linter not runnable: walk `references/gates.md` by hand and say so.

## Designing something new

1. **Read the system first:** `src/App.vue`, `src/styles.css`, the views and components nearest to what you are adding, and the project's `project.js`. Name what you reuse and anything you introduce.
2. **Material before layout.** List what is real (the project's name, description, features, screenshots, links, platforms, status) and what is absent. The page is built from what is real; an absence stays absent or becomes a visible placeholder (Floor 8).
3. **The visitor's job.** On a project page, the visitor decides whether to install, or checks what happens to their data. The action that serves that job (a store link, the privacy policy) sits where they look first and closes the page; never an email sign-up or a generic call to action.
4. **One signature.** The one thing a visitor remembers, taken from the material: a real screenshot set large, the app's own colour, a feature shown rather than listed. Never a drawn illustration, a gradient blob or an emoji.
5. **Build in the repo's way:** TDD as `CLAUDE.md` says, `.vue` blocks ordered template, script, style, Naive UI components before custom markup, scoped styles, theme values per Floor 1. Read `references/craft.md` for type, copy, motion and finish.
6. **Sweep:** run the linter (above), walk the judged gates in `references/gates.md`, check both themes at 375px and 1280px, then report.

## audit, polish, redesign

Only when the user names Hallmark with one of these verbs.

- **audit `<target>`:** run the linter on the target's files (and routes, if the render tier is available), look at the pages in both themes before weighing the findings, then report: what the page is for, what works and stays (at least one thing), what reads as generated, what is broken. Findings by tier with `file:line`, plus the lightest verb that settles them. Changes no files.
- **polish `<target>`:** fix only what a Floor or Reflex gate names. The layout, the components and the look stay. If the concept itself is the problem, say so and recommend a redesign; never smuggle one in.
- **redesign `<target>`:** recomposes the layout and may change the system (colour, type, spacing). First post a plan: what stays, what changes, every file to edit, create or delete. Nothing is deleted and no route is removed until the user approves it.

Every verb keeps:

- **The content:** every fact, name, date and link. Wording only changes where a copy gate names it, and the report lists each changed line, before and after. Privacy policy text is never reworded.
- **The wiring:** routes, props, `key`s, `id`s, test selectors, `staticRoutes` in `vite.config.js`, `usePageTitle` calls. No test is edited to make a redesign pass; `npm test && npm run build` stays green.
- **A clean diff:** start from a clean tree (ask the user to commit or stash; never do it for them), so the change is one diff they can read and revert.

For polish and redesign, finish with a review in fresh context: a subagent that is given the before and after screenshots (or the changed files, if no render tier), `references/gates.md` and the Floor above, and none of this conversation. Fix what it finds that is real, once.

## Report

```markdown
**Hallmark · <verb or "new"> · <target>**

- **Read** · what the page is for; what works and stays
- **Floor** · 0 FAIL (or each finding: gate, file:line, fix)
- **Reflex** · fixed / waived (gate, reason)
- **Finish** · noted
- **Dismissed** · not-applicable gates, count; Naive UI internals, each with its reason
- **Changed** · files; copy changes before and after
- **Not checked** · render tier / dark mode / widths, if skipped
```

A fabricated pass is itself slop: report what ran and what did not.
