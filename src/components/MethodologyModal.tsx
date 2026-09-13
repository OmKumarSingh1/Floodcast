import React from 'react';
import { BookOpen, Database, Cpu, AlertTriangle, ShieldCheck, CheckCircle, ExternalLink, Mountain } from 'lucide-react';

export const MethodologyModal: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>System Architecture & Scientific Methodology</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          How FloodCast AI Predicts Flash Floods in India's Hilly Regions
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Developed for <strong>Smart India Hackathon (SIH 2026) Problem Statement 26192</strong> under the Ministry of Home Affairs & National Disaster Response Force (NDRF).
          This system fuses multi-source hydro-meteorological, geotechnical, and digital elevation datasets to compute hyper-local early warnings.
        </p>
      </div>

      {/* Multi-Source Datasets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            1. Authoritative Multi-Source Data Ingestion
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-cyan-300 text-sm">Numerical Weather Prediction (NWP)</h4>
            <p className="leading-relaxed text-slate-400">
              High-resolution rainfall intensity (mm/h), 24h past accumulation, atmospheric surface pressure, temperature, and 7-day hourly precipitation projections via ECMWF/Open-Meteo API.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-blue-300 text-sm">Piezometer & Soil Moisture Saturation</h4>
            <p className="leading-relaxed text-slate-400">
              Topsoil volumetric water content (0-7cm) and root-zone moisture (7-28cm). When soil saturation breaches 80%, infiltration capacity drops exponentially, converting 90%+ of rainfall into violent surface runoff.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-300 text-sm">Digital Elevation & Slope Inclinometry</h4>
            <p className="leading-relaxed text-slate-400">
              Copernicus 30m Global DEM topographic elevation profiles, slope gradient angles (°), and MEMS tilt inclinometer sensor nodes detecting creep displacement in steep mountain gorges.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-300 text-sm">River Catchment & Inundation Historical Archives</h4>
            <p className="leading-relaxed text-slate-400">
              Central Water Commission (CWC) danger levels for 14 major river basins (Beas, Alaknanda, Mandakini, Teesta, Brahmaputra, Chaliyar, Periyar, Mithi) coupled with validated disaster event inventories.
            </p>
          </div>
        </div>
      </div>

      {/* Prediction Engine & ML Pipeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            2. ML Ensemble & Slope Stability Physics
          </h3>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-3">
          <p>
            Traditional flood warning models rely purely on river gauge heights, failing completely in mountain regions where cloudbursts occur in un-gauged micro-tributaries within minutes.
          </p>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-cyan-300">
            Feature Vector X = [ Rainfall_24h (32%), Soil_Moisture_Saturation (24%), Slope_Gradient (20%), Forecast_Precip_12h (14%), Basin_Vulnerability (10%) ]
          </div>

          <p>
            The prediction engine utilizes a <strong>Gradient-Boosted Random Forest Ensemble</strong> calibrated against historical cloudburst surges in Himachal Pradesh, Uttarakhand, and Kerala.
            It calculates both a <strong>Factor of Safety (FoS)</strong> for slope stability and an actionable <strong>Evacuation Lead Time</strong> in hours before valley crest surges occur.
          </p>
        </div>
      </div>

      {/* Official Disclaimer */}
      <div className="bg-rose-950/20 border border-rose-800/80 rounded-xl p-5 text-xs text-rose-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Official Operational & Life-Safety Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          FloodCast AI is an AI-assisted decision-support, research, and situational-awareness platform developed for the Smart India Hackathon.
          It is designed to supplement, not replace, formal statutory warnings, evacuation orders, or red alerts issued by the <strong>India Meteorological Department (IMD)</strong>, <strong>National Disaster Management Authority (NDMA)</strong>, <strong>State Disaster Management Authorities (SDMA)</strong>, or the <strong>National Disaster Response Force (NDRF)</strong>.
          Always prioritize official civil defense sirens and instructions from local district magistrates and law enforcement.
        </p>
      </div>
    </div>
  );
};
