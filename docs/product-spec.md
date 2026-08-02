# Majo · Od Tatier k Dunaju — product specification

## Product objective

The website is a charity-run landing page, not a personal profile. Its primary
conversion is a **public pledge for Zachráňme Vilyho**. The run is the hook;
moving visitors toward a transparent pledge is the measure of success.

The audiences are:

1. The public, especially Instagram visitors, friends, and the uuultra
   community: understand, pledge, and share.
2. Sponsors: find credible facts, audience context, partnership information,
   and a direct contact.
3. Journalists: find a concise story, verified facts, approved assets, and a
   media contact.

## Source authority

The current React/NestJS/PostgreSQL/Docker architecture takes precedence over
the brief's Astro/Next.js recommendation. The Word brief controls product
goals, behavior, content and page structure. The v5 HTML controls the visual
design of every element it actually contains.

The v5 header, collage hero, doodles, WordArt, typography hierarchy, sticker
controls, sharp borders and shadows, rotations, charity composition, Vily
story card, time brackets, pledge example, and CTA hierarchy must remain
recognizably the same when rebuilt in React. Production code must use focused
components and maintainable CSS—never `dangerouslySetInnerHTML` or one pasted
mockup component. Desktop requires strong fidelity; mobile may recompose the
same elements to remain usable and accessible.

Browser chrome is excluded. Fake countdowns and pledge totals, placeholder
portrait content, and static controls are not authoritative data or behavior.
Their placement and presentation can still define the visual composition.

## Website lifecycle

The phase is explicit configuration, not automatic date inference.

| Phase | Intended period | Primary behavior |
| --- | --- | --- |
| `pre` | Before the run | Pledge-focused hero, start countdown, charity immediately after the hero. |
| `live` | During the run | Live position and progress become prominent while pledges remain available. |
| `post` | After the run | Finish time, result, final multiplier, donation fulfillment, and total raised become prominent. |

The brief associates these phases with 13–16 August 2026, but exact production
switch timing and displayed dates must be confirmed operationally.

## Sitemap

| Route or view | Status | Purpose and dependency |
| --- | --- | --- |
| `/` | Confirmed | Single-page conversion journey. |
| `/press` | Confirmed, content-dependent | Approved release, HD photos, logos, and media contact. |
| `/dakujem` | Confirmed, flow-dependent | Google Form completion destination and sharing prompt. |
| `/gdpr` | Required, legal-dependent | Approved processing information for pledge data. |
| `/vily` | Optional | Deeper approved context for press and sponsors. |
| Pledge list modal or `/prislub-zoznam` | Decision-dependent | Public-only pledge list and totals; presentation is selected in Milestone 5. |

`sitemap.xml`, `robots.txt`, canonical metadata, and structured data are launch
requirements rather than user-facing routes.

## Homepage order

1. Sticky header.
2. Hero with title, key run figures, and primary pledge CTA.
3. Charity section with approved Vily story, the father's 430 km walk, pledge
   brackets, example, and Google Form CTA.
4. Route map and checkpoints.
5. Majo's story and approved Refresher reference.
6. Team.
7. Partners.
8. Segmented sponsor, media, and personal contact.
9. Footer.

## Requirement status

### Confirmed

- Public pledge is the primary CTA and charity follows the hero.
- Run facts specified by the brief: 347.32 km, 84-hour limit, 36 official
  handoffs, Jasná start, and Tyršovo nábrežie finish. Public use still requires
  final factual approval.
- Pledge brackets: 84–76 hours = 1×, 76–68 = 1.5×, 68–60 = 2×, below 60 =
  2.5×, and over 84 hours/DNF = 0.
- Google Form is the external pledge collection mechanism; public display must
  contain only deliberately published fields.
- The supplied Paper/Ink/Ember visual system and v5 composition are binding.

### Optional

- Dedicated `/vily` page, Pavel Seidl team card, trailer, FAQ, and later pledge
  automation.
- The brief's public pledge list may be a modal or route; Milestone 5 selects
  one presentation.

### External-content or operational dependencies

- All biographies, portraits, links, partner assets, press files, legal copy,
  donation instructions, live provider details, production credentials, and
  approved medical/fundraising claims.
- Automated pledge ingestion, email reminders, and live tracking depend on
  approved data access and privacy design.
- Analytics provider, hosting/deployment details, and final launch metadata.

## Privacy and content rules

Emails and private pledge messages must never enter public data or client
bundles. Names appear publicly only with affirmative consent; otherwise use
“Anonym”. Legal, donation, medical, financial, and partner claims remain
placeholders until approved. Track every gap in `content-needed.md`.

## Quality targets

- Keyboard-accessible semantic controls, visible focus, descriptive image
  alternatives, and WCAG AA contrast.
- Lighthouse targets from the brief: performance above 90 desktop and 80
  mobile, first contentful paint below 1.2 seconds, and initial page weight
  below 1.5 MB.
- Responsive images, lazy loading below the fold, and an accessible alternative
  to any decorative or interactive content.
