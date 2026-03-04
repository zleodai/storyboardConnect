import { handleProfileRequest } from "../_lib/profile.js";
import { NodeResponseLike, RequestLike, sendNodeResponse } from "../_lib/http.js";

export default function handler(request: RequestLike, response?: NodeResponseLike): Promise<Response | void> {
  const result = handleProfileRequest(request);
  if (response) {
    return sendNodeResponse(response, result);
  }
  return result;
}
