# Map Provider

## MapTiler Tile Service

When `NEXT_PUBLIC_MAPTILER_KEY` is configured, the atlas uses MapTiler's
`streets-v4` raster tiles through its documented 256px XYZ endpoint. The key
is read from an ignored local `.env` file and is intentionally included in the
client bundle as a restricted client identifier.

Visible attribution on the map is: `© MapTiler © OpenStreetMap contributors`.

For a combined web and Capacitor build, restrict the key by approved HTTP
origins, including `localhost` for development and any deployed web domain. Do
not combine an origin rule with a User-Agent rule on the same MapTiler key,
because both conditions must match. Capacitor uses its local WebView origin and
the project appends `WineAtlasAndroid/1.0` to its Android user agent.

The application falls back to OpenStreetMap Standard tiles only when no
MapTiler key is configured; that fallback remains for local development and
must not be used for offline tile packaging or bulk downloading. The regional
catalogue is local and remains usable when tiles are unavailable.