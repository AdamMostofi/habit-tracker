"""FastAPI app entry point for Habit Tracker."""

from fastapi import FastAPI
from app.database import engine, Base
from app.routers import habits, users

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker", version="0.1.0")

app.include_router(habits.router, prefix="/habits", tags=["habits"])
app.include_router(users.router, prefix="/users", tags=["users"])


@app.get("/")
def root():
    return {"message": "Habit Tracker API"}
