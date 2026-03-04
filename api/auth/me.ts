import { error, json, methodNotAllowed } from "../_lib/http.js";
import { verifyAuthToken } from "../_lib/jwt.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return error(401, "not authenticated");
  }

  try {
    const payload = await verifyAuthToken(header.slice("Bearer ".length).trim());
    if (!payload.sub || !payload.email || !payload.role) {
      return error(401, "not authenticated");
    }

    return json(200, {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  } catch {
    return error(401, "not authenticated");
  }
}
