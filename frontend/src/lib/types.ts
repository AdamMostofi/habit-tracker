/** TypeScript interfaces matching backend Pydantic schemas */

export interface Habit {
  hid: number
  name: string
  description: string | null
  frequency: "daily" | "weekly" | "monthly"
}

export interface HabitCreate {
  name: string
  description?: string | null
  frequency: "daily" | "weekly" | "monthly"
}

export interface HabitLog {
  log_id: number
  hid: number
  user_id: number
  date: string
  status: "done" | "skip"
}

export interface HabitLogCreate {
  hid: number
  user_id: number
  date: string
  status: "done" | "skip"
}

export interface User {
  user_id: number
  username: string
}

export interface UserCreate {
  username: string
}
