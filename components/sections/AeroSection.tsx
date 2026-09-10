"use client";

import ChapterCanvas from "@/components/ChapterCanvas";

export default function AeroSection() {
  return (
    <ChapterCanvas chapter="aero" pinLengthVh={260}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        {[160, 220, 280, 340].map((y, i) => (
          <path
            key={y}
            d={`M -50 ${y} C 250 ${y - 60}, 650 ${y - 40}, 1050 ${y + 10}`}
            fill="none"
            stroke="#8FD6FF"
            strokeOpacity={0.35 - i * 0.05}
            strokeWidth={1.5}
            strokeDasharray="60 240"
            className="animate-[airflow_3.2s_linear_infinite]"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>

      <div className="absolute bottom-16 left-6 max-w-sm md:left-14">
        <p className="chapter-eyebrow mb-3">Aerodynamics</p>
        <h2 className="chapter-headline text-3xl text-white md:text-4xl">
          Airflow shaped for stability.
        </h2>
      </div>

      <style>{`
        @keyframes airflow {
          to { stroke-dashoffset: -900; }
        }
      `}</style>
    </ChapterCanvas>
  );
}
