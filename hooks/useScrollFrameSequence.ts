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

export function useScrollFrameSequence(
  chapter: ChapterId,
  options: Options = {}
) {
  const { pinLengthVh = 300, onProgress } = options;
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Keep the latest callback in a ref so the ScrollTrigger effect below
  // doesn't need to re-create itself (and its pin) every render.
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const cfg = CHAPTERS[chapter];

  // Preload every frame for this chapter before we let ScrollTrigger pin it,
  // so scrubbing never shows a blank/half-loaded canvas.
  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= cfg.frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(chapter, i);
      img.onload = () => {
        loaded++;
        if (!cancelled && loaded === cfg.frameCount) setIsReady(true);
      };
      img.onerror = () => {
        loaded++;
        if (!cancelled && loaded === cfg.frameCount) setIsReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, [chapter, cfg.frameCount]);

  // Draw the frame closest to the current scroll progress, cover-fit to canvas.
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[Math.min(Math.max(index, 0), cfg.frameCount - 1)];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Resize canvas to device pixels and redraw the current frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(frameState.current);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const frameState = useRef(0);

  // The actual pinned + scrubbed ScrollTrigger timeline for this chapter.
  useEffect(() => {
    if (!isReady || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${pinLengthVh}%`,
        pin: true,
        scrub: 0.6, // slight lag = cinematic easing rather than a 1:1 jump
        anticipatePin: 1,
        onUpdate: (self) => {
          const frameIndex = Math.round(self.progress * (cfg.frameCount - 1));
          frameState.current = frameIndex;
          drawFrame(frameIndex);
          onProgressRef.current?.(self.progress);
        },
      });

      // Draw the first frame immediately so there's no flash of empty canvas.
      drawFrame(0);

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, pinLengthVh, cfg.frameCount]);

  return { sectionRef, canvasRef, isReady };
}
