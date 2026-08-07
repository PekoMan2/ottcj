# Codex project guidance

These instructions apply to the entire repository.

## Source-of-truth hierarchy

1. The existing React, Nginx, and Docker architecture is authoritative. The
   site is fully static: there is no backend and no database, and neither may
   be reintroduced. Do not replace the stack with the Astro or Next.js
   recommendation from the product brief.
2. `majootkd_design_brief_v2.docx` is authoritative for product goals,
   functionality, content structure, page structure, lifecycle, and
   requirements.
3. `majootkd_skicar_max_chaos_v5.html` is the visual source of truth for every
   section and element it contains. Preserve the recognizable header, collage
   hero, layering, doodles, WordArt, typography hierarchy, stickers, cards,
   borders, shadows, rotations, charity composition, Vily card, time brackets,
   pledge example, and CTA hierarchy.

The browser mockup chrome is not part of the website. Fake countdowns, pledge
totals, placeholder portrait content, and static controls are not production
data or behavior, although their visual placement and presentation remain
authoritative. Rebuild the mockup as focused React components and production
CSS. Never use `dangerouslySetInnerHTML`, paste the complete mockup into one
component, or redesign it into a generic landing page. Responsiveness,
accessibility, semantics, interactions, data integration, and maintainability
may improve; desktop must retain strong fidelity and mobile must retain the
same visual identity and elements in a deliberate recomposition.

Do not invent biographies, links, photos, legal text, partner details,
tracking URLs, credentials, donation details, or factual claims. Use a clearly
marked placeholder and record every missing input in
`docs/content-needed.md`. Never commit credentials or private pledge fields.

## Architecture

- `fe/`: React 19, TypeScript, Vite, Tailwind CSS v4, React Router, and an Nginx
  production image. Run lifecycle state comes from `VITE_*` build-time
  variables (see `fe/.env.example`); donations link out to Donio and
  notification signups link out to a Google Form.
- `compose.yaml`: the frontend/Nginx service. Nginx serves the React Router
  fallback.
- Use npm only; do not add another package manager or workspace layer.

## Milestone discipline

Follow `docs/implementation-plan.md`. Each of the seven milestones belongs in
its own Codex chat. Work only on the milestone requested by the user and do not
start later milestones. Preserve useful existing code and configuration, keep
components focused, and avoid premature abstraction.

For Milestone 2, visual verification is an acceptance gate: render the v5 HTML
and React implementation, capture desktop and mobile screenshots, compare
them, correct material visual differences, and document intentional responsive
adaptations.

## Verification

Run the checks relevant to the touched areas. Before a full milestone handoff,
run the complete suite:

```bash
npm --prefix fe run lint
npm --prefix fe run typecheck
npm --prefix fe run test -- --run
npm --prefix fe run build
docker compose config --quiet
docker compose build
git diff --check
```

Inspect the final diff and repository status.

## Commits and handoff

Use small, logical Conventional Commits such as `docs:`, `feat(fe):`,
`fix(be):`, and `test(fe):`. Do not bundle a naturally separable milestone into
one large commit. Before finishing, report exactly what was implemented, every
verification command and result, all missing content or external inputs, and
the final working-tree state.
