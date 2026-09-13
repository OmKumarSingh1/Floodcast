import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { searchLocations, reverseGeocode, INDIAN_LOCATIONS_DATABASE } from './src/server/geocodingService';
import { fetchLiveWeather } from './src/server/weatherService';
import { calculateFloodRisk } from './src/server/riskEngine';
import { HISTORICAL_FLOOD_EVENTS, IOT_SENSOR_NODES, getHistoricalTimeSeriesForLocation } from './src/server/historicalData';
import { generateNDRFSituationReport } from './src/server/geminiService';
import { CWC_RIVER_STATIONS, RIVER_BASIN_CORRIDORS, getLiveRadarData } from './src/server/cwcData';
import { DisasterAlert, LocationData } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Structured Logging Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      if (req.path.startsWith('/api/')) {
        console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - start}ms)`);
      }
    });
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'FloodCast AI Core API',
      version: '2.6.0-SIH2026',
      datasetIntegrations: ['Open-Meteo High-Resolution NWP', 'OpenStreetMap Nominatim', 'NDRF DM Division Inventory', 'CWC Basin Telemetry']
    });
  });

  // 1. Location search endpoint
  app.get('/api/location/search', async (req: Request, res: Response) => {
    try {
      const q = (req.query.q as string) || '';
      const results = await searchLocations(q);
      res.json(results);
    } catch (err: any) {
      console.error('Error in /api/location/search:', err);
      res.status(500).json({ error: 'Failed to search locations', fallback: INDIAN_LOCATIONS_DATABASE.slice(0, 5) });
    }
  });

  // 2. Reverse geocoding endpoint
  app.get('/api/location/reverse', async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Valid lat and lon query parameters required' });
      }

      const location = await reverseGeocode(lat, lon);
      res.json(location);
    } catch (err: any) {
      console.error('Error in /api/location/reverse:', err);
      res.status(500).json({ error: 'Failed to reverse geocode' });
    }
  });

  // 3. Weather current & forecast endpoint
  app.get('/api/weather', async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Valid lat and lon required' });
      }

      const weatherData = await fetchLiveWeather(lat, lon);
      res.json(weatherData);
    } catch (err: any) {
      console.error('Error in /api/weather:', err);
      res.status(500).json({ error: 'Live weather data is temporarily unavailable.' });
    }
  });

  // 4. Combined Risk Evaluation Endpoint
  app.get('/api/risk', async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      const name = (req.query.name as string) || 'Selected Location';
      const modelType = (req.query.model as string) === 'baseline' ? 'Baseline Risk Model' : 'ML Random Forest Ensemble';

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Valid lat and lon required' });
      }

      // Check if location matches known database for accurate slope/elevation
      let locData: LocationData | undefined = INDIAN_LOCATIONS_DATABASE.find(
        l => Math.abs(l.latitude - lat) < 0.1 && Math.abs(l.longitude - lon) < 0.1
      );

      if (!locData) {
        locData = await reverseGeocode(lat, lon);
      }

      const weather = await fetchLiveWeather(lat, lon);
      const assessment = calculateFloodRisk(locData, weather.current, weather.hourly, modelType);

      res.json({
        location: locData,
        weather: weather.current,
        hourly: weather.hourly,
        daily: weather.daily,
        risk: assessment
      });
    } catch (err: any) {
      console.error('Error in /api/risk:', err);
      res.status(500).json({ error: 'Failed to compute flood risk assessment' });
    }
  });

  // 5. Explainable AI & Deep NDRF Situation Report
  app.get('/api/risk/explanation', async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Valid lat and lon required' });
      }

      let locData: LocationData | undefined = INDIAN_LOCATIONS_DATABASE.find(
        l => Math.abs(l.latitude - lat) < 0.1 && Math.abs(l.longitude - lon) < 0.1
      );

      if (!locData) {
        locData = await reverseGeocode(lat, lon);
      }

      const weather = await fetchLiveWeather(lat, lon);
      const assessment = calculateFloodRisk(locData, weather.current, weather.hourly);
      const aiReport = await generateNDRFSituationReport(locData, weather.current, assessment);

      res.json({
        ...aiReport,
        riskScore: assessment.riskScore,
        riskLevel: assessment.riskLevel,
        leadTimeHours: assessment.leadTimeHours,
        factors: assessment.contributingFactors
      });
    } catch (err: any) {
      console.error('Error in /api/risk/explanation:', err);
      res.status(500).json({ error: 'Failed to generate explanation' });
    }
  });

  // 6. Historical flood events & time-series
  app.get('/api/historical', (req: Request, res: Response) => {
    try {
      const locName = (req.query.location as string) || 'Mandi';
      const timeSeries = getHistoricalTimeSeriesForLocation(locName);
      res.json({
        events: HISTORICAL_FLOOD_EVENTS,
        timeSeries,
        location: locName
      });
    } catch (err: any) {
      console.error('Error in /api/historical:', err);
      res.status(500).json({ error: 'Failed to load historical disaster data' });
    }
  });

  // 7. IoT sensor network telemetry
  app.get('/api/iot-nodes', (req: Request, res: Response) => {
    res.json(IOT_SENSOR_NODES);
  });

  // 8. Alerts & warning bulletins
  app.get('/api/alerts', (req: Request, res: Response) => {
    const alerts: DisasterAlert[] = [
      {
        id: 'ALT-NDRF-2026-08',
        title: 'Flash Flood Watch: Upper Beas Basin & Mandi Gorge',
        location: 'Mandi, Himachal Pradesh',
        severity: 'CRITICAL',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        reason: 'Soil saturation > 86% with active upstream cloudburst cell delivering 68mm/3h over Aut and Pandoh catchments.',
        leadTime: '2.5 Hours until river stage crest',
        recommendedAction: 'Immediate evacuation of riparian settlements along Beas banks. Move all vehicles to high ridges. NDRF Battalion 14 on standby.',
        villagesWards: ['Pandoh Ward 3', 'Aut Riverside', 'Bajaura Lowlands', 'Mandi Old Town Wharf'],
        source: 'NDRF DM Division & IMD Doppler Radar Station'
      },
      {
        id: 'ALT-SDMA-2026-14',
        title: 'Landslide & Runoff Surge Warning: Chooralmala Slope',
        location: 'Wayanad, Kerala',
        severity: 'WARNING',
        timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        reason: 'Inclinometer creep rate reaching 4.8mm/h coupled with continuous 24h rainfall of 84mm on 34° hill slope.',
        leadTime: '3.5 Hours actionable lead time',
        recommendedAction: 'Relocate families in Meppadi and Mundakkai tea estate quarters to pre-assigned rescue camps.',
        villagesWards: ['Mundakkai Sector 2', 'Chooralmala Bridge Zone', 'Attamala Upper Terrace'],
        source: 'Kerala State Disaster Management Authority (KSDMA)'
      },
      {
        id: 'ALT-CWC-2026-03',
        title: 'Rising Hydrologic Stage: Alaknanda Catchment',
        location: 'Chamoli / Joshimath, Uttarakhand',
        severity: 'WATCH',
        timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
        reason: 'Accelerated snowmelt and tributary inflow at Vishnuprayag confluence approaching warning level.',
        leadTime: '6.0 Hours forecast window',
        recommendedAction: 'Halt all riverbed gravel operations and pilgrim transit near riverside ghats.',
        villagesWards: ['Vishnuprayag Lowland', 'Marwari Ward 1', 'Helang River Confluence'],
        source: 'Central Water Commission (CWC) Hydrological Monitoring'
      },
      {
        id: 'ALT-BMC-2026-01',
        title: 'High Tide & Stormwater Discharge Watch',
        location: 'Mumbai, Maharashtra',
        severity: 'INFORMATION',
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
        reason: '4.45m astronomical high tide expected at 16:30 IST. Stormwater outfalls into Arabian Sea will experience tidal locking.',
        leadTime: 'Periodic monitoring',
        recommendedAction: 'Municipal pump stations at Love Grove and Britannia activated. Avoid seaside promenades.',
        villagesWards: ['Kurla Mithi Basin', 'Hindmata Low-Lying Area', 'Milan Subway Sector'],
        source: 'Brihanmumbai Disaster Management Cell'
      }
    ];

    res.json(alerts);
  });

  // 9. Prediction Sandbox / Simulation Endpoint
  app.post('/api/prediction/simulate', (req: Request, res: Response) => {
    try {
      const { rainfall24h, rainRate, soilMoisture, slopeAngle, elevation, isHillyRegion, riverBasin } = req.body;

      const dummyLoc: LocationData = {
        id: 'sim-scenario',
        name: 'Simulation Scenario Zone',
        state: 'Custom Scenario',
        latitude: 31.5,
        longitude: 77.0,
        elevation: Number(elevation) || 1200,
        slopeAngle: Number(slopeAngle) || 28,
        isHillyRegion: isHillyRegion !== false,
        riverBasin: riverBasin || 'Simulated Mountain Basin'
      };

      const dummyWeather: any = {
        precipitation24h: Number(rainfall24h) || 60,
        precipitation: Number(rainRate) || 12,
        soilMoisture: Number(soilMoisture) || 80,
        temperature: 22,
        feelsLike: 23,
        humidity: 85,
        windSpeed: 15,
        windDirection: 180,
        pressure: 1005,
        visibility: 8,
        condition: 'Simulated Torrential Rain',
        cloudCover: 90,
        timestamp: new Date().toISOString(),
        isLive: false,
        dataSource: 'Scenario Simulation Sandbox'
      };

      const dummyHourly = Array.from({ length: 12 }).map((_, i) => ({
        time: new Date(Date.now() + i * 3600000).toISOString(),
        hour: `+${i + 1}h`,
        precipitation: (Number(rainRate) || 12) * 0.9,
        rainProbability: 85,
        temperature: 22,
        windSpeed: 15,
        riskScore: 70
      }));

      const assessment = calculateFloodRisk(dummyLoc, dummyWeather, dummyHourly, 'ML Random Forest Ensemble');

      res.json({
        scenario: req.body,
        assessment
      });
    } catch (err: any) {
      console.error('Error in /api/prediction/simulate:', err);
      res.status(500).json({ error: 'Simulation computation failed' });
    }
  });

  // 10. Multi-City Comparison Endpoint
  app.get('/api/compare', async (req: Request, res: Response) => {
    try {
      const cityIds = ((req.query.cities as string) || 'in-mandi,in-wayanad,in-guwahati,in-mumbai').split(',');
      const results = [];

      for (const id of cityIds) {
        const loc = INDIAN_LOCATIONS_DATABASE.find(l => l.id === id) || INDIAN_LOCATIONS_DATABASE[0];
        const weather = await fetchLiveWeather(loc.latitude, loc.longitude);
        const risk = calculateFloodRisk(loc, weather.current, weather.hourly);

        results.push({
          location: loc,
          weather: weather.current,
          risk
        });
      }

      res.json(results);
    } catch (err: any) {
      console.error('Error in /api/compare:', err);
      res.status(500).json({ error: 'Failed to compare cities' });
    }
  });

  // 11. Live Doppler Weather Radar (RainViewer frames + tile URLs)
  app.get('/api/radar', async (req: Request, res: Response) => {
    try {
      const radar = await getLiveRadarData();
      res.json(radar);
    } catch (err: any) {
      console.error('Error in /api/radar:', err);
      res.status(500).json({ error: 'Failed to fetch live radar data' });
    }
  });

  // 12. Central Water Commission (CWC) Real-Time Gauge Stations
  app.get('/api/cwc-stations', (req: Request, res: Response) => {
    res.json(CWC_RIVER_STATIONS);
  });

  // 13. River Basin Drainage Corridors
  app.get('/api/river-basins', (req: Request, res: Response) => {
    res.json(RIVER_BASIN_CORRIDORS);
  });

  // 14. Live National Disaster Situational Overview
  app.get('/api/live-summary', async (req: Request, res: Response) => {
    try {
      const warningStations = CWC_RIVER_STATIONS.filter(s => s.status !== 'NORMAL');
      const criticalStations = CWC_RIVER_STATIONS.filter(s => s.status === 'CRITICAL');
      const radar = await getLiveRadarData();

      res.json({
        timestamp: new Date().toISOString(),
        radarOnline: radar.available,
        radarFramesCount: radar.frames.length,
        activeRiverStationsCount: CWC_RIVER_STATIONS.length,
        warningRiverStations: warningStations.length,
        criticalRiverStations: criticalStations.length,
        highRiskCatchments: ['Upper Beas (Mandi)', 'Teesta Gorge (Sikkim)', 'Lower Brahmaputra (Guwahati)', 'Chaliyar (Wayanad)'],
        activeSystemStatus: 'DEFENSE_MONITORING_ACTIVE'
      });
    } catch (err: any) {
      console.error('Error in /api/live-summary:', err);
      res.status(500).json({ error: 'Failed to generate live summary' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FloodCast AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
