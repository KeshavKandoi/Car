"use client";

import { LabelDef } from "@/hooks/useFloatingLabels";

interface Props {
  label: LabelDef;
  active: boolean;
  /** Direction the connector line points, so it reads as "leader line to a point on the car." */
  lineDirection?: "left" | "right";
}

export default function FloatingLabel({ label, active, lineDirection = "right" }: Props) {
  return (
    <div
      className="absolute flex items-center gap-3 transition-all duration-700 ease-cinematic"
      style={{
        top: label.top,
        left: label.left,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {lineDirection === "left" && (
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-carrera-glow/70" />
      )}
      <span className="chapter-eyebrow whitespace-nowrap rounded-sm border border-carrera-glow/25 bg-studio-panel/60 px-2 py-1 backdrop-blur-sm">
        {label.text}
      </span>
      {lineDirection === "right" && (
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-carrera-glow/70" />
      )}
    </div>
  );
}
