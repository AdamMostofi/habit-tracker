"""FastAPI app entry point for Habit Tracker."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import habits, users

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habits.router, prefix="/habits", tags=["habits"])
app.include_router(users.router, prefix="/users", tags=["users"])


@app.get("/")
def root():
    return {"message": "Habit Tracker API"}
