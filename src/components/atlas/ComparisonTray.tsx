"use client";

import { X } from "lucide-react";
import type { Region } from "@/types/region";

type ComparisonTrayProps = {
  onClear: (regionId: string) => void;
  onSelect: (regionId: string) => void;
  regions: Region[];
};

export function ComparisonTray({ onClear, onSelect, regions }: ComparisonTrayProps) {
  if (!regions.length) {
    return null;
  }

  return (
    <aside aria-label="Comparison tray" className="comparison-tray">
      <p className="eyebrow">Compare {regions.length} of 2</p>
      <div className="comparison-items">
        {regions.map((region) => (
          <div className="comparison-item" key={region.id}>
            <button aria-label={`Select ${region.name}`} className="comparison-region" onClick={() => onSelect(region.id)} type="button">
              <strong>{region.name}</strong>
              <span>{region.country} | {region.climate}</span>
            </button>
            <button aria-label={`Remove ${region.name} from comparison`} className="icon-button" onClick={() => onClear(region.id)} type="button">
              <X aria-hidden="true" size={18} />
            </button>
          </div>
        ))}
      </div>
      {regions.length === 2 ? (
        <dl className="comparison-facts">
          <div>
            <dt>Position</dt>
            <dd>{regions.map((region) => `${region.name}: ${region.latitudeBelt}`).join(" | ")}</dd>
          </div>
          <div>
            <dt>Climate</dt>
            <dd>{regions.map((region) => `${region.name}: ${region.climate}`).join(" | ")}</dd>
          </div>
          <div>
            <dt>Landscape</dt>
            <dd>{regions.map((region) => `${region.name}: ${region.landmarks.join(", ")}`).join(" | ")}</dd>
          </div>
          <div>
            <dt>Growing conditions</dt>
            <dd>{regions.map((region) => `${region.name}: ${region.climateImpact}`).join(" | ")}</dd>
          </div>
          <div>
            <dt>Grapes</dt>
            <dd>{regions.map((region) => `${region.name}: ${region.grapes.join(", ")}`).join(" | ")}</dd>
          </div>
          <div>
            <dt>Styles</dt>
            <dd>{regions.map((region) => `${region.name}: ${region.styles.join(", ")}`).join(" | ")}</dd>
          </div>
        </dl>
      ) : null}
    </aside>
  );
}