"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Search, Sun } from "lucide-react";
import type * as Leaflet from "leaflet";
import type { Region } from "@/types/region";

export type MapStyle = "light" | "dark";

const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const tileUrl = mapTilerKey
  ? `https://api.maptiler.com/maps/streets-v4/256/{z}/{x}/{y}.png?key=${mapTilerKey}`
  : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const tileAttribution = mapTilerKey
  ? '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Below this zoom level, marker labels are hidden to avoid clutter on the world view.
const LABEL_ZOOM_THRESHOLD = 4;

type AtlasMapProps = {
  mapStyle: MapStyle;
  onMapStyleChange: (style: MapStyle) => void;
  onOpenBrowser: () => void;
  onSelect: (regionId: string) => void;
  regions: Region[];
  selectedRegionId?: string;
};

export function AtlasMap({
  mapStyle,
  onMapStyleChange,
  onOpenBrowser,
  onSelect,
  regions,
  selectedRegionId,
}: AtlasMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map>(null);
  const markerRefs = useRef(new Map<string, Leaflet.Marker>());
  const skipNextFlyToRef = useRef(false);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const markers = markerRefs.current;

    async function initializeMap() {
      const container = mapElement.current;

      if (!container) {
        return;
      }

      const L = await import("leaflet");

      if (cancelled) {
        return;
      }

      const map = L.map(container, {
        center: [12, 8],
        zoom: 2,
        minZoom: 2,
        zoomControl: true,
      });
      mapRef.current = map;

      const tiles = L.tileLayer(tileUrl, {
        attribution: tileAttribution,
        maxZoom: 19,
      });
      tiles.on("tileerror", () => setTilesUnavailable(true));
      tiles.addTo(map);

      const updateLabelVisibility = () => {
        container.classList.toggle("atlas-map--labels-visible", map.getZoom() >= LABEL_ZOOM_THRESHOLD);
      };
      map.on("zoomend", updateLabelVisibility);
      updateLabelVisibility();

      const beltStyle = {
        color: "#a9413d",
        fillColor: "#a9413d",
        fillOpacity: 0.08,
        interactive: false,
        weight: 1,
      };
      L.rectangle(
        [
          [30, -180],
          [50, 180],
        ],
        beltStyle,
      ).addTo(map);
      L.rectangle(
        [
          [-50, -180],
          [-30, 180],
        ],
        beltStyle,
      ).addTo(map);

      regions.forEach((region) => {
        const marker = L.marker([region.latitude, region.longitude], {
          icon: L.divIcon({
            className: "wine-marker",
            html: `<span class="wine-marker__symbol" aria-hidden="true"></span><span class="wine-marker__label">${region.name}</span>`,
            iconAnchor: [22, 22],
            iconSize: [44, 44],
          }),
          keyboard: true,
          title: `${region.name}, ${region.country}`,
        })
          .bindPopup(`<strong>${region.name}</strong><br />${region.country}`)
          .bindTooltip(`${region.name}, ${region.country}`)
          .on("click", () => {
            skipNextFlyToRef.current = true;
            onSelect(region.id);
          })
          .addTo(map);

        markers.set(region.id, marker);
      });
    }

    void initializeMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, [onSelect, regions]);

  useEffect(() => {
    const map = mapRef.current;

    markerRefs.current.forEach((marker, regionId) => {
      marker.getElement()?.classList.toggle("wine-marker--selected", regionId === selectedRegionId);
    });

    const selectedRegion = regions.find((region) => region.id === selectedRegionId);

    if (!map || !selectedRegion) {
      return;
    }

    if (skipNextFlyToRef.current) {
      skipNextFlyToRef.current = false;
    } else {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      map.flyTo([selectedRegion.latitude, selectedRegion.longitude], 6, {
        animate: !reducedMotion,
      });
    }
    markerRefs.current.get(selectedRegion.id)?.openPopup();
  }, [regions, selectedRegionId]);

  return (
    <section aria-label="World atlas" className="atlas-map-frame">
      <div
        aria-label="Interactive world map with wine region markers"
        className={`atlas-map atlas-map--${mapStyle}`}
        ref={mapElement}
      />
      <div aria-label="Map style" className="map-style-controls" role="group">
        <button
          aria-label="Use light map style"
          aria-pressed={mapStyle === "light"}
          onClick={() => onMapStyleChange("light")}
          title="Light map style"
          type="button"
        >
          <Sun aria-hidden="true" size={19} />
        </button>
        <button
          aria-label="Use dark map style"
          aria-pressed={mapStyle === "dark"}
          onClick={() => onMapStyleChange("dark")}
          title="Dark map style"
          type="button"
        >
          <Moon aria-hidden="true" size={19} />
        </button>
      </div>
      <button className="mobile-search-trigger" onClick={onOpenBrowser} type="button">
        <Search aria-hidden="true" size={18} /> Search regions
      </button>
      {tilesUnavailable ? (
        <p className="map-notice" role="status">
          The map tiles are unavailable. Region reference data remains available.
        </p>
      ) : null}
    </section>
  );
}