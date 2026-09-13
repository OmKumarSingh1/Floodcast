import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { CloudRain, Calendar, Clock, Wind, Thermometer, Droplets } from 'lucide-react';
import { ForecastHour, ForecastDay, RiskLevel } from '../types';

interface ForecastSectionProps {
  hourly: ForecastHour[];
  daily: ForecastDay[];
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ hourly, daily }) => {
  const [activeTab, setActiveTab] = useState<'precipitation' | 'temperature' | 'risk'>('precipitation');

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MODERATE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200">{label} ({data.hour})</div>
          <div className="text-cyan-400 flex items-center justify-between gap-4">
            <span>Precipitation:</span>
            <span className="font-semibold">{data.precipitation} mm</span>
          </div>
          <div className="text-blue-400 flex items-center justify-between gap-4">
            <span>Rain Probability:</span>
            <span className="font-semibold">{data.rainProbability}%</span>
          </div>
          <div className="text-amber-400 flex items-center justify-between gap-4">
            <span>Temperature:</span>
            <span className="font-semibold">{data.temperature}°C</span>
          </div>
          <div className="text-rose-400 flex items-center justify-between gap-4">
            <span>Flood Risk Index:</span>
            <span className="font-semibold">{data.riskScore}/100</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* 24-Hour Hourly Forecast Chart Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              24-Hour High-Resolution Hydro-Meteorological Projection
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              id="btn-forecast-precip"
              onClick={() => setActiveTab('precipitation')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeTab === 'precipitation'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Precipitation (mm)
            </button>
            <button
              id="btn-forecast-temp"
              onClick={() => setActiveTab('temperature')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeTab === 'temperature'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Temperature (°C)
            </button>
            <button
              id="btn-forecast-risk"
              onClick={() => setActiveTab('risk')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeTab === 'risk'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hourly Risk Index
            </button>
          </div>
        </div>

        {/* Chart Rendering */}
        <div className="h-64 sm:h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'precipitation' ? (
              <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="mm" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="precipitation" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#precipGradient)" name="Precipitation" />
              </AreaChart>
            ) : activeTab === 'temperature' ? (
              <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="°C" domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" name="Temperature" />
              </AreaChart>
            ) : (
              <BarChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="riskScore" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Flood Risk Score" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Outlook Cards */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            7-Day Synoptic Monsoon Outlook
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {daily.map((day, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between text-center hover:border-slate-700 transition-colors"
            >
              <div className="font-bold text-xs text-slate-200">
                {day.dayName}
              </div>
              <div className="text-[10px] text-slate-500 mb-2">
                {new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </div>

              <div className="my-1 space-y-1">
                <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-semibold">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>{day.totalPrecipitation} mm</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {day.rainProbability}% Rain Prob
                </div>
              </div>

              <div className="text-xs text-slate-300 font-medium my-1">
                {day.maxTemp}° / <span className="text-slate-500">{day.minTemp}°</span>
              </div>

              <div className={`mt-2 py-0.5 px-1.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getRiskBadge(day.riskLevel)}`}>
                {day.riskLevel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
