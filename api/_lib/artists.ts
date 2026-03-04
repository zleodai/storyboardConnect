import { sql } from "./db.js";
import {
  error,
  getHeader,
  getPathSegments,
  internalServerError,
  json,
  methodNotAllowed,
  parseQuery,
  RequestLike,
} from "./http.js";
import { isUuid, parseArtistFilter } from "./filters.js";
import { verifyAuthToken } from "./jwt.js";

type ArtistRow = {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  banner: string;
  school: string;
  major: string | null;
  graduation_year: string | null;
  about: string;
  top_skills: string[];
  board_types: string[];
  is_premium: boolean;
  avail_status: string | null;
  avail_next: string | null;
  avail_rate: number | null;
  view_count: number;
  created_at: string | Date;
};

type PortfolioRow = {
  id: string;
  artist_id: string;
  title: string;
  image: string;
  tags: string[];
  category: string;
};

type ArtistResponse = {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  school: string;
  major?: string;
  graduationYear?: string;
  about: string;
  topSkills: string[];
  boardTypes: string[];
  portfolio: Array<{
    id: string;
    title: string;
    image: string;
    tags: string[];
    category: string;
  }>;
  availability?: {
    status: "open" | "busy" | "unavailable";
    nextAvailable?: string;
    rate?: number;
  };
  isPremium?: boolean;
  uploadDate: string;
  viewCount: number;
};

type SchoolCountRow = {
  school: string;
  user_count: number;
};

type SchoolCountResponse = {
  value: string;
  label: string;
  count: number;
};

type SkillCountRow = {
  value: string;
  user_count: number;
};

function isMissingRelationError(cause: unknown): cause is { code: string } {
  return Boolean(
    cause &&
      typeof cause === "object" &&
      "code" in cause &&
      (cause as { code?: string }).code === "42P01",
  );
}

function mapArtist(row: ArtistRow, portfolio: PortfolioRow[]): ArtistResponse {
  const response: ArtistResponse = {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    banner: row.banner,
    school: row.school,
    about: row.about,
    topSkills: row.top_skills ?? [],
    boardTypes: row.board_types ?? [],
    portfolio: portfolio.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      tags: item.tags ?? [],
      category: item.category,
    })),
    uploadDate: new Date(row.created_at).toISOString(),
    viewCount: row.view_count,
  };

  if (row.major) {
    response.major = row.major;
  }
  if (row.graduation_year) {
    response.graduationYear = row.graduation_year;
  }
  if (row.is_premium) {
    response.isPremium = true;
  }
  if (row.avail_status) {
    response.availability = {
      status: row.avail_status as "open" | "busy" | "unavailable",
    };
    if (row.avail_next) {
      response.availability.nextAvailable = row.avail_next;
    }
    if (typeof row.avail_rate === "number") {
      response.availability.rate = Number(row.avail_rate);
    }
  }

  return response;
}

async function getViewerUserId(request: RequestLike): Promise<string | null> {
  const header = getHeader(request, "authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(header.slice("Bearer ".length).trim());
    return payload.sub || null;
  } catch {
    return null;
  }
}

async function loadPortfolios(artistIds: string[]): Promise<Map<string, PortfolioRow[]>> {
  if (artistIds.length === 0) {
    return new Map();
  }

  const rows = await sql<PortfolioRow[]>`
    SELECT id, artist_id, title, image, tags, category
    FROM portfolio_projects
    WHERE artist_id = ANY(${artistIds})
    ORDER BY sort_order
  `;

  return rows.reduce((acc, row) => {
    const existing = acc.get(row.artist_id) ?? [];
    existing.push(row);
    acc.set(row.artist_id, existing);
    return acc;
  }, new Map<string, PortfolioRow[]>());
}

export async function handleGetArtists(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const filter = parseArtistFilter(parseQuery(request));
  const viewerUserId = await getViewerUserId(request);

  try {
    const rows = await sql<ArtistRow[]>`
      SELECT
        id, user_id, name, avatar, banner, school, major, graduation_year, about,
        top_skills, board_types, is_premium, avail_status, avail_next, avail_rate,
        view_count, created_at
      FROM artists
      ORDER BY created_at DESC
    `;

    const filteredRows = rows.filter((row) => {
      if (viewerUserId && row.user_id === viewerUserId) {
        return false;
      }
      if (filter.searchQuery && !row.name.toLowerCase().includes(filter.searchQuery.toLowerCase())) {
        return false;
      }
      if (filter.selectedSchools.length > 0 && !filter.selectedSchools.includes(row.school)) {
        return false;
      }
      if (
        filter.selectedSkills.length > 0 &&
        !row.top_skills.some((value) => filter.selectedSkills.includes(value))
      ) {
        return false;
      }
      if (
        filter.selectedBoardTypes.length > 0 &&
        !row.board_types.some((value) => filter.selectedBoardTypes.includes(value))
      ) {
        return false;
      }
      return true;
    });

    const portfolios = await loadPortfolios(filteredRows.map((row) => row.id));
    return json(200, filteredRows.map((row) => mapArtist(row, portfolios.get(row.id) ?? [])));
  } catch (cause) {
    return internalServerError(cause);
  }
}

export async function handleGetFeaturedArtists(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const viewerUserId = await getViewerUserId(request);

  try {
    const rows = await sql<ArtistRow[]>`
      SELECT
        id, user_id, name, avatar, banner, school, major, graduation_year, about,
        top_skills, board_types, is_premium, avail_status, avail_next, avail_rate,
        view_count, created_at
      FROM artists
      WHERE is_featured = TRUE
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const filteredRows = rows.filter((row) => !viewerUserId || row.user_id !== viewerUserId);
    const portfolios = await loadPortfolios(filteredRows.map((row) => row.id));
    return json(200, filteredRows.map((row) => mapArtist(row, portfolios.get(row.id) ?? [])));
  } catch (cause) {
    return internalServerError(cause);
  }
}

export async function handleGetSchoolCounts(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  try {
    const rows = await sql<SchoolCountRow[]>`
      SELECT school, user_count
      FROM school_user_counts
      ORDER BY school ASC
    `;

    const payload: SchoolCountResponse[] = rows.map((row) => ({
      value: row.school,
      label: row.school,
      count: row.user_count,
    }));

    return json(200, payload);
  } catch (cause) {
    if (isMissingRelationError(cause)) {
      try {
        const rows = await sql<SchoolCountRow[]>`
          SELECT school, COUNT(*)::INTEGER AS user_count
          FROM artists
          WHERE school <> ''
          GROUP BY school
          ORDER BY school ASC
        `;

        const payload: SchoolCountResponse[] = rows.map((row) => ({
          value: row.school,
          label: row.school,
          count: row.user_count,
        }));

        return json(200, payload);
      } catch (fallbackCause) {
        return internalServerError(fallbackCause);
      }
    }

    return internalServerError(cause);
  }
}

export async function handleGetSkillCounts(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  try {
    const rows = await sql<SkillCountRow[]>`
      SELECT skill.value AS value, COUNT(*)::INTEGER AS user_count
      FROM artists
      CROSS JOIN LATERAL unnest(top_skills) AS skill(value)
      WHERE skill.value <> ''
      GROUP BY skill.value
      ORDER BY skill.value ASC
    `;

    const payload: SchoolCountResponse[] = rows.map((row) => ({
      value: row.value,
      label: row.value,
      count: row.user_count,
    }));

    return json(200, payload);
  } catch (cause) {
    return internalServerError(cause);
  }
}

export async function handleGetArtistById(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const segments = getPathSegments(request);
  const id = segments[segments.length - 1] ?? "";
  if (!isUuid(id)) {
    return error(400, "bad request");
  }

  try {
    const [row] = await sql<ArtistRow[]>`
      SELECT
        id, user_id, name, avatar, banner, school, major, graduation_year, about,
        top_skills, board_types, is_premium, avail_status, avail_next, avail_rate,
        view_count, created_at
      FROM artists
      WHERE id = ${id}
    `;

    if (!row) {
      return error(404, "not found");
    }

    const portfolios = await loadPortfolios([id]);
    return json(200, mapArtist(row, portfolios.get(id) ?? []));
  } catch (cause) {
    return internalServerError(cause);
  }
}
