import { sql } from "./db.js";

export type DbUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url: string | null;
};

export type UpsertUserInput = {
  email: string;
  name: string;
  provider: "google";
  providerId: string;
  avatarUrl?: string;
};

export async function upsertUser(input: UpsertUserInput): Promise<DbUser> {
  const safeName = input.name.trim() || input.email;

  try {
    const [user] = await sql<DbUser[]>`
      INSERT INTO users (email, name, provider, provider_id, role, avatar_url)
      VALUES (
        ${input.email},
        ${safeName},
        ${input.provider},
        ${input.providerId},
        'artist',
        ${input.avatarUrl ?? null}
      )
      ON CONFLICT (provider, provider_id) DO UPDATE
      SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW()
      RETURNING id, email, name, role, avatar_url
    `;

    return user;
  } catch (cause) {
    const [user] = await sql<DbUser[]>`
      UPDATE users
      SET
        name = ${safeName},
        provider = ${input.provider},
        provider_id = ${input.providerId},
        avatar_url = ${input.avatarUrl ?? null},
        updated_at = NOW()
      WHERE email = ${input.email}
      RETURNING id, email, name, role, avatar_url
    `;

    if (!user) {
      throw cause;
    }

    return user;
  }
}
