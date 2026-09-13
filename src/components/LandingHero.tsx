import React from 'react';
import { ShieldCheck, CloudLightning, Activity, Mountain, Compass, ArrowRight, X } from 'lucide-react';

interface LandingHeroProps {
  onDismiss: () => void;
  onExploreHilly: () => void;
  isDismissed: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onDismiss, onExploreHilly, isDismissed }) => {
  if (isDismissed) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-900/40 px-4 sm:px-6 py-5 shadow-inner">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Mountain className="w-3 h-3 text-cyan-400" />
              SIH 2026 Problem Statement 26192
            </span>
            <span className="text-xs text-slate-400">
              NDRF • Multi-Source Hydro-Meteorological Early Warning System
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Predict. Prepare. Protect. — Hyper-Local Flash Flood Intelligence for India
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hilly terrains across Himachal, Uttarakhand, Kerala, and the North East suffer sudden cloudburst surges with minimal lead time.
            FloodCast AI fuses <strong>live NWP precipitation</strong>, <strong>subsurface soil moisture saturation</strong>, <strong>high-resolution terrain slope stability</strong>, and <strong>river basin IoT telemetry</strong> to deliver village and ward level early warnings.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1 text-slate-300">
              <CloudLightning className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Radar & NWP</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Soil Moisture Piezometer Grid</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Digital Elevation & Slope Runoff</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>NDRF Evacuation Lead Times</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center">
          <button
            id="btn-hero-explore-hilly"
            onClick={onExploreHilly}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-900/30 transition-all border border-cyan-400/40"
          >
            <span>Monitor Vulnerable Hilly Zones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-hero-dismiss"
            onClick={onDismiss}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Dismiss banner"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
