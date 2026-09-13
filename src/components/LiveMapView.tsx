import React, { useState, useEffect } from 'react';
import { InteractiveMap } from './InteractiveMap';
import { LocationData, RiskAssessment, IoTSensorNode, CWCRiverStation, RadarData } from '../types';
import { api } from '../services/api';
import {
  Waves,
  Radio,
  AlertTriangle,
  Activity,
  Compass,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';

interface LiveMapViewProps {
  currentLocation: LocationData;
  risk: RiskAssessment;
  iotNodes: IoTSensorNode[];
  onSelectCoordinates: (lat: number, lon: number) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  currentLocation,
  risk,
  iotNodes,
  onSelectCoordinates,
}) => {
  const [cwcStations, setCwcStations] = useState<CWCRiverStation[]>([]);
  const [liveSummary, setLiveSummary] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterState, setFilterState] = useState<'ALL' | 'WARNING_ONLY'>('ALL');

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [stns, summary] = await Promise.all([
        api.getCWCStations(),
        api.getLiveSummary()
      ]);
      setCwcStations(stns);
      setLiveSummary(summary);
    } catch (err) {
      console.error('Failed to load CWC live stations:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 120000);
    return () => clearInterval(interval);
  }, []);

  const filteredStations = filterState === 'ALL'
    ? cwcStations
    : cwcStations.filter(s => s.status !== 'NORMAL');

  return (
    <div className="space-y-5">
      {/* Live Map National Intelligence Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                National GIS Flood Hydrology & Live Radar Network
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                SYSTEM ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrating real-time Doppler radar precipitation echoes, CWC river gauging stations, and hilly catchment runoff models.
            </p>
          </div>
        </div>

        {/* Live Metrics Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">CWC Stations:</span>
            <span className="font-bold text-cyan-400">{cwcStations.length} Monitored</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">Warning Catchments:</span>
            <span className="font-bold text-amber-400">
              {cwcStations.filter(s => s.status !== 'NORMAL').length} Active
            </span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">Doppler Radar:</span>
            <span className="font-bold text-emerald-400">Streaming Live</span>
          </div>
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
            title="Refresh Live Station Feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Full Interactive Spatial Map */}
      <InteractiveMap
        currentLocation={currentLocation}
        risk={risk}
        iotNodes={iotNodes}
        onSelectCoordinates={onSelectCoordinates}
      />

      {/* Live Central Water Commission (CWC) Telemetry Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Central Water Commission (CWC) Real-Time Hydro Gauging Feed
              </h3>
              <p className="text-xs text-slate-400">
                Live stage data, discharge volume, and hydrograph trend across India's high-risk basins.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterState('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filterState === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              All Basins ({cwcStations.length})
            </button>
            <button
              onClick={() => setFilterState('WARNING_ONLY')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filterState === 'WARNING_ONLY'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Warning / Critical Only ({cwcStations.filter(s => s.status !== 'NORMAL').length})
            </button>
          </div>
        </div>

        {/* Stations Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Station & Basin</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">Warning / Danger</th>
                <th className="px-4 py-3">Discharge</th>
                <th className="px-4 py-3">Trend</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredStations.map((stn) => {
                const isCritical = stn.status === 'CRITICAL';
                const isWarning = stn.status === 'WARNING';
                const statusColor = isCritical
                  ? 'text-rose-400 bg-rose-500/20 border-rose-500/40'
                  : isWarning
                  ? 'text-amber-400 bg-amber-500/20 border-amber-500/40'
                  : 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';

                return (
                  <tr key={stn.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                        {stn.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{stn.river}</div>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-300">
                      {stn.state}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-cyan-300'}`}>
                        {stn.currentStage.toFixed(2)} m
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">
                      <span>{stn.warningLevel.toFixed(1)}m</span> / <span className="text-rose-400/90">{stn.dangerLevel.toFixed(1)}m</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {stn.dischargeCumecs.toLocaleString()} m³/s
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-1 text-[11px]">
                        {stn.trend === 'RISING' ? (
                          <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                        ) : stn.trend === 'FALLING' ? (
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className={stn.trend === 'RISING' ? 'text-rose-300' : stn.trend === 'FALLING' ? 'text-emerald-300' : 'text-slate-400'}>
                          {stn.trend} ({stn.trendRate > 0 ? '+' : ''}{stn.trendRate} m/h)
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
                        {stn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => onSelectCoordinates(stn.latitude, stn.longitude)}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-medium transition-colors"
                      >
                        Inspect Area
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
