"use client";

import { useState } from "react";
import ChapterCanvas from "@/components/ChapterCanvas";
import AnimatedCounter from "@/components/AnimatedCounter";
import { SPECS } from "@/lib/constants";

export default function TunnelSection() {
  const [progress, setProgress] = useState(0);

  return (
    <ChapterCanvas chapter="tunnel" pinLengthVh={300} onProgress={setProgress}>
      {/* Horizontal light-streak overlay that intensifies with scroll progress,
          selling the sense of acceleration on top of the tunnel plate. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 40px,
            rgba(143,214,255,${0.05 + progress * 0.1}) 41px,
            transparent 42px
          )`,
          opacity: 0.6,
        }}
      />

      <div className="absolute left-6 top-1/4 max-w-sm md:left-14">
        <p className="chapter-eyebrow mb-3">Full Throttle</p>
      </div>

      <div className="absolute bottom-16 left-6 flex flex-wrap gap-10 md:left-14 md:gap-16">
        <AnimatedCounter
          value={SPECS.power.value}
          label={SPECS.power.label}
          triggerAt={0.2}
          progress={progress}
        />
        <AnimatedCounter
          value={SPECS.topSpeed.value}
          label={SPECS.topSpeed.label}
          triggerAt={0.4}
          progress={progress}
        />
        <AnimatedCounter
          value={SPECS.sprint.value}
          label={SPECS.sprint.label}
          unit={SPECS.sprint.suffix}
          triggerAt={0.6}
          progress={progress}
          decimals={1}
        />
      </div>
    </ChapterCanvas>
  );
}
