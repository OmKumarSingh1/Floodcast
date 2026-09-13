import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, Cpu, Mountain, ArrowUpRight } from 'lucide-react';
import { LocationData, RiskAssessment, RiskLevel } from '../types';

interface RiskCardProps {
  location: LocationData;
  risk: RiskAssessment;
  activeModel: 'ensemble' | 'baseline';
  onToggleModel: (model: 'ensemble' | 'baseline') => void;
  onViewEvacuation: () => void;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  location,
  risk,
  activeModel,
  onToggleModel,
  onViewEvacuation
}) => {
  const getRiskDetails = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/40 border-rose-800/80',
          badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/60',
          icon: ShieldAlert,
          titleColor: 'text-rose-400',
          barColor: 'bg-rose-500',
          textColor: 'text-rose-300',
          description: 'Flash flood surge imminent. High runoff velocity across steep slopes requires immediate evacuation of low-lying settlements.'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/40 border-amber-800/80',
          badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/60',
          icon: AlertTriangle,
          titleColor: 'text-amber-400',
          barColor: 'bg-amber-500',
          textColor: 'text-amber-300',
          description: 'Elevated precipitation and near-saturated soil conditions. Heightened threat of rapid mountain stream surges.'
        };
      case 'MODERATE':
        return {
          bg: 'bg-yellow-950/30 border-yellow-800/70',
          badgeBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60',
          icon: AlertTriangle,
          titleColor: 'text-yellow-400',
          barColor: 'bg-yellow-500',
          textColor: 'text-yellow-300',
          description: 'Soil saturation levels elevated. Close monitoring of local nullahs and watercourses required.'
        };
      default:
        return {
          bg: 'bg-emerald-950/30 border-emerald-800/70',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60',
          icon: CheckCircle,
          titleColor: 'text-emerald-400',
          barColor: 'bg-emerald-500',
          textColor: 'text-emerald-300',
          description: 'Environmental parameters stable. Catchment retention and infiltration capacity are within safe operating limits.'
        };
    }
  };

  const details = getRiskDetails(risk.riskLevel);
  const Icon = details.icon;

  return (
    <div className={`rounded-xl border p-5 transition-all shadow-xl ${details.bg}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Hyper-Local Hydro-Meteorological Assessment
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Updated {new Date(risk.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">{location.name}</h2>
            <span className="text-sm text-slate-400">
              ({location.district ? `${location.district}, ` : ''}{location.state})
            </span>
          </div>
          {location.riverBasin && (
            <p className="text-xs text-cyan-400/90 mt-0.5 flex items-center gap-1 font-medium">
              <span>Catchment: {location.riverBasin}</span>
              {location.isHillyRegion && (
                <span className="text-amber-400/90 ml-2">• Hilly Terrain ({location.slopeAngle}° slope)</span>
              )}
            </p>
          )}
        </div>

        {/* Model Toggle Switch (Ensemble vs Baseline) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 px-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Engine:</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-md border border-slate-800">
            <button
              id="btn-model-ensemble"
              onClick={() => onToggleModel('ensemble')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                activeModel === 'ensemble'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ML Ensemble
            </button>
            <button
              id="btn-model-baseline"
              onClick={() => onToggleModel('baseline')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                activeModel === 'baseline'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Baseline Rule Model
            </button>
          </div>
        </div>
      </div>

      {/* Main Score & Metrics Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Risk Score & Level */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Flood Risk Level</span>
            <Icon className={`w-4 h-4 ${details.titleColor}`} />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${details.titleColor}`}>
                {risk.riskLevel}
              </span>
              <span className="text-lg font-bold text-slate-400">
                {risk.riskScore}<span className="text-xs text-slate-500">/100</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${details.barColor}`}
                style={{ width: `${risk.riskScore}%` }}
              ></div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Confidence: {risk.confidence}%</span>
            <span>Probability: {risk.probability}%</span>
          </div>
        </div>

        {/* Actionable Evacuation Lead Time */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Actionable Lead Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-white">
              {risk.leadTimeHours} <span className="text-base font-medium text-slate-400">Hours</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Estimated window prior to hydrologic runoff crest
            </p>
          </div>
          <button
            id="btn-evacuation-protocols"
            onClick={onViewEvacuation}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
          >
            <span>Evacuation SOP Directives</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Slope Stability Index (Factor of Safety) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Slope Factor of Safety</span>
            <Mountain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${risk.slopeStabilityIndex < 1.0 ? 'text-rose-400' : risk.slopeStabilityIndex < 1.4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {risk.slopeStabilityIndex}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {risk.slopeStabilityIndex < 1.0 ? 'CRITICAL (Imminent)' : risk.slopeStabilityIndex < 1.4 ? 'UNSTABLE' : 'STABLE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Coupled landslide / debris flow safety threshold (&lt;1.0)
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Slope Angle: {location.slopeAngle}° • Elevation: {location.elevation}m
          </div>
        </div>

        {/* Surface Runoff Coefficient */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Runoff Coefficient (C)</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-white">
              {risk.runoffCoefficient}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {Math.round(risk.runoffCoefficient * 100)}% of incoming rain converts to immediate surface flow
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Model: {risk.modelUsed}
          </div>
        </div>
      </div>

      {/* Summary Explanation Text */}
      <div className="mt-4 p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-slate-800 text-cyan-400 flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>{risk.explanation}</p>
        </div>
      </div>
    </div>
  );
};
