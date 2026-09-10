"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Props {
  value: number;
  /** Caption shown beneath the number, e.g. "PS" or "0–100 km/h" */
  label: string;
  /** Short unit glued immediately after the number, e.g. "s" in "4.1s" */
  unit?: string;
  /** 0–1 chapter progress; the counter starts animating once progress passes this. */
  triggerAt: number;
  progress: number;
  decimals?: number;
}

export default function AnimatedCounter({
  value,
  label,
  unit = "",
  triggerAt,
  progress,
  decimals = 0,
}: Props) {
  const [display, setDisplay] = useState(0);
  const hasFired = useRef(false);

  useEffect(() => {
    if (progress >= triggerAt && !hasFired.current) {
      hasFired.current = true;
      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => setDisplay(counter.n),
      });
    }
  }, [progress, triggerAt, value]);

  return (
    <div className="flex flex-col items-start">
      <span className="font-mono text-3xl font-medium text-white md:text-5xl">
        {display.toFixed(decimals)}
        {unit}
      </span>
      <span className="chapter-eyebrow mt-1">{label}</span>
    </div>
  );
}
