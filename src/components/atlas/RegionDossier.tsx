"use client";

import { useEffect, useRef, useState } from "react";
import { GitCompareArrows, MapPin, X } from "lucide-react";
import type { Region, Subregion } from "@/types/region";

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
  const [selectedSubregion, setSelectedSubregion] = useState<{ parentRegionId: string; subregion: Subregion }>();
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

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSubregion(undefined);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (!region) {
    return (
      <section className="region-dossier dossier-empty" tabIndex={-1}>
        <MapPin aria-hidden="true" size={28} />
        <h2>Select a region</h2>
        <p>Choose a marker or a browser result to open its geographic profile.</p>
      </section>
    );
  }

  const activeSubregion = selectedSubregion?.parentRegionId === region.id ? selectedSubregion.subregion : undefined;

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
          {region.subregions.length ? (
            <div className="subregion-list">
              {region.subregions.map((subregion) => (
                <button key={subregion.name} onClick={() => setSelectedSubregion({ parentRegionId: region.id, subregion })} type="button">
                  <strong>{subregion.name}</strong>
                  <span>{subregion.hasDedicatedProfile ? subregion.geographicFactors.slice(0, 2).join(" | ") : "Parent profile"}</span>
                </button>
              ))}
            </div>
          ) : (
            <p>Named sub-regions have not yet been added.</p>
          )}
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
      {activeSubregion ? (
        <div aria-labelledby="subregion-detail-title" aria-modal="true" className="subregion-dialog-backdrop" role="dialog">
          <section className="subregion-dialog">
            <div className="subregion-dialog-header">
              <div>
                <p className="eyebrow">{region.name} | Subregion profile</p>
                <h2 id="subregion-detail-title">{activeSubregion.name}</h2>
              </div>
              <button aria-label="Close subregion profile" className="icon-button" onClick={() => setSelectedSubregion(undefined)} type="button">
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <p className="subregion-overview">{activeSubregion.overview}</p>
            <dl className="subregion-facts">
              <div>
                <dt>Geographic factors</dt>
                <dd>{activeSubregion.geographicFactors.join(" | ")}</dd>
              </div>
              <div>
                <dt>Key grapes</dt>
                <dd>{activeSubregion.grapes.join(" | ")}</dd>
              </div>
              <div>
                <dt>Common styles</dt>
                <dd>{activeSubregion.styles.join(" | ")}</dd>
              </div>
            </dl>
            {!activeSubregion.hasDedicatedProfile ? <p className="subregion-research-note">Local conditions are shown from the parent profile while this place is being researched.</p> : null}
          </section>
        </div>
      ) : null}
    </section>
  );
}