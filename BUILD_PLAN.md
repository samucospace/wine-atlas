# Wine Atlas Build Plan

## Delivery Approach

Build the app as small vertical slices. Each slice should leave a usable state,
have a focused automated check, and be smoke-tested before the next slice
starts. Keep the region catalogue independent of map tiles so browsing remains
useful when the user is offline or the tile provider fails.

### Decisions To Lock Before Coding

- Use the Next.js App Router with `output: 'export'`; configure Capacitor's
  `webDir` to Next's `out` directory.
- Use a production-approved tile provider and record its URL template,
  attribution text, usage limits, and offline restrictions in `docs/map-provider.md`.
- Use original or compatibly licensed content only. Keep research notes and
  per-claim provenance in maintainer-only data, separate from shipped records.
- Use a neutral app name and Android application ID before creating the native
  project; changing either later creates avoidable release work.

### Test Tooling

- Unit and component tests: Vitest plus React Testing Library.
- Browser checks: Playwright, with desktop and mobile projects.
- Data validation: Zod schema validation run as part of `npm run check:data`.
- Quality scripts: `lint`, `typecheck`, `test`, `test:e2e`, and `build`.
- Android checks: Capacitor sync followed by `gradlew.bat assembleDebug` on
  Windows. Use a physical device for final gesture and safe-area checks.

## Phase 0: Project Baseline

### Work

1. Initialize the Next.js TypeScript project and Tailwind CSS.
2. Add Leaflet, Lucide, Capacitor, test dependencies, and scripts.
3. Configure static export, an `out` web build directory, and a Capacitor config
   pointing to it.
4. Add repository hygiene: `.gitignore`, environment example, license decision,
   third-party notices placeholder, and CI for lint, typecheck, data validation,
   tests, build, dependency audit, and secret scanning.
5. Create the suggested `src/app`, `components/atlas`, `data`, `lib`, and
   `types` structure with a minimal Atlas screen.

### Checkpoint 0: Toolchain Is Reproducible

Run:

```powershell
npm install
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Pass criteria:

- The static build creates `out/index.html`.
- The app opens locally with no browser-console errors.
- CI can run the same commands without local secrets.

## Phase 1: Catalogue And Editorial Foundation

### Work

1. Define `Region` and `SourceReference` in `src/types/region.ts`.
2. Implement the Zod schema and `validateRegions` helper in `src/lib`.
3. Add a small representative catalogue first: at least one region in each
   hemisphere, climate category coverage where feasible, and two comparable
   regions. Include all required fields and original prose.
4. Add a maintainer-only source register with access dates, licenses, and claim
   notes. Ensure it is excluded from the web bundle when appropriate.
5. Implement pure region search, filtering, sorting, latitude-belt calculation,
   and comparison helper functions.

### Checkpoint 1: Data Is Trustworthy And Independently Browseable

Add unit tests for:

- Every shipped region validates and has a unique stable ID.
- Coordinates are in valid ranges and computed hemisphere/belt agree with data.
- Every required editorial field is non-empty.
- Search matches region, country, grape, and style case-insensitively.
- Combined filters and both sort modes behave deterministically.
- Missing grapes, styles, or optional production notes are supported without
  throwing.

Run:

```powershell
npm run check:data
npm test -- --run src/lib
```

Pass criteria:

- Invalid records fail the validation command with an actionable field path.
- Search and filtering work without rendering a map or contacting a network.

## Phase 2: Atlas Map Slice

### Work

1. Implement `AtlasMap` as a client component that exclusively owns Leaflet
   creation, cleanup, viewport changes, marker layers, and tile-layer changes.
2. Load Leaflet CSS, give the map a stable explicit height, and guard browser
   APIs so static export does not attempt map initialization during build.
3. Add the initial global view, zoom controls, accessible marker labels, climate
   symbols in addition to color, selected state, and tap targets of at least
   44 by 44 CSS pixels.
4. Add the 30-50 degree north and south overlays, light/dark map styles, required
   provider attribution, and a tile-error notice that preserves the UI.
5. Respect `prefers-reduced-motion` by using an immediate viewport update rather
   than a fly animation.

### Checkpoint 2: The Map Enhances, But Does Not Gate, Discovery

Add component tests with a thin map adapter mock for marker data, selection
callbacks, belt visibility, style switching, and reduced-motion options.

Add Playwright checks that:

- Load the map at a desktop viewport and confirm belts, markers, and attribution.
- Click a marker and confirm the selection callback opens its popup/dossier host.
- Simulate tile requests failing and confirm the catalogue controls still work.

Run:

```powershell
npm test -- --run src/components/atlas
npm run test:e2e -- --project=chromium
```

Pass criteria:

- The app builds statically without `window` or Leaflet SSR failures.
- A failed tile provider shows a clear non-map state while region information
  remains searchable.

## Phase 3: Selection And Dossier Slice

### Work

1. Introduce a single `selectRegion(id, origin)` action in the Atlas page or a
   focused store. Markers, browser results, related regions, and routes must use it.
2. On selection, coordinate map focus, popup state, URL state if enabled, and
   dossier focus without duplicating selection logic.
3. Build `RegionDossier` with geography, climate impact, grapes, styles, related
   regions, and a clear optional-data empty state.
4. Move focus to the dossier or mobile sheet after selection; retain a visible
   selected state that does not rely only on color.

### Checkpoint 3: Any Region Can Be Read From Any Entry Point

Add tests for:

- Selecting via marker, result, and related link calls the same state action.
- The dossier renders every available record field and explanatory empty states.
- Opening the dossier sets focus appropriately.

Add Playwright coverage for selecting a known region on the map, seeing its
name and climate impact, then following a related region.

Run:

```powershell
npm test -- --run src/components/atlas/RegionDossier
npm run test:e2e -- --grep "selects and reads a region"
```

Pass criteria:

- Selection zooms/focuses the map and opens a readable dossier.
- Incomplete optional expression data never breaks the browsing flow.

## Phase 4: Browser And Filtering Slice

### Work

1. Build `RegionBrowser` using the pure search helpers from Phase 1.
2. Add instant search, country, climate, and hemisphere/belt filters plus region
   name and country sorting.
3. Show region, country, climate, and belt in every result; announce changing
   result counts through an `aria-live` region.
4. Build clear filtered-empty and loading states, plus a reset-filter action.
5. Make the browser a desktop panel/drawer and a mobile bottom sheet without
   putting critical interactions behind hover.

### Checkpoint 4: Direct Lookup Is Complete And Accessible

Add component tests for result count announcements, filter composition, sorting,
empty state, reset behavior, and keyboard result selection.

Add Playwright checks at desktop and mobile widths that search finds a region,
combined filters narrow results, a result opens the dossier, and no horizontal
overflow occurs.

Run:

```powershell
npm test -- --run src/components/atlas/RegionBrowser
npm run test:e2e -- --project=chromium --project="Mobile Chrome"
```

Pass criteria:

- Keyboard users can select every region through the browser.
- Filtered-empty results explain the outcome and can be reset.

## Phase 5: Comparison Slice

### Work

1. Add a focused comparison state that holds at most two IDs and supports add,
   clear, and replace operations.
2. Build `ComparisonTray`: persistent and compact on desktop, safe-area-aware
   bottom sheet on mobile.
3. Present comparable qualitative facts only: position, climate, landmarks,
   growing conditions, grapes, and styles. Do not fabricate numerical precision.
4. Ensure selection and comparison updates leave the current map viewport intact.

### Checkpoint 5: Two-Region Comparison Has Predictable State

Add unit tests for the two-item limit, replacement rules, clearing either slot,
and preserving the active map selection.

Add browser checks for add-first, add-second, compare, replace, and clear flows
on desktop and mobile.

Run:

```powershell
npm test -- --run src/components/atlas/ComparisonTray
npm run test:e2e -- --grep "compares two regions"
```

Pass criteria:

- Users can always tell which two records are being compared.
- Replacing or clearing a record does not reset the map or lose the other record.

## Phase 6: Responsive, Offline, And Failure States

### Work

1. Verify the full flow at phone, tablet, and desktop widths; apply safe-area
   insets and stable sheet/control dimensions.
2. Add online/offline detection with a non-blocking map-unavailable status.
3. Confirm local catalogue imports are bundled in the static output and remain
   available after an offline reload.
4. Audit focus visibility, labels, contrast, color-independent states, and
   reduced motion.
5. Add optional static share routes only after the base interaction works; generate
   all known region parameters at build time for static export.

### Checkpoint 6: Core Reference Use Survives Real Conditions

Use Playwright network routing to block tile requests and browser offline mode:

- Region browser, dossier, and comparison still operate offline after the app
  has loaded.
- The map failure/offline message is visible and understandable.
- The default, 768px, and 390px-wide views have no clipped controls or overflow.
- Reduced-motion mode does not invoke animated fly behavior.

Run:

```powershell
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

Pass criteria:

- All required loading, empty, selected, filtered, error, and offline states
  are represented and tested.
- The static build contains the catalogue and needs no server database.

## Phase 7: Android Packaging And Release Gate

### Work

1. Add the Android platform after the web build is stable.
2. Configure status-bar and splash behavior for both map styles.
3. Add `android:sync` to run the static build and `npx cap sync android`.
4. Test physical-device pinch, pan, marker taps, bottom sheets, back navigation,
   rotation, safe areas, offline catalogue use, and unavailable tiles.
5. Produce a debug APK and retain the validation record; postpone signing until
   attribution, licensing, and provenance review is complete.

### Checkpoint 7: Installable Debug Build

Run from the repository root:

```powershell
npm run build
npm run android:sync
Set-Location android
.\gradlew.bat assembleDebug
```

Pass criteria:

- The APK installs and opens on a physical Android device.
- Region search, dossier, comparison, map gestures, and offline catalogue all work.
- Tile unavailability does not make the app unusable.

## Final MVP Exit Checklist

- Run the full CI suite on a clean checkout.
- Manually test the primary journeys at phone, tablet, and desktop widths.
- Verify provider attribution text and tile terms against the chosen provider.
- Audit every shipped editorial paragraph and data record for provenance.
- Run dependency audit, license report, and secret scan.
- Confirm no learning, exam, protected-branding, account, analytics, or unused
  legacy code has entered the release.
- Record the tested catalogue version, Android debug APK version, and device
  coverage in the release notes.

## Recommended Implementation Order

Do not start the next numbered slice until its checkpoint passes:

1. Phase 0 baseline
2. Phase 1 catalogue and pure search helpers
3. Phase 2 map and tile-failure behavior
4. Phase 3 shared selection and dossier
5. Phase 4 browser and filters
6. Phase 5 comparison
7. Phase 6 responsive, accessibility, and offline hardening
8. Phase 7 Android debug build