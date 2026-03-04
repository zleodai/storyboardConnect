import { buildAuthRedirect, generateState } from "../_lib/oauth.js";
import { getRequestUrl, methodNotAllowed } from "../_lib/http.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  return buildAuthRedirect(generateState(), getRequestUrl(request).protocol === "https:");
}
