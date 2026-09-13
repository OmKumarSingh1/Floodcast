import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { RiskCard } from './components/RiskCard';
import { WeatherCards } from './components/WeatherCards';
import { InteractiveMap } from './components/InteractiveMap';
import { ForecastSection } from './components/ForecastSection';
import { ExplainableAI } from './components/ExplainableAI';
import { HillyIoTGrid } from './components/HillyIoTGrid';
import { HistoricalAnalytics } from './components/HistoricalAnalytics';
import { CityComparison } from './components/CityComparison';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AlertsView } from './components/AlertsView';
import { MethodologyModal } from './components/MethodologyModal';
import { LiveMapView } from './components/LiveMapView';

import { LocationData, WeatherData, ForecastHour, ForecastDay, RiskAssessment, IoTSensorNode, DisasterAlert, RiskLevel } from './types';
import { api } from './services/api';
import { INDIAN_LOCATIONS_DATABASE } from './server/geocodingService';
import { CloudRain, AlertCircle, RefreshCw, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  // Default to Mandi, Himachal Pradesh (Vulnerable Hilly Zone with Beas Basin)
  const [currentLocation, setCurrentLocation] = useState<LocationData>(INDIAN_LOCATIONS_DATABASE[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<ForecastHour[]>([]);
  const [daily, setDaily] = useState<ForecastDay[]>([]);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [iotNodes, setIotNodes] = useState<IoTSensorNode[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeModel, setActiveModel] = useState<'ensemble' | 'baseline'>('ensemble');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [heroDismissed, setHeroDismissed] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Initial load for IoT nodes and alerts
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [nodesData, alertsData] = await Promise.all([
          api.getIoTNodes(),
          api.getAlerts()
        ]);
        setIotNodes(nodesData);
        setAlerts(alertsData);
      } catch (err) {
        console.error('Failed to load telemetry or alerts:', err);
      }
    }
    loadInitialData();
  }, []);

  // Fetch comprehensive risk and weather whenever location or model changes
  const loadLocationRisk = async (loc: LocationData, model: 'ensemble' | 'baseline' = activeModel) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await api.getComprehensiveRisk(loc.latitude, loc.longitude, loc.name, model);
      setCurrentLocation(data.location || loc);
      setWeather(data.weather);
      setHourly(data.hourly || []);
      setDaily(data.daily || []);
      setRisk(data.risk);
    } catch (err: any) {
      console.error('Failed to load risk assessment:', err);
      setFetchError('Live data calculation error. Retrying with regional telemetry baseline...');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocationRisk(currentLocation, activeModel);
  }, [currentLocation.id, activeModel]);

  // Handle GPS "Use My Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const resolvedLoc = await api.reverseGeocode(lat, lon);
          setCurrentLocation(resolvedLoc);
        } catch (err) {
          console.error('GPS resolution failed:', err);
          setGpsError('Could not resolve your location name. Please search manually.');
        } finally {
          setIsGpsLoading(false);
        }
      },
      (err) => {
        setIsGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission was denied. Please search for an Indian city or district instead.');
        } else {
          setGpsError('Unable to retrieve your current location.');
        }
        setTimeout(() => setGpsError(null), 6000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Click Anywhere on GIS Map
  const handleSelectMapCoordinates = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const resolvedLoc = await api.reverseGeocode(lat, lon);
      setCurrentLocation(resolvedLoc);
    } catch (e) {
      console.error('Map coordinate resolution failed:', e);
    }
  };

  // Refresh IoT telemetry
  const handleRefreshIoT = async () => {
    try {
      const nodesData = await api.getIoTNodes();
      setIotNodes(nodesData);
    } catch (e) {
      console.error('IoT refresh error:', e);
    }
  };

  const currentRiskLevel: RiskLevel = risk?.riskLevel || 'LOW';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          if (activeTab !== 'overview') setActiveTab('overview');
        }}
        onUseMyLocation={handleUseMyLocation}
        isGpsLoading={isGpsLoading}
        gpsError={gpsError}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRiskLevel={currentRiskLevel}
        alertCount={alerts.length}
      />

      {/* Hero Banner for SIH 2026 Context */}
      <LandingHero
        isDismissed={heroDismissed}
        onDismiss={() => setHeroDismissed(true)}
        onExploreHilly={() => {
          const mandi = INDIAN_LOCATIONS_DATABASE[0];
          setCurrentLocation(mandi);
          setActiveTab('overview');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Error notification banner if any */}
        {fetchError && (
          <div className="p-3.5 bg-amber-950/80 border border-amber-800 text-amber-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => loadLocationRisk(currentLocation, activeModel)}
              className="px-2 py-1 bg-amber-900/60 hover:bg-amber-900 rounded font-semibold text-amber-100 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Tab 1: Primary Overview & GIS Map */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {isLoading || !risk || !weather ? (
              <div className="h-96 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center gap-3">
                <span className="animate-spin h-8 w-8 border-3 border-cyan-500 border-t-transparent rounded-full"></span>
                <p className="text-xs font-semibold text-slate-300">
                  Calculating multi-source flash flood risk for {currentLocation.name}...
                </p>
                <span className="text-[11px] text-slate-500">
                  Synthesizing NWP Precipitation + Soil Moisture Saturation + Terrain Slope Runoff
                </span>
              </div>
            ) : (
              <>
                {/* 1. Main Risk HUD Card */}
                <RiskCard
                  location={currentLocation}
                  risk={risk}
                  activeModel={activeModel}
                  onToggleModel={(model) => setActiveModel(model)}
                  onViewEvacuation={() => setActiveTab('alerts')}
                />

                {/* 2. Real-Time Meteorological & Geotechnical Weather Cards */}
                <WeatherCards weather={weather} location={currentLocation} />

                {/* 3. GIS Interactive Spatial Map */}
                <InteractiveMap
                  currentLocation={currentLocation}
                  risk={risk}
                  iotNodes={iotNodes}
                  onSelectCoordinates={handleSelectMapCoordinates}
                />

                {/* 4. Explainable AI & Feature Contribution Breakdown */}
                <ExplainableAI
                  location={currentLocation}
                  weather={weather}
                  risk={risk}
                />

                {/* 5. 24-Hour Hourly Forecast & 7-Day Outlook */}
                <ForecastSection hourly={hourly} daily={daily} />
              </>
            )}
          </div>
        )}

        {/* Tab: Dedicated Live GIS & Doppler Radar Network */}
        {activeTab === 'live-map' && risk && (
          <LiveMapView
            currentLocation={currentLocation}
            risk={risk}
            iotNodes={iotNodes}
            onSelectCoordinates={handleSelectMapCoordinates}
          />
        )}

        {/* Tab 2: Hilly IoT Sensor Network */}
        {activeTab === 'iot-grid' && (
          <HillyIoTGrid nodes={iotNodes} onRefresh={handleRefreshIoT} />
        )}

        {/* Tab 3: Historical Analytics */}
        {activeTab === 'historical' && (
          <HistoricalAnalytics currentLocationName={currentLocation.name} />
        )}

        {/* Tab 4: City & Regional Comparison */}
        {activeTab === 'compare' && (
          <CityComparison />
        )}

        {/* Tab 5: Scenario Simulation Sandbox */}
        {activeTab === 'simulator' && (
          <ScenarioSimulator />
        )}

        {/* Tab 6: NDRF Early Warnings & Evacuation Advisories */}
        {activeTab === 'alerts' && (
          <AlertsView alerts={alerts} currentLocationName={currentLocation.name} />
        )}

        {/* Tab 7: Methodology & Architecture Documentation */}
        {activeTab === 'methodology' && (
          <MethodologyModal />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              F
            </div>
            <div>
              <span className="font-bold text-slate-200">FloodCast AI</span>
              <span className="mx-1.5 text-slate-600">•</span>
              <span>Predict. Prepare. Protect.</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-0.5">
            <p className="text-slate-400">
              Developed for <strong>Smart India Hackathon (SIH 2026)</strong> • Problem Statement ID: <strong>26192</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Ministry of Home Affairs • National Disaster Response Force (NDRF) DM Division
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
