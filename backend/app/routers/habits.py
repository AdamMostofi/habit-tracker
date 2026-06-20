"""Habit CRUD + check-in endpoints."""

from fastapi import APIRouter, Depends, HTTPException
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
    pass  # TODO: implement


@router.post("/", response_model=HabitResponse)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    pass  # TODO: implement


@router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    pass  # TODO: implement


@router.post("/{habit_id}/log", response_model=HabitLogResponse)
def check_in(habit_id: int, log: HabitLogCreate, db: Session = Depends(get_db)):
    pass  # TODO: implement

# here is the pseducode of the routes that i want to implement in the above code snippet
"""
ok so we have a edit a habit where we can change the description name and tracker duration so is it on certain days or only weekly or daily or monthly here we use put method to update the habit and we can also delete a habit using the delete method
"""
"""
then we have the route that lets me see todays habits and we can also select which days habits i want to see  here we get method

and then a route that lets me seee this weeks habit we can also select which weeks habits i want to see here we get method

and then we have a route that lets me see this months habits also we can select what months habits i want to see here we get method
"""

"""
then i want a route that lets me check or mark a habit a done or skipped or paused as in put on hold here we use the post method 
"""

"""
then i want make a route to let me create a user , here we use the post method 

then i want a route to let me login a user , here we use the post method 
"""

"""
then finally i want a route that lets me see all users using the get method 

also a route to delete a user using the delete method
"""