import { json, methodNotAllowed, NodeResponseLike, RequestLike, sendNodeResponse } from "./_lib/http.js";

export default async function handler(request: RequestLike, response?: NodeResponseLike): Promise<Response | void> {
  if (request.method !== "GET") {
    const result = methodNotAllowed(["GET"]);
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  }

  const result = json(200, { status: "ok" });
  if (response) {
    return sendNodeResponse(response, result);
  }
  return result;
}
