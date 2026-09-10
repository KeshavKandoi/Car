"use client";

import ChapterCanvas from "@/components/ChapterCanvas";
import FloatingLabel from "@/components/FloatingLabel";
import { useFloatingLabels, LabelDef } from "@/hooks/useFloatingLabels";

const LABELS: LabelDef[] = [
  { id: "roofline", text: "Roofline", range: [0.15, 0.95], top: "22%", left: "38%" },
  { id: "headlights", text: "Headlights", range: [0.2, 0.95], top: "40%", left: "14%" },
  { id: "wheelbase", text: "Wheelbase", range: [0.3, 0.95], top: "72%", left: "45%" },
  { id: "spoiler", text: "Rear Spoiler", range: [0.4, 0.95], top: "30%", left: "80%" },
];

export default function ExteriorSection() {
  const { handleProgress, activeIds } = useFloatingLabels(LABELS);

  return (
    <ChapterCanvas chapter="exterior" pinLengthVh={280} onProgress={handleProgress}>
      <div className="absolute left-6 top-1/3 max-w-xs md:left-14">
        <p className="chapter-eyebrow mb-3">Silhouette</p>
        <h2 className="chapter-headline text-3xl text-white md:text-4xl">
          An unmistakable shape refined over generations.
        </h2>
      </div>

      {LABELS.map((label, i) => (
        <FloatingLabel
          key={label.id}
          label={label}
          active={activeIds.has(label.id)}
          lineDirection={i % 2 === 0 ? "left" : "right"}
        />
      ))}
    </ChapterCanvas>
  );
}
