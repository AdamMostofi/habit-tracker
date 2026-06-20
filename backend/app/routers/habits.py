"""Habit CRUD + check-in endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Habit, HabitLog
from app.schemas import HabitCreate, HabitResponse, HabitLogCreate, HabitLogResponse

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[HabitResponse])
def list_habits(db: Session = Depends(get_db)):
    habits = db.query(Habit).all()
    return habits


@router.post("/", response_model=HabitResponse)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    new_habit = Habit(
        name=habit.name,
        description=habit.description,
        frequency=habit.frequency,
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(habit_id: int, habit: HabitCreate, db: Session = Depends(get_db)):
    db_habit = db.query(Habit).filter(Habit.hid == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db_habit.name = habit.name
    db_habit.description = habit.description
    db_habit.frequency = habit.frequency
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.hid == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()


@router.get("/today", response_model=list[HabitResponse])
def today_habits(
    date: str | None = Query(None, description="Date YYYY-MM-DD (defaults to today)"),
    db: Session = Depends(get_db),
):
    return db.query(Habit).filter(Habit.frequency == "daily").all()


@router.get("/weekly", response_model=list[HabitResponse])
def weekly_habits(db: Session = Depends(get_db)):
    return db.query(Habit).filter(Habit.frequency == "weekly").all()


@router.get("/monthly", response_model=list[HabitResponse])
def monthly_habits(db: Session = Depends(get_db)):
    return db.query(Habit).filter(Habit.frequency == "monthly").all()


@router.post("/{habit_id}/log", response_model=HabitLogResponse)
def check_in(habit_id: int, log: HabitLogCreate, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.hid == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    log_entry = HabitLog(
        hid=habit_id,
        user_id=log.user_id,
        date=log.date,
        status=log.status,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
