import React from 'react';
import { CloudRain, Droplets, Thermometer, Wind, Gauge, Mountain, Compass, Eye, ShieldCheck, AlertCircle } from 'lucide-react';
import { WeatherData, LocationData } from '../types';

interface WeatherCardsProps {
  weather: WeatherData;
  location: LocationData;
}

export const WeatherCards: React.FC<WeatherCardsProps> = ({ weather, location }) => {
  const getPrecipitationSeverity = (val24h: number) => {
    if (val24h > 115) return { color: 'text-rose-400', badge: 'Extremely Heavy (>115mm)', bg: 'bg-rose-500/10 border-rose-500/30' };
    if (val24h > 64) return { color: 'text-amber-400', badge: 'Heavy Rain (64-115mm)', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (val24h > 15) return { color: 'text-yellow-400', badge: 'Moderate (15-64mm)', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    return { color: 'text-slate-200', badge: 'Light / Normal (<15mm)', bg: 'bg-slate-800/40 border-slate-700/40' };
  };

  const getSoilMoistureSeverity = (pct: number) => {
    if (pct >= 85) return { color: 'text-rose-400', status: 'Saturated (High Infiltration Barrier)', bg: 'bg-rose-500/10 border-rose-500/30' };
    if (pct >= 70) return { color: 'text-amber-400', status: 'Elevated Saturation', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (pct >= 45) return { color: 'text-emerald-400', status: 'Normal Retention Capacity', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    return { color: 'text-slate-200', status: 'Low / Dry Ground', bg: 'bg-slate-800/40 border-slate-700/40' };
  };

  const precipInfo = getPrecipitationSeverity(weather.precipitation24h);
  const soilInfo = getSoilMoistureSeverity(weather.soilMoisture);

  return (
    <div className="space-y-3">
      {/* Live Data Source Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            Meteorological & Geotechnical Parameters
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Station Coordinates: {location.latitude.toFixed(3)}°N, {location.longitude.toFixed(3)}°E</span>
        </div>
        <div className="flex items-center gap-1.5">
          {weather.isLive ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {weather.dataSource}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Calibrated Regional Fallback
            </span>
          )}
        </div>
      </div>

      {/* Grid of Weather Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Rainfall Card */}
        <div className={`col-span-2 sm:col-span-1 rounded-xl p-3.5 border bg-slate-900/90 ${precipInfo.bg} flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>24h Rainfall</span>
            <CloudRain className={`w-4 h-4 ${precipInfo.color}`} />
          </div>
          <div className="my-2">
            <div className={`text-2xl font-extrabold ${precipInfo.color}`}>
              {weather.precipitation24h} <span className="text-xs font-medium text-slate-400">mm</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Rate: <span className="font-semibold text-slate-200">{weather.precipitation} mm/h</span>
            </div>
          </div>
          <div className="text-[10px] font-medium text-slate-400 truncate">
            {precipInfo.badge}
          </div>
        </div>

        {/* Soil Moisture Saturation */}
        <div className={`col-span-2 sm:col-span-1 rounded-xl p-3.5 border bg-slate-900/90 ${soilInfo.bg} flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Soil Saturation</span>
            <Droplets className={`w-4 h-4 ${soilInfo.color}`} />
          </div>
          <div className="my-2">
            <div className={`text-2xl font-extrabold ${soilInfo.color}`}>
              {weather.soilMoisture}<span className="text-xs font-medium text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Deep (7-28cm): <span className="font-semibold text-slate-200">{weather.soilMoistureDeep || 65}%</span>
            </div>
          </div>
          <div className="text-[10px] font-medium text-slate-400 truncate">
            {soilInfo.status}
          </div>
        </div>

        {/* Temperature */}
        <div className="rounded-xl p-3.5 border border-slate-800 bg-slate-900/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Temperature</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">
              {weather.temperature}<span className="text-xs font-medium text-slate-400">°C</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Feels: <span className="font-semibold text-slate-200">{weather.feelsLike}°C</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {weather.condition}
          </div>
        </div>

        {/* Humidity & Atmospheric Pressure */}
        <div className="rounded-xl p-3.5 border border-slate-800 bg-slate-900/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Humidity & Pressure</span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">
              {weather.humidity}<span className="text-xs font-medium text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Surface: <span className="font-semibold text-slate-200">{weather.pressure} hPa</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Cloud Cover: {weather.cloudCover}%
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="rounded-xl p-3.5 border border-slate-800 bg-slate-900/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Wind</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">
              {weather.windSpeed} <span className="text-xs font-medium text-slate-400">km/h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Bearing {weather.windDirection}°</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Monsoon Vector Flow
          </div>
        </div>

        {/* Elevation & Slope Angle */}
        <div className="rounded-xl p-3.5 border border-slate-800 bg-slate-900/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Topography</span>
            <Mountain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">
              {location.elevation} <span className="text-xs font-medium text-slate-400">m ASL</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Slope: <span className="font-semibold text-amber-400">{location.slopeAngle}°</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {location.isHillyRegion ? 'Mountain Catchment' : 'Lowland Plain'}
          </div>
        </div>
      </div>
    </div>
  );
};
