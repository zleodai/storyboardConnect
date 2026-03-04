import { error, getHeader, json, methodNotAllowed, NodeResponseLike, RequestLike, sendNodeResponse } from "../_lib/http.js";
import { verifyAuthToken } from "../_lib/jwt.js";
import { sql } from "../_lib/db.js";

export default async function handler(request: RequestLike, response?: NodeResponseLike): Promise<Response | void> {
  if (request.method !== "GET") {
    const result = methodNotAllowed(["GET"]);
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  }

  const header = getHeader(request, "authorization");
  if (!header || !header.startsWith("Bearer ")) {
    const result = error(401, "not authenticated");
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  }

  try {
    const payload = await verifyAuthToken(header.slice("Bearer ".length).trim());
    if (!payload.sub || !payload.email || !payload.role) {
      const result = error(401, "not authenticated");
      if (response) {
        return sendNodeResponse(response, result);
      }
      return result;
    }

    const [user] = await sql<{ name: string; avatar_url: string | null }[]>`
      SELECT name, avatar_url
      FROM users
      WHERE id = ${payload.sub}
    `;

    const result = json(200, {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: user?.name,
      avatarUrl: user?.avatar_url || undefined,
    });
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  } catch {
    const result = error(401, "not authenticated");
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  }
}
