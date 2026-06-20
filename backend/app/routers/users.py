"""User endpoints.

Endpoints:
  POST /users/       Create a user
  GET  /users/       List all users
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.schemas import UserCreate, UserResponse

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    pass  # ← YOU write this


@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    pass  # ← YOU write this
