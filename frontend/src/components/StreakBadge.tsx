"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "motion/react";

interface StreakBadgeProps {
  habitId: number;
  count: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    stiffness: 180,
    damping: 28,
    mass: 0.4,
  });
  const [display, setDisplay] = useState(value);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <span>{display}</span>;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-muted-foreground tabular-nums">
        —
      </span>
    );
  }

  return (
    <motion.span
      layout
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-xs tabular-nums ${
        count >= 3
          ? "bg-primary/10 text-primary"
          : "bg-primary/10 text-muted-foreground"
      }`}
    >
      <span className="text-[0.65rem] leading-none">🔥</span>
      <AnimatedNumber value={count} />
      <span className="leading-none">day{count !== 1 ? "s" : ""}</span>
    </motion.span>
  );
}
