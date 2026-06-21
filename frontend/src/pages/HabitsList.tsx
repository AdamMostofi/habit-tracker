import { useState, useEffect, useMemo } from "react"
import { motion, type Variants } from "motion/react"
import { habits } from "@/lib/api"
import type { Habit } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckInButton } from "@/components/CheckInButton"
import { DeleteHabitButton } from "@/components/DeleteHabitButton"
import { StreakBadge } from "@/components/StreakBadge"
import { Link } from "react-router-dom"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
}

const frequencyOrder = ["daily", "weekly", "monthly"] as const

const frequencyLabel: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
}

const badgeVariant: Record<string, "secondary" | "outline" | "ghost"> = {
  daily: "secondary",
  weekly: "outline",
  monthly: "ghost",
}

export function HabitsList() {
  const [habitsList, setHabitsList] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHabits = async () => {
    setError(null)
    try {
      const data = await habits.list()
      setHabitsList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits")
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchHabits().finally(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => {
    const groups: Record<string, Habit[]> = {}
    habitsList.forEach((habit) => {
      if (!groups[habit.frequency]) {
        groups[habit.frequency] = []
      }
      groups[habit.frequency].push(habit)
    })
    return groups
  }, [habitsList])

  const isError = !loading && error !== null
  const isEmpty = !loading && !error && habitsList.length === 0

  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">All Habits</h1>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-8">
          {[0, 1, 2].map((section) => (
            <div key={section}>
              <Skeleton className="mb-3 h-4 w-16 rounded-md" />
              <div className="space-y-3">
                {[0, 1].map((card) => (
                  <Skeleton key={card} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              fetchHabits().finally(() => setLoading(false))
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/50 p-12 text-center">
          <p className="text-sm text-muted-foreground">No habits yet</p>
          <Link
            to="/habits/new"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Create your first habit
          </Link>
        </div>
      )}

      {/* Grouped habits */}
      {!loading && !isError && !isEmpty && (
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {frequencyOrder.map((freq, idx) => {
            const items = grouped[freq]
            if (!items?.length) return null

            /* Alternate layout per section to avoid identical card grids */
            const useGrid = idx % 2 === 0

            return (
              <motion.div key={freq} variants={itemVariants}>
                <h2 className="mb-3 font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {frequencyLabel[freq]}
                </h2>
                <div
                  className={
                    useGrid
                      ? "grid grid-cols-1 gap-3 xl:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]"
                      : "space-y-3"
                  }
                >
                  {items.map((habit) => (
                    <motion.div
                      key={habit.hid}
                      variants={itemVariants}
                      whileHover={{ scale: 1.015 }}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-primary/20 hover:bg-card/80"
                    >
                      <Link
                        to={`/habits/${habit.hid}`}
                        className="min-w-0 flex-1 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-foreground">
                            {habit.name}
                          </p>
                          <Badge
                            variant={badgeVariant[habit.frequency]}
                            className="shrink-0"
                          >
                            {habit.frequency}
                          </Badge>
                        </div>
                        {habit.description && (
                          <p className="line-clamp-1 text-sm text-muted-foreground">
                            {habit.description}
                          </p>
                        )}
                        <StreakBadge habitId={habit.hid} count={habit.current_streak} />
                      </Link>
                      <div className="flex items-center gap-1">
                        <DeleteHabitButton
                          habitId={habit.hid}
                          habitName={habit.name}
                          onDeleted={() => {
                            setHabitsList((prev) => prev.filter((h) => h.hid !== habit.hid))
                          }}
                        />
                        <CheckInButton
                          habitId={habit.hid}
                          currentStatus={null}
                          onCheckIn={async () => {
                            /* CheckInButton already called habits.checkIn */
                            await fetchHabits()
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
