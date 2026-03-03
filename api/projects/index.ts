import { handleGetProjects } from "../_lib/projects";

export default function handler(request: Request): Promise<Response> {
  return handleGetProjects(request);
}
