# Wine Atlas Product Specification

## 1. Product Definition

Wine Atlas is a map-first reference app for exploring wine-growing regions around the world. Its primary interaction is geographic: users open a world map, find a region, zoom into its location, and browse a concise regional profile.

The product is an independent reference and exploration tool. All editorial prose, labels, summaries, and regional descriptions must be written from original research or included under a compatible license. The product must not imply affiliation, endorsement, certification, or official status from any external education provider, trade body, publisher, or map provider.

## 2. Product Goals

- Make wine regions discoverable through geography rather than a long text index.
- Give each region a useful, readable detail view.
- Make browsing comfortable on a phone as well as a desktop screen.
- Work with a small, maintainable data model.
- Support an Android build with cached reference data.
- Keep third-party attribution and content provenance visible to maintainers.

## 3. Non-Goals

- No exams, quizzes, flashcards, spaced repetition, scoring, or learner accounts in the first release.
- No user-generated reviews or ratings in the first release.
- No claim that the app is an official guide, certification tool, or complete catalogue of every wine region.
- No requirement for a server database for the initial region catalogue.

## 4. Target Users

### Curious Explorer

Wants to understand where a region is, what geographic forces shape it, and which grapes or styles are associated with it.

### Student or Hospitality Professional

Needs fast geographic orientation and a dependable way to compare regions while studying or preparing for work.

### Traveller

Wants to browse regions near a destination or route, including basic climate and landscape context.

## 5. Primary User Journeys

### Discover a Region

1. Open the Atlas view.
2. See the world map and the highlighted 30-50 degree latitude bands.
3. Pan and zoom to a wine-growing area.
4. Select a marker.
5. Read the region dossier.
6. Select a related grape or style to continue browsing.

### Find a Region Directly

1. Open the region browser.
2. Search by region, country, grape, or style.
3. Select a result.
4. The map flies to the region and opens its dossier.

### Compare Two Regions

1. Open one region dossier.
2. Add the region to a comparison tray.
3. Select a second region from the map or search results.
4. Compare location, climate, geographic factors, grapes, and styles.

## 6. MVP Feature Set

### World Atlas

- Full-width, viewport-sized interactive map.
- Pan, scroll zoom, touch pinch zoom, and zoom controls.
- Initial global view centered on the major wine-growing latitudes.
- Optional 30-50 degree Northern and Southern latitude overlays.
- Map style selector with a light cartographic style and a dark style.
- Responsive controls that remain usable on small screens.

### Region Markers

Each region has one selectable marker with:

- Region name.
- Country.
- Latitude and longitude.
- Climate category.
- Latitude belt.
- Visual climate color.
- Selected and comparison states.

Markers must be large enough to tap reliably. Name labels appear beside a marker once the map is zoomed in enough to avoid clutter, and stay hidden at the full world view. Selecting a marker must:

- Open a short map popup.
- Load the full region dossier below or beside the map.
- Preserve the map's current pan and zoom, so a user who has navigated to a location can select nearby markers without losing that view.

Selecting a region from the region browser, related-region links, or the comparison tray must additionally fly the map to the region and increase zoom to a useful regional level, since the map may not already be showing that area.

### Region Browser

- Search input with instant filtering.
- Country filter.
- Climate filter.
- Latitude hemisphere or belt filter.
- Sort by region name and country.
- A visible way to clear the search text and to reset all active filters at once.
- Results must show enough context to distinguish similarly named regions.
- Selecting a result must use the same selection path as selecting a marker.

### Region Dossier

The dossier is the main detail surface for a selected region. It must include:

- Region name and country.
- Coordinates and latitude belt.
- A short original overview.
- Climate summary.
- Geographic and topographic landmarks.
- Water, altitude, coast, soil, wind, or other relevant geographic factors.
- A plain-language explanation of how those factors influence growing conditions.
- Associated grapes.
- Associated wine styles.
- Optional production notes, clearly separated from geographic facts.
- Links to related regions and comparison actions.

The dossier must remain useful when no associated expression data is available. Empty states should explain what is missing without breaking the browsing flow.

### Comparison Tray

- Allow up to two selected regions.
- Show a compact persistent tray on desktop and a bottom sheet on mobile.
- Compare geographic position, climate, landmarks, growing conditions, grapes, and styles.
- Allow either selection to be cleared or replaced.
- Do not present numerical precision that the source data cannot support.

## 7. Content and Data Rules

### Region Record

```ts
type Region = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  hemisphere: 'Northern' | 'Southern';
  latitudeBelt: '30-50 N' | '30-50 S' | 'Outside primary belts';
  climate: 'Cool' | 'Moderate' | 'Warm' | 'Hot' | 'Variable';
  landmarks: string[];
  geographicFactors: string[];
  climateImpact: string;
  overview: string;
  subregions: Subregion[];
  grapes: string[];
  styles: string[];
  sources: SourceReference[];
};
```

```ts
type Subregion = {
  name: string;
  overview: string;
  geographicFactors: string[];
  grapes: string[];
  styles: string[];
  hasDedicatedProfile: boolean;
};
```

Subregions and villages are presented as clickable study entries. Dedicated
profiles contain local original research; entries without a verified dedicated
profile transparently inherit parent-region context until research is complete.
As of the current catalogue, every bundled subregion has a dedicated profile;
the parent-context fallback remains available for any subregion added later
before it has been researched.

### Editorial Requirements

- Prose must be written from original research or sourced from material with a compatible license.
- Maintain a source record for each region and each substantial editorial claim.
- Avoid copying distinctive wording from books, course materials, commercial guides, or websites.
- Separate verifiable geographic facts from interpretation and editorial summary.
- Use consistent naming, diacritics, units, and climate vocabulary.
- Do not use third-party logos, seals, official-looking badges, or protected certification marks.

### Source Record

```ts
type SourceReference = {
  title: string;
  publisher: string;
  url?: string;
  accessedAt?: string;
  license?: string;
  notes?: string;
};
```

Source records may live in a maintainer-only file if they should not be shipped to users, but every shipped claim must have a documented provenance decision.

## 8. Interface Structure

### Desktop

- Header with product name, search, filters, and map style controls.
- Map occupying most of the first viewport.
- Region browser as a side panel or collapsible drawer.
- Dossier below the map or in a coordinated detail panel.
- Comparison tray anchored to the bottom edge when active.

### Mobile

- Map fills the available screen beneath a compact header.
- Search and filters open from a map-level `Search regions` button as a bottom sheet.
- Region dossier opens as a scrollable detail sheet below the map.
- Subregion profiles open as a safe-area-aware detail sheet.
- Tap targets must be at least 44 by 44 CSS pixels.
- Controls must respect safe-area insets.
- No critical information may depend on hover.

### Interaction States

Every major surface must define loading, empty, selected, filtered, error, and offline states. Selection state must be visually distinct without relying on color alone.

## 9. Accessibility

- All controls have accessible names.
- Marker selection has a keyboard-accessible equivalent through the region browser.
- Search results are announced as the result count changes.
- Focus is visible and follows the opened dossier or sheet.
- Color is not the sole indicator of climate or comparison state.
- Text and controls meet WCAG AA contrast targets.
- Reduced-motion preferences disable map fly animations and decorative transitions.

## 10. Technical Architecture

### Recommended Stack

- Next.js with the App Router.
- TypeScript.
- Leaflet for the interactive map.
- Tailwind CSS for layout and responsive styling.
- Lucide icons for interface controls.
- Capacitor for Android packaging.
- Local typed JSON or TypeScript data for the initial catalogue.

### Suggested Structure

```text
src/
  app/
    page.tsx                 # Atlas screen
    region/[slug]/page.tsx   # Optional shareable region route
    globals.css
  components/
    atlas/
      AtlasMap.tsx
      MapControls.tsx
      RegionBrowser.tsx
      RegionDossier.tsx
      ComparisonTray.tsx
  data/
    regions.json
    sources.json             # May remain maintainer-only
  lib/
    geo.ts
    region-search.ts
  types/
    region.ts
```

The map component should own map lifecycle and viewport behavior. Search, dossiers, and comparison state should remain ordinary React state or a small focused store. Do not reintroduce a general-purpose learning engine for this product.

### Data Loading

- Load the initial region catalogue locally for fast startup and offline access.
- Keep map tiles remote unless a compliant offline tile strategy is deliberately added.
- Validate region records at build time.
- Fail gracefully when a tile provider is unavailable.
- Avoid shipping source notes or private editorial metadata unless intended.

## 11. Map Provider and Attribution Requirements

- Use a tile provider whose terms permit the intended traffic and distribution.
- Display the provider's required attribution exactly as specified.
- Display OpenStreetMap attribution when OpenStreetMap data or tiles are used.
- Do not scrape, cache, or redistribute tiles outside the provider's terms.
- Document provider URLs, attribution text, rate limits, and production restrictions.
- Treat map tiles as a service dependency and provide a useful non-map error state.

## 12. Android Requirements

- Use a neutral application ID and application name.
- Package the static web export through Capacitor.
- Preserve status-bar and splash-screen behavior across light and dark map styles.
- Verify map gestures and bottom sheets on a physical Android device.
- Cache the region catalogue for offline browsing.
- Clearly indicate when the map itself is unavailable offline.
- Build and verify a debug APK before each release candidate.

Implemented Android workflow:

```bash
npm run android:build
```

This builds the static web export, syncs Capacitor, and writes a debug APK to
`android/app/build/outputs/apk/debug/app-debug.apk`.

Expected commands:

```bash
npm install
npm run build
npm run android:sync
cd android
./gradlew assembleDebug
```

## 13. Privacy and Security

- The MVP requires no account and should collect no personal data.
- Do not embed API keys or provider secrets in the client bundle.
- Keep environment files and local databases out of version control.
- Do not add analytics until the product has a documented privacy policy and a clear opt-in decision.
- Add secret scanning and dependency auditing to CI before public release.

## 14. Licensing and Public Repository Checklist

Before making the repository public:

- Add a project license for original source code.
- Add third-party notices for libraries, fonts, icons, and map providers.
- Confirm the provenance and reuse rights for every shipped data record and editorial paragraph.
- Remove unused legacy routes, data, package dependencies, and generated artifacts.
- Remove external brand names and claims of affiliation or official status.
- Ignore local databases, environment files, build output, and generated native assets.
- Run a secret scanner and dependency license report.
- Review the repository history for content or secrets removed from the working tree.

## 15. Acceptance Criteria for MVP

- A new user can open the app and identify the major wine-growing belts immediately.
- A user can select any visible region marker with a mouse, keyboard-accessible browser, or touch input.
- Selecting a region zooms to it and opens its dossier.
- A user can find a region by name without using the map.
- Filters work together and have clear empty states.
- The dossier displays all available geographic and wine-style fields without layout overflow.
- Two regions can be compared and replaced without losing the current map context.
- The primary browsing flow works at phone, tablet, and desktop widths.
- The catalogue remains available when the device is offline.
- A missing map tile service does not make the region catalogue unusable.
- The project builds a working Android debug APK.
- No legacy learning, exam, or protected-branding content is present in the new product.

## 16. Delivery Plan

### Phase 1: Foundation

- Create the focused project shell.
- Add the typed region schema and validation.
- Add the neutral brand, license, and attribution files.
- Port the map lifecycle and geographic coordinate data after provenance review.

### Phase 2: Atlas MVP

- Implement the full-screen world map.
- Add markers, zoom behavior, belt overlays, and map attribution.
- Implement the region browser and dossier.
- Add loading, empty, error, and offline states.

### Phase 3: Exploration

- Add country and climate filters.
- Add related-region navigation.
- Add the two-region comparison tray.
- Add shareable region URLs if they improve discovery.

### Phase 4: Mobile Release

- Add safe-area-aware mobile sheets and controls.
- Sync the web export into Capacitor.
- Test on Android devices at multiple screen sizes.
- Produce a signed release build only after licensing and attribution review.
