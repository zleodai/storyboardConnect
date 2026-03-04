import { sql } from "./db.js";
import {
  error,
  getHeader,
  getRequestUrl,
  internalServerError,
  json,
  methodNotAllowed,
  RequestLike,
} from "./http.js";
import { signAuthToken, verifyAuthToken } from "./jwt.js";
import { clearStateCookie, exchangeCodeForUser } from "./oauth.js";
import { parseCookies } from "./cookies.js";
import { upsertUser } from "./users.js";
import { getFrontendUrl } from "./env.js";

export async function handleGetCurrentUser(request: RequestLike): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const header = getHeader(request, "authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return error(401, "not authenticated");
  }

  try {
    const payload = await verifyAuthToken(header.slice("Bearer ".length).trim());
    if (!payload.sub || !payload.email || !payload.role) {
      return error(401, "not authenticated");
    }

    const [user] = await sql<{ name: string; avatar_url: string | null }[]>`
      SELECT name, avatar_url
      FROM users
      WHERE id = ${payload.sub}
    `;

    return json(200, {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: user?.name,
      avatarUrl: user?.avatar_url || undefined,
    });
  } catch {
    return error(401, "not authenticated");
  }
}

export async function handleGoogleCallback(request: RequestLike): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const url = getRequestUrl(request);
  const cookies = parseCookies(request);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const secure = url.protocol === "https:";

  if (!state || !code || cookies.oauth_state !== state) {
    return error(400, "invalid oauth state", {
      "Set-Cookie": clearStateCookie(secure),
    });
  }

  try {
    const oauthUser = await exchangeCodeForUser(code);
    const user = await upsertUser({
      email: oauthUser.email,
      name: oauthUser.name,
      provider: "google",
      providerId: oauthUser.providerId,
      avatarUrl: oauthUser.avatarUrl,
    });
    const token = await signAuthToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const frontendUrl = new URL(getFrontendUrl());
    frontendUrl.searchParams.set("token", token);

    return new Response(null, {
      status: 307,
      headers: {
        Location: frontendUrl.toString(),
        "Set-Cookie": clearStateCookie(secure),
      },
    });
  } catch (cause) {
    return internalServerError(cause);
  }
}
