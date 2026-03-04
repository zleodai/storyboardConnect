export type RequestLike = {
  method?: string;
  url?: string;
  headers?: Headers | Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  json?: () => Promise<unknown>;
};

export type NodeResponseLike = {
  statusCode?: number;
  setHeader: (name: string, value: string | string[]) => void;
  end: (body?: string) => void;
};

export function json(status: number, data: unknown, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function getHeader(request: RequestLike, name: string): string | null {
  const headers = request.headers;
  if (!headers) {
    return null;
  }

  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name);
  }

  const raw = (headers as Record<string, string | string[] | undefined>)[name] ??
    (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()];

  if (Array.isArray(raw)) {
    return raw[0] ?? null;
  }

  return raw ?? null;
}

export function getRequestUrl(request: RequestLike): URL {
  const requestUrl = request.url ?? "/";

  try {
    return new URL(requestUrl);
  } catch {
    const protocol =
      getHeader(request, "x-forwarded-proto") ??
      getHeader(request, "x-forwarded-protocol") ??
      "https";
    const host =
      getHeader(request, "x-forwarded-host") ??
      getHeader(request, "host") ??
      "localhost";

    return new URL(requestUrl, `${protocol}://${host}`);
  }
}

export function error(status: number, message: string, headers?: HeadersInit): Response {
  return json(status, { error: message }, headers);
}

export function methodNotAllowed(allowed: string[]): Response {
  return error(405, "method not allowed", { Allow: allowed.join(", ") });
}

export function parseQuery(request: RequestLike): URLSearchParams {
  if (request.query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(request.query)) {
      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry));
      } else if (typeof value === "string") {
        params.append(key, value);
      }
    }
    return params;
  }

  return getRequestUrl(request).searchParams;
}

export async function parseJsonBody<T>(request: RequestLike): Promise<T> {
  if (typeof request.json === "function") {
    return (await request.json()) as T;
  }

  if (typeof request.body === "string") {
    return JSON.parse(request.body) as T;
  }

  return request.body as T;
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

export function getPathSegments(request: RequestLike): string[] {
  return getRequestUrl(request).pathname.split("/").filter(Boolean);
}

export function internalServerError(cause: unknown): Response {
  console.error(cause);
  return error(500, "internal server error");
}

export async function sendNodeResponse(
  response: NodeResponseLike,
  result: Response | Promise<Response>,
): Promise<void> {
  const resolved = await result;

  response.statusCode = resolved.status;

  resolved.headers.forEach((value, key) => {
    response.setHeader(key, value);
  });

  const body = await resolved.text();
  response.end(body || undefined);
}
