"use client";

import { ReactNode } from "react";
import { ChapterId } from "@/lib/constants";
import { useScrollFrameSequence } from "@/hooks/useScrollFrameSequence";

interface Props {
  chapter: ChapterId;
  pinLengthVh?: number;
  onProgress?: (progress: number) => void;
  /** Overlay content (copy, labels, counters) rendered above the canvas, inside the pinned frame. */
  children?: ReactNode;
  className?: string;
}

/**
 * The single building block every section is made of: a pinned viewport
 * with a canvas that scrubs through that chapter's pre-sliced WebP frames
 * as the user scrolls, plus a slot for the copy/labels/counters layered on top.
 */
export default function ChapterCanvas({
  chapter,
  pinLengthVh = 300,
  onProgress,
  children,
  className = "",
}: Props) {
  const { sectionRef, canvasRef, isReady } = useScrollFrameSequence(chapter, {
    pinLengthVh,
    onProgress,
  });

  return (
    <section
      ref={sectionRef}
      className={`relative h-screen w-full overflow-hidden bg-studio ${className}`}
      data-chapter={chapter}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Vignette: keeps focus on the car, matches the "dark premium studio" brief */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(8,9,11,0.55) 100%)",
        }}
      />

      {/* Fallback: if frames failed to decode, show a flat studio-black plate rather than a broken canvas */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-studio">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-carrera-glow/30 border-t-carrera-glow" />
        </div>
      )}

      <div className="relative z-10 h-full w-full">{children}</div>
    </section>
  );
}
