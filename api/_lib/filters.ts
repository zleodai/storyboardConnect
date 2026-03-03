function sanitizeString(value: string): string {
  return value.trim().slice(0, 200);
}

function parseArrayValue(raw: string): string[] {
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function parseArrayParam(params: URLSearchParams, key: string): string[] {
  const repeated = params.getAll(key);
  const bracketed = params.getAll(`${key}[]`);
  const values = repeated.length > 0 ? repeated : bracketed;

  if (values.length === 0) {
    return [];
  }

  if (values.length === 1) {
    return parseArrayValue(values[0]);
  }

  return values.map((value) => value.trim()).filter(Boolean);
}

export type ArtistFilter = {
  searchQuery: string;
  selectedSchools: string[];
  selectedBoardTypes: string[];
  sortBy: "date";
};

export type ProjectFilter = {
  searchQuery: string;
  selectedSchools: string[];
  selectedFormats: string[];
  selectedProductionTypes: string[];
  selectedTimelines: string[];
  sortBy: "date" | "views";
};

export function parseArtistFilter(params: URLSearchParams): ArtistFilter {
  return {
    searchQuery: sanitizeString(params.get("searchQuery") ?? ""),
    selectedSchools: parseArrayParam(params, "selectedSchools"),
    selectedBoardTypes: parseArrayParam(params, "selectedBoardTypes"),
    sortBy: "date",
  };
}

export function parseProjectFilter(params: URLSearchParams): ProjectFilter {
  const sortBy = params.get("sortBy");

  return {
    searchQuery: sanitizeString(params.get("searchQuery") ?? ""),
    selectedSchools: parseArrayParam(params, "selectedSchools"),
    selectedFormats: parseArrayParam(params, "selectedFormats"),
    selectedProductionTypes: parseArrayParam(params, "selectedProductionTypes"),
    selectedTimelines: parseArrayParam(params, "selectedTimelines"),
    sortBy: sortBy === "views" ? "views" : "date",
  };
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function truncate(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}
