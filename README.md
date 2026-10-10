# Career Checklist

A week-by-week career preparation tracker built with React + Vite, FastAPI, SQLite, and GitHub OAuth.

## Features
- Sign in with GitHub (OAuth handled by the FastAPI backend)
- 16-week career preparation checklist
- Persist checked/unchecked items per GitHub user in SQLite
- Responsive dashboard with progress summaries
- Secure, HTTP-only signed session cookie
- CSRF state validation handled by Authlib/Starlette OAuth flow

## Requirements
- Python 3.11+
- Node.js 20+
- A GitHub OAuth App

## 1. Create a GitHub OAuth App
In GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**.
For local development use:
- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:8000/auth/github/callback`

Copy the Client ID and generate a Client Secret.

## 2. Configure backend
```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```
Edit `.env` and set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and a long random `SESSION_SECRET`.

Run:
```bash
uvicorn app.main:app --reload --port 8000
```

The SQLite database is created automatically at `backend/career_checklist.db`.

## 3. Configure frontend
In a second terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open `http://localhost:5173`.

## Environment variables
Backend `.env`:
- `GITHUB_CLIENT_ID`: GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth app client secret (never put this in frontend)
- `SESSION_SECRET`: random secret used to sign the session cookie
- `FRONTEND_URL`: `http://localhost:5173`
- `BACKEND_URL`: `http://localhost:8000`
- `COOKIE_SECURE`: `false` locally; set `true` behind HTTPS in production
- `DATABASE_URL`: optional; defaults to local SQLite file

Frontend `.env`:
- `VITE_API_BASE_URL`: `http://localhost:8000`

## Production notes
- Use HTTPS and set `COOKIE_SECURE=true`.
- Set exact production callback URL in the GitHub OAuth App.
- Use a strong unique `SESSION_SECRET`; do not commit `.env`.
- For cross-site frontend/backend deployments, configure `SameSite=None; Secure` and explicit CORS origins. The included same-site local setup uses `SameSite=Lax`.
- SQLite is suitable for a single-instance personal app. Use persistent disk storage when hosting it; ephemeral filesystems can erase the database on redeploy.
- GitHub OAuth only authenticates users; it does not grant access to private repositories.
