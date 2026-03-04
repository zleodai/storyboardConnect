import { handleGetArtistById } from "../_lib/artists.js";

export default function handler(request: Request): Promise<Response> {
  return handleGetArtistById(request);
}
