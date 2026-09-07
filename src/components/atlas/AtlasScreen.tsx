"use client";

import { useState } from "react";
import { regions } from "@/data/regions";
import { AtlasMap, type MapStyle } from "./AtlasMap";
import { ComparisonTray } from "./ComparisonTray";
import { RegionBrowser } from "./RegionBrowser";
import { RegionDossier } from "./RegionDossier";

export function AtlasScreen() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>();
  const [mapStyle, setMapStyle] = useState<MapStyle>("light");
  const [comparisonRegionIds, setComparisonRegionIds] = useState<string[]>([]);
  const selectedRegion = regions.find((region) => region.id === selectedRegionId);

  function selectRegion(regionId: string) {
    setSelectedRegionId(regionId);
  }

  function addToComparison(regionId: string) {
    setComparisonRegionIds((currentRegionIds) => {
      if (currentRegionIds.includes(regionId)) {
        return currentRegionIds;
      }

      return [...currentRegionIds.slice(-1), regionId];
    });
  }

  return (
    <main className="atlas-shell">
      <header className="atlas-header">
        <div className="brand-lockup">
          <span aria-hidden="true" className="terroir-mark">
            <span />
            <span />
            <span />
          </span>
          <div>
            <p className="eyebrow">Independent wine geography</p>
            <h1>Wine Atlas</h1>
          </div>
        </div>
        <p className="atlas-edition">Terroir / Atlas No. 01</p>
      </header>
      <div className="atlas-workspace">
        <AtlasMap
          mapStyle={mapStyle}
          onMapStyleChange={setMapStyle}
          onSelect={selectRegion}
          regions={regions}
          selectedRegionId={selectedRegionId}
        />
        <RegionBrowser onSelect={selectRegion} regions={regions} />
      </div>
      <RegionDossier
        onAddToComparison={addToComparison}
        onSelectRelatedRegion={selectRegion}
        region={selectedRegion}
        regions={regions}
      />
      <ComparisonTray
        onClear={(regionId) =>
          setComparisonRegionIds((currentRegionIds) => currentRegionIds.filter((id) => id !== regionId))
        }
        onSelect={selectRegion}
        regions={regions.filter((region) => comparisonRegionIds.includes(region.id))}
      />
    </main>
  );
}