<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Wine Atlas Project Rules

## Architecture

- Keep the app statically exportable. `next.config.ts` uses `output: "export"` and Capacitor copies the resulting `out/` directory.
- Keep Leaflet browser-only. `AtlasMap.tsx` owns Leaflet creation, layers, markers, map viewport behavior, and cleanup.
- Keep selection in `AtlasScreen.tsx`; marker clicks, browser results, related regions, and comparison actions must use the same selection path.
- Use the existing component boundaries: `AtlasMap`, `RegionBrowser`, `RegionDossier`, and `ComparisonTray`.
- Preserve the map's bounded responsive height. Do not make the Leaflet container depend on an unbounded percentage height.

## Catalogue And Editorial Work

- The local catalogue is `src/data/regions.ts`. Run `npm run check:data` after every catalogue change.
- `Region` and `Subregion` contracts live in `src/types/region.ts`; runtime schemas live in `src/lib/region-schema.ts`.
- A `Subregion` with `hasDedicatedProfile: true` must have an original, place-specific overview, geographic factors, grapes, and styles.
- Do not copy prose from course material, books, commercial guides, or websites. Use original summaries based on verified research.
- If a named subregion has not been researched, leave its generated parent-context profile in place and do not mark it as dedicated.
- Maintain source/provenance decisions for all shipped editorial claims before publishing publicly.

## Maps And Keys

- Use MapTiler when `NEXT_PUBLIC_MAPTILER_KEY` is set; preserve visible MapTiler and OpenStreetMap attribution.
- The client key is an identifier, not a secret. Never commit `.env` files or use an administrative/service token in the client.
- Preserve the tile-unavailable state: regional data, search, and dossiers must remain usable when map tiles fail.
- Do not add tile prefetching, bulk downloading, or offline tile packaging without a provider whose terms explicitly allow it.

## Mobile And Android

- On mobile, region search is an on-demand bottom sheet opened from the map's `Search regions` button. Keep the long result list hidden until that action.
- Maintain at least 44 by 44 CSS pixel tap targets and safe-area-aware bottom sheets.
- Run `npm run android:build` to build and sync the current static app into the debug APK.
- Launcher source assets are in `assets/`; Android adaptive icon resources are in `android/app/src/main/res/`.
- Do not commit APKs, Gradle build output, Playwright reports, or test results.

## Validation

Run focused checks before widening a change, then use the relevant final gate:

```powershell
npm run check:data
npm run typecheck
npm run lint
npm test -- --run
npm run test:e2e
npm run build
npm run android:build
```

- Use Playwright's Chromium and Mobile Chrome projects for interaction and mobile layout changes.
- Keep generated `playwright-report/` and `test-results/` out of version control.
