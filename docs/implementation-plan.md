# Seven gated implementation milestones

Each milestone is completed in a separate Codex chat. Do not start later work
early. Every milestone ends with relevant lint, typecheck, tests, production
builds, diff inspection, a missing-input report, and small logical Conventional
Commits.

## 1. Product specification and frontend design foundation

Create authoritative documentation and `AGENTS.md`; define tokens, typography,
layout and reusable primitives; add explicit build-time phase configuration, a
minimal Slovak route shell, focused tests, and no backend changes. Do not build
the final header, hero, or charity section.

## 2. Header, hero, charity, and pledge calculations

Rebuild every corresponding v5 element as focused React components and
production CSS. Preserve the recognizable desktop composition, layering,
doodles, WordArt, typography, rotations, borders, shadows, Vily card, brackets,
example, and CTA hierarchy. Add semantic interactions, responsive mobile
recomposition, and tested bracket calculations.

Visual acceptance is mandatory:

1. Render the original v5 HTML as the reference.
2. Render React at representative desktop and mobile viewports.
3. Capture screenshots using available browser tooling.
4. Compare and correct material differences in composition, hierarchy,
   layering, typography, WordArt, doodles, rotations, borders, shadows, charity
   layout, and CTA prominence.
5. Document intentional responsive differences and confirm the result is
   recognizably the same design, not merely the same palette and components.

Strong fidelity is required at the reference desktop viewport. Pixel-perfect
scaling is not required when responsiveness or accessibility needs adaptation.

## 3. Remaining homepage content

Implement the approved story, team, partners, contact, and footer content in
the Word-defined order using the established visual system. Keep missing
content explicit and preserve primary pledge prominence.

## 4. Route map

Parse the supplied KMZ/GPX at runtime, render Leaflet/OpenStreetMap route and
checkpoints, add the approved key-point list, and handle loading, parsing,
interaction, accessibility, and responsive failure states. Route-map work stays
exclusively in this milestone.

## 5. Pledge workflow and supporting routes

- Configure the external Google Form pledge flow.
- Add safe manually maintained public pledge data.
- Implement pledge totals, anonymous display behavior, multiplier calculations,
  and the selected pledge-list presentation.
- Implement `/dakujem`, `/press`, optional `/vily`, and required `/gdpr`.
- Never expose private Google Form fields such as email addresses or private
  messages.
- Do not invent final legal, donation, press, or factual content.

## 6. Lifecycle and tracking operations

Implement explicit `pre`, `live`, and `post` behavior, backend operational
state, safe operational controls, and the approved direct Garmin LiveTrack
handoff. The live website links to Garmin rather than embedding a second map or
inventing live statistics. A separately consented start-alert registration may
collect an email address, phone number, or both only after the Garmin device,
recipient limits, legal copy, retention and manual operator workflow pass an
end-to-end pilot.

## 7. Launch hardening

Complete SEO, structured data, final metadata, accessibility audit, performance
budgets, asset optimization, production configuration, security/privacy review,
cross-browser checks, and full launch verification.

## Dependency rules

Milestones consume only approved content recorded as received in
`content-needed.md`. Never expose private form data or credentials. Architecture
changes must extend the existing React/NestJS/PostgreSQL/Docker stack. The v5
visual contract applies wherever it supplies a design; the Word brief governs
remaining content and behavior.
