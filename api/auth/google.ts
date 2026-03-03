import { buildAuthRedirect, generateState } from "../_lib/oauth";
import { methodNotAllowed } from "../_lib/http";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  return buildAuthRedirect(generateState(), new URL(request.url).protocol === "https:");
}
