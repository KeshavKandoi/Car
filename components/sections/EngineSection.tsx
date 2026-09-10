"use client";

import { useState } from "react";
import ChapterCanvas from "@/components/ChapterCanvas";
import AnimatedCounter from "@/components/AnimatedCounter";
import { SPECS } from "@/lib/constants";

export default function EngineSection() {
  const [progress, setProgress] = useState(0);

  return (
    <ChapterCanvas chapter="engine" pinLengthVh={300} onProgress={setProgress}>
      {/* Heat shimmer + blue glow overlay — CSS stand-in for the x-ray/engine reveal
          described in the brief; the underlying plate already carries a warm rear-body glow. */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 62%, rgba(79,166,224,0.28), transparent 55%)",
          opacity: Math.min(progress * 2, 1),
        }}
      />

      <div className="absolute left-6 top-1/4 max-w-sm md:left-14">
        <p className="chapter-eyebrow mb-3">Rear-Mounted Flat-Six</p>
        <h2 className="chapter-headline text-3xl text-white md:text-4xl">
          The heart still beats at the rear.
        </h2>
      </div>

      <div className="absolute bottom-16 left-6 flex gap-10 md:left-14 md:gap-16">
        <AnimatedCounter
          value={SPECS.power.value}
          label={SPECS.power.label}
          triggerAt={0.35}
          progress={progress}
        />
        <AnimatedCounter
          value={SPECS.torque.value}
          label={SPECS.torque.label}
          triggerAt={0.45}
          progress={progress}
        />
        <AnimatedCounter
          value={SPECS.sprint.value}
          label={SPECS.sprint.label}
          unit={SPECS.sprint.suffix}
          triggerAt={0.55}
          progress={progress}
          decimals={1}
        />
      </div>
    </ChapterCanvas>
  );
}
