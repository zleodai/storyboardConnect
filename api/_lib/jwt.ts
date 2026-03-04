import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "./env.js";

const encoder = new TextEncoder();

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

function getKey(): Uint8Array {
  return encoder.encode(getJwtSecret());
}

export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload> {
  const result = await jwtVerify(token, getKey());

  return {
    sub: result.payload.sub ?? "",
    email: typeof result.payload.email === "string" ? result.payload.email : "",
    role: typeof result.payload.role === "string" ? result.payload.role : "",
  };
}
