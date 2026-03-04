import { sql } from "./db.js";
import {
  error,
  getHeader,
  internalServerError,
  json,
  methodNotAllowed,
  parseJsonBody,
  RequestLike,
} from "./http.js";
import { verifyAuthToken } from "./jwt.js";

type UserRow = {
  id: string;
  email: string;
  role: string;
  name: string;
  avatar_url: string | null;
};

type ArtistRow = {
  user_id: string;
  avatar: string;
  banner: string;
  school: string;
  major: string | null;
  graduation_year: string | null;
  about: string;
  top_skills: string[];
  board_types: string[];
  is_premium: boolean;
  avail_status: "open" | "busy" | "unavailable" | null;
  avail_next: string | null;
  avail_rate: number | null;
};

type ProfilePayload = {
  name?: string;
  avatarUrl?: string;
  school?: string;
  major?: string;
  graduationYear?: string;
  about?: string;
  topSkills?: string[];
  boardTypes?: string[];
  availability?: {
    status?: "open" | "busy" | "unavailable";
    nextAvailable?: string;
    rate?: number;
  };
};

type ProfileResponse = {
  id: string;
  email: string;
  role: string;
  name: string;
  avatarUrl?: string;
  banner: string;
  school: string;
  major?: string;
  graduationYear?: string;
  about: string;
  topSkills: string[];
  boardTypes: string[];
  availability?: {
    status: "open" | "busy" | "unavailable";
    nextAvailable?: string;
    rate?: number;
  };
  isPremium?: boolean;
  onboardingRequired: boolean;
};

const DEFAULT_BANNER = "/images/banner_main.jpg";

function truncate(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function sanitizeArray(values: string[] | undefined, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => truncate(String(value), maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

async function getAuthenticatedUser(request: RequestLike): Promise<UserRow | null> {
  const header = getHeader(request, "authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(header.slice("Bearer ".length).trim());
    if (!payload.sub) {
      return null;
    }

    const [user] = await sql<UserRow[]>`
      SELECT id, email, role, name, avatar_url
      FROM users
      WHERE id = ${payload.sub}
    `;

    return user ?? null;
  } catch {
    return null;
  }
}

function toProfileResponse(user: UserRow, artist?: ArtistRow | null): ProfileResponse {
  const response: ProfileResponse = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    banner: artist?.banner || DEFAULT_BANNER,
    school: artist?.school || "",
    about: artist?.about || "",
    topSkills: artist?.top_skills || [],
    boardTypes: artist?.board_types || [],
    onboardingRequired: !artist,
  };

  if (user.avatar_url || artist?.avatar) {
    response.avatarUrl = user.avatar_url || artist?.avatar;
  }
  if (artist?.major) {
    response.major = artist.major;
  }
  if (artist?.graduation_year) {
    response.graduationYear = artist.graduation_year;
  }
  if (artist?.is_premium) {
    response.isPremium = true;
  }
  if (artist?.avail_status) {
    response.availability = {
      status: artist.avail_status,
    };
    if (artist.avail_next) {
      response.availability.nextAvailable = artist.avail_next;
    }
    if (typeof artist.avail_rate === "number") {
      response.availability.rate = Number(artist.avail_rate);
    }
  }

  return response;
}

async function loadArtistProfile(userId: string): Promise<ArtistRow | null> {
  const [artist] = await sql<ArtistRow[]>`
    SELECT
      user_id, avatar, banner, school, major, graduation_year, about,
      top_skills, board_types, is_premium, avail_status, avail_next, avail_rate
    FROM artists
    WHERE user_id = ${userId}
  `;

  return artist ?? null;
}

export async function handleProfileRequest(request: RequestLike): Promise<Response> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return error(401, "not authenticated");
  }

  if (request.method === "GET") {
    try {
      const artist = await loadArtistProfile(user.id);
      return json(200, toProfileResponse(user, artist));
    } catch (cause) {
      return internalServerError(cause);
    }
  }

  if (request.method === "PUT") {
    let body: ProfilePayload;
    try {
      body = await parseJsonBody<ProfilePayload>(request);
    } catch {
      return error(400, "invalid request body");
    }

    const name = truncate(body.name || user.name, 255) || user.name;
    const avatarUrl = truncate(body.avatarUrl || user.avatar_url || "", 2_000_000);
    const school = truncate(body.school || "", 255);
    const major = truncate(body.major || "", 255);
    const graduationYear = truncate(body.graduationYear || "", 10);
    const about = truncate(body.about || "", 2000);
    const topSkills = sanitizeArray(body.topSkills, 12, 50);
    const boardTypes = sanitizeArray(body.boardTypes, 12, 50);
    const availabilityStatus = body.availability?.status ?? null;
    const nextAvailable = truncate(body.availability?.nextAvailable || "", 100);
    const rate =
      typeof body.availability?.rate === "number" && Number.isFinite(body.availability.rate)
        ? Math.max(0, body.availability.rate)
        : null;

    if (!school) {
      return error(400, "school is required");
    }

    if (
      availabilityStatus &&
      !["open", "busy", "unavailable"].includes(availabilityStatus)
    ) {
      return error(400, "invalid availability status");
    }

    try {
      await sql`
        UPDATE users
        SET
          name = ${name},
          avatar_url = ${avatarUrl || null},
          updated_at = NOW()
        WHERE id = ${user.id}
      `;

      await sql`
        INSERT INTO artists (
          user_id, name, avatar, banner, school, major, graduation_year, about,
          top_skills, board_types, is_premium, avail_status, avail_next, avail_rate
        )
        VALUES (
          ${user.id},
          ${name},
          ${avatarUrl || ""},
          ${DEFAULT_BANNER},
          ${school},
          ${major || null},
          ${graduationYear || null},
          ${about},
          ${topSkills},
          ${boardTypes},
          FALSE,
          ${availabilityStatus},
          ${nextAvailable || null},
          ${rate}
        )
        ON CONFLICT (user_id) DO UPDATE
        SET
          name = EXCLUDED.name,
          avatar = EXCLUDED.avatar,
          school = EXCLUDED.school,
          major = EXCLUDED.major,
          graduation_year = EXCLUDED.graduation_year,
          about = EXCLUDED.about,
          top_skills = EXCLUDED.top_skills,
          board_types = EXCLUDED.board_types,
          avail_status = EXCLUDED.avail_status,
          avail_next = EXCLUDED.avail_next,
          avail_rate = EXCLUDED.avail_rate,
          updated_at = NOW()
      `;

      const updatedUser: UserRow = {
        ...user,
        name,
        avatar_url: avatarUrl || null,
      };
      const artist = await loadArtistProfile(user.id);

      return json(200, toProfileResponse(updatedUser, artist));
    } catch (cause) {
      return internalServerError(cause);
    }
  }

  return methodNotAllowed(["GET", "PUT"]);
}
