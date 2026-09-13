import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, Bell, PhoneCall, Download, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DisasterAlert } from '../types';

interface AlertsViewProps {
  alerts: DisasterAlert[];
  currentLocationName: string;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, currentLocationName }) => {
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(alerts[0] || null);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse';
      case 'WARNING': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'WATCH': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FloodCast_NDRF_Disaster_Bulletin_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                National Disaster Response Force (NDRF) Early Warnings & Advisories
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Official hydro-meteorological early warning bulletins issued under Ministry of Home Affairs guidelines (SIH 2026 Problem ID: 26192).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-download-alert-report"
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Incident Bulletin</span>
            </button>
          </div>
        </div>

        {/* Emergency Hotlines Strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">NDRF Headquarters Control</div>
              <div className="text-sm font-bold text-white">1078 / 011-24363260</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">National Emergency Support</div>
              <div className="text-sm font-bold text-white">112 (Universal Emergency)</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">State Disaster Management (SDMA)</div>
              <div className="text-sm font-bold text-white">1070 (Toll Free State Line)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Alert List & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Alerts List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Warning Bulletins ({alerts.length})
          </h3>

          <div className="space-y-2.5">
            {alerts.map((al) => {
              const isSelected = selectedAlert?.id === al.id;
              return (
                <button
                  key={al.id}
                  onClick={() => setSelectedAlert(al)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(al.severity)}`}>
                      {al.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(al.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{al.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{al.location}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Alert Detailed Dossier */}
        <div className="lg:col-span-7">
          {selectedAlert ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="pb-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getSeverityBadge(selectedAlert.severity)}`}>
                      {selectedAlert.severity} ADVISORY
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedAlert.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{selectedAlert.title}</h3>
                </div>
              </div>

              {/* Location & Time Strip */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Target Location / Corridor</div>
                  <div className="font-bold text-white mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedAlert.location}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Actionable Evacuation Lead Time</div>
                  <div className="font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedAlert.leadTime}</span>
                  </div>
                </div>
              </div>

              {/* Physical Reason / Sensor Trigger */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Physical Mechanism & Sensor Trigger
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedAlert.reason}
                </p>
              </div>

              {/* High-Risk Villages / Wards List (Problem 26192 Requirement) */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>High-Priority Village & Ward Clusters for Evacuation</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedAlert.villagesWards.map((vw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200 font-medium">
                      📍 {vw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Tactical & Public Actions */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tactical Directives for Citizens & Emergency Responders</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedAlert.recommendedAction}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                <span>Issued by: {selectedAlert.source}</span>
                <span>Timestamp: {new Date(selectedAlert.timestamp).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-500 text-xs">
              Select an advisory bulletin to view tactical directives.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
