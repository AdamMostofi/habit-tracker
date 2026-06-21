"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Circle, CheckCircle2, Minus } from "lucide-react";
import { habits } from "@/lib/api";
import type { HabitLogCreate } from "@/lib/types";

type CheckInStatus = "done" | "skip";

interface CheckInButtonProps {
  habitId: number;
  currentStatus?: CheckInStatus | null;
  onCheckIn: (status: CheckInStatus) => void;
}

type AnimationState = "idle" | "pulse" | "shake";

const stateStyles = {
  unchecked:
    "border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  done: "bg-primary text-primary-foreground",
  skip: "bg-muted text-muted-foreground",
} as const;

export function CheckInButton({
  habitId,
  currentStatus,
  onCheckIn,
}: CheckInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState<AnimationState>("idle");

  useEffect(() => {
    if (animation === "idle") return;
    const timer = setTimeout(() => setAnimation("idle"), 600);
    return () => clearTimeout(timer);
  }, [animation]);

  const handleClick = useCallback(async () => {
    if (loading) return;

    const nextStatus: CheckInStatus =
      currentStatus === "done" ? "skip" : "done";

    setLoading(true);
    try {
      const payload: HabitLogCreate = {
        hid: habitId,
        user_id: 1,
        date: new Date().toISOString().split("T")[0],
        status: nextStatus,
      };
      await habits.checkIn(habitId, payload);

      setAnimation("pulse");
      onCheckIn(nextStatus);
    } catch {
      setAnimation("shake");
      toast.error("Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [habitId, currentStatus, loading, onCheckIn]);

  const isDone = currentStatus === "done";
  const isSkip = currentStatus === "skip";
  const stateClass = isDone
    ? stateStyles.done
    : isSkip
      ? stateStyles.skip
      : stateStyles.unchecked;

  const shakeX = [0, -4, 4, -4, 4, -2, 2, 0];
  const pulseScale = [1, 1.2, 0.95, 1.05, 1];

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      animate={
        animation === "shake"
          ? { x: shakeX, boxShadow: "0 0 0px transparent" }
          : animation === "pulse"
            ? {
                scale: pulseScale,
                boxShadow: [
                  "0 0 0px var(--glow)",
                  "0 0 14px var(--glow)",
                  "0 0 6px var(--glow)",
                  "0 0 0px var(--glow)",
                ],
              }
            : { scale: 1, boxShadow: "0 0 0px transparent" }
      }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.6,
      }}
      whileTap={{ scale: 0.92 }}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors duration-150 ${stateClass} ${
        loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
      aria-label={
        loading
          ? "Checking in…"
          : isDone
            ? "Mark as skipped"
            : isSkip
              ? "Mark as done"
              : "Check in"
      }
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : isDone ? (
        <CheckCircle2 className="size-4" />
      ) : isSkip ? (
        <Minus className="size-4 stroke-[2.5]" />
      ) : (
        <Circle className="size-4" />
      )}
    </motion.button>
  );
}
