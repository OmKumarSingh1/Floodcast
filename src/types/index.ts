export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface LocationData {
  id: string;
  name: string;
  state: string;
  district?: string;
  latitude: number;
  longitude: number;
  elevation: number; // meters above sea level
  slopeAngle: number; // degrees
  riverBasin?: string;
  isHillyRegion: boolean;
  type?: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number; // current mm/h
  precipitation24h: number; // cumulative last 24h mm
  windSpeed: number; // km/h
  windDirection: number; // degrees
  pressure: number; // hPa
  visibility: number; // km
  condition: string;
  cloudCover: number; // %
  soilMoisture: number; // % saturation (0-7cm)
  soilMoistureDeep?: number; // % saturation (7-28cm)
  timestamp: string;
  isLive: boolean;
  dataSource: string;
}

export interface ForecastHour {
  time: string;
  hour: string;
  precipitation: number; // mm
  rainProbability: number; // %
  temperature: number; // °C
  windSpeed: number; // km/h
  riskScore: number; // 0 - 100
}

export interface ForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  totalPrecipitation: number;
  rainProbability: number;
  riskLevel: RiskLevel;
}

export interface ContributingFactor {
  factor: string;
  impact: 'low' | 'moderate' | 'high' | 'critical';
  value: string;
  weight: number; // 0 to 1
  description: string;
}

export interface RiskAssessment {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  probability: number; // %
  leadTimeHours: number; // Lead time for evacuation
  modelUsed: 'ML Random Forest Ensemble' | 'Baseline Risk Model';
  confidence: number; // %
  contributingFactors: ContributingFactor[];
  explanation: string;
  recommendedActions: string[];
  slopeStabilityIndex: number; // Factor of safety (0-3)
  runoffCoefficient: number; // 0 to 1
  timestamp: string;
}

export interface IoTSensorNode {
  id: string;
  name: string;
  locationName: string;
  type: 'SOIL_MOISTURE' | 'RIVER_GAUGE' | 'RAIN_GAUGE' | 'SLOPE_INCLINOMETER';
  latitude: number;
  longitude: number;
  currentValue: number;
  unit: string;
  thresholdWarning: number;
  thresholdCritical: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  batteryPct: number;
  lastPing: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  location: string;
  severity: 'INFORMATION' | 'WATCH' | 'WARNING' | 'CRITICAL';
  timestamp: string;
  reason: string;
  leadTime: string;
  recommendedAction: string;
  villagesWards: string[];
  source: string;
}

export interface HistoricalFloodEvent {
  year: number;
  date: string;
  location: string;
  state: string;
  peakRainfall24h: number; // mm
  casualties: number;
  estimatedDamageINR: string;
  cause: string;
  impactSeverity: 'Moderate' | 'High' | 'Catastrophic';
}

export interface CWCRiverStation {
  id: string;
  name: string;
  river: string;
  state: string;
  latitude: number;
  longitude: number;
  currentStage: number; // meters
  warningLevel: number; // meters
  dangerLevel: number; // meters
  hfl: number; // highest flood level (meters)
  dischargeCumecs: number; // m3/s
  trend: 'RISING' | 'FALLING' | 'STEADY';
  trendRate: number; // m/h
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  lastUpdated: string;
}

export interface RadarFrame {
  time: number;
  path: string;
  formattedTime: string;
  relativeTime: string;
}

export interface RadarData {
  host: string;
  available: boolean;
  frames: RadarFrame[];
  currentFrameIndex: number;
  tileUrlTemplate: string;
}

export interface RiverBasinCorridor {
  id: string;
  name: string;
  river: string;
  state: string;
  coordinates: [number, number][]; // [lat, lon]
  currentStageStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  description: string;
}
