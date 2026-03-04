import { handleGetProjectById } from "../_lib/projects.js";

export default function handler(request: Request): Promise<Response> {
  return handleGetProjectById(request);
}
