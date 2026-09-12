"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ExteriorSection from "@/components/sections/ExteriorSection";
import EngineSection from "@/components/sections/EngineSection";
import PowerFlowSection from "@/components/sections/PowerFlowSection";
import BrakeSection from "@/components/sections/BrakeSection";
import AeroSection from "@/components/sections/AeroSection";
import InteriorSection from "@/components/sections/InteriorSection";
import TunnelSection from "@/components/sections/TunnelSection";
import FinalSection from "@/components/sections/FinalSection";
import { framePath } from "@/lib/constants";

export default function Home() {
  useLenis();
  const [heroReady, setHeroReady] = useState(false);

  // Gate the loading screen on the Hero chapter's first frame only.
  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.src = framePath("hero", 1);
    const finish = () => setHeroReady(true);
    img.onload = finish;
    img.onerror = finish;
  }, []);

  return (
    <main className="relative bg-studio">
      <LoadingScreen done={heroReady} />
      <Navbar />

      <div id="hero">
        <HeroSection />
      </div>
      <div id="exterior">
        <ExteriorSection />
      </div>
      <div id="engine">
        <EngineSection />
      </div>
      <PowerFlowSection />
      <BrakeSection />
      <AeroSection />
      <div id="interior">
        <InteriorSection />
      </div>
      <div id="tunnel">
        <TunnelSection />
      </div>
      <FinalSection />

      <Footer />
    </main>
  );
}
