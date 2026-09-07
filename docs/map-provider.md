# Map Provider

## Development Tile Service

The current development build uses the OpenStreetMap Standard raster tile
service at `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.

Visible attribution on the map is: `© OpenStreetMap contributors`.

This service is only suitable for normal interactive map viewing. It must not
be bulk-downloaded, pre-fetched, or packaged for offline use. Browser requests
must retain their normal referrer behavior. A production provider decision,
including traffic limits, support terms, and Android identification needs, is
required before public distribution.