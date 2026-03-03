# Storyboard Connect V2

A platform connecting storyboard artists with filmmakers, built as a Vite frontend plus Vercel Functions.

## Quick Start

```bash
npm install
npm run dev
```

For local frontend-only development, visit `http://localhost:5173`.

For full-stack Vercel-style development, use `vercel dev` after configuring env vars.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Vercel Node.js Functions
- Tailwind CSS
- Axios
- `postgres`
- `jose`

## Project Structure

```text
storyboardConnect/
|-- api/                  # Vercel Functions API
|-- public/images/        # Image assets
|-- src/                  # Frontend React app
|-- server/               # Legacy Go backend reference only
|-- supabase/schema.sql   # Baseline schema to apply in Supabase
|-- vercel.json
```

## Backend Integration

The app now expects a same-origin Vercel Functions API by default.

### Production setup

1. Apply `supabase/schema.sql` to your Supabase database.
2. Set Vercel env vars from `.env.example`.
3. Use the Supabase transaction pooler `DATABASE_URL` on port `6543`.
4. Set `VITE_USE_MOCK_DATA=false`.

### API Endpoints

- `GET /api/health`
- `GET /api/artists`
- `GET /api/artists/featured`
- `GET /api/artists/:id`
- `GET /api/projects`
- `GET /api/projects/featured`
- `GET /api/projects/:id`
- `POST /api/projects/:id/apply`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/auth/me`

## Commands

- `npm run dev` - Start the Vite frontend
- `npm run build` - Build the frontend bundle
- `npm run test` - Run Vitest
- `npm run preview` - Preview the frontend production build

## Deployment Notes

- Frontend and API deploy together on Vercel.
- Runtime migrations are intentionally removed; apply schema changes before deployment.
- The Go backend under `server/` is no longer part of the deployment target.
