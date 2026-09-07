export type Hemisphere = "Northern" | "Southern";

export type LatitudeBelt = "30-50 N" | "30-50 S" | "Outside primary belts";

export type Climate = "Cool" | "Moderate" | "Warm" | "Hot" | "Variable";

export type Subregion = {
  name: string;
  overview: string;
  geographicFactors: string[];
  grapes: string[];
  styles: string[];
  hasDedicatedProfile: boolean;
};

export type SourceReference = {
  title: string;
  publisher: string;
  url?: string;
  accessedAt?: string;
  license?: string;
  notes?: string;
};

export type Region = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  hemisphere: Hemisphere;
  latitudeBelt: LatitudeBelt;
  climate: Climate;
  landmarks: string[];
  geographicFactors: string[];
  climateImpact: string;
  overview: string;
  subregions: Subregion[];
  grapes: string[];
  styles: string[];
  sources: SourceReference[];
};