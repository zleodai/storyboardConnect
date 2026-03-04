CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    provider    VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    role        VARCHAR(50) NOT NULL DEFAULT 'artist',
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_provider_unique UNIQUE (provider, provider_id),
    CONSTRAINT users_role_check CHECK (role IN ('artist', 'creator', 'admin'))
);

CREATE TABLE IF NOT EXISTS artists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    avatar          TEXT NOT NULL DEFAULT '',
    banner          TEXT NOT NULL DEFAULT '',
    school          VARCHAR(255) NOT NULL,
    major           VARCHAR(255),
    graduation_year VARCHAR(10),
    about           TEXT NOT NULL DEFAULT '',
    top_skills      TEXT[] NOT NULL DEFAULT '{}',
    board_types     TEXT[] NOT NULL DEFAULT '{}',
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    avail_status    VARCHAR(20) DEFAULT 'open',
    avail_next      VARCHAR(100),
    avail_rate      NUMERIC(10,2),
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    view_count      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT artists_user_unique UNIQUE (user_id),
    CONSTRAINT artists_avail_check CHECK (
        avail_status IS NULL OR avail_status IN ('open', 'busy', 'unavailable')
    )
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id   UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    image       TEXT NOT NULL DEFAULT '',
    tags        TEXT[] NOT NULL DEFAULT '{}',
    category    VARCHAR(100) NOT NULL DEFAULT '',
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title             VARCHAR(255) NOT NULL,
    subtitle          VARCHAR(500) NOT NULL DEFAULT '',
    image             TEXT NOT NULL DEFAULT '',
    logline           TEXT NOT NULL DEFAULT '',
    school            VARCHAR(255) NOT NULL,
    format            VARCHAR(50) NOT NULL,
    length            VARCHAR(100),
    timeline          VARCHAR(100) NOT NULL,
    production_type   VARCHAR(50) NOT NULL,
    shotlist_ready    BOOLEAN NOT NULL DEFAULT FALSE,
    location_secured  BOOLEAN NOT NULL DEFAULT FALSE,
    is_paid           BOOLEAN NOT NULL DEFAULT FALSE,
    visual_deck_url   TEXT,
    contact_twitter   VARCHAR(255),
    contact_instagram VARCHAR(255),
    contact_email     VARCHAR(255),
    is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
    view_count        INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT projects_format_check CHECK (
        format IN ('MV', 'Commercial', 'Short Film', 'Feature')
    ),
    CONSTRAINT projects_prod_type_check CHECK (
        production_type IN ('Commercial', 'Student', 'Indie', 'Others')
    )
);

CREATE TABLE IF NOT EXISTS applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message         TEXT NOT NULL DEFAULT '',
    portfolio_link  TEXT,
    status          VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT applications_unique UNIQUE (project_id, user_id),
    CONSTRAINT applications_status_check CHECK (
        status IN ('pending', 'accepted', 'rejected', 'withdrawn')
    )
);

CREATE TABLE IF NOT EXISTS school_user_counts (
    school       VARCHAR(255) PRIMARY KEY,
    user_count   INTEGER NOT NULL DEFAULT 0,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_artists_school ON artists(school);
CREATE INDEX IF NOT EXISTS idx_artists_board_types ON artists USING GIN(board_types);
CREATE INDEX IF NOT EXISTS idx_artists_featured ON artists(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_portfolio_artist ON portfolio_projects(artist_id);
CREATE INDEX IF NOT EXISTS idx_projects_school ON projects(school);
CREATE INDEX IF NOT EXISTS idx_projects_format ON projects(format);
CREATE INDEX IF NOT EXISTS idx_projects_prod_type ON projects(production_type);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

INSERT INTO school_user_counts (school, user_count, updated_at)
SELECT school, COUNT(*)::INTEGER, NOW()
FROM artists
WHERE school <> ''
GROUP BY school
ON CONFLICT (school) DO UPDATE
SET
    user_count = EXCLUDED.user_count,
    updated_at = NOW();
