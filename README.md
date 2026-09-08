# Wine Atlas

Wine Atlas is an independent, map-first reference app for exploring wine regions, their geographic conditions, grapes, styles, and important subregions or villages. It is designed for personal study and geographic orientation; it is not an official guide or complete catalogue.

## Included

- 49 locally bundled parent regions across Europe, the Americas, South Africa, Australia, and New Zealand.
- Interactive Leaflet map with MapTiler tiles, climate markers, latitude-belt overlays, and a tile-failure fallback.
- Marker labels appear once you zoom in a little, keeping the world view uncluttered; selecting a marker opens its dossier without resetting the current pan or zoom.
- Search, country/climate/hemisphere filters, a one-click "Clear all filters" action, related-region navigation, and two-region comparison.
- Click-through subregion profiles. All 214 bundled subregions currently have a dedicated, original profile with local geography, grapes, and styles; the data model still supports a parent-context fallback for any subregion added later without research.
- Responsive mobile search sheet and Capacitor Android debug build.

## Run Locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

Create a local `.env` file before using MapTiler:

```env
NEXT_PUBLIC_MAPTILER_KEY=your_restricted_client_key
```

The app falls back to OpenStreetMap Standard tiles only when that variable is absent. Read [docs/map-provider.md](docs/map-provider.md) before changing the map provider or publishing the app.

## Checks

```powershell
npm run check:data
npm run typecheck
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

`npm run check:data` validates the complete local catalogue using Zod. Playwright reports and test results are generated files and are ignored by Git.

## Android

Build a fresh debug APK with:

```powershell
npm run android:build
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. Install it on an Android 7+ device with an updated WebView. The regional catalogue is bundled into the app; map tiles still need a network connection.

## Content And Attribution

All editorial summaries should be written from original research. Do not copy wording from course material, books, commercial guides, or websites. Each local data record carries source references; maintain detailed provenance for every shipped factual or editorial claim before any public release.

MapTiler and OpenStreetMap attribution must remain visible on the map. A MapTiler client key is exposed in the built app by design, so restrict it to approved origins and monitor usage. Do not commit `.env` files or service tokens.

## Project Structure

```text
src/app/                 App shell, global styles, and web icon
src/components/atlas/    Map, browser, dossier, and comparison UI
src/data/regions.ts      Local parent-region and subregion catalogue
src/lib/                 Geographic, schema, and search helpers
src/types/region.ts      Region and subregion contracts
e2e/                     Playwright browser tests
android/                 Capacitor Android project
assets/                  Launcher icon source assets
```
