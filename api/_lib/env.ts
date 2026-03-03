export type GoogleOAuthEnv = {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}

export function getJwtSecret(): string {
  return requireEnv("JWT_SECRET");
}

export function getFrontendUrl(): string {
  return requireEnv("FRONTEND_URL");
}

export function getGoogleOAuthEnv(): GoogleOAuthEnv {
  return {
    clientId: requireEnv("GOOGLE_CLIENT_ID"),
    clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    redirectUrl: requireEnv("GOOGLE_REDIRECT_URL"),
  };
}

export function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : undefined;
}
