import { GoogleGenAI } from '@google/genai';
import { LocationData, WeatherData, RiskAssessment } from '../types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

export async function generateNDRFSituationReport(
  location: LocationData,
  weather: WeatherData,
  risk: RiskAssessment
): Promise<{
  reportText: string;
  tacticalEvacuationSummary: string;
  source: string;
}> {
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are a Senior Disaster Management Officer and Hydro-meteorological ML Expert for the National Disaster Response Force (NDRF), Ministry of Home Affairs, India (SIH 2026 Problem Statement 26192: Flash Flood Prediction System for Hilly Regions).

Generate an authoritative, hyper-local Flash Flood Situation & Evacuation Action Report for the following coordinates and real-time sensor parameters:

Location: ${location.name}, District: ${location.district || 'N/A'}, State: ${location.state}
Terrain Characteristics: Elevation ${location.elevation}m ASL, Hill Slope ${location.slopeAngle}°, River Catchment: ${location.riverBasin || 'Local Drainage Basin'}
Hilly Region: ${location.isHillyRegion ? 'YES (High vulnerability to flash floods & coupled landslides)' : 'NO'}

Current Meteorological & Sensor Inputs:
- 24-Hour Rainfall: ${weather.precipitation24h} mm
- Current Rain Rate: ${weather.precipitation} mm/h
- Soil Moisture Saturation: ${weather.soilMoisture}%
- Slope Stability Factor of Safety: ${risk.slopeStabilityIndex}
- Calculated Flash Flood Risk Score: ${risk.riskScore}/100 (${risk.riskLevel})
- Actionable Lead Time for Evacuation: ${risk.leadTimeHours} Hours
- Surface Runoff Coefficient: ${risk.runoffCoefficient}

Please formulate a concise, professional 3-part NDRF Command Assessment:
1. Hydro-Geomorphic Threat Analysis (Explain the physics of why this terrain + soil saturation + rainfall produces flash flood surge or debris flow)
2. Tactical Incident Commander Directives (Specific orders for NDRF battalions, district magistrates, SDRF, and civil defense)
3. Village/Ward Level Evacuation Lead Time & Priority Zones (Specific directives for vulnerable settlement clusters along the drainage basin).

Keep formatting clean with Markdown headings and bullet points. Be rigorous and objective.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        return {
          reportText: response.text,
          tacticalEvacuationSummary: `NDRF Command Alert: ${risk.riskLevel} threat for ${location.name}. Est. Lead Time: ${risk.leadTimeHours} hrs. Evacuate vulnerable riparian and toe-slope settlements immediately.`,
          source: 'Gemini 3.8 Flash (NDRF DM Division AI Engine)'
        };
      }
    } catch (err) {
      console.warn('Gemini API call encountered error, falling back to rule-based NDRF generator:', err);
    }
  }

  // Grounded expert fallback report if GEMINI_API_KEY is not configured
  const isHilly = location.isHillyRegion;
  const leadTime = risk.leadTimeHours;
  const factorList = risk.contributingFactors.map(f => `* **${f.factor}**: ${f.value} — ${f.description}`).join('\n');

  const fallbackReport = `### 1. Hydro-Geomorphic Threat Analysis
The monitored catchment in **${location.name}** (${location.elevation}m ASL, ${location.slopeAngle}° slope) is experiencing an aggregated 24-hour rainfall of **${weather.precipitation24h} mm**. 
With topsoil moisture saturation at **${weather.soilMoisture}%**, the local ground infiltration capacity is heavily exhausted. 

${isHilly ? `In steep hilly topography (${location.slopeAngle}° gradient), saturated pore-water pressures severely decrease effective soil shear strength (Slope Factor of Safety: ${risk.slopeStabilityIndex}). Runoff velocity accelerates rapidly into ephemeral mountain gullies, creating immediate flash surge conditions.` : `In the flatter alluvial basin, drainage impedance and backwater effects along the ${location.riverBasin || 'waterways'} are driving progressive inundation of low-lying floodplains.`}

### 2. Contributing Sensor Metrics (XAI)
${factorList}

### 3. Tactical NDRF & District Administration Directives
* **Incident Command Post (ICP)**: Activate ICP under DDMA protocols. Establish redundant VHF/satellite communication linking district headquarters and field search & rescue units.
* **Pre-positioning of Assets**: Deploy inflatable motorboats (IRBs), tree-clearing power chainsaws, high-capacity dewatering pump sets, and aerial drone surveillance.
* **Safe Zone Routing**: Restrict civilian passage across culverts, low bridges, and landslide toe sectors. Direct civilian flow towards pre-identified high-ground concrete shelters.
* **Actionable Evacuation Lead Time**: **${leadTime} Hours** remaining prior to peak hydrologic discharge crest.`;

  return {
    reportText: fallbackReport,
    tacticalEvacuationSummary: `Standard NDRF Directive: ${risk.riskLevel} status active for ${location.name}. Estimated lead time: ${leadTime} hours. Follow DDMA SOP 4B.`,
    source: 'NDRF Hydro-Meteorological Baseline Expert Engine'
  };
}
