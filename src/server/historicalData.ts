import { HistoricalFloodEvent, IoTSensorNode } from '../types';

export const HISTORICAL_FLOOD_EVENTS: HistoricalFloodEvent[] = [
  {
    year: 2024,
    date: 'July 30, 2024',
    location: 'Wayanad (Chooralmala & Meppadi)',
    state: 'Kerala',
    peakRainfall24h: 572,
    casualties: 420,
    estimatedDamageINR: '₹1,200 Crore',
    cause: 'Extreme orographic cloudburst + 98% saturated steep laterite hill slopes triggering catastrophic debris flows.',
    impactSeverity: 'Catastrophic'
  },
  {
    year: 2023,
    date: 'July 9-11, 2023',
    location: 'Mandi & Kullu Valley (Beas Basin)',
    state: 'Himachal Pradesh',
    peakRainfall24h: 246,
    casualties: 110,
    estimatedDamageINR: '₹8,680 Crore',
    cause: 'Western Disturbance interaction with SW Monsoon delivering unprecedented catchment precipitation into Beas river gorge.',
    impactSeverity: 'Catastrophic'
  },
  {
    year: 2023,
    date: 'October 4, 2023',
    location: 'Teesta Basin (South Lhonak Lake GLOF)',
    state: 'Sikkim',
    peakRainfall24h: 185,
    casualties: 94,
    estimatedDamageINR: '₹3,400 Crore',
    cause: 'Glacial Lake Outburst Flood (GLOF) triggered by sudden breach compounding downstream monsoon river levels.',
    impactSeverity: 'Catastrophic'
  },
  {
    year: 2021,
    date: 'February 7, 2021',
    location: 'Chamoli & Joshimath (Rishi Ganga / Dhauli Ganga)',
    state: 'Uttarakhand',
    peakRainfall24h: 75,
    casualties: 204,
    estimatedDamageINR: '₹1,500 Crore',
    cause: 'Hanging glacier rock-ice detachment generating high-velocity flash flood and dam surge at Tapovan.',
    impactSeverity: 'Catastrophic'
  },
  {
    year: 2018,
    date: 'August 8-16, 2018',
    location: 'Idukki, Wayanad, Ernakulam (Periyar Basin)',
    state: 'Kerala',
    peakRainfall24h: 310,
    casualties: 483,
    estimatedDamageINR: '₹31,000 Crore',
    cause: 'Consecutive atmospheric depressions causing 164% above normal monsoon rainfall, forcing 35 dams to open gates.',
    impactSeverity: 'Catastrophic'
  },
  {
    year: 2015,
    date: 'December 1-2, 2015',
    location: 'Chennai (Adyar & Cooum Rivers)',
    state: 'Tamil Nadu',
    peakRainfall24h: 494,
    casualties: 289,
    estimatedDamageINR: '₹15,000 Crore',
    cause: 'Northeast monsoon trough stalled over coastal lowlands, leading to Chembarambakkam reservoir surplus discharge.',
    impactSeverity: 'Catastrophic'
  },
  {
    year: 2013,
    date: 'June 16-17, 2013',
    location: 'Kedarnath & Mandakini Valley',
    state: 'Uttarakhand',
    peakRainfall24h: 375,
    casualties: 5700,
    estimatedDamageINR: '₹9,500 Crore',
    cause: 'Multi-day cloudburst coupled with Chorabari glacial lake moraine collapse down Mandakini river gorge.',
    impactSeverity: 'Catastrophic'
  },
  {
    year: 2022,
    date: 'May - July 2022',
    location: 'Silchar & Guwahati (Brahmaputra & Barak Basins)',
    state: 'Assam',
    peakRainfall24h: 280,
    casualties: 197,
    estimatedDamageINR: '₹10,000 Crore',
    cause: 'Prolonged inundation of Barak valley dykes following continuous pre-monsoon heavy rains in Meghalaya hills.',
    impactSeverity: 'High'
  },
  {
    year: 2005,
    date: 'July 26, 2005',
    location: 'Mumbai (Mithi River & Suburbs)',
    state: 'Maharashtra',
    peakRainfall24h: 944,
    casualties: 1094,
    estimatedDamageINR: '₹4,500 Crore',
    cause: 'Historic mesoscale convective storm stalling over Mumbai coincided with high astronomical tide in Arabian Sea.',
    impactSeverity: 'Catastrophic'
  }
];

// High-density hilly IoT sensor telemetry network (SIH 2026 Problem Statement 26192)
export const IOT_SENSOR_NODES: IoTSensorNode[] = [
  {
    id: 'IOT-SM-01',
    name: 'Vibrating Wire Piezometer Node #4',
    locationName: 'Mandi - Pandoh Hill Slope',
    type: 'SOIL_MOISTURE',
    latitude: 31.6705,
    longitude: 76.9920,
    currentValue: 86.4,
    unit: '% Saturation',
    thresholdWarning: 75.0,
    thresholdCritical: 85.0,
    status: 'CRITICAL',
    batteryPct: 94,
    lastPing: '2 mins ago'
  },
  {
    id: 'IOT-RG-02',
    name: 'Ultrasonic River Level Gauge #12',
    locationName: 'Beas River - Aut Bridge',
    type: 'RIVER_GAUGE',
    latitude: 31.7450,
    longitude: 77.2100,
    currentValue: 14.8,
    unit: 'm Gauge Height (Danger: 15.0m)',
    thresholdWarning: 12.5,
    thresholdCritical: 14.5,
    status: 'CRITICAL',
    batteryPct: 88,
    lastPing: '1 min ago'
  },
  {
    id: 'IOT-SI-03',
    name: 'MEMS Tilt Inclinometer Node #8',
    locationName: 'Joshimath - Ravigram Slope',
    type: 'SLOPE_INCLINOMETER',
    latitude: 30.5510,
    longitude: 79.5720,
    currentValue: 4.8,
    unit: 'mm/h Creep Displacement',
    thresholdWarning: 2.0,
    thresholdCritical: 4.0,
    status: 'CRITICAL',
    batteryPct: 91,
    lastPing: 'Just now'
  },
  {
    id: 'IOT-RN-04',
    name: 'Tipping Bucket Rain Gauge #21',
    locationName: 'Wayanad - Mundakkai Ridge',
    type: 'RAIN_GAUGE',
    latitude: 11.5320,
    longitude: 76.1410,
    currentValue: 68.5,
    unit: 'mm / 3hr',
    thresholdWarning: 45.0,
    thresholdCritical: 65.0,
    status: 'CRITICAL',
    batteryPct: 97,
    lastPing: '4 mins ago'
  },
  {
    id: 'IOT-SM-05',
    name: 'TDR Soil Volumetric Probe #7',
    locationName: 'Kullu - Akhara Bazar',
    type: 'SOIL_MOISTURE',
    latitude: 31.9620,
    longitude: 77.1150,
    currentValue: 71.2,
    unit: '% Saturation',
    thresholdWarning: 70.0,
    thresholdCritical: 85.0,
    status: 'WARNING',
    batteryPct: 82,
    lastPing: '3 mins ago'
  },
  {
    id: 'IOT-RG-06',
    name: 'Radar Water Level Sensor #09',
    locationName: 'Alaknanda - Vishnuprayag Confluence',
    type: 'RIVER_GAUGE',
    latitude: 30.5640,
    longitude: 79.5780,
    currentValue: 8.2,
    unit: 'm Level (Danger: 10.0m)',
    thresholdWarning: 7.5,
    thresholdCritical: 9.5,
    status: 'WARNING',
    batteryPct: 95,
    lastPing: '5 mins ago'
  },
  {
    id: 'IOT-RN-07',
    name: 'Solar Optical Rain Sensor #15',
    locationName: 'Darjeeling - Batasia Loop',
    type: 'RAIN_GAUGE',
    latitude: 27.0180,
    longitude: 88.2450,
    currentValue: 24.0,
    unit: 'mm / 3hr',
    thresholdWarning: 40.0,
    thresholdCritical: 60.0,
    status: 'NORMAL',
    batteryPct: 99,
    lastPing: '1 min ago'
  },
  {
    id: 'IOT-RG-08',
    name: 'Telemetry Acoustic Gauge #03',
    locationName: 'Guwahati - Saraighat Ghat',
    type: 'RIVER_GAUGE',
    latitude: 26.1280,
    longitude: 91.6850,
    currentValue: 47.9,
    unit: 'm MSL (Danger: 49.68m)',
    thresholdWarning: 47.0,
    thresholdCritical: 49.0,
    status: 'WARNING',
    batteryPct: 90,
    lastPing: 'Just now'
  }
];

export function getHistoricalTimeSeriesForLocation(locationName: string) {
  // Generate 30 days of daily historical rainfall, soil moisture, and river level trend
  const baseDate = new Date();
  const series = [];
  
  // Create deterministic baseline pattern seeded by location name
  const seed = locationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    const dayFactor = Math.sin((i + seed) / 4) * 0.5 + 0.5;
    const spikeFactor = (i === 3 || i === 4) ? 2.8 : 1.0;
    
    const rainfall = Math.round((dayFactor * 45 * spikeFactor) * 10) / 10;
    const soilMoisture = Math.min(96, Math.round(50 + (rainfall * 0.5) + Math.sin(i / 3) * 10));
    const riverLevelM = Math.round((3.2 + (rainfall / 30) + (soilMoisture / 60)) * 10) / 10;
    const riskIndex = Math.min(100, Math.round((rainfall * 0.7) + (soilMoisture * 0.3)));

    series.push({
      date: dateStr,
      rainfall,
      soilMoisture,
      riverLevel: riverLevelM,
      riskIndex
    });
  }

  return series;
}
