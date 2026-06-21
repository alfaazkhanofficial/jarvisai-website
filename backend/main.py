"""
main.py - JARVIS-AI backend
FastAPI server providing signup/login auth and JARVIS source code downloads.

Run with: uvicorn main:app --reload --port 8000
"""
import os
import re
import logging
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session
from sqlalchemy import or_, text
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from database import init_db, get_db, User, DownloadLog
from auth import hash_password, verify_password, create_access_token, decode_access_token

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("jarvisai")

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(title="JARVIS-AI API", version="1.0.0")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Comma-separated list of allowed origins, e.g. "https://jarvisai.vercel.app,https://jarvisai.com"
# Note: browsers reject "*" when allow_credentials=True, so this must be a real origin in production.
_allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS = (
    ["*"] if _allowed_origins_env == "*" else [o.strip() for o in _allowed_origins_env.split(",")]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch anything that isn't an intentional HTTPException so stack traces
    and internal details never leak to the client in production."""
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on our end. Please try again shortly."},
    )

init_db()
logger.info("Database initialized")

BASE_DIR = Path(__file__).resolve().parent
DOWNLOADS_DIR = BASE_DIR / "downloads"
DOWNLOADS_DIR.mkdir(exist_ok=True)

RELEASE_FILENAME = "jarvis-source.zip"  # the file Alfaaz will upload here
RELEASE_PATH = DOWNLOADS_DIR / RELEASE_FILENAME

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 32:
            raise ValueError("Username must be between 3 and 32 characters")
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    identifier: str  # email or username
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------------------------------------------------------------------------
# Auth dependency
# ---------------------------------------------------------------------------

def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if token is None:
        raise credentials_exception
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


def get_current_user_optional(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    if token is None:
        return None
    payload = decode_access_token(token)
    if payload is None:
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()


# ---------------------------------------------------------------------------
# Routes - health
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception as exc:
        logger.error(f"Health check DB failure: {exc}")
        db_ok = False

    return {
        "status": "online" if db_ok else "degraded",
        "service": "JARVIS-AI",
        "database": "ok" if db_ok else "unreachable",
    }


# ---------------------------------------------------------------------------
# Routes - auth
# ---------------------------------------------------------------------------

@app.post("/api/auth/signup", response_model=TokenResponse)
@limiter.limit("5/minute")
def signup(payload: SignupRequest, request: Request, db: Session = Depends(get_db)):
    existing = (
        db.query(User)
        .filter(or_(User.email == payload.email, User.username == payload.username))
        .first()
    )
    if existing:
        if existing.email == payload.email:
            raise HTTPException(status_code=400, detail="An account with this email already exists")
        raise HTTPException(status_code=400, detail="This username is already taken")

    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"New signup: {user.username}")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@app.post("/api/auth/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(or_(User.email == payload.identifier, User.username == payload.identifier))
        .first()
    )
    if not user or not verify_password(payload.password, user.hashed_password):
        logger.warning(f"Failed login attempt for identifier: {payload.identifier}")
        raise HTTPException(status_code=401, detail="Incorrect email/username or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="This account has been deactivated")

    logger.info(f"Login: {user.username}")
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@app.get("/api/auth/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


# ---------------------------------------------------------------------------
# Routes - downloads
# ---------------------------------------------------------------------------

@app.get("/api/downloads/info")
def download_info():
    """Returns metadata about the available release so the frontend can render it
    even before the file itself is uploaded."""
    exists = RELEASE_PATH.exists()
    size_bytes = RELEASE_PATH.stat().st_size if exists else 0
    return {
        "available": exists,
        "filename": RELEASE_FILENAME,
        "size_bytes": size_bytes,
        "size_mb": round(size_bytes / (1024 * 1024), 2) if exists else 0,
    }


@app.get("/api/downloads/jarvis")
def download_jarvis(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not RELEASE_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="The release file hasn't been uploaded yet. Check back soon.",
        )

    log = DownloadLog(
        user_id=current_user.id,
        filename=RELEASE_FILENAME,
        ip_address=request.client.host if request.client else None,
    )
    db.add(log)
    db.commit()
    logger.info(f"Download served to user:{current_user.username}")

    return FileResponse(
        path=RELEASE_PATH,
        filename=RELEASE_FILENAME,
        media_type="application/zip",
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
