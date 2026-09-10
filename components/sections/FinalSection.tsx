"use client";

import ChapterCanvas from "@/components/ChapterCanvas";

export default function FinalSection() {
  return (
    <ChapterCanvas chapter="final" pinLengthVh={220} className="scroll-mt-0" >
      <div id="final" className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <h2 className="chapter-headline text-5xl text-white md:text-7xl">
          Every curve has a purpose.
        </h2>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-carrera-glow px-8 py-3 font-body text-sm font-semibold text-studio transition-transform duration-300 ease-cinematic hover:scale-105">
            Explore the 911
          </button>
          <button className="rounded-full border border-white/30 px-8 py-3 font-body text-sm font-semibold text-white transition-colors duration-300 hover:border-carrera-glow hover:text-carrera-glow">
            Configure Your Drive
          </button>
        </div>
      </div>
    </ChapterCanvas>
  );
}
