"""Habit CRUD + check-in endpoints."""

from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Habit, HabitLog
from app.schemas import (
    HabitCreate,
    HabitResponse,
    HabitLogCreate,
    HabitLogResponse,
    DashboardStats,
    HabitStatsItem,
    WeekSummary,
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def compute_streak(db: Session, habit_id: int) -> int:
    rows = (
        db.query(HabitLog.date)
        .filter(HabitLog.hid == habit_id, HabitLog.status == "done")
        .order_by(HabitLog.date.desc())
        .distinct()
        .all()
    )
    if not rows:
        return 0
    dates = [r.date for r in rows]
    streak = 1
    for i in range(len(dates) - 1):
        if dates[i] - dates[i + 1] == timedelta(days=1):
            streak += 1
        else:
            break
    return streak


def enrich_habit(db: Session, habit: Habit) -> HabitResponse:
    return HabitResponse(
        hid=habit.hid,
        name=habit.name,
        description=habit.description,
        frequency=habit.frequency,
        current_streak=compute_streak(db, habit.hid),
    )


def best_streak(db: Session, habit_id: int) -> int:
    rows = (
        db.query(HabitLog.date)
        .filter(HabitLog.hid == habit_id, HabitLog.status == "done")
        .order_by(HabitLog.date.asc())
        .distinct()
        .all()
    )
    if not rows:
        return 0
    dates = [r.date for r in rows]
    best = 1
    current = 1
    for i in range(1, len(dates)):
        if dates[i] - dates[i - 1] == timedelta(days=1):
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best


def completion_rate(db: Session, habit_id: int, days: int) -> float:
    since = date.today() - timedelta(days=days)
    count = (
        db.query(HabitLog)
        .filter(
            HabitLog.hid == habit_id,
            HabitLog.status == "done",
            HabitLog.date >= since,
        )
        .count()
    )
    return round((count / days) * 100, 1)


def weekly_done_counts(db: Session) -> list[WeekSummary]:
    """Return total 'done' check-ins per ISO week for the last 8 weeks."""
    rows = (
        db.query(HabitLog.date)
        .filter(HabitLog.status == "done")
        .order_by(HabitLog.date.asc())
        .all()
    )
    from collections import defaultdict

    week_map: dict[str, int] = defaultdict(int)
    for r in rows:
        iso_year, iso_week, _ = r.date.isocalendar()
        week_map[f"{iso_year}-W{iso_week:02d}"] += 1

    result: list[WeekSummary] = []
    today = date.today()
    for i in range(7, -1, -1):
        d = today - timedelta(weeks=i)
        iso_year, iso_week, _ = d.isocalendar()
        label = f"{iso_year}-W{iso_week:02d}"
        result.append(WeekSummary(label=label, done=week_map.get(label, 0)))
    return result


@router.get("/", response_model=list[HabitResponse])
def list_habits(db: Session = Depends(get_db)):
    habits = db.query(Habit).all()
    return [enrich_habit(db, h) for h in habits]


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
    return enrich_habit(db, new_habit)


@router.get("/today", response_model=list[HabitResponse])
def today_habits(
    date: str | None = Query(None, description="Date YYYY-MM-DD (defaults to today)"),
    db: Session = Depends(get_db),
):
    habits = db.query(Habit).filter(Habit.frequency == "daily").all()
    return [enrich_habit(db, h) for h in habits]


@router.get("/weekly", response_model=list[HabitResponse])
def weekly_habits(db: Session = Depends(get_db)):
    habits = db.query(Habit).filter(Habit.frequency == "weekly").all()
    return [enrich_habit(db, h) for h in habits]


@router.get("/monthly", response_model=list[HabitResponse])
def monthly_habits(db: Session = Depends(get_db)):
    habits = db.query(Habit).filter(Habit.frequency == "monthly").all()
    return [enrich_habit(db, h) for h in habits]


@router.get("/stats", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db)):
    all_habits = db.query(Habit).all()
    total_checkins = db.query(HabitLog).count()
    habit_stats: list[HabitStatsItem] = []
    best_overall = 0

    for h in all_habits:
        cs = compute_streak(db, h.hid)
        bs = best_streak(db, h.hid)
        tc = (
            db.query(HabitLog)
            .filter(HabitLog.hid == h.hid, HabitLog.status == "done")
            .count()
        )
        cr7 = completion_rate(db, h.hid, 7)
        cr30 = completion_rate(db, h.hid, 30)
        if cs > best_overall:
            best_overall = cs
        habit_stats.append(
            HabitStatsItem(
                hid=h.hid,
                name=h.name,
                frequency=h.frequency,
                current_streak=cs,
                best_streak=bs,
                total_checkins=tc,
                completion_rate_7=cr7,
                completion_rate_30=cr30,
            )
        )

    return DashboardStats(
        total_habits=len(all_habits),
        total_checkins=total_checkins,
        best_streak=best_overall,
        habits=habit_stats,
        weekly_summary=weekly_done_counts(db),
    )


@router.get("/{habit_id}", response_model=HabitResponse)
def get_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.hid == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return enrich_habit(db, habit)


@router.get("/{habit_id}/logs", response_model=list[HabitLogResponse])
def get_habit_logs(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.hid == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return (
        db.query(HabitLog)
        .filter(HabitLog.hid == habit_id)
        .order_by(HabitLog.date.desc())
        .all()
    )


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
    return enrich_habit(db, db_habit)


@router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.hid == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()


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
