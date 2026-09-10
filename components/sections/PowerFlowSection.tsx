"use client";

import ChapterCanvas from "@/components/ChapterCanvas";

export default function PowerFlowSection() {
  return (
    <ChapterCanvas chapter="powerflow" pinLengthVh={260}>
      {/* Energy-flow overlay: three glowing traces running rear-engine -> PDK -> wheels,
          looping continuously to read as "power flowing" rather than a single scroll-scrub. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4FA6E0" stopOpacity="0" />
            <stop offset="50%" stopColor="#8FD6FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#4FA6E0" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[220, 300, 380].map((y, i) => (
          <path
            key={y}
            d={`M 120 ${y} C 350 ${y}, 450 ${y - 20}, 620 ${y}`}
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth={2 + i * 0.5}
            strokeDasharray="140 400"
            className="animate-[flowDash_2.6s_linear_infinite]"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>

      <div className="absolute bottom-16 left-6 max-w-sm md:left-14">
        <p className="chapter-eyebrow mb-3">8-Speed PDK</p>
        <h2 className="chapter-headline text-3xl text-white md:text-4xl">
          PDK shifts without interrupting the flow of power.
        </h2>
      </div>

      <style>{`
        @keyframes flowDash {
          to { stroke-dashoffset: -540; }
        }
      `}</style>
    </ChapterCanvas>
  );
}
