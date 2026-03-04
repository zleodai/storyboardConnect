import { handleGetFeaturedProjects } from "../_lib/projects.js";
import { NodeResponseLike, RequestLike, sendNodeResponse } from "../_lib/http.js";

export default function handler(request: RequestLike, response?: NodeResponseLike): Promise<Response | void> {
  const result = handleGetFeaturedProjects(request as Request);
  if (response) {
    return sendNodeResponse(response, result);
  }
  return result;
}
