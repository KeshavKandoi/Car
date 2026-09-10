"use client";

import ChapterCanvas from "@/components/ChapterCanvas";

export default function HeroSection() {
  return (
    <ChapterCanvas chapter="hero" pinLengthVh={220}>
      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <p className="chapter-eyebrow mb-5 animate-[fadeIn_1.2s_ease-cinematic]">
          Sky Blue · Rear-Engine · Naturally Balanced
        </p>
        <h1 className="chapter-headline text-6xl text-white md:text-8xl lg:text-[9rem]">
          911 Carrera
        </h1>
        <p className="mt-6 max-w-md font-body text-base text-steel-300 md:text-lg">
          Born from heritage. Engineered for speed.
        </p>
      </div>

      {/* Minimal animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-70">
        <span className="chapter-eyebrow">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-steel-700">
          <span className="block h-4 w-px animate-[scrollDown_1.8s_ease-in-out_infinite] bg-carrera-glow" />
        </span>
      </div>

      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(250%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ChapterCanvas>
  );
}
