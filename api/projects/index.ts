import { handleGetProjects } from "../_lib/projects.js";

export default function handler(request: Request): Promise<Response> {
  return handleGetProjects(request);
}
