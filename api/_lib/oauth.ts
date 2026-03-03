import { getGoogleOAuthEnv } from "./env";
import { serializeCookie } from "./cookies";
import { redirect } from "./http";

export type Provider = "google";

type GoogleTokenResponse = {
  access_token: string;
};

type GoogleUser = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
};

export type OAuthUser = {
  provider: Provider;
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export function generateState(): string {
  return crypto.randomUUID();
}

export function getStateCookie(state: string, secure: boolean): string {
  return serializeCookie("oauth_state", state, {
    path: "/",
    maxAge: 300,
    httpOnly: true,
    sameSite: "Lax",
    secure,
  });
}

export function clearStateCookie(secure: boolean): string {
  return serializeCookie("oauth_state", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "Lax",
    secure,
  });
}

export function buildAuthRedirect(state: string, secure: boolean): Response {
  const cookie = getStateCookie(state, secure);
  const env = getGoogleOAuthEnv();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.clientId);
  url.searchParams.set("redirect_uri", env.redirectUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);

  return redirect(url.toString(), 307, { "Set-Cookie": cookie });
}

export async function exchangeCodeForUser(code: string): Promise<OAuthUser> {
  return exchangeGoogleCode(code);
}

async function exchangeGoogleCode(code: string): Promise<OAuthUser> {
  const env = getGoogleOAuthEnv();

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.clientId,
      client_secret: env.clientSecret,
      redirect_uri: env.redirectUrl,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("google token exchange failed");
  }

  const token = (await tokenResponse.json()) as GoogleTokenResponse;
  const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error("google user fetch failed");
  }

  const user = (await userResponse.json()) as GoogleUser;
  return {
    provider: "google",
    providerId: user.sub,
    email: user.email,
    name: user.name,
    avatarUrl: user.picture,
  };
}
