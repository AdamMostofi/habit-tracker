import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { habits } from "@/lib/api"
import type { DashboardStats } from "@/lib/types"
import { relativeDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { StreakBadge } from "@/components/StreakBadge"
import {
  BarChart3,
  Target,
  Flame,
  CheckCircle2,
} from "lucide-react"

const statCards = [
  {
    key: "total_habits" as const,
    label: "Total Habits",
    icon: Target,
    iconClass: "text-primary",
  },
  {
    key: "total_checkins" as const,
    label: "Total Check-ins",
    icon: CheckCircle2,
    iconClass: "text-primary",
  },
  {
    key: "best_streak" as const,
    label: "Best Streak",
    icon: Flame,
    iconClass: "text-primary",
  },
]

export function Analytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    habits
      .stats()
      .then(setStats)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load stats"),
      )
      .finally(() => setLoading(false))
  }, [])

  const maxWeekly = useMemo(
    () => Math.max(...(stats?.weekly_summary.map((w) => w.done) ?? [1]), 1),
    [stats],
  )

  if (loading) {
    return (
      <section>
        <h1 className="text-3xl font-semibold tracking-tight mb-8">
          Analytics
        </h1>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h1 className="text-3xl font-semibold tracking-tight mb-8">
          Analytics
        </h1>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              habits
                .stats()
                .then(setStats)
                .catch((err) =>
                  setError(err instanceof Error ? err.message : "Failed to load stats"),
                )
                .finally(() => setLoading(false))
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (!stats) return null

  const statValues = {
    total_habits: stats.total_habits,
    total_checkins: stats.total_checkins,
    best_streak: stats.best_streak,
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
          <BarChart3 className="size-6 text-primary" />
          Analytics
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => {
          const value = statValues[card.key]
          const Icon = card.icon
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card/50 p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className={`size-4 ${card.iconClass}`} />
                <span className="font-mono text-xs tracking-wider uppercase">
                  {card.label}
                </span>
              </div>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
            </motion.div>
          )
        })}
      </div>

      {stats.habits.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/50 p-12 text-center">
          <BarChart3 className="size-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Create some habits to see analytics
          </p>
          <Link
            to="/habits/new"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Create a habit
          </Link>
        </div>
      ) : (
        <>
          {/* Weekly activity bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-xl border border-border bg-card/50 p-5 mb-6 space-y-4"
          >
            <h2 className="text-sm font-mono font-medium text-muted-foreground tracking-wider uppercase flex items-center gap-2">
              <BarChart3 className="size-3.5" />
              Weekly Activity
            </h2>

            <div className="flex items-end gap-2 h-32">
              {stats.weekly_summary.map((week, i) => {
                const height =
                  week.done === 0
                    ? 4
                    : Math.max(8, (week.done / maxWeekly) * 100)
                return (
                  <div
                    key={week.label}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground/50 tabular-nums">
                      {week.done}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.04,
                        ease: "easeOut",
                      }}
                      className={`w-full max-w-[32px] rounded-t-sm ${
                        week.done > 0
                          ? "bg-primary/70"
                          : "bg-muted-foreground/10"
                      }`}
                    />
                    <span className="text-[9px] font-mono text-muted-foreground/30 leading-none mt-auto">
                      {week.label.replace("W", "")}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Per-habit breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-xl border border-border bg-card/50 p-5 space-y-4"
          >
            <h2 className="text-sm font-mono font-medium text-muted-foreground tracking-wider uppercase">
              Per Habit
            </h2>

            <div className="space-y-2">
              {stats.habits.map((h, i) => (
                  <motion.div
                    key={h.hid}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.06 }}
                  className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/30 p-3"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {h.name}
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">
                        {h.frequency}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StreakBadge habitId={h.hid} count={h.current_streak} />
                      <span className="text-[11px] font-mono text-muted-foreground/50 tabular-nums">
                        Best: {h.best_streak}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground/30 tabular-nums">
                        last {relativeDate(h.last_check_in)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${Math.min(h.completion_rate_7, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-muted-foreground/70 w-8 text-right">
                          {h.completion_rate_7}%
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-wider">
                        7 day
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/50 transition-all duration-500"
                            style={{ width: `${Math.min(h.completion_rate_30, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-muted-foreground/70 w-8 text-right">
                          {h.completion_rate_30}%
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-wider">
                        30 day
                      </span>
                    </div>

                    <div className="text-right min-w-[40px]">
                      <p className="text-sm font-mono tabular-nums text-foreground">
                        {h.total_checkins}
                      </p>
                      <span className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-wider">
                        done
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  )
}
