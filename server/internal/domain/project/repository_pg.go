package project

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const projectColumns = `id, created_by, title, subtitle, image, logline, school,
	          format, length, timeline, production_type, shotlist_ready, location_secured,
	          is_paid, visual_deck_url, contact_twitter, contact_instagram, contact_email,
	          view_count, created_at, updated_at`

type pgRepository struct {
	pool *pgxpool.Pool
}

// NewRepository creates a PostgreSQL-backed project repository.
func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) FindAll(ctx context.Context, filter ProjectFilter) ([]Project, error) {
	query := `SELECT ` + projectColumns + ` FROM projects WHERE 1=1`
	args := []any{}
	argIdx := 1

	if filter.SearchQuery != "" {
		query += fmt.Sprintf(" AND (LOWER(title) LIKE LOWER($%d) OR LOWER(logline) LIKE LOWER($%d))", argIdx, argIdx)
		args = append(args, "%"+filter.SearchQuery+"%")
		argIdx++
	}
	if len(filter.Schools) > 0 {
		query += fmt.Sprintf(" AND school = ANY($%d)", argIdx)
		args = append(args, filter.Schools)
		argIdx++
	}
	if len(filter.Formats) > 0 {
		query += fmt.Sprintf(" AND format = ANY($%d)", argIdx)
		args = append(args, filter.Formats)
		argIdx++
	}
	if len(filter.ProductionTypes) > 0 {
		query += fmt.Sprintf(" AND production_type = ANY($%d)", argIdx)
		args = append(args, filter.ProductionTypes)
		argIdx++
	}
	if len(filter.Timelines) > 0 {
		query += fmt.Sprintf(" AND timeline = ANY($%d)", argIdx)
		args = append(args, filter.Timelines)
		argIdx++
	}

	query += orderByClause(filter.SortBy)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query projects: %w", err)
	}
	defer rows.Close()

	return scanProjects(rows)
}

func (r *pgRepository) FindByID(ctx context.Context, id string) (*Project, error) {
	query := `SELECT ` + projectColumns + ` FROM projects WHERE id = $1`

	row := r.pool.QueryRow(ctx, query, id)
	p, err := scanProject(row)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query project by id: %w", err)
	}
	return p, nil
}

func (r *pgRepository) FindFeatured(ctx context.Context, limit int) ([]Project, error) {
	query := `SELECT ` + projectColumns + ` FROM projects WHERE is_featured = TRUE
	          ORDER BY created_at DESC LIMIT $1`

	rows, err := r.pool.Query(ctx, query, limit)
	if err != nil {
		return nil, fmt.Errorf("query featured projects: %w", err)
	}
	defer rows.Close()

	return scanProjects(rows)
}

func (r *pgRepository) CreateApplication(ctx context.Context, app *Application) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO applications (project_id, user_id, message, portfolio_link)
		 VALUES ($1, $2, $3, $4)`,
		app.ProjectID, app.UserID, app.Message, app.PortfolioLink,
	)
	if err != nil {
		return fmt.Errorf("create application: %w", err)
	}
	return nil
}

func (r *pgRepository) FindApplication(ctx context.Context, projectID, userID string) (*Application, error) {
	var app Application
	err := r.pool.QueryRow(ctx,
		`SELECT id, project_id, user_id, message, portfolio_link, status, created_at, updated_at
		 FROM applications WHERE project_id = $1 AND user_id = $2`,
		projectID, userID,
	).Scan(
		&app.ID, &app.ProjectID, &app.UserID, &app.Message,
		&app.PortfolioLink, &app.Status, &app.CreatedAt, &app.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("find application: %w", err)
	}
	return &app, nil
}

// orderByClause returns a safe ORDER BY clause based on sortBy value.
func orderByClause(sortBy string) string {
	switch sortBy {
	case "views":
		return " ORDER BY view_count DESC"
	default:
		return " ORDER BY created_at DESC"
	}
}

func scanProjects(rows pgx.Rows) ([]Project, error) {
	var projects []Project
	for rows.Next() {
		p, err := scanProjectFromRows(rows)
		if err != nil {
			return nil, err
		}
		projects = append(projects, *p)
	}
	if projects == nil {
		projects = []Project{}
	}
	return projects, nil
}

func scanProject(row pgx.Row) (*Project, error) {
	var p Project
	err := row.Scan(
		&p.ID, &p.CreatedByUserID, &p.Title, &p.Subtitle, &p.Image, &p.Logline,
		&p.School, &p.Format, &p.Length, &p.Timeline, &p.ProductionType,
		&p.ShotlistReady, &p.LocationSecured, &p.IsPaid, &p.VisualDeckURL,
		&p.ContactInfo.Twitter, &p.ContactInfo.Instagram, &p.ContactInfo.Email,
		&p.ViewCount, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func scanProjectFromRows(rows pgx.Rows) (*Project, error) {
	var p Project
	err := rows.Scan(
		&p.ID, &p.CreatedByUserID, &p.Title, &p.Subtitle, &p.Image, &p.Logline,
		&p.School, &p.Format, &p.Length, &p.Timeline, &p.ProductionType,
		&p.ShotlistReady, &p.LocationSecured, &p.IsPaid, &p.VisualDeckURL,
		&p.ContactInfo.Twitter, &p.ContactInfo.Instagram, &p.ContactInfo.Email,
		&p.ViewCount, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("scan project: %w", err)
	}
	return &p, nil
}
