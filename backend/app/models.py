"""SQLAlchemy models for Habit Tracker.

Tables: USER, HABIT, HABIT_LOG, JOINT (user-habit many-to-many)
"""

from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False, unique=True)
    # streak is calculated from HabitLog — not stored here


class Habit(Base):
    __tablename__ = "habits"

    hid = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(300), nullable=True)
    frequency = Column(String(20), nullable=False, default="daily")  # daily, weekly, monthly
    # streak is calculated from HabitLog — not stored here


class HabitLog(Base):
    __tablename__ = "habit_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    hid = Column(Integer, ForeignKey("habits.hid"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(10), nullable=False)  # "done" or "skip"
    # streak is calculated — not stored here


class UserHabit(Base):
    """JOINT table — which users have which habits (many-to-many)."""
    __tablename__ = "user_habits"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    hid = Column(Integer, ForeignKey("habits.hid"), primary_key=True)
