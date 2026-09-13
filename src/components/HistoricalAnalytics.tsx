import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { BarChart2, Calendar, FileText, AlertTriangle, TrendingUp, History, Filter } from 'lucide-react';
import { HistoricalFloodEvent } from '../types';
import { api } from '../services/api';

interface HistoricalAnalyticsProps {
  currentLocationName: string;
}

export const HistoricalAnalytics: React.FC<HistoricalAnalyticsProps> = ({ currentLocationName }) => {
  const [events, setEvents] = useState<HistoricalFloodEvent[]>([]);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [selectedParameter, setSelectedParameter] = useState<'rainfall' | 'soilMoisture' | 'riverLevel' | 'riskIndex'>('rainfall');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await api.getHistoricalData(currentLocationName);
        setEvents(data.events || []);
        setTimeSeries(data.timeSeries || []);
      } catch (err) {
        console.error('Failed to load historical data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [currentLocationName]);

  const CustomTimeSeriesTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200">{label}</div>
          <div className="text-cyan-400">Rainfall: <strong>{data.rainfall} mm</strong></div>
          <div className="text-blue-400">Soil Saturation: <strong>{data.soilMoisture}%</strong></div>
          <div className="text-teal-400">River Stage: <strong>{data.riverLevel} m</strong></div>
          <div className="text-rose-400">Risk Score: <strong>{data.riskIndex}/100</strong></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Historical Disaster Intelligence & Hydro-Climatic Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Comparative multi-decadal analysis of cloudburst incidents, dam breaches, debris flows, and flash floods across India’s vulnerable terrain sectors.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {[
              { id: 'rainfall', label: 'Rainfall (mm)', color: '#06b6d4' },
              { id: 'soilMoisture', label: 'Soil Saturation (%)', color: '#3b82f6' },
              { id: 'riverLevel', label: 'River Stage (m)', color: '#14b8a6' },
              { id: 'riskIndex', label: 'Flood Risk Index', color: '#f43f5e' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedParameter(p.id as any)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedParameter === p.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 30-Day Time-Series Chart */}
        <div className="h-64 sm:h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedParameter === 'riskIndex' ? '#f43f5e' : selectedParameter === 'soilMoisture' ? '#3b82f6' : selectedParameter === 'riverLevel' ? '#14b8a6' : '#06b6d4'} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={selectedParameter === 'riskIndex' ? '#f43f5e' : selectedParameter === 'soilMoisture' ? '#3b82f6' : selectedParameter === 'riverLevel' ? '#14b8a6' : '#06b6d4'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTimeSeriesTooltip />} />
              <Area
                type="monotone"
                dataKey={selectedParameter}
                stroke={selectedParameter === 'riskIndex' ? '#f43f5e' : selectedParameter === 'soilMoisture' ? '#3b82f6' : selectedParameter === 'riverLevel' ? '#14b8a6' : '#06b6d4'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#histGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Verified Major Indian Flood Events Table & Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Validated Indian Disaster Event Inventories (NDRF / CWC Archives)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {events.length} Catastrophic Events Documented
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-cyan-400">{ev.date}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {ev.impactSeverity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{ev.location}</h4>
                <div className="text-xs text-slate-400 mb-2.5">{ev.state}</div>

                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs space-y-1 my-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Peak 24h Rainfall:</span>
                    <strong className="text-cyan-300 font-mono">{ev.peakRainfall24h} mm</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Reported Casualties:</span>
                    <strong className="text-rose-400 font-mono">{ev.casualties.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Est. Economic Impact:</span>
                    <strong className="text-amber-400 font-mono">{ev.estimatedDamageINR}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                  {ev.cause}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
