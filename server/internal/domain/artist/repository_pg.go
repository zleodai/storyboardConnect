package artist

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const artistColumns = `id, user_id, name, avatar, banner, school, major, graduation_year,
	          about, top_skills, board_types, is_premium, avail_status, avail_next, avail_rate,
	          view_count, created_at, updated_at`

type pgRepository struct {
	pool *pgxpool.Pool
}

// NewRepository creates a PostgreSQL-backed artist repository.
func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) FindAll(ctx context.Context, filter ArtistFilter) ([]Artist, error) {
	query := `SELECT ` + artistColumns + ` FROM artists WHERE 1=1`
	args := []any{}
	argIdx := 1

	if filter.SearchQuery != "" {
		query += fmt.Sprintf(" AND LOWER(name) LIKE LOWER($%d)", argIdx)
		args = append(args, "%"+filter.SearchQuery+"%")
		argIdx++
	}
	if len(filter.Schools) > 0 {
		query += fmt.Sprintf(" AND school = ANY($%d)", argIdx)
		args = append(args, filter.Schools)
		argIdx++
	}
	if len(filter.BoardTypes) > 0 {
		query += fmt.Sprintf(" AND board_types && $%d::text[]", argIdx)
		args = append(args, filter.BoardTypes)
		argIdx++
	}

	query += orderByClause(filter.SortBy)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query artists: %w", err)
	}
	defer rows.Close()

	artists, err := scanArtists(rows)
	if err != nil {
		return nil, err
	}

	return r.loadPortfolios(ctx, artists)
}

func (r *pgRepository) FindByID(ctx context.Context, id string) (*Artist, error) {
	query := `SELECT ` + artistColumns + ` FROM artists WHERE id = $1`

	row := r.pool.QueryRow(ctx, query, id)
	a, err := scanArtist(row)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query artist by id: %w", err)
	}

	portfolio, err := r.loadPortfolio(ctx, a.ID)
	if err != nil {
		return nil, err
	}
	a.Portfolio = portfolio

	return a, nil
}

func (r *pgRepository) FindFeatured(ctx context.Context, limit int) ([]Artist, error) {
	query := `SELECT ` + artistColumns + ` FROM artists WHERE is_featured = TRUE
	          ORDER BY created_at DESC LIMIT $1`

	rows, err := r.pool.Query(ctx, query, limit)
	if err != nil {
		return nil, fmt.Errorf("query featured artists: %w", err)
	}
	defer rows.Close()

	artists, err := scanArtists(rows)
	if err != nil {
		return nil, err
	}

	return r.loadPortfolios(ctx, artists)
}

// orderByClause returns a safe ORDER BY clause based on sortBy value.
// Artists only support sorting by date (created_at DESC).
func orderByClause(sortBy string) string {
	return " ORDER BY created_at DESC"
}

// loadPortfolios loads portfolio projects for a batch of artists.
func (r *pgRepository) loadPortfolios(ctx context.Context, artists []Artist) ([]Artist, error) {
	if len(artists) == 0 {
		return artists, nil
	}

	ids := make([]string, len(artists))
	for i, a := range artists {
		ids[i] = a.ID
	}

	rows, err := r.pool.Query(ctx,
		`SELECT id, artist_id, title, image, tags, category
		 FROM portfolio_projects
		 WHERE artist_id = ANY($1)
		 ORDER BY sort_order`,
		ids,
	)
	if err != nil {
		return nil, fmt.Errorf("query portfolios: %w", err)
	}
	defer rows.Close()

	portfolioMap := make(map[string][]PortfolioProject)
	for rows.Next() {
		var p PortfolioProject
		var artistID string
		if err := rows.Scan(&p.ID, &artistID, &p.Title, &p.Image, &p.Tags, &p.Category); err != nil {
			return nil, fmt.Errorf("scan portfolio: %w", err)
		}
		portfolioMap[artistID] = append(portfolioMap[artistID], p)
	}

	for i := range artists {
		if portfolio, ok := portfolioMap[artists[i].ID]; ok {
			artists[i].Portfolio = portfolio
		} else {
			artists[i].Portfolio = []PortfolioProject{}
		}
	}

	return artists, nil
}

// loadPortfolio loads portfolio projects for a single artist.
func (r *pgRepository) loadPortfolio(ctx context.Context, artistID string) ([]PortfolioProject, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, title, image, tags, category
		 FROM portfolio_projects
		 WHERE artist_id = $1
		 ORDER BY sort_order`,
		artistID,
	)
	if err != nil {
		return nil, fmt.Errorf("query portfolio: %w", err)
	}
	defer rows.Close()

	var portfolio []PortfolioProject
	for rows.Next() {
		var p PortfolioProject
		if err := rows.Scan(&p.ID, &p.Title, &p.Image, &p.Tags, &p.Category); err != nil {
			return nil, fmt.Errorf("scan portfolio: %w", err)
		}
		portfolio = append(portfolio, p)
	}

	if portfolio == nil {
		portfolio = []PortfolioProject{}
	}
	return portfolio, nil
}

// scanArtists scans multiple rows into Artist structs.
func scanArtists(rows pgx.Rows) ([]Artist, error) {
	var artists []Artist
	for rows.Next() {
		a, err := scanArtistFromRows(rows)
		if err != nil {
			return nil, err
		}
		artists = append(artists, *a)
	}
	if artists == nil {
		artists = []Artist{}
	}
	return artists, nil
}

// scanArtist scans a single row into an Artist struct.
func scanArtist(row pgx.Row) (*Artist, error) {
	var a Artist
	var availStatus *string
	var availNext *string
	var availRate *float64

	err := row.Scan(
		&a.ID, &a.UserID, &a.Name, &a.Avatar, &a.Banner, &a.School,
		&a.Major, &a.GraduationYear, &a.About, &a.TopSkills, &a.BoardTypes,
		&a.IsPremium, &availStatus, &availNext, &availRate,
		&a.ViewCount, &a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	if availStatus != nil {
		a.Availability = &Availability{
			Status:        AvailabilityStatus(*availStatus),
			NextAvailable: availNext,
			Rate:          availRate,
		}
	}

	return &a, nil
}

// scanArtistFromRows scans the current row from pgx.Rows.
func scanArtistFromRows(rows pgx.Rows) (*Artist, error) {
	var a Artist
	var availStatus *string
	var availNext *string
	var availRate *float64

	err := rows.Scan(
		&a.ID, &a.UserID, &a.Name, &a.Avatar, &a.Banner, &a.School,
		&a.Major, &a.GraduationYear, &a.About, &a.TopSkills, &a.BoardTypes,
		&a.IsPremium, &availStatus, &availNext, &availRate,
		&a.ViewCount, &a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("scan artist: %w", err)
	}

	if availStatus != nil {
		a.Availability = &Availability{
			Status:        AvailabilityStatus(*availStatus),
			NextAvailable: availNext,
			Rate:          availRate,
		}
	}

	return &a, nil
}
