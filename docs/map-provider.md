# Map Provider

## MapTiler Tile Service

When `NEXT_PUBLIC_MAPTILER_KEY` is configured, the atlas uses MapTiler's
`streets-v4` raster tiles through its documented 256px XYZ endpoint.

Visible attribution on the map is: `© MapTiler © OpenStreetMap contributors`.

The client key is intentionally visible in web and Capacitor builds. Restrict it
in MapTiler to approved origins and monitor its usage. The application falls
back to OpenStreetMap Standard tiles only when no MapTiler key is configured;
that fallback remains for local development and must not be used for offline
tile packaging or bulk downloading.