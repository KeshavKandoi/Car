"use client";

import ChapterCanvas from "@/components/ChapterCanvas";
import FloatingLabel from "@/components/FloatingLabel";
import { useFloatingLabels, LabelDef } from "@/hooks/useFloatingLabels";

const LABELS: LabelDef[] = [
  { id: "disc", text: "Brake Disc", range: [0.15, 0.95], top: "42%", left: "48%" },
  { id: "caliper", text: "Caliper", range: [0.25, 0.95], top: "55%", left: "62%" },
  { id: "suspension", text: "Suspension", range: [0.35, 0.95], top: "20%", left: "58%" },
  { id: "tire", text: "Performance Tire", range: [0.45, 0.95], top: "75%", left: "30%" },
];

export default function BrakeSection() {
  const { handleProgress, activeIds, progress } = useFloatingLabels(LABELS);

  return (
    <ChapterCanvas chapter="brake" pinLengthVh={280} onProgress={handleProgress}>
      {/* Ember glow pulsing on the rotor once the section is mostly scrubbed through */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: "radial-gradient(circle at 50% 48%, rgba(255,106,61,0.22), transparent 45%)",
          opacity: Math.min(progress * 1.6, 0.9),
        }}
      />

      <div className="absolute left-6 top-1/4 max-w-sm md:left-14">
        <p className="chapter-eyebrow mb-3">Chassis &amp; Braking</p>
        <h2 className="chapter-headline text-3xl text-white md:text-4xl">
          Grip, control and confidence at every corner.
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
