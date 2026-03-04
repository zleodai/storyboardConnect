import { buildAuthRedirect, generateState } from "../_lib/oauth.js";
import { getRequestUrl, methodNotAllowed, NodeResponseLike, RequestLike, sendNodeResponse } from "../_lib/http.js";

export default async function handler(request: RequestLike, response?: NodeResponseLike): Promise<Response | void> {
  if (request.method !== "GET") {
    const result = methodNotAllowed(["GET"]);
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  }

  const result = buildAuthRedirect(generateState(), getRequestUrl(request).protocol === "https:");
  if (response) {
    return sendNodeResponse(response, result);
  }
  return result;
}
