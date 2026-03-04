import { sql } from "./db.js";
import {
  error,
  getHeader,
  getPathSegments,
  internalServerError,
  json,
  methodNotAllowed,
  parseJsonBody,
  parseQuery,
} from "./http.js";
import { isUuid, parseProjectFilter, truncate } from "./filters.js";
import { verifyAuthToken } from "./jwt.js";

type ProjectRow = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  logline: string;
  school: string;
  format: "MV" | "Commercial" | "Short Film" | "Feature";
  length: string | null;
  timeline: string;
  production_type: "Commercial" | "Student" | "Indie" | "Others";
  shotlist_ready: boolean;
  location_secured: boolean;
  is_paid: boolean;
  visual_deck_url: string | null;
  contact_twitter: string | null;
  contact_instagram: string | null;
  contact_email: string | null;
  view_count: number;
  created_at: string | Date;
};

type ProjectResponse = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  logline: string;
  school: string;
  format: "MV" | "Commercial" | "Short Film" | "Feature";
  length?: string;
  timeline: string;
  productionType: "Commercial" | "Student" | "Indie" | "Others";
  shotlistReady: boolean;
  locationSecured: boolean;
  isPaid: boolean;
  visualDeckUrl?: string;
  contactInfo: {
    twitter?: string;
    instagram?: string;
    email?: string;
  };
  uploadDate: string;
  viewCount: number;
};

type ApplyRequest = {
  message?: string;
  portfolioLink?: string;
};

function mapProject(row: ProjectRow): ProjectResponse {
  const response: ProjectResponse = {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image,
    logline: row.logline,
    school: row.school,
    format: row.format,
    timeline: row.timeline,
    productionType: row.production_type,
    shotlistReady: row.shotlist_ready,
    locationSecured: row.location_secured,
    isPaid: row.is_paid,
    contactInfo: {},
    uploadDate: new Date(row.created_at).toISOString(),
    viewCount: row.view_count,
  };

  if (row.length) {
    response.length = row.length;
  }
  if (row.visual_deck_url) {
    response.visualDeckUrl = row.visual_deck_url;
  }
  if (row.contact_twitter) {
    response.contactInfo.twitter = row.contact_twitter;
  }
  if (row.contact_instagram) {
    response.contactInfo.instagram = row.contact_instagram;
  }
  if (row.contact_email) {
    response.contactInfo.email = row.contact_email;
  }

  return response;
}

function getProjectId(request: Request): string {
  const segments = getPathSegments(request);
  const projectsIndex = segments.indexOf("projects");
  return projectsIndex >= 0 ? segments[projectsIndex + 1] ?? "" : "";
}

async function findProjectById(id: string): Promise<ProjectRow | null> {
  const [project] = await sql<ProjectRow[]>`
    SELECT
      id, title, subtitle, image, logline, school, format, length, timeline,
      production_type, shotlist_ready, location_secured, is_paid, visual_deck_url,
      contact_twitter, contact_instagram, contact_email, view_count, created_at
    FROM projects
    WHERE id = ${id}
  `;

  return project ?? null;
}

function getBearerToken(request: Request): string | null {
  const header = getHeader(request, "authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length).trim();
}

export async function handleGetProjects(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const filter = parseProjectFilter(parseQuery(request));

  try {
    const rows = await sql<ProjectRow[]>`
      SELECT
        id, title, subtitle, image, logline, school, format, length, timeline,
        production_type, shotlist_ready, location_secured, is_paid, visual_deck_url,
        contact_twitter, contact_instagram, contact_email, view_count, created_at
      FROM projects
      ORDER BY created_at DESC
    `;

    const filteredRows = rows
      .filter((row) => {
        const query = filter.searchQuery.toLowerCase();
        if (
          query &&
          !row.title.toLowerCase().includes(query) &&
          !row.logline.toLowerCase().includes(query)
        ) {
          return false;
        }
        if (filter.selectedSchools.length > 0 && !filter.selectedSchools.includes(row.school)) {
          return false;
        }
        if (filter.selectedFormats.length > 0 && !filter.selectedFormats.includes(row.format)) {
          return false;
        }
        if (
          filter.selectedProductionTypes.length > 0 &&
          !filter.selectedProductionTypes.includes(row.production_type)
        ) {
          return false;
        }
        if (filter.selectedTimelines.length > 0 && !filter.selectedTimelines.includes(row.timeline)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === "views") {
          return b.view_count - a.view_count;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    return json(200, filteredRows.map(mapProject));
  } catch (cause) {
    return internalServerError(cause);
  }
}

export async function handleGetFeaturedProjects(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  try {
    const rows = await sql<ProjectRow[]>`
      SELECT
        id, title, subtitle, image, logline, school, format, length, timeline,
        production_type, shotlist_ready, location_secured, is_paid, visual_deck_url,
        contact_twitter, contact_instagram, contact_email, view_count, created_at
      FROM projects
      WHERE is_featured = TRUE
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return json(200, rows.map(mapProject));
  } catch (cause) {
    return internalServerError(cause);
  }
}

export async function handleGetProjectById(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const id = getProjectId(request);
  if (!isUuid(id)) {
    return error(400, "bad request");
  }

  try {
    const project = await findProjectById(id);
    if (!project) {
      return error(404, "not found");
    }

    return json(200, mapProject(project));
  } catch (cause) {
    return internalServerError(cause);
  }
}

export async function handleApplyToProject(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  const token = getBearerToken(request);
  if (!token) {
    return error(401, "authentication required");
  }

  let userId = "";
  try {
    const payload = await verifyAuthToken(token);
    userId = payload.sub;
  } catch {
    return error(401, "authentication required");
  }

  const projectId = getProjectId(request);
  if (!isUuid(projectId) || !isUuid(userId)) {
    return error(400, "bad request");
  }

  let body: ApplyRequest;
  try {
    body = await parseJsonBody<ApplyRequest>(request);
  } catch {
    return error(400, "invalid request body");
  }

  try {
    const project = await findProjectById(projectId);
    if (!project) {
      return error(404, "not found");
    }

    const [existing] = await sql<{ id: string }[]>`
      SELECT id
      FROM applications
      WHERE project_id = ${projectId} AND user_id = ${userId}
    `;

    if (existing) {
      return error(409, "conflict");
    }

    const message = truncate(body.message ?? "", 2000);
    const portfolioLink = body.portfolioLink ? truncate(body.portfolioLink, 500) : null;

    await sql`
      INSERT INTO applications (project_id, user_id, message, portfolio_link)
      VALUES (${projectId}, ${userId}, ${message}, ${portfolioLink})
    `;

    return json(201, { message: "application submitted" });
  } catch (cause) {
    return internalServerError(cause);
  }
}
