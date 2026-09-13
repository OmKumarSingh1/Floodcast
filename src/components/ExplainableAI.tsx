import React, { useState } from 'react';
import { Cpu, Sparkles, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import { RiskAssessment, LocationData, WeatherData } from '../types';
import { api, ExplanationResponse } from '../services/api';

interface ExplainableAIProps {
  location: LocationData;
  weather: WeatherData;
  risk: RiskAssessment;
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({ location, weather, risk }) => {
  const [aiReport, setAiReport] = useState<ExplanationResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoadingAi(true);
    setAiError(null);
    try {
      const data = await api.getRiskExplanation(location.latitude, location.longitude, location.name);
      setAiReport(data);
    } catch (err: any) {
      console.error('Failed to get AI report:', err);
      setAiError('Failed to generate real-time AI report. Please check server logs.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Explainable AI (XAI) & SHAP Contribution Breakdown
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent algorithmic reasoning behind {location.name}'s {risk.riskLevel} classification
          </p>
        </div>

        <button
          id="btn-generate-ndrf-ai"
          onClick={handleGenerateReport}
          disabled={isLoadingAi}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
          <span>{isLoadingAi ? 'Synthesizing NDRF Directives...' : 'Generate NDRF Command Assessment'}</span>
        </button>
      </div>

      {/* Feature Contributions Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Normalized Feature Contribution Weights
        </div>

        <div className="space-y-2.5">
          {risk.contributingFactors.map((factor, idx) => (
            <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{factor.factor}:</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{factor.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getImpactBadge(factor.impact)}`}>
                    {factor.impact} IMPACT
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Weight: {Math.round(factor.weight * 100)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar of Weight */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${factor.impact === 'critical' ? 'bg-rose-500' : factor.impact === 'high' ? 'bg-amber-500' : factor.impact === 'moderate' ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.round(factor.weight * 100 * 2.5)}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400 mt-1.5">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Situation Report Modal / Section if Generated */}
      {aiReport && (
        <div className="bg-slate-950 border border-cyan-800/60 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                NDRF Commander Tactical Incident Report
              </h4>
            </div>
            <span className="text-[10px] font-medium bg-cyan-950/80 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
              Source: {aiReport.source}
            </span>
          </div>

          <div className="prose prose-invert prose-xs text-slate-300 max-w-none text-xs leading-relaxed space-y-2">
            <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg text-cyan-200 font-medium">
              {aiReport.tacticalEvacuationSummary}
            </div>
            <div className="whitespace-pre-line text-slate-300">
              {aiReport.reportText}
            </div>
          </div>
        </div>
      )}

      {aiError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{aiError}</span>
        </div>
      )}
    </div>
  );
};
