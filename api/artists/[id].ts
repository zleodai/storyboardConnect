import { handleGetArtistById } from "../_lib/artists";

export default function handler(request: Request): Promise<Response> {
  return handleGetArtistById(request);
}
