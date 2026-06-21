import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowLeft, Loader2, CheckCircle2, MinusCircle } from "lucide-react"
import { toast } from "sonner"

import { habits } from "@/lib/api"
import type { Habit, HabitLog } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteHabitButton } from "@/components/DeleteHabitButton"
import { StreakBadge } from "@/components/StreakBadge"

export function HabitDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const habitId = Number(id)

  const [habit, setHabit] = useState<Habit | null>(null)
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setError(null)
    try {
      const [habitData, logsData] = await Promise.all([
        habits.get(habitId),
        habits.getLogs(habitId),
      ])
      setHabit(habitData)
      setLogs(logsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habit")
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchData().finally(() => setLoading(false))
  }, [habitId])

  /* Build a map of date → status for the calendar */
  const logMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const log of logs) {
      if (!map.has(log.date)) {
        map.set(log.date, log.status)
      }
    }
    return map
  }, [logs])

  /* Heatmap: 6-week grid ending at this week's Saturday */
  const calendarCells = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    /* Saturday of current week (getDay: 0=Sun, 6=Sat) */
    const saturday = new Date(today)
    const daysToSat = today.getDay() === 0 ? -1 : 6 - today.getDay()
    saturday.setDate(today.getDate() + daysToSat)

    const start = new Date(saturday)
    start.setDate(saturday.getDate() - 41)

    const cells: { day: number; dateStr: string; isToday: boolean }[] = []
    const cursor = new Date(start)

    while (cursor <= saturday) {
      const dateStr = cursor.toISOString().split("T")[0]
      const isToday = cursor.getTime() === today.getTime()
      cells.push({
        day: cursor.getDate(),
        dateStr,
        isToday,
      })
      cursor.setDate(cursor.getDate() + 1)
    }

    return cells
  }, [])

  /* Group cells into weeks for the grid */
  const weeks = useMemo(() => {
    const w: typeof calendarCells[] = []
    for (let i = 0; i < calendarCells.length; i += 7) {
      w.push(calendarCells.slice(i, i + 7))
    }
    return w
  }, [calendarCells])

  /* Build month labels for the header row */
  const monthLabels = useMemo(() => {
    const labels: { label: string; colSpan: number }[] = []
    let i = 0
    while (i < weeks.length) {
      const week = weeks[i]
      const firstDate = new Date(week[0]?.dateStr + "T00:00:00")
      const monthName = firstDate.toLocaleDateString("en-US", {
        month: "short",
      })
      let count = 1
      for (let j = i + 1; j < weeks.length; j++) {
        const nextDate = new Date(weeks[j][0].dateStr + "T00:00:00")
        if (
          nextDate.getMonth() === firstDate.getMonth() &&
          nextDate.getFullYear() === firstDate.getFullYear()
        ) {
          count++
        } else {
          break
        }
      }
      labels.push({ label: monthName, colSpan: count })
      i += count
    }
    return labels
  }, [weeks])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !habit) {
    return (
      <section className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {error || "Habit not found"}
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            Go home
          </Button>
        </div>
      </section>
    )
  }

  const recentLogs = logs.slice(0, 20)

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Back */}
      <Link
        to="/habits"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        All Habits
      </Link>

      {/* Habit card */}
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {habit.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{habit.frequency}</Badge>
              <StreakBadge habitId={habit.hid} count={habit.current_streak} />
            </div>
          </div>
        </div>

        {habit.description && (
          <p className="text-sm text-muted-foreground">{habit.description}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/habits/${habitId}/edit`)}
          >
            Edit
          </Button>
          <DeleteHabitButton
            habitId={habit.hid}
            habitName={habit.name}
            onDeleted={() => {
              toast.success("Habit deleted")
              navigate("/habits", { replace: true })
            }}
          />
        </div>
      </div>

      {/* Streak calendar — compact heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card/50 p-4 space-y-2"
      >
        {/* Month labels */}
        <div className="flex items-center gap-0.5">
          {monthLabels.map((m) => (
            <div
              key={m.label}
              style={{ width: `${m.colSpan * 28 + (m.colSpan - 1) * 2}px` }}
              className="text-[10px] font-mono font-medium text-muted-foreground/40 uppercase tracking-wider"
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Day-of-week header */}
        <div className="flex items-center gap-[2px] text-[9px] font-mono font-medium text-muted-foreground/30 uppercase tracking-wider">
          {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
            <div key={d} className="w-[26px] text-center">
              {d}
            </div>
          ))}
        </div>

        {/* Week rows */}
        <div className="space-y-[2px]">
          {weeks.map((week, wi) => (
            <motion.div
              key={wi}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: wi * 0.04 }}
              className="flex items-center gap-[2px]"
            >
              {week.map((cell) => {
                const status = logMap.get(cell.dateStr)
                let bg = "bg-transparent"
                if (status === "done") bg = "bg-primary"
                else if (status === "skip") bg = "bg-muted-foreground/20"
                else if (cell.isToday) bg = "bg-primary/30"

                return (
                  <div
                    key={cell.dateStr}
                    title={`${cell.dateStr}${status ? " — " + status : ""}`}
                    className={`w-[26px] h-[26px] rounded-[5px] ${bg} ${
                      cell.isToday ? "ring-1 ring-primary" : ""
                    } transition-colors duration-150`}
                  />
                )
              })}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span className="text-[10px] font-mono text-muted-foreground/40">Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/20" />
            <span className="text-[10px] font-mono text-muted-foreground/40">Skip</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-transparent border border-border/30" />
            <span className="text-[10px] font-mono text-muted-foreground/40">Missed</span>
          </div>
          {habit.current_streak > 0 && (
            <span className="ml-auto text-[10px] font-mono text-primary tabular-nums">
              🔥 {habit.current_streak}
            </span>
          )}
        </div>
      </motion.div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
        <h2 className="text-sm font-mono font-medium text-muted-foreground tracking-wider uppercase">
          Recent Activity
        </h2>

        {recentLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground/60 py-4 text-center">
            No check-ins yet
          </p>
        ) : (
          <div className="space-y-1.5">
            {recentLogs.map((log) => {
              const d = new Date(log.date + "T00:00:00")
              const label = d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
              const isDone = log.status === "done"
              return (
                <div
                  key={log.log_id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
                >
                  {isDone ? (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  ) : (
                    <MinusCircle className="size-4 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {label}
                  </span>
                  <span
                    className={
                      isDone
                        ? "text-xs font-medium text-primary"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {isDone ? "Done" : "Skipped"}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.section>
  )
}
