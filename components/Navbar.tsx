"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      setScrollProgress(scrollable > 0 ? h.scrollTop / scrollable : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 z-40 flex w-full items-center justify-between px-6 py-5 md:px-10">
      <span className="font-display text-sm font-semibold tracking-tight text-white">
        911 <span className="text-carrera-glow">Carrera</span>
      </span>

      <nav className="hidden gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.target}
            href={`#${link.target}`}
            className="chapter-eyebrow text-steel-300 transition-colors hover:text-carrera-glow"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#final"
        className="chapter-eyebrow rounded-full border border-carrera-glow/30 px-4 py-2 text-carrera-glow transition-colors hover:bg-carrera-glow/10"
      >
        Configure
      </a>

      {/* Global scroll-progress hairline */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-studio-line">
        <div
          className="h-full bg-carrera-glow transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </header>
  );
}
