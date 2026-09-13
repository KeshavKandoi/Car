"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, ChapterId, framePath } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

interface Options {
  /** How many viewport-heights the pinned section should last while scrubbing. */
  pinLengthVh?: number;
  /** Called every tick with 0–1 scroll progress through this chapter — drives labels/counters. */
  onProgress?: (progress: number) => void;
}

const MAX_CACHED_FRAMES = 16;
const LOOK_AHEAD = 8;
const LOOK_BEHIND = 3;
const MAX_CONCURRENT_LOADS = 3;

function getCanvasDpr(width: number, height: number) {
  const nativeDpr = window.devicePixelRatio || 1;
  const device = navigator as Navigator & { deviceMemory?: number };
  const lowPowerDevice = (navigator.hardwareConcurrency || 8) <= 4 ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 4);
  const qualityCap = lowPowerDevice ? 1.25 : 1.5;
  const pixelBudget = lowPowerDevice ? 2_000_000 : 3_000_000;

  return Math.max(
    1,
    Math.min(nativeDpr, qualityCap, Math.sqrt(pixelBudget / Math.max(width * height, 1)))
  );
}

export function useScrollFrameSequence(
  chapter: ChapterId,
  options: Options = {}
) {
  const { pinLengthVh = 300, onProgress } = options;
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameState = useRef(0);
  const controllerRef = useRef<((index: number, direction: number) => void) | null>(null);
  const progressReporterRef = useRef<((progress: number) => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const cfg = CHAPTERS[chapter];

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let cancelled = false;
    let context: CanvasRenderingContext2D | null = null;
    let lastDrawnFrame = -1;
    let drawRaf = 0;
    let progressRaf = 0;
    let resizeRaf = 0;
    let pendingFrame = 0;
    let pendingProgress = 0;
    let lastProgress = -1;
    let activeLoads = 0;
    let queue: number[] = [];
    let observer: IntersectionObserver | null = null;
    const queued = new Set<number>();
    const pending = new Map<number, Promise<void>>();
    const cache = new Map<number, HTMLImageElement>();
    const size = { width: 0, height: 0, dpr: 0 };

    const touch = (index: number, image: HTMLImageElement) => {
      cache.delete(index);
      cache.set(index, image);
    };

    const releaseDistantFrames = () => {
      if (cache.size <= MAX_CACHED_FRAMES) return;

      const current = frameState.current;
      const candidates = [...cache.keys()]
        .filter((index) => index !== current && index !== lastDrawnFrame)
        .sort((a, b) => Math.abs(b - current) - Math.abs(a - current));

      while (cache.size > MAX_CACHED_FRAMES && candidates.length) {
        cache.delete(candidates.shift()!);
      }
    };

    const drawFrame = (index: number) => {
      if (cancelled || !context || !size.width || !size.height) return;
      const image = cache.get(index);
      if (!image || !image.naturalWidth || lastDrawnFrame === index) return;

      touch(index, image);
      const scale = Math.max(size.width / image.naturalWidth, size.height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      // The image is cover-fitted and opaque, so clearing first only adds work.
      context.drawImage(
        image,
        (size.width - drawWidth) / 2,
        (size.height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      lastDrawnFrame = index;
    };

    const scheduleDraw = (index: number) => {
      pendingFrame = index;
      if (drawRaf) return;
      drawRaf = requestAnimationFrame(() => {
        drawRaf = 0;
        drawFrame(pendingFrame);
      });
    };

    const pump = () => {
      while (!cancelled && activeLoads < MAX_CONCURRENT_LOADS && queue.length) {
        const index = queue.shift()!;
        queued.delete(index);
        if (cache.has(index) || pending.has(index)) continue;

        activeLoads += 1;
        const image = new Image();
        image.decoding = "async";
        const load = new Promise<void>((resolve) => {
          const finish = (loaded: boolean) => {
            image.onload = null;
            image.onerror = null;
            if (loaded && image.naturalWidth) {
              touch(index, image);
              if (index === 0) setIsReady(true);
              if (frameState.current === index) scheduleDraw(index);
              releaseDistantFrames();
            } else if (index === 0) {
              // Keep the page usable even if the first frame cannot be decoded.
              setIsReady(true);
            }
            activeLoads -= 1;
            pending.delete(index);
            resolve();
            pump();
          };

          image.onload = () => {
            void image.decode().catch(() => undefined).then(() => finish(true));
          };
          image.onerror = () => finish(false);
          image.src = framePath(chapter, index + 1);
        });
        pending.set(index, load);
      }
    };

    const requestFrame = (index: number, priority = false) => {
      const clamped = Math.min(Math.max(index, 0), cfg.frameCount - 1);
      if (cache.has(clamped) || pending.has(clamped) || queued.has(clamped)) return;
      queued.add(clamped);
      if (priority) queue.unshift(clamped);
      else queue.push(clamped);
      pump();
    };

    const primeWindow = (index: number, direction: number) => {
      const windowStart = Math.max(0, index - LOOK_AHEAD - LOOK_BEHIND);
      const windowEnd = Math.min(cfg.frameCount - 1, index + LOOK_AHEAD + LOOK_BEHIND);
      queue = queue.filter((queuedIndex) => {
        const keep = queuedIndex >= windowStart && queuedIndex <= windowEnd;
        if (!keep) queued.delete(queuedIndex);
        return keep;
      });
      requestFrame(index, true);
      for (let step = 1; step <= LOOK_AHEAD; step += 1) {
        requestFrame(index + direction * step);
      }
      for (let step = 1; step <= LOOK_BEHIND; step += 1) {
        requestFrame(index - direction * step);
      }
    };

    const reportProgress = (progress: number) => {
      pendingProgress = progress;
      if (progressRaf) return;
      progressRaf = requestAnimationFrame(() => {
        progressRaf = 0;
        if (Math.abs(pendingProgress - lastProgress) < 0.001) return;
        lastProgress = pendingProgress;
        onProgressRef.current?.(pendingProgress);
      });
    };

    const resize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        const rect = canvas.getBoundingClientRect();
        const width = Math.round(rect.width || window.innerWidth);
        const height = Math.round(rect.height || window.innerHeight);
        const dpr = getCanvasDpr(width, height);
        if (width === size.width && height === size.height && dpr === size.dpr) return;

        size.width = width;
        size.height = height;
        size.dpr = dpr;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context = canvas.getContext("2d", { alpha: false, desynchronized: true });
        context?.setTransform(dpr, 0, 0, dpr, 0, 0);
        lastDrawnFrame = -1;
        scheduleDraw(frameState.current);
      });
    };

    context = canvas.getContext("2d", { alpha: false, desynchronized: true });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    progressReporterRef.current = reportProgress;

    controllerRef.current = (index: number, direction: number) => {
      const nextFrame = Math.min(Math.max(index, 0), cfg.frameCount - 1);
      if (nextFrame !== frameState.current) {
        frameState.current = nextFrame;
        primeWindow(nextFrame, direction || 1);
        scheduleDraw(nextFrame);
      }
    };

    const start = () => {
      if (cancelled) return;
      requestFrame(0, true);
      primeWindow(0, 1);
      setIsActive(true);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            start();
            observer?.disconnect();
          }
        },
        { rootMargin: "50% 0px" }
      );
      observer.observe(section);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      controllerRef.current = null;
      progressReporterRef.current = null;
      observer?.disconnect();
      resizeObserver.disconnect();
      if (drawRaf) cancelAnimationFrame(drawRaf);
      if (progressRaf) cancelAnimationFrame(progressRaf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      queue = [];
      cache.clear();
      pending.clear();
    };
  }, [chapter, cfg.frameCount]);

  useEffect(() => {
    if (!isReady || !isActive || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${pinLengthVh}%`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const nextFrame = Math.round(self.progress * (cfg.frameCount - 1));
          const direction = nextFrame >= frameState.current ? 1 : -1;
          controllerRef.current?.(nextFrame, direction);
          progressReporterRef.current?.(self.progress);
        },
      });

      controllerRef.current?.(0, 1);
      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [cfg.frameCount, isActive, isReady, pinLengthVh]);

  return { sectionRef, canvasRef, isReady };
}
