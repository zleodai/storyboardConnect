import { handleGetCurrentUser, handleGoogleCallback } from "./_lib/auth.js";
import { handleProfileRequest } from "./_lib/profile.js";
import { buildAuthRedirect, generateState } from "./_lib/oauth.js";
import {
  error,
  getPathSegments,
  getRequestUrl,
  internalServerError,
  NodeResponseLike,
  RequestLike,
  sendNodeResponse,
} from "./_lib/http.js";

async function route(request: RequestLike): Promise<Response> {
  try {
    const segments = getPathSegments(request);

    if (segments.length >= 2 && segments[1] === "auth") {
      const rest = segments.slice(2);

      if (rest.length === 1 && rest[0] === "google") {
        if (request.method !== "GET") {
          return error(405, "method not allowed", { Allow: "GET" });
        }
        return buildAuthRedirect(generateState(), getRequestUrl(request).protocol === "https:");
      }

      if (rest.length === 2 && rest[0] === "google" && rest[1] === "callback") {
        return handleGoogleCallback(request);
      }

      if (rest.length === 1 && rest[0] === "me") {
        return handleGetCurrentUser(request);
      }

      return error(404, "not found");
    }

    if (segments.length >= 2 && segments[1] === "me") {
      const rest = segments.slice(2);

      if (rest.length === 1 && rest[0] === "profile") {
        return handleProfileRequest(request);
      }

      return error(404, "not found");
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
