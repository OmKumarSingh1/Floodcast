import React, { useState, useEffect } from 'react';
import { GitCompare, Plus, X, BarChart2, ShieldAlert, Mountain, Droplets, CloudRain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { api } from '../services/api';
import { INDIAN_LOCATIONS_DATABASE } from '../server/geocodingService';
import { LocationData, WeatherData, RiskAssessment, RiskLevel } from '../types';

export const CityComparison: React.FC = () => {
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([
    'in-mandi',
    'in-wayanad',
    'in-joshimath',
    'in-guwahati',
    'in-mumbai'
  ]);
  const [comparisonData, setComparisonData] = useState<Array<{
    location: LocationData;
    weather: WeatherData;
    risk: RiskAssessment;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadComparison() {
      setIsLoading(true);
      try {
        const data = await api.compareLocations(selectedCityIds);
        setComparisonData(data);
      } catch (err) {
        console.error('Failed to load city comparison:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadComparison();
  }, [selectedCityIds]);

  const handleToggleCity = (id: string) => {
    if (selectedCityIds.includes(id)) {
      if (selectedCityIds.length > 2) {
        setSelectedCityIds(selectedCityIds.filter(c => c !== id));
      }
    } else {
      if (selectedCityIds.length < 6) {
        setSelectedCityIds([...selectedCityIds, id]);
      }
    }
  };

  const chartData = comparisonData.map(item => ({
    name: item.location.name.split(' ')[0],
    riskScore: item.risk.riskScore,
    rainfall: item.weather.precipitation24h,
    soilMoisture: item.weather.soilMoisture,
    slope: item.location.slopeAngle,
  }));

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
      case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'MODERATE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Multi-Regional Flood Vulnerability Comparison
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Cross-compare live hydro-meteorological indices, terrain slope steepness, soil moisture saturation, and evacuation lead times across multiple Indian districts.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Selected: <span className="font-bold text-cyan-400">{selectedCityIds.length}/6 Locations</span>
          </div>
        </div>

        {/* City Selector Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {INDIAN_LOCATIONS_DATABASE.slice(0, 14).map(loc => {
            const isSelected = selectedCityIds.includes(loc.id);
            return (
              <button
                key={loc.id}
                onClick={() => handleToggleCity(loc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{loc.name}</span>
                {isSelected ? <X className="w-3 h-3 text-slate-950" /> : <Plus className="w-3 h-3 text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-3 border-b border-slate-800 mb-4">
          Comparative Parameter Benchmark
        </h3>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="riskScore" name="Flood Risk Score" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rainfall" name="24h Rainfall (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="soilMoisture" name="Soil Moisture (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="slope" name="Slope Gradient (°)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Comparative Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg overflow-x-auto">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-3 border-b border-slate-800 mb-4">
          Detailed Matrix Breakdown
        </h3>

        <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
          <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/80 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Location & Terrain</th>
              <th className="py-2.5 px-3">Risk Level</th>
              <th className="py-2.5 px-3">Risk Score</th>
              <th className="py-2.5 px-3">24h Rainfall</th>
              <th className="py-2.5 px-3">Soil Moisture</th>
              <th className="py-2.5 px-3">Slope Stability</th>
              <th className="py-2.5 px-3">Lead Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {comparisonData.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-white">{item.location.name}</div>
                  <div className="text-[11px] text-slate-400">{item.location.state} • {item.location.elevation}m ASL</div>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getRiskBadge(item.risk.riskLevel)}`}>
                    {item.risk.riskLevel}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-200">
                  {item.risk.riskScore}/100
                </td>
                <td className="py-3 px-3 font-mono text-cyan-300">
                  {item.weather.precipitation24h} mm
                </td>
                <td className="py-3 px-3 font-mono text-blue-300">
                  {item.weather.soilMoisture}%
                </td>
                <td className="py-3 px-3 font-mono">
                  <span className={item.risk.slopeStabilityIndex < 1.0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {item.risk.slopeStabilityIndex} FoS
                  </span>
                  <div className="text-[10px] text-slate-500">{item.location.slopeAngle}° slope</div>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-white">
                  {item.risk.leadTimeHours} Hours
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
