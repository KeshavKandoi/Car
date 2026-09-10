"use client";

import { useMemo, useState, useCallback } from "react";

export interface LabelDef {
  id: string;
  text: string;
  /** [start, end] of chapter progress (0–1) during which this label is visible. */
  range: [number, number];
  /** Position as a percentage of the pinned viewport. */
  top: string;
  left: string;
}

/**
 * Given a set of label definitions with their own progress windows, returns
 * a stable `onProgress` handler plus the current set of visible label ids —
 * so a section only needs to spread {activeIds} into its <FloatingLabel/> list.
 */
export function useFloatingLabels(labels: LabelDef[]) {
  const [progress, setProgress] = useState(0);

  const handleProgress = useCallback((p: number) => setProgress(p), []);

  const activeIds = useMemo(
    () =>
      new Set(
        labels
          .filter((l) => progress >= l.range[0] && progress <= l.range[1])
          .map((l) => l.id)
      ),
    [labels, progress]
  );

  return { progress, handleProgress, activeIds };
}
