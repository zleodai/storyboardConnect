import { parseCookies } from "../../_lib/cookies.js";
import { getFrontendUrl } from "../../_lib/env.js";
import {
  error,
  getRequestUrl,
  internalServerError,
  methodNotAllowed,
  NodeResponseLike,
  redirect,
  RequestLike,
  sendNodeResponse,
} from "../../_lib/http.js";
import { signAuthToken } from "../../_lib/jwt.js";
import { clearStateCookie, exchangeCodeForUser } from "../../_lib/oauth.js";
import { upsertUser } from "../../_lib/users.js";

export default async function handler(request: RequestLike, response?: NodeResponseLike): Promise<Response | void> {
  if (request.method !== "GET") {
    const result = methodNotAllowed(["GET"]);
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  }

  const url = getRequestUrl(request);
  const cookies = parseCookies(request);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const secure = url.protocol === "https:";

  if (!state || !code || cookies.oauth_state !== state) {
    const result = error(400, "invalid oauth state", {
      "Set-Cookie": clearStateCookie(secure),
    });
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
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

    const result = redirect(frontendUrl.toString(), 307, {
      "Set-Cookie": clearStateCookie(secure),
    });
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  } catch (cause) {
    const result = internalServerError(cause);
    if (response) {
      return sendNodeResponse(response, result);
    }
    return result;
  }
}
