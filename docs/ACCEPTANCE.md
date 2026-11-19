# Acceptance report — 30 October 2026

Verified in the independent `kantora-next-demo` sibling. Original `gener2` code and data were not modified by this continuation.

## Executed results

- Production build: PASS; TypeScript and prerendering completed, including role routes.
- ESLint: PASS with zero errors and four `no-img-element` advisory warnings. Native images intentionally support local data/blob previews without an image service.
- Playwright on installed Chrome: **5 passed (11.8 seconds)**.
- Desktop (1440px width) and mobile (390px width) screenshots captured and visually inspected. Mobile has no horizontal overflow.
- Actual GLB geometry verified with a canvas pixel threshold (more than 10,000 non-background pixels), not just a visible canvas or successful asset request.

## Browser scenarios

1. Engineer submission → manager approval → director completion 52% → explicit publication → customer 65%. Internal note absent from customer publication. Reload and reset verified; no uncaught browser errors in this flow.
2. Model loads; planned mode, floor, structure layer, camera reset and approved evidence controls work. Screenshots show architectural geometry.
3. Local upload preview and three-image simulation show the corresponding prebuilt model. No generated-geometry claim.
4. Engineer task submission → manager validation clears overdue status; another passing inspection changes first-pass quality from 50% to 67%.
5. All eight direct role routes load correct roles; property management uses Toptani.

## Defects found and corrected during verification

- Dynamic role pages blocked Next.js prerendering: added explicit static role params.
- Customer publication exposed the internal report: separate public summaries now required.
- Camera reset recreated the WebGL surface: reset now acts on orbit controls.
- Drei HTML loading overlay produced a React DOM removal error: replaced with normal DOM controls and native 3D evidence markers.
- A visible canvas contained no model: single-material meshes were incorrectly converted into material arrays. Preserving the single-material shape restored rendering; pixel verification protects against recurrence.

## Scope limits

This is a local frontend demonstration, not production authorization, a real financial ledger or real image reconstruction. Role switching deliberately makes the entire synthetic dataset available to the presenter. See MIGRATION.md for simplified and omitted production workflows. Historical overlays reuse the architectural asset; evidence marker positions are illustrative. Financial values are synthetic fixtures.

Artifacts: `customer-desktop.png`, `customer-mobile.png`; browser HTML report in `../playwright-report/index.html`.
