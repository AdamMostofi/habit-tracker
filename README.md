# Habit Tracker

A full-stack habit tracking app built for learning — Python, FastAPI, SQL, and React.

> **Purpose:** This project exists solely for me to learn backend development,
> database design, API architecture, and frontend integration.
> Every feature is a vertical slice designed → pseudocoded → implemented → committed.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python + FastAPI |
| Database | SQLite (SQLAlchemy ORM) |
| Frontend | React (coming in Slice 2) |
| CI/CD | GitHub Actions (coming) |

## Setup

### Prerequisites

- Python 3.12+
- Node.js (for frontend later)

### 1. Backend

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

### 2. Verify it works

```bash
# Create a user
curl -X POST http://localhost:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{"username": "adam"}'

# Create a habit
curl -X POST http://localhost:8000/habits/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Exercise", "description": "30 min run", "frequency": "daily"}'

# See today's habits
curl http://localhost:8000/habits/today

# Check in
curl -X POST http://localhost:8000/habits/1/log \
  -H "Content-Type: application/json" \
  -d '{"hid": 1, "user_id": 1, "date": "2026-06-20", "status": "done"}'
```

### 3. API Docs

Once the server is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## API Endpoints

### Habits

| Method | Path | Description |
|--------|------|-------------|
| GET | `/habits/` | List all habits |
| POST | `/habits/` | Create a habit |
| PUT | `/habits/{id}` | Update a habit |
| DELETE | `/habits/{id}` | Delete a habit |
| GET | `/habits/today` | Daily habits |
| GET | `/habits/weekly` | Weekly habits |
| GET | `/habits/monthly` | Monthly habits |
| POST | `/habits/{id}/log` | Check in (done/skip) |

### Users

| Method | Path | Description |
|--------|------|-------------|
| POST | `/users/` | Create a user |
| GET | `/users/` | List all users |
| DELETE | `/users/{id}` | Delete a user |

## Database Schema

```
users:         user_id (PK), username
habits:        hid (PK), name, description, frequency (daily/weekly/monthly)
habit_logs:    log_id (PK), hid (FK), user_id (FK), date, status (done/skip)
user_habits:   user_id (FK), hid (FK) — many-to-many join
```

## Project Structure

```
habit-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── database.py       # SQLite connection
│   │   ├── models.py         # SQLAlchemy table definitions
│   │   ├── schemas.py        # Pydantic request/response models
│   │   └── routers/
│   │       ├── habits.py     # Habit CRUD + check-in + time views
│   │       └── users.py      # User CRUD
│   └── requirements.txt
├── frontend/                  # React (next slice)
└── ph1-design.excalidraw      # System design sketch
```

## Learning Notes

- Streaks are **calculated** from HabitLog, not stored
- Frequency field determines which time view a habit appears in
- All patterns follow the 5 basic CRUD templates
- Per-feature commits for GitHub contribution graph

## Git Log

```
35bf6de chore: add pycache and db to gitignore
410467d feat: implement Slice 1 - habits CRUD + check-in + time views + users
09a8e2c feat: add frequency field to habit model
1de452b feat: add FastAPI project skeleton
ad96d03 feat: add preliminary excalidraw design
```
