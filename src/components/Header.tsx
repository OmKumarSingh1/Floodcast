import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, AlertTriangle, CloudRain, Navigation, Activity, ShieldAlert, BookOpen, Layers, BarChart2, GitCompare, Sliders, Compass } from 'lucide-react';
import { LocationData, RiskLevel } from '../types';
import { api } from '../services/api';
import { INDIAN_LOCATIONS_DATABASE } from '../server/geocodingService';

interface HeaderProps {
  currentLocation: LocationData;
  onSelectLocation: (location: LocationData) => void;
  onUseMyLocation: () => void;
  isGpsLoading: boolean;
  gpsError: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRiskLevel: RiskLevel;
  alertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onUseMyLocation,
  isGpsLoading,
  gpsError,
  activeTab,
  setActiveTab,
  currentRiskLevel,
  alertCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Quick select key hilly and vulnerable locations
  const quickLocations = [
    { name: 'Mandi (HP)', id: 'in-mandi' },
    { name: 'Wayanad (KL)', id: 'in-wayanad' },
    { name: 'Joshimath (UK)', id: 'in-joshimath' },
    { name: 'Kedarnath (UK)', id: 'in-kedarnath' },
    { name: 'Guwahati (AS)', id: 'in-guwahati' },
    { name: 'Darjeeling (WB)', id: 'in-darjeeling' },
    { name: 'Mumbai (MH)', id: 'in-mumbai' },
  ];

  // Search autocomplete debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.searchLocations(searchQuery);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse';
      case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'MODERATE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner: SIH 2026 & National Disaster Management Header */}
      <div className="bg-slate-900/90 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-400 font-semibold px-2 py-0.5 rounded border border-cyan-500/30">
            SIH 2026 Problem ID: 26192
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            Ministry of Home Affairs • National Disaster Response Force (NDRF) DM Division
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Telemetry Grid Active</span>
          </div>
          <span className="text-slate-500">|</span>
          <a
            href="tel:1078"
            className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
            title="National Disaster Emergency Helpline"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>NDRF Hotline: 1078</span>
          </a>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo & Current Location Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
                <CloudRain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    FLOODCAST <span className="text-cyan-400">AI</span>
                  </h1>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRiskColor(currentRiskLevel)}`}>
                    {currentRiskLevel} RISK
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  Predict. Prepare. Protect.
                </p>
              </div>
            </div>

            {/* Mobile Tab Trigger or Emergency Trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                id="btn-mobile-alerts"
                onClick={() => setActiveTab('alerts')}
                className="relative p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                aria-label="View Active Alerts"
              >
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Location Search Bar & GPS Trigger */}
          <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="input-location-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Search any Indian city, hilly district, town, or village (e.g. Mandi, Wayanad, Joshimath)..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-cyan-500 border-t-transparent rounded-full"></span>
                  </div>
                )}
              </div>

              {/* GPS Button */}
              <button
                id="btn-use-my-location"
                onClick={onUseMyLocation}
                disabled={isGpsLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                title="Detect flood risk at your current GPS coordinates"
              >
                <Navigation className={`w-3.5 h-3.5 text-cyan-400 ${isGpsLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isGpsLoading ? 'Locating...' : 'Use My Location'}</span>
              </button>
            </div>

            {/* GPS Error Toast */}
            {gpsError && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-rose-950/90 border border-rose-800 rounded-md text-xs text-rose-300 z-50 flex items-center justify-between">
                <span>{gpsError}</span>
              </div>
            )}

            {/* Autocomplete Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
                  Indian Geographic Locations
                </div>
                {suggestions.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-800/80 border-b border-slate-800/50 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {loc.district ? `${loc.district}, ` : ''}{loc.state}
                          {loc.riverBasin && ` • ${loc.riverBasin}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {loc.isHillyRegion && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          Hilly Terrain ({loc.slopeAngle}°)
                        </span>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {loc.elevation}m ASL
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 flex-shrink-0 font-medium text-[11px]">
            High-Risk Zones:
          </span>
          {quickLocations.map((q) => {
            const isCurrent = currentLocation.name.toLowerCase().includes(q.name.split(' ')[0].toLowerCase());
            return (
              <button
                key={q.id}
                onClick={() => {
                  const target = INDIAN_LOCATIONS_DATABASE.find(l => l.id === q.id);
                  if (target) onSelectLocation(target);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {q.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="bg-slate-900/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-2 py-1.5">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Layers },
              { id: 'live-map', label: 'Live GIS & Doppler Radar', icon: Compass },
              { id: 'iot-grid', label: 'Hilly IoT Sensor Grid', icon: Activity },
              { id: 'historical', label: 'Historical Analytics', icon: BarChart2 },
              { id: 'compare', label: 'City Comparison', icon: GitCompare },
              { id: 'simulator', label: 'Scenario Sandbox', icon: Sliders },
              { id: 'alerts', label: 'NDRF Alerts & Evacuation', icon: ShieldAlert, badge: alertCount },
              { id: 'methodology', label: 'Methodology & Data', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all relative ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500">Active Location:</span>
            <span className="font-semibold text-slate-200">{currentLocation.name}</span>
            <span className="text-slate-500">({currentLocation.state})</span>
          </div>
        </div>
      </nav>
    </header>
  );
};
