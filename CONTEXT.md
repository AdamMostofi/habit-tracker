# Domain Glossary

## Core Concepts

| Term | Definition |
|------|-----------|
| **Habit** | A tracked behavior with a name, optional description, and frequency (daily/weekly/monthly) |
| **Check-in** | Logging completion or skip of a habit for a specific date |
| **Streak** | Consecutive "done" check-ins without a gap (calculated from HabitLog, not stored) |
| **Frequency** | How often a habit repeats: daily, weekly, or monthly |
| **Slice** | A vertical feature slice: design → pseudocode → implement → commit |

## Technical

| Term | Definition |
|------|-----------|
| **User** | An authenticated person using the tracker (identified by username for now, no auth) |
| **HabitLog** | A single check-in record: habit ID, user ID, date, status (done/skip) |
| **UserHabit** | Join table linking users to habits (many-to-many) |
