# JARVIS-AI Website

Full-stack site for distributing the J.A.R.V.I.S source code: minimal black-and-white UI,
working nav, real email/password auth (JWT + SQLite, rate-limited), and a working zip download.

## Structure
```
jarvisai/
├── backend/      FastAPI + SQLite (auth, download serving, rate limiting, logging)
└── frontend/     React + Vite (Inter-based minimal UI)
```

## Backend setup
```bash
cd backend
pip install -r requirements.txt
python main.py        # or: uvicorn main:app --reload --port 8000
```
This starts the API at `http://localhost:8000` and creates `jarvisai.db` automatically on first run.

### Uploading your release zip
Drop your JARVIS source zip into `backend/downloads/jarvis-source.zip` (exact filename matters).
The `/api/downloads/info` endpoint will then report it as available, and the Download button
on the site will start working immediately — no restart needed.

```bash
cp /path/to/your/jarvis-source.zip backend/downloads/jarvis-source.zip
```

## Frontend setup
```bash
cd frontend
npm install
npm run dev            # dev server at http://localhost:5173
```

To point the frontend at a different backend URL (e.g. once deployed), edit `frontend/.env`
(local dev) or `frontend/.env.production` (production build):
```
VITE_API_BASE=https://your-backend-domain.com
```

## Production build
```bash
cd frontend
npm run build           # outputs to frontend/dist
```
Serve the `dist/` folder with any static host (Vercel, Netlify, Nginx, etc.). On Vercel,
`frontend/vercel.json` already handles rewriting all paths to `index.html` so React Router's
client-side routes (`/downloads`, `/login`) work on direct page loads / refresh.

## Security notes before going live
- Set a real `JARVISAI_SECRET_KEY` environment variable on the backend (used to sign JWTs).
  The fallback in `auth.py` is a dev-only placeholder.
- Set `ALLOWED_ORIGINS` on the backend to your real frontend domain (comma-separated if
  more than one). Browsers reject `*` with credentialed requests, so this must be a real
  origin in production, not the default wildcard.
- Signup and login are rate-limited (5/min and 10/min per IP respectively) via `slowapi`.

## What's implemented

**Frontend**
- Minimal black-and-white design system: Inter throughout, glass effect reserved for the
  navbar and cards only, flat hairline-bordered surfaces elsewhere
- Navbar: rectangular with rounded corners, JARVIS-AI logo (left) · Home / Downloads / Login /
  GitHub (right), collapses to a hamburger menu on mobile
- Home page, single centered column — feature cards describing the real J.A.R.V.I.S app
  (three chat modes, voice, vision, memory)
- Downloads page: fetches real file size from the backend, downloads the actual zip via blob,
  shows "not uploaded yet" state gracefully if the file is missing, credits the original author
- Login page: tabbed login/signup, real bcrypt password hashing, JWT issued and stored,
  duplicate email/username rejected server-side

**Backend**
- JWT auth (signup/login/me) backed by SQLite, passwords hashed with bcrypt
- Rate limiting on auth endpoints to deter brute-force attempts
- Structured logging for signups, logins (including failed attempts), and downloads
- CORS origin and JWT secret both configurable via environment variables

## Attribution
The source code distributed through this site (J.A.R.V.I.S) was originally built by
**Shreshth Kaushik** ([theshreshthkaushik.com](https://www.theshreshthkaushik.com/)) and is
released under the MIT license. Attribution is shown on the Downloads page — keep it there
if you redistribute this project, per the MIT license terms.
