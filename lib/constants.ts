// Central source of truth for every chapter's frame sequence + copy.
// Nothing else in the app should hardcode a frame count or folder name —
// change it here and every section/hook picks it up automatically.

export type ChapterId =
  | "hero"
  | "exterior"
  | "engine"
  | "powerflow"
  | "brake"
  | "aero"
  | "interior"
  | "tunnel"
  | "final";

export interface ChapterConfig {
  id: ChapterId;
  folder: string; // public/frames/<folder>
  frameCount: number;
  framePrefix: string;
  extension: "webp";
}

// All nine chapters were sliced at 12fps from 8s source clips -> 96 frames each.
export const CHAPTERS: Record<ChapterId, ChapterConfig> = {
  hero: { id: "hero", folder: "hero", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  exterior: { id: "exterior", folder: "exterior", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  engine: { id: "engine", folder: "engine", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  powerflow: { id: "powerflow", folder: "powerflow", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  brake: { id: "brake", folder: "brake", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  aero: { id: "aero", folder: "aero", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  interior: { id: "interior", folder: "interior", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  tunnel: { id: "tunnel", folder: "tunnel", frameCount: 96, framePrefix: "frame_", extension: "webp" },
  final: { id: "final", folder: "final", frameCount: 96, framePrefix: "frame_", extension: "webp" },
};

export function framePath(chapter: ChapterId, index: number): string {
  const cfg = CHAPTERS[chapter];
  const n = Math.min(Math.max(index, 1), cfg.frameCount);
  const padded = String(n).padStart(3, "0");
  return `/frames/${cfg.folder}/${cfg.framePrefix}${padded}.${cfg.extension}`;
}

// Spec numbers reused across the Engine and Tunnel chapters' animated counters.
export const SPECS = {
  power: { label: "PS", value: 394 },
  torque: { label: "Nm", value: 450 },
  sprint: { label: "0–100 km/h", value: 4.1, suffix: "s" },
  topSpeed: { label: "km/h top speed", value: 294 },
};

export const NAV_LINKS = [
  { label: "Exterior", target: "exterior" },
  { label: "Engine", target: "engine" },
  { label: "Performance", target: "tunnel" },
  { label: "Interior", target: "interior" },
];
