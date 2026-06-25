/** TypeScript interfaces matching backend Pydantic schemas */

export interface Habit {
  hid: number
  name: string
  description: string | null
  frequency: "daily" | "weekly" | "monthly"
  current_streak: number
  last_check_in: string | null
}

export interface HabitCreate {
  name: string
  description?: string | null
  frequency: "daily" | "weekly" | "monthly"
}

export interface HabitLog {
  log_id: number
  hid: number
  date: string
  status: "done" | "skip"
}

export interface HabitLogCreate {
  hid: number
  date: string
  status: "done" | "skip"
}

export interface HabitStatsItem {
  hid: number
  name: string
  frequency: string
  current_streak: number
  best_streak: number
  total_checkins: number
  completion_rate_7: number
  completion_rate_30: number
  last_check_in: string | null
}

export interface WeekSummary {
  label: string
  done: number
}

export interface DashboardStats {
  total_habits: number
  total_checkins: number
  best_streak: number
  habits: HabitStatsItem[]
  weekly_summary: WeekSummary[]
}
