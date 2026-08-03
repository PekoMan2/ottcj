# Milestone 2 visual verification

Playwright coverage is configured for the authored desktop composition at
1280×900 and the deliberate mobile recomposition at 390×844. It checks
horizontal overflow, sticky-header behavior, mobile navigation, defining
collage elements, the charity heading, and the MAX pledge bracket.

Run the gate with:

```bash
npm --prefix fe run test:visual
```

The test fixes the clock, captures both the original v5 reference and React
implementation, and writes the four screenshots into this directory.

## Current status

The gate was rerun during Milestone 3 after the remaining homepage sections
were added. All six desktop/mobile Playwright checks pass. The four generated
screenshots are stored beside this file; the React screenshots now include the
complete homepage, while the v5 references end after the authoritative charity
section. Side-by-side review confirms that the original header, collage hero,
and charity composition remain recognizable and materially unchanged.

The hero now uses the client-approved SketchAR artwork for the route map,
347 km mark, event title, halušky, lynx, and šuhaj. These supplied images
intentionally replace the corresponding v5 placeholder drawings while keeping
their collage roles, relative hierarchy, and desktop/mobile layering.
The Slovakia artwork carries a deliberately approximate hand-drawn route with
its start and finish attached to the map; the exact course remains available
in the separate interactive map.

## Intended mobile adaptations

- The desktop stage keeps bounded absolute layers matching the v5 relative
  composition; mobile moves the same art into named grid positions.
- WordArt and annotations shrink and move to remain legible without horizontal
  clipping.
- White-backed SketchAR images blend into the paper surface; the transparent
  šuhaj source is used instead of its opaque duplicate.
- The desktop navigation becomes a keyboard-accessible menu and the four run
  statistics recompose into a two-column sticker grid.
- Charity content remains in the same narrative order while CTA controls stack
  to full width on narrow screens.
- The Milestone 3 editorial grids become single-column card stacks while
  retaining their doodles, borders, hard shadows, rotations, and CTA hierarchy.
