"""Pydantic schemas for request/response validation."""

from datetime import date
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str


class UserResponse(BaseModel):
    user_id: int
    username: str

    class Config:
        from_attributes = True


class HabitCreate(BaseModel):
    name: str
    description: str | None = None


class HabitResponse(BaseModel):
    hid: int
    name: str
    description: str | None = None

    class Config:
        from_attributes = True


class HabitLogCreate(BaseModel):
    hid: int
    user_id: int
    date: date
    status: str  # "done" or "skip"


class HabitLogResponse(BaseModel):
    log_id: int
    hid: int
    user_id: int
    date: date
    status: str

    class Config:
        from_attributes = True
