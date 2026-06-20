# JARVIS-AI Website

Full-stack site for distributing the JARVIS CLI source code: liquid-glass UI, working nav,
real email/password auth (JWT + SQLite), and a working zip download.

## Structure
```
jarvisai/
├── backend/      FastAPI + SQLite (auth, download serving)
└── frontend/     React + Vite (liquid glass UI)
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

To point the frontend at a different backend URL (e.g. once deployed), edit `frontend/.env`:
```
VITE_API_BASE=https://your-backend-domain.com
```

## Production build
```bash
cd frontend
npm run build           # outputs to frontend/dist
```
Serve the `dist/` folder with any static host (Vercel, Netlify, Nginx, etc.) — just make sure
your host rewrites all paths to `index.html` so React Router's client-side routes
(`/downloads`, `/login`) work on direct page loads.

## Security notes before going live
- Set a real `JARVISAI_SECRET_KEY` environment variable on the backend (used to sign JWTs).
  The current value in `auth.py` is a dev-only placeholder.
- Lock down CORS in `backend/main.py` (`allow_origins=["*"]`) to your actual frontend domain.
- Consider rate-limiting `/api/auth/signup` and `/api/auth/login` if this goes public.

## What's implemented
- Liquid-glass navbar: JARVIS-AI logo (left) · Home / Downloads / Login / GitHub (right)
- Home page, single centered column, pure black background — feature cards describing the real
  J.A.R.V.I.S app (three chat modes, voice, vision, memory)
- Downloads page: fetches real file size from the backend, downloads the actual zip via blob,
  shows "not uploaded yet" state gracefully if the file is missing, credits the original author
- Login page: tabbed login/signup, real bcrypt password hashing, JWT issued and stored,
  duplicate email/username rejected server-side
- Mobile-responsive nav with hamburger menu

## Attribution
The source code distributed through this site (J.A.R.V.I.S) was originally built by
**Shreshth Kaushik** ([theshreshthkaushik.com](https://www.theshreshthkaushik.com/)) and is
released under the MIT license. Attribution is shown on the Downloads page — keep it there
if you redistribute this project, per the MIT license terms.
