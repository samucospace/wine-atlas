"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { findRegions, type RegionFilters, type RegionSort } from "@/lib/region-search";
import type { Climate, Hemisphere, LatitudeBelt, Region } from "@/types/region";

type RegionBrowserProps = {
  onSelect: (regionId: string) => void;
  regions: Region[];
};

const climates: Climate[] = ["Cool", "Moderate", "Warm", "Hot", "Variable"];
const hemispheres: Hemisphere[] = ["Northern", "Southern"];
const latitudeBelts: LatitudeBelt[] = ["30-50 N", "30-50 S", "Outside primary belts"];

export function RegionBrowser({ onSelect, regions }: RegionBrowserProps) {
  const [filters, setFilters] = useState<RegionFilters>({ sort: "name" });
  const results = findRegions(regions, filters);
  const countries = [...new Set(regions.map((region) => region.country))].sort();

  function updateFilter<Key extends keyof RegionFilters>(key: Key, value: RegionFilters[Key]) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  function resetFilters() {
    setFilters({ sort: "name" });
  }

  return (
    <aside aria-label="Region browser" className="region-browser">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Region browser</p>
          <h2>Find a region</h2>
        </div>
        <SlidersHorizontal aria-hidden="true" size={20} />
      </div>
      <label className="search-field">
        <Search aria-hidden="true" size={18} />
        <span className="sr-only">Search regions, countries, grapes, or styles</span>
        <input
          onChange={(event) => updateFilter("query", event.target.value)}
          placeholder="Search places, grapes, styles"
          type="search"
          value={filters.query ?? ""}
        />
      </label>
      <div className="filter-grid">
        <label>
          Country
          <select
            onChange={(event) => updateFilter("country", event.target.value || undefined)}
            value={filters.country ?? ""}
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </label>
        <label>
          Climate
          <select
            onChange={(event) => updateFilter("climate", (event.target.value || undefined) as Climate | undefined)}
            value={filters.climate ?? ""}
          >
            <option value="">All climates</option>
            {climates.map((climate) => (
              <option key={climate}>{climate}</option>
            ))}
          </select>
        </label>
        <label>
          Hemisphere
          <select
            onChange={(event) => updateFilter("hemisphere", (event.target.value || undefined) as Hemisphere | undefined)}
            value={filters.hemisphere ?? ""}
          >
            <option value="">Both hemispheres</option>
            {hemispheres.map((hemisphere) => (
              <option key={hemisphere}>{hemisphere}</option>
            ))}
          </select>
        </label>
        <label>
          Latitude belt
          <select
            onChange={(event) => updateFilter("latitudeBelt", (event.target.value || undefined) as LatitudeBelt | undefined)}
            value={filters.latitudeBelt ?? ""}
          >
            <option value="">All belts</option>
            {latitudeBelts.map((latitudeBelt) => (
              <option key={latitudeBelt}>{latitudeBelt}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select
            onChange={(event) => updateFilter("sort", event.target.value as RegionSort)}
            value={filters.sort ?? "name"}
          >
            <option value="name">Region name</option>
            <option value="country">Country</option>
          </select>
        </label>
      </div>
      <p aria-live="polite" className="result-count">
        {results.length} {results.length === 1 ? "region" : "regions"}
      </p>
      {results.length ? (
        <ul className="region-results">
          {results.map((region) => (
            <li key={region.id}>
              <button onClick={() => onSelect(region.id)} type="button">
                <strong>{region.name}</strong>
                <span>{region.country}</span>
                <span>{region.climate} climate | {region.latitudeBelt}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No regions match these filters.</p>
          <button className="text-button" onClick={resetFilters} type="button">
            <X aria-hidden="true" size={16} /> Reset filters
          </button>
        </div>
      )}
    </aside>
  );
}