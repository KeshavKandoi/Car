# 911 Carrera — Cinematic Scroll Microsite

A Next.js 14 + TypeScript + Tailwind + GSAP/ScrollTrigger + Lenis production build.
Nine pinned, scroll-scrubbed chapters, each backed by a real WebP frame sequence
extracted from your generated video clips.

## What this actually is

Your 12 Google Flow clips were inspected, the best take per chapter selected, and
each one sliced into a 96-frame WebP sequence at 12fps (`public/frames/<chapter>/`).
Scrolling pins each chapter full-screen and scrubs through its frames in lockstep
with GSAP ScrollTrigger, smoothed by Lenis — the same "vanilla scroll-film" technique
Apple product pages and Awwvwards sites use when the visual is footage rather than a
live 3D/WebGL model.

**Chapter → source clip used:**

| Chapter | Clip |
|---|---|
| Hero | `Sports_coupe_rotating_in_studio` |
| Exterior / Silhouette | `Sky-blue_sports_coupe_studio` |
| Engine | `Sky-blue_sports_coupe_rear` |
| Power Flow | `Sports_coupe_underside_tracking` |
| Brakes | `Front_wheel_brake_glow` |
| Aero | `Sports_coupe_in_dark_studio` |
| Interior | `Sports_coupe_cabin_at_night` |
| Tunnel | `Sports_coupe_drives_underground` |
| Final | `Sky-blue_sports_coupe_rotating_s` (alt take, distinct from Hero) |

Backup/alternate takes you generated but weren't used (easy swaps — see below):
`Sky-blue_sports_coupe_rear__1_`, `Sky-blue_sports_coupe_rotating_s__1_`,
`Sports_coupe_in_dark_studio__1_`.

## Run it locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. First build needs internet access once (Next/Font
pulls Space Grotesk, Manrope, and JetBrains Mono from Google Fonts at build time).

```bash
npm run build && npm start   # production build
```

## Swapping in a different take for any chapter

1. Put your new clip anywhere, e.g. `~/Desktop/new_hero.mp4`.
2. Re-slice it into the matching `public/frames/<chapter>` folder:
   ```bash
   ffmpeg -i new_hero.mp4 -vf "fps=12,scale=1280:-1" frame_%03d.png
   # then convert PNG -> WebP (Pillow, since ffmpeg has no libwebp encoder by default):
   python3 -c "
   from PIL import Image
   import glob
   for i, f in enumerate(sorted(glob.glob('frame_*.png')), start=1):
       Image.open(f).convert('RGB').save(f'public/frames/hero/frame_{i:03d}.webp', 'WEBP', quality=72)
   "
   ```
3. Update `frameCount` in `lib/constants.ts` if the new clip has a different
   frame count than 96. Everything else (ScrollTrigger pin length, canvas draw,
   preloading) reads from that single config object — no other file needs touching.

## Where things live

- `lib/constants.ts` — the one place frame counts, folder names, and spec numbers
  (394 PS / 450 Nm / 4.1s / 294 km/h) are defined.
- `hooks/useLenis.ts` — boots Lenis and syncs it to the GSAP ticker.
- `hooks/useScrollFrameSequence.ts` — the core engine: preloads a chapter's frames,
  pins the section, and scrubs frames onto a `<canvas>` via ScrollTrigger.
- `hooks/useFloatingLabels.ts` — maps chapter scroll-progress to which floating
  spec labels (roofline, brake disc, etc.) are currently visible.
- `components/ChapterCanvas.tsx` — the reusable pinned-canvas wrapper every
  section is built from.
- `components/sections/*` — the nine chapters (Hero, Exterior, Engine, PowerFlow,
  Brake, Aero, Interior, Tunnel, Final), each composing `ChapterCanvas` plus its
  own copy, labels, counters, or SVG overlay effects.
- `public/frames/<chapter>/frame_NNN.webp` — the actual sliced footage.

## Performance notes already built in

- Frames are WebP (72 quality), ~23MB total across all nine chapters — each
  chapter preloads independently so the Hero section is interactive fast while
  Engine/Tunnel/Final continue warming the cache in the background.
- Canvas is sized to `devicePixelRatio` capped at 2x, so retina displays don't
  pay a 3x+ fill-rate cost.
- `prefers-reduced-motion` is respected globally (see `app/globals.css`) —
  animations collapse to near-instant for anyone with that OS setting on.
- `ScrollTrigger`'s `scrub: 0.6` gives every camera/frame move a slight
  cinematic lag instead of a 1:1 jump to scroll position, matching the brief's
  "no abrupt transitions" requirement without any extra easing code per section.

## Honest scope note

The original brief asked for a live React Three Fiber / Drei GLB scene with a
real camera rig orbiting a 3D model. You don't have a `.glb` model of the
911 — you have AI-generated video footage — so this build uses the frame-
sequence technique instead, which is the correct tool for footage-based
storytelling (it's what most Apple/Awwwards "video-as-hero" pages actually do
under the hood). If you later get a real GLB (e.g. commissioned or from a
Porsche asset license), the `ChapterCanvas` slot pattern here maps cleanly onto
an R3F `<Canvas>` + `useCameraAnimation` swap — the section components, copy,
labels, and counters wouldn't need to change, only the rendering layer inside
`ChapterCanvas`.
