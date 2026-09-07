"use client";

import { useEffect, useRef } from "react";
import { GitCompareArrows, MapPin } from "lucide-react";
import type { Region } from "@/types/region";

type RegionDossierProps = {
  comparisonCount: number;
  isInComparison: boolean;
  onAddToComparison: (regionId: string) => void;
  onSelectRelatedRegion: (regionId: string) => void;
  region?: Region;
  regions: Region[];
};

export function RegionDossier({ comparisonCount, isInComparison, onAddToComparison, onSelectRelatedRegion, region, regions }: RegionDossierProps) {
  const dossierElement = useRef<HTMLElement>(null);
  const relatedRegions = region
    ? regions.filter(
        (candidate) =>
          candidate.id !== region.id &&
          (candidate.country === region.country || candidate.grapes.some((grape) => region.grapes.includes(grape))),
      )
    : [];

  useEffect(() => {
    if (region) {
      dossierElement.current?.focus();
    }
  }, [region]);

  if (!region) {
    return (
      <section className="region-dossier dossier-empty" tabIndex={-1}>
        <MapPin aria-hidden="true" size={28} />
        <h2>Select a region</h2>
        <p>Choose a marker or a browser result to open its geographic profile.</p>
      </section>
    );
  }

  return (
    <section className="region-dossier" ref={dossierElement} tabIndex={-1}>
      <div className="dossier-title-row">
        <div>
          <p className="eyebrow">{region.country} | {region.latitudeBelt}</p>
          <h2>{region.name}</h2>
        </div>
        <button
          className="icon-text-button"
          disabled={isInComparison}
          onClick={() => onAddToComparison(region.id)}
          title={isInComparison ? "This region is already in the comparison" : "Add this region to the comparison"}
          type="button"
        >
          <GitCompareArrows aria-hidden="true" size={18} />
          {isInComparison ? "Added to comparison" : comparisonCount ? "Add as second region" : "Compare this region"}
        </button>
      </div>
      <p className="dossier-overview">{region.overview}</p>
      <dl className="fact-grid">
        <div>
          <dt>Coordinates</dt>
          <dd>{Math.abs(region.latitude).toFixed(2)}{region.latitude >= 0 ? " N" : " S"}, {Math.abs(region.longitude).toFixed(2)}{region.longitude >= 0 ? " E" : " W"}</dd>
        </div>
        <div>
          <dt>Climate</dt>
          <dd>{region.climate}</dd>
        </div>
      </dl>
      <div className="dossier-grid">
        <section>
          <h3>Landscape</h3>
          <p>{region.landmarks.join(" | ") || "Landscape notes are not yet available."}</p>
        </section>
        <section>
          <h3>Growing conditions</h3>
          <p>{region.climateImpact}</p>
        </section>
        <section>
          <h3>Geographic factors</h3>
          <p>{region.geographicFactors.join(" | ") || "Geographic factors are not yet available."}</p>
        </section>
        <section>
          <h3>Key sub-regions and villages</h3>
          <p>{region.subregions.join(" | ") || "Named sub-regions have not yet been added."}</p>
        </section>
        <section>
          <h3>Grapes</h3>
          <p>{region.grapes.join(" | ") || "Associated grapes are not yet available."}</p>
        </section>
        <section>
          <h3>Styles</h3>
          <p>{region.styles.join(" | ") || "Associated styles are not yet available."}</p>
        </section>
      </div>
      {relatedRegions.length ? (
        <section className="related-regions">
          <h3>Related regions</h3>
          <div>
            {relatedRegions.map((relatedRegion) => (
              <button key={relatedRegion.id} onClick={() => onSelectRelatedRegion(relatedRegion.id)} type="button">
                {relatedRegion.name}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}