/** API client — typed fetch wrapper for all backend endpoints */

const API_BASE = "http://localhost:8000"

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "Unknown error")
    throw new Error(`${res.status} ${msg}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

import type {
  Habit,
  HabitCreate,
  HabitLog,
  HabitLogCreate,
  User,
  UserCreate,
} from "./types"

/* ── Habits ── */

export const habits = {
  list: () => request<Habit[]>("GET", "/habits/"),
  create: (data: HabitCreate) => request<Habit>("POST", "/habits/", data),
  update: (id: number, data: HabitCreate) =>
    request<Habit>("PUT", `/habits/${id}`, data),
  delete: (id: number) => request<void>("DELETE", `/habits/${id}`),
  today: (date?: string) =>
    request<Habit[]>("GET", `/habits/today${date ? `?date=${date}` : ""}`),
  weekly: () => request<Habit[]>("GET", "/habits/weekly"),
  monthly: () => request<Habit[]>("GET", "/habits/monthly"),
  checkIn: (id: number, data: HabitLogCreate) =>
    request<HabitLog>("POST", `/habits/${id}/log`, data),
}

/* ── Users ── */

export const users = {
  create: (data: UserCreate) => request<User>("POST", "/users/", data),
  list: () => request<User[]>("GET", "/users/"),
  delete: (id: number) => request<void>("DELETE", `/users/${id}`),
}
