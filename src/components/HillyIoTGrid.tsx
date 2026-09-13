import React, { useState } from 'react';
import { Activity, Radio, Droplets, Mountain, Gauge, CloudRain, AlertTriangle, ShieldCheck, Battery, RefreshCw } from 'lucide-react';
import { IoTSensorNode } from '../types';

interface HillyIoTGridProps {
  nodes: IoTSensorNode[];
  onRefresh: () => void;
}

export const HillyIoTGrid: React.FC<HillyIoTGridProps> = ({ nodes, onRefresh }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredNodes = nodes.filter(node => {
    if (filterType !== 'ALL' && node.type !== filterType) return false;
    if (filterStatus !== 'ALL' && node.status !== filterStatus) return false;
    return true;
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'SOIL_MOISTURE': return Droplets;
      case 'RIVER_GAUGE': return Gauge;
      case 'RAIN_GAUGE': return CloudRain;
      case 'SLOPE_INCLINOMETER': return Mountain;
      default: return Activity;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse';
      case 'WARNING': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & SIH 2026 Context */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                SIH Problem 26192 Hardware-Software Interface
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">NDRF IoT Hill-Slope Mesh</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              Real-Time Hilly Region IoT Sensor Network
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Multi-source edge sensors deployed across high-vulnerability hill slopes and river corridors in Himachal Pradesh, Uttarakhand, and Western Ghats. In-situ telemetry feeds pore-water pressure, slope creep, and river discharge to the FloodCast AI model.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="btn-refresh-iot"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Poll Sensors</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1">Filter Type:</span>
            {['ALL', 'SOIL_MOISTURE', 'RIVER_GAUGE', 'RAIN_GAUGE', 'SLOPE_INCLINOMETER'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterType === type
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Status:</span>
            {['ALL', 'CRITICAL', 'WARNING', 'NORMAL'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredNodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isCritical = node.status === 'CRITICAL';
          const isWarning = node.status === 'WARNING';

          return (
            <div
              key={node.id}
              className={`rounded-xl border p-4 bg-slate-900/90 flex flex-col justify-between transition-all hover:border-slate-700 shadow-md ${
                isCritical
                  ? 'border-rose-800/80 bg-rose-950/20'
                  : isWarning
                  ? 'border-amber-800/80 bg-amber-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${isCritical ? 'bg-rose-500/20 text-rose-400' : isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-cyan-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">{node.id}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(node.status)}`}>
                    {node.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{node.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{node.locationName}</p>

                <div className="my-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                  <div className="text-[11px] text-slate-400">Current Reading</div>
                  <div className="text-lg font-extrabold text-cyan-300 mt-0.5">
                    {node.currentValue} <span className="text-xs font-medium text-slate-400">{node.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Warn: {node.thresholdWarning}</span>
                    <span>Crit: {node.thresholdCritical}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{node.batteryPct}% Solar</span>
                </div>
                <div>Ping: {node.lastPing}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
