import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import postgres from "postgres";

const ROOT_DIR = process.cwd();

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf8");
  const entries = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const candidates = [
    path.join(ROOT_DIR, ".env.production"),
    path.join(ROOT_DIR, ".env"),
    path.join(ROOT_DIR, "server", ".env"),
  ];

  for (const candidate of candidates) {
    const values = parseEnvFile(candidate);
    if (values.DATABASE_URL) {
      return values.DATABASE_URL;
    }
  }

  throw new Error(
    "DATABASE_URL is required. Set it in the environment or add it to .env.production, .env, or server/.env.",
  );
}

const users = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "seed.nicholas@example.com",
    name: "Nicholas Wu",
    provider: "seed",
    providerId: "seed-nicholas-wu",
    role: "artist",
    avatarUrl: "/images/nicholas_avatar.jpg",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "seed.maya@example.com",
    name: "Maya Patel",
    provider: "seed",
    providerId: "seed-maya-patel",
    role: "artist",
    avatarUrl: "/images/nicholas_avatar.jpg",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    email: "seed.jordan@example.com",
    name: "Jordan Lee",
    provider: "seed",
    providerId: "seed-jordan-lee",
    role: "artist",
    avatarUrl: "/images/nicholas_avatar.jpg",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    email: "seed.anika@example.com",
    name: "Anika Torres",
    provider: "seed",
    providerId: "seed-anika-torres",
    role: "artist",
    avatarUrl: "/images/nicholas_avatar.jpg",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    email: "seed.derek@example.com",
    name: "Derek Okafor",
    provider: "seed",
    providerId: "seed-derek-okafor",
    role: "artist",
    avatarUrl: "/images/nicholas_avatar.jpg",
  },
];

const artists = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    userId: users[0].id,
    name: "Nicholas Wu",
    avatar: "/images/nicholas_avatar.jpg",
    banner: "/images/banner_main.jpg",
    school: "LMU",
    major: "Film & TV Production",
    graduationYear: "2024",
    about:
      "Nicholas Wu is a storyboard artist and animator in Los Angeles, California. Nicholas studied Film & TV Production and Screenwriting at Loyola Marymount University and has worked on both live-action and animation projects.",
    topSkills: ["Storyboard Pro", "Blender", "Photoshop"],
    boardTypes: ["Action Board", "Cinematic"],
    isPremium: false,
    availabilityStatus: "open",
    nextAvailable: "Oct 2025",
    rate: 450,
    isFeatured: true,
    viewCount: 1240,
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "a2222222-2222-4222-8222-222222222222",
    userId: users[1].id,
    name: "Maya Patel",
    avatar: "/images/nicholas_avatar.jpg",
    banner: "/images/banner_main.jpg",
    school: "CalArts",
    major: "Character Animation",
    graduationYear: "2023",
    about:
      "Maya Patel is a storyboard artist and character designer based in Burbank, CA. She graduated from CalArts with a focus on character animation and has contributed boards to several animated series and indie shorts.",
    topSkills: ["Storyboard Pro", "Procreate", "After Effects"],
    boardTypes: ["Comedy Board", "Character-Driven"],
    isPremium: true,
    availabilityStatus: "busy",
    nextAvailable: "Mar 2026",
    rate: 500,
    isFeatured: true,
    viewCount: 3450,
    createdAt: "2025-08-22T14:30:00Z",
  },
  {
    id: "a3333333-3333-4333-8333-333333333333",
    userId: users[2].id,
    name: "Jordan Lee",
    avatar: "/images/nicholas_avatar.jpg",
    banner: "/images/banner_main.jpg",
    school: "SVA",
    major: "Visual Narrative",
    graduationYear: "2025",
    about:
      "Jordan Lee is a storyboard and concept artist from New York. He specializes in sci-fi and horror visual storytelling, blending cinematic compositions with graphic novel aesthetics.",
    topSkills: ["Clip Studio Paint", "Photoshop", "Blender"],
    boardTypes: ["Cinematic", "Horror"],
    isPremium: false,
    availabilityStatus: "open",
    nextAvailable: "Feb 2026",
    rate: 350,
    isFeatured: true,
    viewCount: 870,
    createdAt: "2025-11-03T09:15:00Z",
  },
  {
    id: "a4444444-4444-4444-8444-444444444444",
    userId: users[3].id,
    name: "Anika Torres",
    avatar: "/images/nicholas_avatar.jpg",
    banner: "/images/banner_main.jpg",
    school: "RISD",
    major: "Illustration",
    graduationYear: "2024",
    about:
      "Anika Torres is an illustrator and storyboard artist from Providence, RI. Her work focuses on emotionally rich, dialogue-heavy sequences for animation and live-action drama.",
    topSkills: ["Storyboard Pro", "Photoshop", "Procreate"],
    boardTypes: ["Dialogue Board", "Drama"],
    isPremium: false,
    availabilityStatus: "open",
    nextAvailable: null,
    rate: 400,
    isFeatured: false,
    viewCount: 2100,
    createdAt: "2025-12-10T16:45:00Z",
  },
  {
    id: "a5555555-5555-4555-8555-555555555555",
    userId: users[4].id,
    name: "Derek Okafor",
    avatar: "/images/nicholas_avatar.jpg",
    banner: "/images/banner_main.jpg",
    school: "USC",
    major: "Animation & Digital Arts",
    graduationYear: "2023",
    about:
      "Derek Okafor is a Los Angeles-based storyboard artist with experience in commercial and music video production. Known for dynamic action sequences and bold compositions.",
    topSkills: ["Storyboard Pro", "After Effects", "Premiere Pro"],
    boardTypes: ["Action Board", "Commercial"],
    isPremium: true,
    availabilityStatus: "unavailable",
    nextAvailable: null,
    rate: null,
    isFeatured: true,
    viewCount: 5670,
    createdAt: "2026-01-18T11:00:00Z",
  },
];

const projects = [
  {
    id: "91111111-1111-4111-8111-111111111111",
    createdBy: users[0].id,
    title: "Soulstealers",
    subtitle: "LMU Undergrad 3rd-Year Thesis",
    image: "/images/Soulstealers.jpg",
    logline:
      "At the height of the 1768 Sorcery Scare in Qing Dynasty China, a bridge builder from out of town races to find the real cause of the local kid's possession before the xenophobic town deems him guilty.",
    school: "LMU",
    format: "Short Film",
    length: "15 min",
    timeline: "1 Month",
    productionType: "Student",
    shotlistReady: true,
    locationSecured: true,
    isPaid: true,
    visualDeckUrl: "#",
    contactTwitter: "#",
    contactInstagram: "#",
    contactEmail: "contact@example.com",
    isFeatured: true,
    viewCount: 2340,
    createdAt: "2025-07-10T08:00:00Z",
  },
  {
    id: "92222222-2222-4222-8222-222222222222",
    createdBy: users[1].id,
    title: "Parallax",
    subtitle: "CalArts Senior Thesis Film",
    image: "/images/Soulstealers.jpg",
    logline:
      "A retired astronaut suffering from memory loss discovers that the strange visions she keeps having aren't hallucinations - they're transmissions from a version of herself that never came home.",
    school: "CalArts",
    format: "Short Film",
    length: "12 min",
    timeline: "2 Months",
    productionType: "Student",
    shotlistReady: true,
    locationSecured: false,
    isPaid: false,
    visualDeckUrl: null,
    contactTwitter: null,
    contactInstagram: "#",
    contactEmail: "parallax@example.com",
    isFeatured: true,
    viewCount: 1870,
    createdAt: "2025-09-05T12:00:00Z",
  },
  {
    id: "93333333-3333-4333-8333-333333333333",
    createdBy: users[2].id,
    title: "Glass Garden",
    subtitle: "Indie Animated Short",
    image: "/images/Soulstealers.jpg",
    logline:
      "In a city where emotions manifest as plants, a florist who feels nothing must tend to the overgrown grief of a stranger before it consumes the entire neighborhood.",
    school: "SVA",
    format: "Short Film",
    length: "8 min",
    timeline: "3 Months",
    productionType: "Indie",
    shotlistReady: false,
    locationSecured: true,
    isPaid: true,
    visualDeckUrl: "#",
    contactTwitter: "#",
    contactInstagram: null,
    contactEmail: "glassgarden@example.com",
    isFeatured: false,
    viewCount: 950,
    createdAt: "2025-10-20T15:30:00Z",
  },
  {
    id: "94444444-4444-4444-8444-444444444444",
    createdBy: users[4].id,
    title: "VANTA",
    subtitle: "Nike x Foot Locker Campaign",
    image: "/images/Soulstealers.jpg",
    logline:
      "A 60-second spot following a dancer through impossible architecture as each move transforms the world around her into bold, kinetic geometry.",
    school: "USC",
    format: "Commercial",
    length: "60 sec",
    timeline: "2 Weeks",
    productionType: "Commercial",
    shotlistReady: true,
    locationSecured: true,
    isPaid: true,
    visualDeckUrl: "#",
    contactTwitter: "#",
    contactInstagram: "#",
    contactEmail: "vanta@example.com",
    isFeatured: true,
    viewCount: 4200,
    createdAt: "2025-12-01T09:00:00Z",
  },
  {
    id: "95555555-5555-4555-8555-555555555555",
    createdBy: users[3].id,
    title: "Undertow",
    subtitle: "RISD MFA Thesis",
    image: "/images/Soulstealers.jpg",
    logline:
      "Two estranged siblings return to their childhood beach house to settle their late mother's estate, only to find that the house won't let them leave until they confront what tore them apart.",
    school: "RISD",
    format: "Short Film",
    length: "20 min",
    timeline: "6 Weeks",
    productionType: "Student",
    shotlistReady: true,
    locationSecured: true,
    isPaid: false,
    visualDeckUrl: null,
    contactTwitter: null,
    contactInstagram: null,
    contactEmail: "undertow@example.com",
    isFeatured: false,
    viewCount: 680,
    createdAt: "2026-01-08T14:00:00Z",
  },
  {
    id: "96666666-6666-4666-8666-666666666666",
    createdBy: users[0].id,
    title: "Midnight Frequency",
    subtitle: "Independent Music Video",
    image: "/images/Soulstealers.jpg",
    logline:
      "A pirate radio DJ in 1990s Lagos broadcasts forbidden songs that literally bring the city's murals to life, drawing the attention of a government determined to silence him.",
    school: "LMU",
    format: "MV",
    length: "4 min",
    timeline: "3 Weeks",
    productionType: "Indie",
    shotlistReady: false,
    locationSecured: false,
    isPaid: true,
    visualDeckUrl: "#",
    contactTwitter: "#",
    contactInstagram: "#",
    contactEmail: "midfreq@example.com",
    isFeatured: true,
    viewCount: 3100,
    createdAt: "2026-02-01T10:00:00Z",
  },
];

async function refreshOptionalCacheTables(sql) {
  const cacheQueries = [
    sql`
      INSERT INTO school_user_counts (school, user_count, updated_at)
      SELECT school, COUNT(*)::INTEGER, NOW()
      FROM artists
      WHERE school <> ''
      GROUP BY school
      ON CONFLICT (school) DO UPDATE
      SET
        user_count = EXCLUDED.user_count,
        updated_at = NOW()
    `,
    sql`
      INSERT INTO project_school_counts (school, project_count, updated_at)
      SELECT school, COUNT(*)::INTEGER, NOW()
      FROM projects
      WHERE school <> ''
      GROUP BY school
      ON CONFLICT (school) DO UPDATE
      SET
        project_count = EXCLUDED.project_count,
        updated_at = NOW()
    `,
  ];

  for (const query of cacheQueries) {
    try {
      await query;
    } catch (error) {
      if (error && typeof error === "object" && error.code === "42P01") {
        continue;
      }
      throw error;
    }
  }
}

async function main() {
  const databaseUrl = resolveDatabaseUrl();
  const sql = postgres(databaseUrl, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
  });

  try {
    for (const user of users) {
      await sql`
        INSERT INTO users (id, email, name, provider, provider_id, role, avatar_url)
        VALUES (
          ${user.id},
          ${user.email},
          ${user.name},
          ${user.provider},
          ${user.providerId},
          ${user.role},
          ${user.avatarUrl}
        )
        ON CONFLICT (id) DO UPDATE
        SET
          email = EXCLUDED.email,
          name = EXCLUDED.name,
          provider = EXCLUDED.provider,
          provider_id = EXCLUDED.provider_id,
          role = EXCLUDED.role,
          avatar_url = EXCLUDED.avatar_url,
          updated_at = NOW()
      `;
    }

    for (const artist of artists) {
      await sql`
        INSERT INTO artists (
          id, user_id, name, avatar, banner, school, major, graduation_year, about,
          top_skills, board_types, is_premium, avail_status, avail_next, avail_rate,
          is_featured, view_count, created_at, updated_at
        )
        VALUES (
          ${artist.id},
          ${artist.userId},
          ${artist.name},
          ${artist.avatar},
          ${artist.banner},
          ${artist.school},
          ${artist.major},
          ${artist.graduationYear},
          ${artist.about},
          ${artist.topSkills},
          ${artist.boardTypes},
          ${artist.isPremium},
          ${artist.availabilityStatus},
          ${artist.nextAvailable},
          ${artist.rate},
          ${artist.isFeatured},
          ${artist.viewCount},
          ${artist.createdAt},
          NOW()
        )
        ON CONFLICT (id) DO UPDATE
        SET
          user_id = EXCLUDED.user_id,
          name = EXCLUDED.name,
          avatar = EXCLUDED.avatar,
          banner = EXCLUDED.banner,
          school = EXCLUDED.school,
          major = EXCLUDED.major,
          graduation_year = EXCLUDED.graduation_year,
          about = EXCLUDED.about,
          top_skills = EXCLUDED.top_skills,
          board_types = EXCLUDED.board_types,
          is_premium = EXCLUDED.is_premium,
          avail_status = EXCLUDED.avail_status,
          avail_next = EXCLUDED.avail_next,
          avail_rate = EXCLUDED.avail_rate,
          is_featured = EXCLUDED.is_featured,
          view_count = EXCLUDED.view_count,
          created_at = EXCLUDED.created_at,
          updated_at = NOW()
      `;
    }

    for (const project of projects) {
      await sql`
        INSERT INTO projects (
          id, created_by, title, subtitle, image, logline, school, format, length, timeline,
          production_type, shotlist_ready, location_secured, is_paid, visual_deck_url,
          contact_twitter, contact_instagram, contact_email, is_featured, view_count,
          created_at, updated_at
        )
        VALUES (
          ${project.id},
          ${project.createdBy},
          ${project.title},
          ${project.subtitle},
          ${project.image},
          ${project.logline},
          ${project.school},
          ${project.format},
          ${project.length},
          ${project.timeline},
          ${project.productionType},
          ${project.shotlistReady},
          ${project.locationSecured},
          ${project.isPaid},
          ${project.visualDeckUrl},
          ${project.contactTwitter},
          ${project.contactInstagram},
          ${project.contactEmail},
          ${project.isFeatured},
          ${project.viewCount},
          ${project.createdAt},
          NOW()
        )
        ON CONFLICT (id) DO UPDATE
        SET
          created_by = EXCLUDED.created_by,
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          image = EXCLUDED.image,
          logline = EXCLUDED.logline,
          school = EXCLUDED.school,
          format = EXCLUDED.format,
          length = EXCLUDED.length,
          timeline = EXCLUDED.timeline,
          production_type = EXCLUDED.production_type,
          shotlist_ready = EXCLUDED.shotlist_ready,
          location_secured = EXCLUDED.location_secured,
          is_paid = EXCLUDED.is_paid,
          visual_deck_url = EXCLUDED.visual_deck_url,
          contact_twitter = EXCLUDED.contact_twitter,
          contact_instagram = EXCLUDED.contact_instagram,
          contact_email = EXCLUDED.contact_email,
          is_featured = EXCLUDED.is_featured,
          view_count = EXCLUDED.view_count,
          created_at = EXCLUDED.created_at,
          updated_at = NOW()
      `;
    }

    await refreshOptionalCacheTables(sql);

    console.log(`Seeded ${users.length} users, ${artists.length} artists, and ${projects.length} projects.`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed mock data.");
  console.error(error);
  process.exit(1);
});
