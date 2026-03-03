import { handleGetFeaturedArtists } from "../_lib/artists";

export default function handler(request: Request): Promise<Response> {
  return handleGetFeaturedArtists(request);
}
