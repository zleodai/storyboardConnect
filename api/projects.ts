import {
  handleApplyToProject,
  handleGetFeaturedProjects,
  handleGetProjectFilterCounts,
  handleGetProjectById,
  handleGetProjects,
  handleGetProjectSchoolCounts,
} from "./_lib/projects.js";
import {
  error,
  getPathSegments,
  internalServerError,
  NodeResponseLike,
  RequestLike,
  sendNodeResponse,
} from "./_lib/http.js";

async function route(request: RequestLike): Promise<Response> {
  try {
    const segments = getPathSegments(request);
    const projectsIndex = segments.indexOf("projects");
    const rest = projectsIndex >= 0 ? segments.slice(projectsIndex + 1) : [];

    if (rest.length === 0) {
      return handleGetProjects(request as Request);
    }

    if (rest.length === 1 && rest[0] === "featured") {
      return handleGetFeaturedProjects(request as Request);
    }

    if (rest.length === 1 && rest[0] === "schools") {
      return handleGetProjectSchoolCounts(request as Request);
    }

    if (rest.length === 1 && rest[0] === "filter-counts") {
      return handleGetProjectFilterCounts(request as Request);
    }

    if (rest.length === 1) {
      return handleGetProjectById(request as Request);
    }

    if (rest.length === 2 && rest[1] === "apply") {
      return handleApplyToProject(request as Request);
    }

    return error(404, "not found");
  } catch (cause) {
    return internalServerError(cause);
  }
}

export default function handler(
  request: RequestLike,
  response?: NodeResponseLike,
): Promise<Response | void> {
  const result = route(request);
  if (response) {
    return sendNodeResponse(response, result);
  }
  return result;
}
