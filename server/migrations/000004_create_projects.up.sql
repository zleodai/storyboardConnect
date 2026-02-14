CREATE TABLE projects (
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
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT projects_format_check CHECK (
        format IN ('MV', 'Commercial', 'Short Film', 'Feature')
    ),
    CONSTRAINT projects_prod_type_check CHECK (
        production_type IN ('Commercial', 'Student', 'Indie', 'Others')
    )
);

CREATE INDEX idx_projects_school ON projects(school);
CREATE INDEX idx_projects_format ON projects(format);
CREATE INDEX idx_projects_prod_type ON projects(production_type);
CREATE INDEX idx_projects_featured ON projects(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_projects_created_by ON projects(created_by);
