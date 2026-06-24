# Habit Tracker

Full-stack habit tracker. Track daily, weekly, and monthly habits. Check in, build streaks, see your stats.

Dark cinematic UI with green accent, terminal-precision typography, and purposeful motion. Practice-what-you-build architecture: TypeScript, linted, committed per vertical slice.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12 + FastAPI 0.115 |
| Database | SQLite (SQLAlchemy 2.0 ORM) |
| API Schemas | Pydantic 2.9 |
| Frontend | React 19 + Vite 8 + TypeScript 6 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | motion 12 (motion.dev) |
| Icons | lucide-react |
| Fonts | Geist Variable + JetBrains Mono |

## Quick Start

### Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate    # Windows

pip install -r requirements.txt

uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs (Swagger) or http://localhost:8000/redoc (ReDoc).

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Opens at http://localhost:5173.

## Project Structure

```
habit-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point, CORS, middleware
│   │   ├── database.py       # SQLite + SQLAlchemy setup
│   │   ├── models.py         # Table models
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   └── routers/
│   │       ├── habits.py     # Habit CRUD, check-in, time views, stats
│   │       └── users.py      # User CRUD
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/            # TodayView, HabitsList, HabitDetail,
│   │   │                     # CreateHabit, EditHabit, Analytics
│   │   ├── components/       # Sidebar, CheckInButton, DeleteHabitButton,
│   │   │                     # StreakBadge, ui/ (shadcn primitives)
│   │   ├── lib/              # api.ts, types.ts, utils.ts
│   │   ├── App.tsx           # Router + layout + page transitions
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Tailwind + OKLCH theme variables
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.js
├── docs/
│   ├── adr/                  # Architecture Decision Records
│   ├── backlog.md            # Security audit, polish items
│   ├── ideas.md              # Future UI ideas
│   └── motion-feature-audit.md
├── CONTEXT.md                # Domain glossary
├── PRODUCT.md                # Product vision, brand, design principles
└── ph1-design.excalidraw     # System design sketch
```

## Database Schema

```
users:         user_id (PK), username
habits:        hid (PK), name, description, frequency (daily/weekly/monthly)
habit_logs:    log_id (PK), hid (FK), user_id (FK), date, status (done/skip)
user_habits:   user_id (FK), hid (FK)   many-to-many join
```

Streaks are calculated from the habit_logs table, not stored.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/habits/` | List all habits (with streaks) |
| POST | `/habits/` | Create a habit |
| GET | `/habits/today` | Daily habits for today |
| GET | `/habits/weekly` | Weekly habits this week |
| GET | `/habits/monthly` | Monthly habits this month |
| GET | `/habits/stats` | Dashboard stats (streaks, rates, weekly summary) |
| GET | `/habits/{id}` | Get habit detail |
| PUT | `/habits/{id}` | Update a habit |
| DELETE | `/habits/{id}` | Delete a habit |
| POST | `/habits/{id}/log` | Check in (done / skip) |
| GET | `/habits/{id}/logs` | Check-in history for a habit |
| POST | `/users/` | Create a user |
| GET | `/users/` | List all users |
| DELETE | `/users/{id}` | Delete a user |

## Design System

Sharp, cinematic, dev-tool inspired. Dark theme with green accent, respects
`prefers-color-scheme`. Layout uses monospace for data, clean sans for UI.
Motion is purposeful (page transitions, check-in feedback), not decorative.
WCAG AA contrast. Respects `prefers-reduced-motion`.

## Development

Built in vertical slices. Each feature goes through design (Excalidraw),
pseudocode, implementation, then commit. The project is a deliberate exercise
in full-stack architecture — backend-first, then the frontend on top of a
stable API.

## Docs

- **CONTEXT.md** — Domain glossary (Habit, Check-in, Streak, Frequency, Slice)
- **PRODUCT.md** — Product vision, brand, design principles
- **docs/adr/** — Architecture Decision Records
- **docs/backlog.md** — Security audit findings, polish backlog
