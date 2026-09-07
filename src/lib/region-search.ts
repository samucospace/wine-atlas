import type { Climate, Hemisphere, LatitudeBelt, Region } from "@/types/region";

export type RegionSort = "name" | "country";

export type RegionFilters = {
  query?: string;
  country?: string;
  climate?: Climate;
  hemisphere?: Hemisphere;
  latitudeBelt?: LatitudeBelt;
  sort?: RegionSort;
};

function matchesQuery(region: Region, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [region.name, region.country, ...region.grapes, ...region.styles].some((value) =>
    value.toLocaleLowerCase().includes(normalizedQuery),
  );
}

export function findRegions(regions: Region[], filters: RegionFilters = {}) {
  const filteredRegions = regions.filter((region) => {
    return (
      matchesQuery(region, filters.query ?? "") &&
      (!filters.country || region.country === filters.country) &&
      (!filters.climate || region.climate === filters.climate) &&
      (!filters.hemisphere || region.hemisphere === filters.hemisphere) &&
      (!filters.latitudeBelt || region.latitudeBelt === filters.latitudeBelt)
    );
  });

  const sort = filters.sort ?? "name";

  return [...filteredRegions].sort((first, second) => {
    const firstValue = sort === "country" ? `${first.country} ${first.name}` : first.name;
    const secondValue = sort === "country" ? `${second.country} ${second.name}` : second.name;

    return firstValue.localeCompare(secondValue);
  });
}