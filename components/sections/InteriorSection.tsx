"use client";

import { useState } from "react";
import ChapterCanvas from "@/components/ChapterCanvas";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function InteriorSection() {
  const [progress, setProgress] = useState(0);

  return (
    <ChapterCanvas chapter="interior" pinLengthVh={260} onProgress={setProgress}>
      <div className="absolute left-6 top-1/4 max-w-sm md:left-14">
        <p className="chapter-eyebrow mb-3">Cockpit</p>
        <h2 className="chapter-headline text-3xl text-white md:text-4xl">
          Everything revolves around the driver.
        </h2>
      </div>

      <div className="absolute bottom-16 right-6 md:right-14">
        <AnimatedCounter
          value={100}
          label="km/h · Digital Cluster"
          triggerAt={0.2}
          progress={progress}
        />
      </div>
    </ChapterCanvas>
  );
}
