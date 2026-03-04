import { handleGetArtistById, handleGetArtists, handleGetFeaturedArtists } from "./_lib/artists.js";
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
    const artistsIndex = segments.indexOf("artists");
    const rest = artistsIndex >= 0 ? segments.slice(artistsIndex + 1) : [];

    if (rest.length === 0) {
      return handleGetArtists(request as Request);
    }

    if (rest.length === 1 && rest[0] === "featured") {
      return handleGetFeaturedArtists(request as Request);
    }

    if (rest.length === 1) {
      return handleGetArtistById(request as Request);
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
