import { handleApplyToProject } from "../../_lib/projects";

export default function handler(request: Request): Promise<Response> {
  return handleApplyToProject(request);
}
