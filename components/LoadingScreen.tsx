"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen({ done }: { done: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  // Cosmetic progress creep so the bar always feels alive, even before real
  // frame-load events land — then snaps to 100 the moment `done` flips true.
  useEffect(() => {
    if (done) {
      gsap.to({ p: progress }, {
        p: 100,
        duration: 0.4,
        onUpdate: function () {
          setProgress(this.targets()[0].p);
        },
        onComplete: () => {
          setTimeout(() => setHidden(true), 350);
        },
      });
      return;
    }
    const id = setInterval(() => {
      setProgress((p) => (p < 88 ? p + (88 - p) * 0.06 : p));
    }, 120);
    return () => clearInterval(id);
  }, [done, progress]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-studio transition-opacity duration-500"
      style={{ opacity: done && progress >= 99.5 ? 0 : 1 }}
      aria-hidden={done}
    >
      <p className="chapter-eyebrow mb-6">911 Carrera</p>
      <div className="h-px w-56 overflow-hidden bg-studio-line">
        <div
          className="h-full bg-carrera-glow transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 font-mono text-xs text-steel-500">{Math.round(progress)}%</p>
    </div>
  );
}
