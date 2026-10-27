# Craft

Type, colour, motion, copy and finish for this site, condensed from upstream Hallmark's `references/craft.md`. Where Naive UI already decides something (control sizes, input states, its own transitions), Naive UI wins.

## Type

- At most two families plus one for code; one family at several weights is one family. Three weights at most across a page (F19).
- **Body** 16px or more, line-height 1.5 to 1.65 (prose pages 1.65 to 1.8, as `.prose` is), measure 45 to 75ch (25). Never all caps, never justified without hyphenation, never tracked past 0.05em.
- **Headings:** one weight, one style, one colour (38i, 38iii). Line-height 1.0 to 1.25, tighter as they grow. `text-wrap: balance` on headings, `pretty` on body copy, so no heading ends on a stub (F26). Heading levels step one at a time (F21).
- **Labels, captions, tags, meta, nav links:** the body face a step smaller, sentence case, untracked (67). Monospace only for code or a measurement (64).
- Curly quotes and apostrophes, a true ellipsis `…`, a non-breaking space inside unit pairs (`10 MB`), `tabular-nums` on figures that compare (F6).

## Colour

- Every colour comes from the theme (Floor 1): Naive UI's light theme and `darkTheme`, any `themeOverrides`, `useThemeVars()` in a component, or a custom property on `:root` in `src/styles.css` with its dark value.
- **The accent is a signal, not a fill:** links, the primary control, the focus ring, an active state. Under about 5% of a screen (23).
- A project's own `color` (from `project.js`) may tint its tile or page, mixed with the surface so text on it holds 4.5:1 in both themes (41).
- **Dark mode is designed, not inverted:** elevated surfaces are lighter than the canvas, not darker; shadows give way to lightness steps or a hairline; saturated accents drop a little chroma and gain lightness; hue never moves. Screenshots use their dark variant, never a CSS `invert` or `brightness` filter.
- Bans: gradients past three stops; purple-blue, purple-pink or cyan-on-dark (2a); glows and halos (29); red and green as the only signal.

## Surfaces

- **The surface ladder:** whitespace, then a hairline, then a tinted well, then a card (a border or a shadow, never both, F24). Cards are for content that is independently interactive, like a project in the list. Never a card in a card (4); climb different rungs at different seams (9).
- Grids for page layout, flex inside components; flex children that must shrink take `min-width: 0`, images `flex-shrink: 0`. No orphan on a grid's last row (F20).
- One radius per nesting level, concentric: inner = outer minus padding.
- `overflow-x: clip` on `html` and `body` (34); `hidden` breaks `position: sticky`.

## Motion

- `transform` and `opacity` only (10a). Ease-out for arrivals, ease-in for exits; never bounce on UI state (12).
- Durations: about 120ms for a press or colour change, 220ms for hover and menus, 420ms for a drawer or accordion.
- At most one reveal on a page, from an already-visible default (62). Under `prefers-reduced-motion: reduce` every motion shows its end state at once (27).
- Hover is one signal that raises contrast (11). Focus rings never animate (15). Tooltips wait 800 to 1000ms on hover, 0 on focus (17).
- Never parallax, custom cursors, cursor followers, pulsing dots, or a carousel that will not pause on hover and focus (18).

## Copy

Write as the owner would say it to someone at a club night: the project's own nouns, the verb a user would use.

- **The swap test:** a line that would work on another app's page is rewritten with a noun only this project has. *Track your training* fits anyone; *A Fechtbuch for the modern HEMAist* fits one app.
- **Three tests a line:** can the reader picture it, could it be proven false, could only this project say it.
- **Headings** say what the visitor will see or get, never a category label (*Features*, *About*, *Why us*).
- **Rhythm:** verbs over adjectives, one idea a sentence, no triads of adjectives (*fast, simple, powerful*).
- **Refuse the generated voice:** everything gate 19 names, plus *Reimagine*, *Whether you're X or Y*, *It's not just X, it's Y*, *Say goodbye to*, *game-changer*, *journey*, a colon title (*Liechtenoter: the app for*), *Click here*.
- **Buttons** carry the verb of the action (*Get it on Google Play*, *Read the privacy policy*). **Errors:** what happened, what to do; no *Oops*, no exclamation marks. **Empty states:** what is empty and one action.
- **Punctuation:** no `--`, no em or en dash in UI copy (a comma, colon, full stop or parentheses instead). A full stop on standalone sentences, none on list items.
- Privacy policies and other legal text are the owner's: never reworded without them.

## Opening a section

The reflex is a small tracked-caps label above the heading, and the reflex is the tell (54). Ask what the reader does not yet know. If nothing, open with nothing. Other ways in:

1. **Nothing:** space above, the heading flush. Usually best.
2. **The heading announces itself:** the subject in its first two words.
3. **A lead-in inside the paragraph** in a heavier weight, never on its own line.
4. **A hairline or a change of surface:** the edge is the break.
5. **A real `<ol>`** when the sequence is genuine.
6. **A caption below** the content instead of a label above it.

Legal because each names something present: a `<figcaption>`, `<th>`, `<label>`, a nav or tab label, a `<time>`, a status tag that states a real status (`StatusTag`).

## Finish

- **Controls:** one filled primary button a page (F4); secondaries quieter. Delete or destructive actions are never the primary style unless they are the page's one action.
- **Forms** (if one ever appears): a `<label>` on every field, the right `type`, `autocomplete` and `inputmode`, paste never blocked, a failed submit focuses the first invalid field, and never a success message without something real behind it (70).
- **Lists of facts** (platforms, status, links) are a `<dl>` or a list, never a dotted string (63).
- **Images:** `width` and `height` set, the light and dark variant chosen by theme, `alt` that says what the screenshot shows (or `alt=""` when the caption already does).
- **Responsive:** check at 375 and 1280. Nothing scrolls sideways; body text never under 16px; tap targets 44px on touch.
- **The document:** a `<title>` per page via `usePageTitle`, `lang` on `<html>`, a meta description (F23).
