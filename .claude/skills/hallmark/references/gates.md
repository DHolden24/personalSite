# Gates

What this site refuses, condensed from upstream Hallmark's `references/gates.md` (gate numbers kept so they match `scripts/sloplint.mjs` output). Fixes are restated for Vue and Naive UI.

**Tiers.** **Floor**: never waived, nothing ships with one open. **Reflex**: a default a model falls into; fix it, or waive it in the report with a reason about this page (one under a sentence, or boilerplate, is no reason). **Finish**: craft detail, reported, never blocking.

**Grades** from the linter: `FAIL` (Floor) · `REFLEX` · `WARN` (suspected: confirm and fix, or dismiss with a reason) · `NOTE` (bookkeeping).

## Not applicable

Upstream builds one-screen-at-a-time landing pages with a stamped CSS header and a build log. These gates check that machinery or that page shape, not this site. Dismiss their findings without asking and count them in the report:

- **20, 42, 8, 32**: the Hallmark stamp, chrome named in the stamp, and repetition against `.hallmark/log.json`. This repo has no stamp and no log.
- **6b, 44a, 44b, 44c, 79**: hero posture, the fold and the dead band. Pages here are a single narrow column, not a hero and sections.
- **58, 59, 77, 78**: the 80-words-per-screen budget, 120px section gaps, section mass, 40px section heads. Privacy policies and project descriptions are meant to be read.
- **68, 81, F18**: upstream's `data-slot` stand-ins. Screenshot placeholders in `project.js` are this site's own way of marking missing material; they stay until the owner adds the image.
- **39b**: marketing control height. Naive UI's sizes are the system.
- **1, 65**: the display face and the named look apply to a new theme. Naive UI's system font stack is the site's choice; raise either only on a redesign that changes type.

## Floor

| Gate | The tell | The fix here |
| --- | --- | --- |
| 2a | Purple-to-blue, purple-to-pink or cyan-on-dark gradient, `background-clip: text` included | one hue, solid |
| 4 | A card inside a card (`n-card` in `n-card`, a bordered box in a bordered box) | one containment layer |
| 6a | Anything sized in `vh` | `dvh` or `svh` |
| 7a | `#000` or `#fff` as a colour outside the theme | a theme value |
| 10a | `transition: all`; animating `width`, `height`, `top`, `left` | list the properties; `transform` and `opacity` |
| 15 | A focus ring that fades in | instant |
| 17 | Tooltip focus delay equal to its hover delay | hover 800 to 1000ms, focus 0 |
| 18 | Auto-rotating content (a screenshot carousel) with no pause on hover and focus | pause on both, and a visible pause control past 5s |
| 19 | Copy tells: placeholder names, buzzwords (*seamless, robust, empower, supercharge, elevate, effortless, unlock, unleash, next-generation, world-class, best-in-class*), the rebuttal cadence ("Not a feature. A platform."), em or en dashes, filler openers, *Learn more* / *Get started* as a second action | the project's own nouns and verbs |
| 26a | An interactive element with no `:focus-visible`, a ring under 3:1, or an outline removed with nothing in its place | a ring at 3:1 or better, instant |
| 27 | A keyframe or transform transition with no `prefers-reduced-motion: reduce` fallback | add it |
| 28a | Autoplaying video without `muted`; `loading="lazy"` on the largest image above the fold | `muted playsinline`; `fetchpriority="high"` |
| 30a | An emoji standing in for an icon | one icon set (Naive UI pairs with `@vicons`), an SVG, or typography |
| 33 | A decorative `<svg>` or CSS-art element with neither `aria-hidden="true"` nor a label | hide it or name it |
| 34 | Horizontal scroll at any width 320 to 1920; `overflow-x` missing on `html` and `body`; `100vw` widths | `overflow-x: clip` on both, `width: 100%` |
| 38i | One italic word inside an otherwise roman heading | the whole heading one way |
| 39a | An input whose border width shifts between states, a focus ring built from `border`, disabled by opacity alone | Naive UI inputs handle this; custom ones use `outline` and the native `disabled` |
| 40 | Text, icon, focus ring or field edge under contrast against its computed background, in either theme (body 4.5:1, large text and icons 3:1) | fix the pair in both themes |
| 41 | Text within a hair of its fill colour; a surface that changes in dark mode without its text changing; grey text on a coloured surface (a project's `color` tile) | pair every fill with its text colour |
| 46a | An invented metric, testimonial, rating, logo wall or count | the owner's real fact, a visible placeholder, or nothing |
| 47a | A hand-drawn browser bar or OS window chrome | the real screenshot in a `<figure>`, or no chrome |
| 48 | A colour or `font-family` literal outside the theme (Naive UI theme, `useThemeVars()`, `:root` in `src/styles.css`) | lift it into the theme |
| 49a | A button label or primary nav link wrapping at any width 320 to 1920 | shorten it; `white-space: nowrap` |
| 50 | An image-bearing grid track on bare `1fr`; a large heading without `overflow-wrap: break-word; min-width: 0` | `minmax(0, 1fr)`; `break-word` |
| 54 | The eyebrow: short inert text before a heading that announces it (a category tag over a card, `FEATURES` over features). Legal: a `<figcaption>`, `<th>`, `<label>`, a nav label, a `<time>`, a status tag that states a real status | open the section another way (`craft.md` § Opening a section) |
| 55a | An uppercase heading that can wrap with `line-height` under 1.0 | 1.0 at least |
| 56 | Two `position: sticky; top: 0` elements | offset the second |
| 62 | Content hidden at rest: `opacity: 0` or `visibility: hidden` that needs JavaScript to show it | visible by default; animate from visible |
| 63 | Meta strings joined with middle dots (`A · B · C`), an arrow glued to link text (`Privacy →`), decorative status dots, `WORD - fragment` labels. Legal: one dot in a byline | line breaks, a list, a `<dl>`, a verb as the label |
| 67 | A label, caption, table head, nav link, tag or any text at 15px or under set uppercase, in small caps, or letter-spaced past 0.03em. Legal: a wordmark | the body face, a step smaller, sentence case, untracked |
| 70 | A form or control that prints success with nothing behind it | no success state until something real happens |
| 73 | Text painted under another element | give it its own space |
| 76 | An `<img>` with no source or one that does not load; a hotlinked stock photo | the real file in the project folder, imported |

## Reflex

| Gate | The tell | The fix here |
| --- | --- | --- |
| 2b | Gradient text in any hue | solid; weight or size |
| 3 | Three equal tiles of icon-above-heading; an icon in a rounded tile above a heading; a thick coloured stripe down a card's side | vary the layout; inline icons; hairline or no border |
| 7b | A surface that is pure white or black | Naive's surface values |
| 9 | Every section separated the same way with the same gap | whitespace, a hairline, a tinted well, a card: vary the rung |
| 10b | Transitioning `margin` or `padding` | `transform` |
| 11 | The same lift or scale on every card, more than one hover effect on one element, an image scaling on hover, hover on something not interactive | one signal, on the container |
| 12 | Bounce or overshoot easing on UI state | ease-out |
| 16 | A toast for an effect the user already sees | silent success |
| 22 | Pure grey neutrals next to a coloured accent | tint toward the hue |
| 23 | The accent colour covering more than about 5% of a screen | retreat it to links, the primary control, the focus ring |
| 25 | Running prose outside 45 to 75ch | `max-width: 65ch` |
| 26b | A form control missing `:active` or `:disabled` styles | add them |
| 29 | Glow and wash: blurred orbs, mesh blobs, a coloured glow shadow on dark | a solid surface; shadows with offset |
| 37 | More than three font families | two, plus one for code |
| 38ii | An italic display system | roman |
| 38iii | One word in a heading set apart by colour, weight, highlight or underline | the whole heading one way; a line break |
| 47b | A phone frame drawn around a screenshot. Guard: one frame, real screenshot inside | one frame or none |
| 47c | Imitation material: a "product UI" of styled divs where a screenshot belongs, a decorative grid or stripe background | the real screenshot, or nothing |
| 49b | A footer link, tab or breadcrumb wrapping | shorten it |
| 55b | A one-line caps lockup under 1.02 line-height | leave it if it cannot wrap at 320px |
| 64 | Monospace on labels, captions or meta when the text is not code or a measurement | the body face |
| 66 | Decoration text: a version badge or `BETA` pill as decoration, scroll cues, rotated labels, a `01 / 4` count on tiles. Guard: the text is a real fact (the project's status) | delete it, or make the fact a plain line |
| 69 | The echo: one fact repeated in four or more places, or a section's last line restating its heading | say it once |
| 71 | A heading nearer what precedes it than what it heads | at least twice the space above as below |
| 72 | Text in a filled or bordered box closer than 8px to its edges; running text within 8px of a phone's edge | pad it; a 16px gutter |
| 74 | A framework's stock swatch (Tailwind indigo-500 and kin) | a theme value |
| 75 | Running text under 12px, functional text under 11px, prose leaded under 1.3 | body 16px at 1.5 to 1.8 |
| 80 | A drawn illustration (an inline SVG of an object, person or scene past icon size) | a real screenshot or photo, or type |
| 82 | 24 or more identical marks counting a quantity | the number in type |
| 83 | Photos or screenshots covering most of the page with nothing between them | keep the strongest, set big; carry the rest in text |
| 84 | A built mock of an app that exists and could be captured | real screenshots in `src/projects/<id>/screenshots/` |
| 85 | The stock close: an email sign-up or generic call to action ending the page | end on what the visitor came for: the store link, the privacy policy, the source |

## Finish

Report, never block. F1 straight quotes in prose · F2 `...` for an ellipsis · F4 more than one filled primary button on a page, or two side by side · F5 an icon in a coloured coin · F6 figures that compare without `tabular-nums` · F11 a highlighter or underline thicker than 2px · F12 a flex row of unequal heights without `align-items: center` · F14 helper text with no reserved height (fields jump) · F15 page invariants broken: more than one primary button style, container width or radius per nesting level · F16 no `::selection` colour on a committed palette · F17 a text block squeezed into a sliver · F19 more than three font weights · F20 one item alone on a grid's last row under a fuller row · F21 a heading level skipped · F22 justified text without `hyphens: auto` · F23 a page without `lang`, a `<title>` or a meta description · F24 a hairline border under a wide soft shadow · F25 content shown at 1280 and hidden on a phone · F26 one word alone on a paragraph's last line, or a heading ending on a stub, at 375 or 1280.

## Judged clauses

The gates a script cannot settle.

- **54, the eyebrow test.** Delete the small line above the heading and reread. If nothing was lost but a name for what comes next, it was an eyebrow. Never just delete it: where the heading is figurative, the plain label becomes the heading.
- **63, template punctuation.** The middle dot as a universal separator, the arrow as a universal suffix and the coloured dot as a universal prefix are the punctuation of generated pages. A platform list is a list or a line break.
- **67, tracked caps.** Delete the transform and the tracking and read it again: the body face a step smaller says the same thing.
- **38iii, the accented word.** A heading is one weight, one style and one colour.
- **46a and 84, real material.** A project page shows the app as it is: its real screenshots, its real status, its real platforms. Missing material stays a placeholder, never an invention or a styled-div mock.
- **85, the close.** Could this exact page sit under a different app's name? A project page ends on what its visitor came to do, in that project's terms.
- **9, rhythm.** A page that climbs the same rung at every seam reads as a template.
- **11, hover.** One signal per element, on the container, never on an image. Non-interactive things do not react to the pointer.
