import { buildAuthRedirect, generateState } from "../_lib/oauth.js";
import { methodNotAllowed } from "../_lib/http.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  return buildAuthRedirect(generateState(), new URL(request.url).protocol === "https:");
}
