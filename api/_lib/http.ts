export function json(status: number, data: unknown, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function error(status: number, message: string, headers?: HeadersInit): Response {
  return json(status, { error: message }, headers);
}

export function methodNotAllowed(allowed: string[]): Response {
  return error(405, "method not allowed", { Allow: allowed.join(", ") });
}

export function parseQuery(request: Request): URLSearchParams {
  return new URL(request.url).searchParams;
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

export function redirect(url: string, status = 307, headers?: HeadersInit): Response {
  return new Response(null, {
    status,
    headers: {
      Location: url,
      ...headers,
    },
  });
}

export function getPathSegments(request: Request): string[] {
  return new URL(request.url).pathname.split("/").filter(Boolean);
}

export function internalServerError(cause: unknown): Response {
  console.error(cause);
  return error(500, "internal server error");
}
