# Frontend design system

## Design contract

The design is a postmodern sketchbook: disciplined editorial hierarchy on
paper with deliberate collage energy. It must not drift into a generic polished
landing page.

For content present in `majootkd_skicar_max_chaos_v5.html`, the mockup is the
visual source of truth. Future implementation must retain:

- The header's paired `uuu`/`MAJO · OTKD` branding, navigation, countdown area,
  and tilted pledge sticker composition.
- The hero's recognizable overlapping layers and relative placement: sun,
  mountains, halušky, kamzík, Slovakia/route drawing, 347 km treatment, labels,
  arrows, ambulance, cat, portrait area, arched WordArt, date, and primary CTA.
- The charity badge/title hierarchy, cream Vily story card, handwritten tag,
  story/progress division, bracket rows and dark MAX row, dashed example card,
  CTA hierarchy, note, and totals presentation.

Browser chrome is omitted. Fake values and placeholder imagery must be replaced
with real data or marked placeholders, but their composition can remain
binding. Recreate elements as semantic React components, CSS, and accessible
SVG. Do not paste the HTML or use `dangerouslySetInnerHTML`.

Desktop should closely match the reference composition. Mobile may turn fixed
overlaps into a deliberate stacked collage, resize WordArt, and move labels to
prevent clipping; it must keep the same visual identity and recognizable
elements. Intentional differences must be recorded during Milestone 2 visual
verification.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#FDFCF9` | Site background and primary surfaces. |
| Ink Black | `#0F1419` | Text, outlines, hard shadows, dark cards. |
| Ember | `#E8622D` | CTA surfaces, scribbles, large accents. |
| Ash | `#6B6B6B` | Secondary text and metadata where contrast permits. |
| Fog | `#D6D2CB` | Hairlines, quiet surfaces, disabled controls. |
| Vily Cream | `#FFFDF6` | Vily story card and warm emphasis. |

Use Ember for decorative or large text when it does not meet normal-text
contrast. Ember buttons use Ink text where needed for WCAG AA.

## Typography

- Prompt italic 200: `uuu` wordmark.
- Prompt italic 900: hero WordArt fallback and display headlines.
- Prompt italic 800: section headings.
- Prompt italic 400: body copy.
- Prompt italic 700: emphasis and buttons.
- Caveat 400/700: handwritten annotations only, never critical standalone
  information.
- JetBrains Mono 400/500: times, distances, countdowns, and tabular figures.

Load the Google Fonts stylesheet with `display=swap` and resilient local
fallbacks. Maintain clear heading semantics independently of visual size.

## Spacing and layout

Use an 8px grid. Core spaces are 8, 16, 24, 32, 40, 48, 64, 80, 96, and
128px. The content container is at most 1280px, with 16px mobile, 24px small
screen, and 32px desktop gutters. Section spacing is 64–80px on mobile and
96–128px on desktop.

The future collage hero uses explicit layers and named regions rather than
DOM-order accidents. Keep z-index values local to the collage context. Avoid
content-bearing layers that become unreachable or clipped at zoom.

## Shape, borders, and motion

- Corners are square or at most 4px; no bubble cards.
- Primary outlines are 2px Ink.
- Hard shadows use 3–5px Ink offsets, never blurred soft shadows.
- Decorative rotations stay around 0.3–2 degrees unless the v5 composition
  visibly requires more for a doodle.
- Hover/active movement must not cause layout shift. Honor
  `prefers-reduced-motion` and retain non-motion feedback.
- Dashed borders identify notes and examples.

## Foundation components

- `Container`: centered responsive width and gutters.
- `Section`: consistent vertical rhythm and optional semantic element.
- `StickerButton`: Ember primary and Ink secondary variants, small/regular
  sizes, hard shadow, controlled rotation, and native disabled behavior.
- `SectionHeading`: eyebrow, semantic heading, and optional handwritten
  annotation.
- `Card`: Paper, Vily Cream, or Ink tone with controlled rotation.
- `HandwrittenAnnotation`: Caveat styling around supplemental copy.
- `Stat`: tabular value plus descriptive label; the label must remain available
  to assistive technology.

These primitives support the later high-fidelity components; they do not
replace specific `Header`, `HeroCollage`, doodle, `VilyStory`, `TimeBrackets`,
or `PledgeExample` components required in Milestone 2.

## Background and accessibility

Paper uses a subtle repeating radial noise pattern without blocking pointer
events or reducing text contrast. Every interactive element has a visible
`:focus-visible` outline with sufficient offset. Do not remove native semantics
for visual styling. Decorative SVGs use `aria-hidden`; meaningful images need
approved alt text. Test keyboard flow, 200% zoom, reduced motion, and contrast
on every tone.
