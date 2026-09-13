import { LocationData, WeatherData, ForecastHour, ForecastDay, RiskAssessment, IoTSensorNode, DisasterAlert, HistoricalFloodEvent, CWCRiverStation, RadarData, RiverBasinCorridor } from '../types';

export interface ComprehensiveRiskResponse {
  location: LocationData;
  weather: WeatherData;
  hourly: ForecastHour[];
  daily: ForecastDay[];
  risk: RiskAssessment;
}

export interface ExplanationResponse {
  reportText: string;
  tacticalEvacuationSummary: string;
  source: string;
  riskScore: number;
  riskLevel: string;
  leadTimeHours: number;
  factors: any[];
}

export const api = {
  async searchLocations(query: string): Promise<LocationData[]> {
    try {
      const res = await fetch(`/api/location/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (err) {
      console.warn('Location search fallback:', err);
      return [];
    }
  },

  async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    const res = await fetch(`/api/location/reverse?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Reverse geocoding failed');
    return await res.json();
  },

  async getComprehensiveRisk(lat: number, lon: number, name?: string, model: 'ensemble' | 'baseline' = 'ensemble'): Promise<ComprehensiveRiskResponse> {
    const res = await fetch(`/api/risk?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name || '')}&model=${model}`);
    if (!res.ok) throw new Error('Risk assessment computation failed');
    return await res.json();
  },

  async getRiskExplanation(lat: number, lon: number, name?: string): Promise<ExplanationResponse> {
    const res = await fetch(`/api/risk/explanation?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name || '')}`);
    if (!res.ok) throw new Error('Explanation retrieval failed');
    return await res.json();
  },

  async getHistoricalData(location: string): Promise<{
    events: HistoricalFloodEvent[];
    timeSeries: any[];
    location: string;
  }> {
    const res = await fetch(`/api/historical?location=${encodeURIComponent(location)}`);
    if (!res.ok) throw new Error('Historical data retrieval failed');
    return await res.json();
  },

  async getIoTNodes(): Promise<IoTSensorNode[]> {
    const res = await fetch('/api/iot-nodes');
    if (!res.ok) throw new Error('IoT nodes retrieval failed');
    return await res.json();
  },

  async getAlerts(): Promise<DisasterAlert[]> {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Alerts retrieval failed');
    return await res.json();
  },

  async compareLocations(cityIds: string[]): Promise<Array<{
    location: LocationData;
    weather: WeatherData;
    risk: RiskAssessment;
  }>> {
    const res = await fetch(`/api/compare?cities=${encodeURIComponent(cityIds.join(','))}`);
    if (!res.ok) throw new Error('Comparison retrieval failed');
    return await res.json();
  },

  async runSimulation(payload: {
    rainfall24h: number;
    rainRate: number;
    soilMoisture: number;
    slopeAngle: number;
    elevation: number;
    isHillyRegion: boolean;
    riverBasin: string;
  }): Promise<{ scenario: any; assessment: RiskAssessment }> {
    const res = await fetch('/api/prediction/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Simulation failed');
    return await res.json();
  },

  async getLiveRadar(): Promise<RadarData> {
    const res = await fetch('/api/radar');
    if (!res.ok) throw new Error('Live radar fetch failed');
    return await res.json();
  },

  async getCWCStations(): Promise<CWCRiverStation[]> {
    const res = await fetch('/api/cwc-stations');
    if (!res.ok) throw new Error('CWC stations fetch failed');
    return await res.json();
  },

  async getRiverBasins(): Promise<RiverBasinCorridor[]> {
    const res = await fetch('/api/river-basins');
    if (!res.ok) throw new Error('River basins fetch failed');
    return await res.json();
  },

  async getLiveSummary(): Promise<{
    timestamp: string;
    radarOnline: boolean;
    radarFramesCount: number;
    activeRiverStationsCount: number;
    warningRiverStations: number;
    criticalRiverStations: number;
    highRiskCatchments: string[];
    activeSystemStatus: string;
  }> {
    const res = await fetch('/api/live-summary');
    if (!res.ok) throw new Error('Live summary fetch failed');
    return await res.json();
  }
};
