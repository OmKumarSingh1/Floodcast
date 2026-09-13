import React, { useState, useEffect } from 'react';
import { Sliders, Play, RotateCcw, AlertTriangle, ShieldCheck, Mountain, Droplets, CloudRain, Cpu, Clock } from 'lucide-react';
import { api } from '../services/api';
import { RiskAssessment } from '../types';

export const ScenarioSimulator: React.FC = () => {
  const [rainfall24h, setRainfall24h] = useState<number>(85);
  const [rainRate, setRainRate] = useState<number>(22);
  const [soilMoisture, setSoilMoisture] = useState<number>(82);
  const [slopeAngle, setSlopeAngle] = useState<number>(32);
  const [elevation, setElevation] = useState<number>(1450);
  const [isHillyRegion, setIsHillyRegion] = useState<boolean>(true);

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const runSimulation = async () => {
    setIsComputing(true);
    try {
      const res = await api.runSimulation({
        rainfall24h,
        rainRate,
        soilMoisture,
        slopeAngle,
        elevation,
        isHillyRegion,
        riverBasin: isHillyRegion ? 'Simulated High-Altitude Mountain Valley' : 'Simulated Alluvial Floodplain'
      });
      setAssessment(res.assessment);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsComputing(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [rainfall24h, rainRate, soilMoisture, slopeAngle, elevation, isHillyRegion]);

  const handleReset = () => {
    setRainfall24h(85);
    setRainRate(22);
    setSoilMoisture(82);
    setSlopeAngle(32);
    setElevation(1450);
    setIsHillyRegion(true);
  };

  const handlePreset = (type: string) => {
    if (type === 'cloudburst') {
      setRainfall24h(180);
      setRainRate(65);
      setSoilMoisture(95);
      setSlopeAngle(38);
      setElevation(2100);
      setIsHillyRegion(true);
    } else if (type === 'moderate_hilly') {
      setRainfall24h(45);
      setRainRate(10);
      setSoilMoisture(65);
      setSlopeAngle(24);
      setElevation(1200);
      setIsHillyRegion(true);
    } else if (type === 'urban_lowland') {
      setRainfall24h(120);
      setRainRate(35);
      setSoilMoisture(75);
      setSlopeAngle(2);
      setElevation(15);
      setIsHillyRegion(false);
    } else if (type === 'normal') {
      setRainfall24h(8);
      setRainRate(1);
      setSoilMoisture(40);
      setSlopeAngle(15);
      setElevation(600);
      setIsHillyRegion(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                "What-If" Flash Flood Scenario Simulation Sandbox
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Simulate extreme cloudbursts, soil saturation limits, and steep gradient runoff acceleration to evaluate how rapidly lead time deteriorates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-sim-reset"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div className="mt-4 pt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Load Preset Scenario:</span>
          {[
            { id: 'cloudburst', label: 'Himalayan Cloudburst (Kedarnath/Mandi Type)' },
            { id: 'moderate_hilly', label: 'Moderate Hill Monsoon' },
            { id: 'urban_lowland', label: 'Urban Coastal Deluge (Mumbai Type)' },
            { id: 'normal', label: 'Safe Baseline Conditions' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handlePreset(p.id)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-md font-medium transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Sliders on Left, Simulation Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Controls Column */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-3 border-b border-slate-800">
            Multi-Source Sensor Input Sliders
          </h3>

          {/* 24h Rainfall */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                24-Hour Cumulative Rainfall
              </span>
              <span className="font-mono font-bold text-cyan-300">{rainfall24h} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="5"
              value={rainfall24h}
              onChange={(e) => setRainfall24h(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 mm (Dry)</span>
              <span>115 mm (Heavy)</span>
              <span>350 mm (Extreme Cloudburst)</span>
            </div>
          </div>

          {/* Current Rainfall Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                Current Rain Intensity Rate
              </span>
              <span className="font-mono font-bold text-blue-300">{rainRate} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="2"
              value={rainRate}
              onChange={(e) => setRainRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 mm/h</span>
              <span>25 mm/h (Torrential)</span>
              <span>80 mm/h (Catastrophic)</span>
            </div>
          </div>

          {/* Soil Moisture Saturation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                Topsoil Moisture Saturation (Piezometer)
              </span>
              <span className="font-mono font-bold text-emerald-300">{soilMoisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10% (Dry Ground)</span>
              <span>75% (High Saturation)</span>
              <span>100% (Zero Infiltration)</span>
            </div>
          </div>

          {/* Slope Angle */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-amber-400" />
                Terrain Slope Gradient
              </span>
              <span className="font-mono font-bold text-amber-300">{slopeAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={slopeAngle}
              onChange={(e) => setSlopeAngle(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0° (Flat Delta)</span>
              <span>20° (Moderate Hill)</span>
              <span>45° (Extreme Gorge Face)</span>
            </div>
          </div>

          {/* Hilly Region Toggle */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              Enable Hilly Region Coupled Landslide Model:
            </span>
            <button
              id="btn-toggle-sim-hilly"
              onClick={() => setIsHillyRegion(!isHillyRegion)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                isHillyRegion
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {isHillyRegion ? 'ACTIVE (Steep Hill Physics)' : 'DISABLED (Plain Basin)'}
            </button>
          </div>
        </div>

        {/* Live Simulation Output Column */}
        <div className="lg:col-span-5 space-y-4">
          {assessment && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Live Model Output
                  </h3>
                </div>
                {isComputing && <span className="text-xs text-cyan-400 animate-pulse">Recalculating...</span>}
              </div>

              {/* Big Score HUD */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Computed Flood Risk Level
                </div>
                <div className={`text-4xl font-extrabold my-1 ${
                  assessment.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                  assessment.riskLevel === 'HIGH' ? 'text-amber-400' :
                  assessment.riskLevel === 'MODERATE' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {assessment.riskLevel}
                </div>
                <div className="text-sm font-bold text-slate-300">
                  Risk Score: {assessment.riskScore}/100 • Probability: {assessment.probability}%
                </div>
              </div>

              {/* Actionable Lead Time Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Actionable Evacuation Lead Time</div>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {assessment.leadTimeHours} <span className="text-sm font-medium text-slate-400">Hours</span>
                  </div>
                </div>
                <Clock className="w-8 h-8 text-cyan-400/60" />
              </div>

              {/* Slope Safety & Runoff Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Slope Factor of Safety</div>
                  <div className={`text-lg font-bold mt-0.5 ${assessment.slopeStabilityIndex < 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {assessment.slopeStabilityIndex}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {assessment.slopeStabilityIndex < 1.0 ? 'Imminent Slope Debris Failure' : 'Slope Structurally Stable'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Runoff Fraction</div>
                  <div className="text-lg font-bold text-cyan-300 mt-0.5">
                    {assessment.runoffCoefficient}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {Math.round(assessment.runoffCoefficient * 100)}% Overland Flow
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong>Model Reasoning:</strong> {assessment.explanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
