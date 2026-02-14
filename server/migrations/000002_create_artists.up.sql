CREATE TABLE artists (
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
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT artists_user_unique UNIQUE (user_id),
    CONSTRAINT artists_avail_check CHECK (
        avail_status IS NULL OR avail_status IN ('open', 'busy', 'unavailable')
    )
);

CREATE INDEX idx_artists_school ON artists(school);
CREATE INDEX idx_artists_board_types ON artists USING GIN(board_types);
CREATE INDEX idx_artists_featured ON artists(is_featured) WHERE is_featured = TRUE;
