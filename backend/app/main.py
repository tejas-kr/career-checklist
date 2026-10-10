import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse

load_dotenv()

from .checklist import WEEKS
from .database import Base, engine, get_db
from .models import TaskProgress, User

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip("/")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
SESSION_SECRET = os.getenv("SESSION_SECRET", "dev-only-change-this-secret-before-deploying")

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Career Checklist API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    session_cookie="career_session",
    same_site="lax",
    https_only=COOKIE_SECURE,
    max_age=60 * 60 * 24 * 7,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type"],
)

oauth = OAuth()
client_id = os.getenv("GITHUB_CLIENT_ID", "")
client_secret = os.getenv("GITHUB_CLIENT_SECRET", "")
if client_id and client_secret:
    oauth.register(
        name="github",
        client_id=client_id,
        client_secret=client_secret,
        access_token_url="https://github.com/login/oauth/access_token",
        authorize_url="https://github.com/login/oauth/authorize",
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "read:user user:email"},
    )

def get_github_oauth():
    if not (os.getenv("GITHUB_CLIENT_ID") and os.getenv("GITHUB_CLIENT_SECRET")):
        raise HTTPException(status_code=503, detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env.")
    return oauth.create_client("github")

def current_user(request: Request, db: Session = Depends(get_db)) -> User:
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Please sign in with GitHub.")
    user = db.get(User, int(user_id))
    if not user:
        request.session.clear()
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    return user

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/auth/github")
async def github_login(request: Request):
    github = get_github_oauth()
    redirect_uri = f"{BACKEND_URL}/auth/github/callback"
    return await github.authorize_redirect(request, redirect_uri)

@app.get("/auth/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    github = get_github_oauth()
    try:
        token = await github.authorize_access_token(request)
        resp = await github.get("user", token=token)
        profile = resp.json()
    except Exception as exc:
        # Do not expose OAuth internals or credentials in the response.
        raise HTTPException(status_code=400, detail="GitHub sign-in failed. Please try again.") from exc

    github_id = str(profile.get("id", ""))
    login = profile.get("login")
    if not github_id or not login:
        raise HTTPException(status_code=400, detail="GitHub did not return a valid user profile.")

    user = db.scalar(select(User).where(User.github_id == github_id))
    if user is None:
        user = User(
            github_id=github_id,
            login=login,
            name=profile.get("name"),
            avatar_url=profile.get("avatar_url"),
        )
        db.add(user)
    else:
        user.login = login
        user.name = profile.get("name")
        user.avatar_url = profile.get("avatar_url")
    db.commit()
    db.refresh(user)

    request.session.clear()
    request.session["user_id"] = user.id
    return RedirectResponse(url=f"{FRONTEND_URL}/", status_code=302)

@app.get("/auth/me")
def me(user: User = Depends(current_user)):
    return {
        "id": user.id,
        "github_login": user.login,
        "name": user.name,
        "avatar_url": user.avatar_url,
    }

@app.post("/auth/logout")
def logout(request: Request):
    request.session.clear()
    return {"ok": True}

@app.get("/api/weeks")
def get_weeks(user: User = Depends(current_user), db: Session = Depends(get_db)):
    saved = db.scalars(select(TaskProgress).where(TaskProgress.user_id == user.id)).all()
    checked_by_key = {item.task_key: item.checked for item in saved}
    result = []
    for week in WEEKS:
        tasks = []
        for key, title, detail in week["tasks"]:
            tasks.append({
                "key": key,
                "title": title,
                "detail": detail,
                "checked": checked_by_key.get(key, False),
            })
        completed = sum(1 for task in tasks if task["checked"])
        result.append({
            "week": week["week"],
            "title": week["title"],
            "focus": week["focus"],
            "tasks": tasks,
            "completed": completed,
            "total": len(tasks),
        })
    return {"weeks": result}

@app.patch("/api/progress/{task_key}")
def update_progress(
    task_key: str,
    payload: dict,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    known_keys = {task[0] for week in WEEKS for task in week["tasks"]}
    if task_key not in known_keys:
        raise HTTPException(status_code=404, detail="Checklist item not found.")
    checked = payload.get("checked")
    if not isinstance(checked, bool):
        raise HTTPException(status_code=422, detail="'checked' must be a boolean.")

    progress = db.scalar(
        select(TaskProgress).where(
            TaskProgress.user_id == user.id,
            TaskProgress.task_key == task_key,
        )
    )
    if progress is None:
        progress = TaskProgress(user_id=user.id, task_key=task_key, checked=checked)
        db.add(progress)
    else:
        progress.checked = checked
        progress.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"task_key": task_key, "checked": checked, "saved": True}
