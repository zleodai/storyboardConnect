import { parseCookies } from "../../_lib/cookies.js";
import { getFrontendUrl } from "../../_lib/env.js";
import { error, internalServerError, methodNotAllowed, redirect } from "../../_lib/http.js";
import { signAuthToken } from "../../_lib/jwt.js";
import { clearStateCookie, exchangeCodeForUser } from "../../_lib/oauth.js";
import { upsertUser } from "../../_lib/users.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  const url = new URL(request.url);
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

    return redirect(frontendUrl.toString(), 307, {
      "Set-Cookie": clearStateCookie(secure),
    });
  } catch (cause) {
    return internalServerError(cause);
  }
}
