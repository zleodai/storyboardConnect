import { handleGetProjectById } from "../_lib/projects";

export default function handler(request: Request): Promise<Response> {
  return handleGetProjectById(request);
}
