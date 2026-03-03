import { json, methodNotAllowed } from "./_lib/http";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  return json(200, { status: "ok" });
}
