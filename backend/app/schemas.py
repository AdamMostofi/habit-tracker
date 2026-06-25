"""Pydantic schemas for request/response validation."""

from datetime import date
from typing import Literal
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str


class UserResponse(BaseModel):
    user_id: int
    username: str

    class Config:
        from_attributes = True


class HabitCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    frequency: Literal["daily", "weekly", "monthly"] = "daily"


class HabitResponse(BaseModel):
    hid: int
    name: str
    description: str | None = None
    frequency: str
    current_streak: int = 0
    last_check_in: date | None = None

    class Config:
        from_attributes = True


class HabitLogCreate(BaseModel):
    hid: int
    user_id: int
    date: date
    status: Literal["done", "skip"]


class HabitLogResponse(BaseModel):
    log_id: int
    hid: int
    user_id: int
    date: date
    status: str

    class Config:
        from_attributes = True


class HabitStatsItem(BaseModel):
    hid: int
    name: str
    frequency: str
    current_streak: int
    best_streak: int
    total_checkins: int
    completion_rate_7: float
    completion_rate_30: float
    last_check_in: date | None = None


class WeekSummary(BaseModel):
    label: str
    done: int


class DashboardStats(BaseModel):
    total_habits: int
    total_checkins: int
    best_streak: int
    habits: list[HabitStatsItem]
    weekly_summary: list[WeekSummary]
