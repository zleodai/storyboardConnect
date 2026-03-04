import { getHeader, RequestLike } from "./http.js";

type CookieOptions = {
  path?: string;
  maxAge?: number;
  httpOnly?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
};

export function parseCookies(request: RequestLike): Record<string, string> {
  const header = getHeader(request, "cookie");
  if (!header) {
    return {};
  }

  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const [name, ...rest] = part.trim().split("=");
    if (!name) {
      return acc;
    }
    acc[name] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const segments = [`${name}=${encodeURIComponent(value)}`];

  if (options.path) {
    segments.push(`Path=${options.path}`);
  }
  if (typeof options.maxAge === "number") {
    segments.push(`Max-Age=${options.maxAge}`);
  }
  if (options.httpOnly) {
    segments.push("HttpOnly");
  }
  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }
  if (options.secure) {
    segments.push("Secure");
  }

  return segments.join("; ");
}
