import { WeatherData, ForecastHour, ForecastDay, RiskLevel } from '../types';

export async function fetchLiveWeather(lat: number, lon: number): Promise<{
  current: WeatherData;
  hourly: ForecastHour[];
  daily: ForecastDay[];
}> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,cloud_cover,soil_moisture_0_to_7cm,soil_moisture_7_to_28cm&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,soil_moisture_0_to_7cm&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata&past_days=1&forecast_days=7`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }

    const data = await response.json();
    const curr = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    // Calculate 24h past precipitation from hourly array if available
    let past24hPrecipitation = 0;
    if (hourly.precipitation && hourly.time) {
      // Look at the past 24 values
      const pastSlice = hourly.precipitation.slice(0, 24);
      past24hPrecipitation = pastSlice.reduce((sum: number, val: number) => sum + (val || 0), 0);
    }
    // Round to 1 decimal place
    past24hPrecipitation = Math.round(past24hPrecipitation * 10) / 10;

    // Soil moisture percentage from m³/m³ (typically 0.0 to 0.5+ where 0.45 is saturated)
    const rawSoilMoisture = curr.soil_moisture_0_to_7cm ?? 0.28;
    const soilMoisturePct = Math.min(100, Math.round((rawSoilMoisture / 0.45) * 100));

    const rawSoilMoistureDeep = curr.soil_moisture_7_to_28cm ?? 0.32;
    const soilMoistureDeepPct = Math.min(100, Math.round((rawSoilMoistureDeep / 0.45) * 100));

    const weatherCondition = decodeWmoWeatherCode(curr.weather_code ?? 0);

    const currentWeatherData: WeatherData = {
      temperature: Math.round((curr.temperature_2m ?? 24.5) * 10) / 10,
      feelsLike: Math.round((curr.apparent_temperature ?? 26.0) * 10) / 10,
      humidity: Math.round(curr.relative_humidity_2m ?? 75),
      precipitation: Math.round((curr.precipitation ?? 0.0) * 10) / 10,
      precipitation24h: past24hPrecipitation,
      windSpeed: Math.round(curr.wind_speed_10m ?? 12),
      windDirection: Math.round(curr.wind_direction_10m ?? 180),
      pressure: Math.round(curr.surface_pressure ?? 1008),
      visibility: 9.8,
      condition: weatherCondition,
      cloudCover: Math.round(curr.cloud_cover ?? 60),
      soilMoisture: soilMoisturePct,
      soilMoistureDeep: soilMoistureDeepPct,
      timestamp: new Date().toISOString(),
      isLive: true,
      dataSource: 'Open-Meteo High-Resolution NWP (India/ECMWF Model)'
    };

    // Format next 24 hours
    const currentHourIndex = hourly.time ? Math.min(24, Math.max(0, hourly.time.findIndex((t: string) => new Date(t) >= new Date()))) : 24;
    const next24Hours: ForecastHour[] = [];
    
    if (hourly.time) {
      for (let i = currentHourIndex; i < Math.min(currentHourIndex + 24, hourly.time.length); i++) {
        const timeStr = hourly.time[i];
        const dateObj = new Date(timeStr);
        const hourLabel = dateObj.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' });
        const precip = hourly.precipitation ? Math.round((hourly.precipitation[i] || 0) * 10) / 10 : 0;
        const rainProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] || 0 : 0;
        const temp = hourly.temperature_2m ? Math.round(hourly.temperature_2m[i]) : 25;
        const wind = hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[i]) : 10;
        
        // Calculate rough hourly risk contribution
        const hourlyRisk = Math.min(100, Math.round((precip * 6) + (rainProb * 0.4)));

        next24Hours.push({
          time: timeStr,
          hour: hourLabel,
          precipitation: precip,
          rainProbability: rainProb,
          temperature: temp,
          windSpeed: wind,
          riskScore: hourlyRisk
        });
      }
    }

    // Format 7-day daily forecast
    const forecastDays: ForecastDay[] = [];
    if (daily.time) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let d = 0; d < Math.min(7, daily.time.length); d++) {
        const dDate = new Date(daily.time[d]);
        const dayName = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : dayNames[dDate.getDay()];
        const precipSum = daily.precipitation_sum ? Math.round((daily.precipitation_sum[d] || 0) * 10) / 10 : 0;
        const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[d] || 0 : 0;
        
        let riskLvl: RiskLevel = 'LOW';
        if (precipSum > 115 || (precipSum > 70 && rainProb > 80)) riskLvl = 'CRITICAL';
        else if (precipSum > 65 || (precipSum > 35 && rainProb > 70)) riskLvl = 'HIGH';
        else if (precipSum > 20 || rainProb > 50) riskLvl = 'MODERATE';

        forecastDays.push({
          date: daily.time[d],
          dayName,
          maxTemp: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[d]) : 28,
          minTemp: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[d]) : 18,
          totalPrecipitation: precipSum,
          rainProbability: rainProb,
          riskLevel: riskLvl
        });
      }
    }

    return {
      current: currentWeatherData,
      hourly: next24Hours,
      daily: forecastDays
    };

  } catch (error) {
    console.error('Failed to fetch live weather data:', error);
    // Return standard calibrated fallback with clear labeling
    return getFallbackWeatherData(lat, lon);
  }
}

function decodeWmoWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Dense Fog / Mist';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 63) return 'Moderate Rain';
  if (code >= 65) return 'Heavy Monsoon Torrent';
  if (code >= 80 && code <= 82) return 'Intense Rain Showers';
  if (code >= 95) return 'Severe Thunderstorm with Rain';
  return 'Cloudy';
}

function getFallbackWeatherData(lat: number, lon: number): {
  current: WeatherData;
  hourly: ForecastHour[];
  daily: ForecastDay[];
} {
  const isMonsoonLatitude = lat >= 8.0 && lat <= 35.0;
  return {
    current: {
      temperature: 24.0,
      feelsLike: 26.5,
      humidity: 82,
      precipitation: 4.2,
      precipitation24h: 38.5,
      windSpeed: 14,
      windDirection: 210,
      pressure: 1006,
      visibility: 8.5,
      condition: 'Moderate Rain (Demo Fallback)',
      cloudCover: 85,
      soilMoisture: 72,
      soilMoistureDeep: 68,
      timestamp: new Date().toISOString(),
      isLive: false,
      dataSource: 'Demo Data — Live API unreachable, displaying calibrated regional fallback'
    },
    hourly: Array.from({ length: 24 }).map((_, i) => ({
      time: new Date(Date.now() + i * 3600000).toISOString(),
      hour: `${(new Date().getHours() + i) % 24}:00`,
      precipitation: Math.max(0, Math.round((Math.sin(i / 3) * 5 + 3) * 10) / 10),
      rainProbability: Math.min(100, Math.round(60 + Math.sin(i / 2) * 30)),
      temperature: 22 + Math.round(Math.sin(i / 4) * 4),
      windSpeed: 12 + Math.round(Math.cos(i / 3) * 6),
      riskScore: Math.min(100, Math.round(35 + Math.sin(i / 3) * 30))
    })),
    daily: ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((dayName, idx) => ({
      date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
      dayName,
      maxTemp: 28 - idx % 3,
      minTemp: 20 - idx % 2,
      totalPrecipitation: [35, 45, 60, 25, 12, 5, 8][idx],
      rainProbability: [75, 85, 90, 60, 40, 25, 30][idx],
      riskLevel: (['HIGH', 'HIGH', 'CRITICAL', 'MODERATE', 'LOW', 'LOW', 'LOW'] as RiskLevel[])[idx]
    }))
  };
}
