import { LocationData } from '../types';

// Pre-indexed high-resolution Indian locations with terrain, slope, and river basin information
export const INDIAN_LOCATIONS_DATABASE: LocationData[] = [
  // Hilly vulnerable zones (SIH 2026 Problem Statement 26192 Focus)
  {
    id: 'in-mandi',
    name: 'Mandi',
    district: 'Mandi',
    state: 'Himachal Pradesh',
    latitude: 31.7088,
    longitude: 76.9320,
    elevation: 1044,
    slopeAngle: 28.5,
    riverBasin: 'Beas River Basin',
    isHillyRegion: true,
    type: 'Hilly District Headquarters'
  },
  {
    id: 'in-wayanad',
    name: 'Wayanad (Meppadi / Chooralmala)',
    district: 'Wayanad',
    state: 'Kerala',
    latitude: 11.5540,
    longitude: 76.1265,
    elevation: 890,
    slopeAngle: 34.0,
    riverBasin: 'Chaliyar River Basin',
    isHillyRegion: true,
    type: 'High-Vulnerability Hill Slope'
  },
  {
    id: 'in-joshimath',
    name: 'Joshimath (Chamoli)',
    district: 'Chamoli',
    state: 'Uttarakhand',
    latitude: 30.5564,
    longitude: 79.5664,
    elevation: 1890,
    slopeAngle: 36.2,
    riverBasin: 'Alaknanda River Catchment',
    isHillyRegion: true,
    type: 'Steep Hill Town'
  },
  {
    id: 'in-kedarnath',
    name: 'Kedarnath Valley',
    district: 'Rudraprayag',
    state: 'Uttarakhand',
    latitude: 30.7352,
    longitude: 79.0669,
    elevation: 3583,
    slopeAngle: 42.0,
    riverBasin: 'Mandakini River',
    isHillyRegion: true,
    type: 'High Alpine Gorge'
  },
  {
    id: 'in-shimla',
    name: 'Shimla',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    latitude: 31.1048,
    longitude: 77.1734,
    elevation: 2206,
    slopeAngle: 31.0,
    riverBasin: 'Satluj River Basin',
    isHillyRegion: true,
    type: 'Hilly Capital'
  },
  {
    id: 'in-kullu',
    name: 'Kullu Valley',
    district: 'Kullu',
    state: 'Himachal Pradesh',
    latitude: 31.9579,
    longitude: 77.1095,
    elevation: 1279,
    slopeAngle: 33.5,
    riverBasin: 'Beas River',
    isHillyRegion: true,
    type: 'Valley Basin'
  },
  {
    id: 'in-dehradun',
    name: 'Dehradun',
    district: 'Dehradun',
    state: 'Uttarakhand',
    latitude: 30.3165,
    longitude: 78.0322,
    elevation: 640,
    slopeAngle: 18.0,
    riverBasin: 'Ganga-Yamuna Doab',
    isHillyRegion: true,
    type: 'Sub-Himalayan Foothills'
  },
  {
    id: 'in-rishikesh',
    name: 'Rishikesh',
    district: 'Dehradun',
    state: 'Uttarakhand',
    latitude: 30.0869,
    longitude: 78.2676,
    elevation: 372,
    slopeAngle: 22.0,
    riverBasin: 'Ganga River Gorge',
    isHillyRegion: true,
    type: 'Riverine Gorge'
  },
  {
    id: 'in-darjeeling',
    name: 'Darjeeling',
    district: 'Darjeeling',
    state: 'West Bengal',
    latitude: 27.0410,
    longitude: 88.2663,
    elevation: 2042,
    slopeAngle: 37.0,
    riverBasin: 'Teesta River Basin',
    isHillyRegion: true,
    type: 'Eastern Himalayan Ridge'
  },
  {
    id: 'in-guwahati',
    name: 'Guwahati',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    latitude: 26.1445,
    longitude: 91.7362,
    elevation: 55,
    slopeAngle: 14.5,
    riverBasin: 'Brahmaputra River Basin',
    isHillyRegion: false,
    type: 'River Basin Metropolis'
  },
  {
    id: 'in-itanagar',
    name: 'Itanagar',
    district: 'Papum Pare',
    state: 'Arunachal Pradesh',
    latitude: 27.0844,
    longitude: 93.6053,
    elevation: 320,
    slopeAngle: 26.0,
    riverBasin: 'Dikrong / Brahmaputra Sub-basin',
    isHillyRegion: true,
    type: 'Hilly Capital'
  },
  {
    id: 'in-shillong',
    name: 'Shillong',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    latitude: 25.5788,
    longitude: 91.8933,
    elevation: 1525,
    slopeAngle: 29.0,
    riverBasin: 'Umiam River Catchment',
    isHillyRegion: true,
    type: 'Plateau Ridge'
  },
  {
    id: 'in-srinagar',
    name: 'Srinagar',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    latitude: 34.0837,
    longitude: 74.7973,
    elevation: 1585,
    slopeAngle: 12.0,
    riverBasin: 'Jhelum River Basin',
    isHillyRegion: true,
    type: 'Intermontane Valley'
  },
  {
    id: 'in-leh',
    name: 'Leh',
    district: 'Leh',
    state: 'Ladakh',
    latitude: 34.1526,
    longitude: 77.5771,
    elevation: 3524,
    slopeAngle: 21.0,
    riverBasin: 'Indus River Catchment',
    isHillyRegion: true,
    type: 'High-Altitude Cold Desert Valley'
  },
  {
    id: 'in-mumbai',
    name: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    elevation: 14,
    slopeAngle: 4.2,
    riverBasin: 'Mithi River / Coastal Lowland',
    isHillyRegion: false,
    type: 'Coastal Lowland Metropolis'
  },
  {
    id: 'in-kolkata',
    name: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    latitude: 22.5726,
    longitude: 88.3639,
    elevation: 9,
    slopeAngle: 2.1,
    riverBasin: 'Hooghly / Lower Gangetic Delta',
    isHillyRegion: false,
    type: 'Delta Plain Metropolis'
  },
  {
    id: 'in-howrah',
    name: 'Howrah',
    district: 'Howrah',
    state: 'West Bengal',
    latitude: 22.5958,
    longitude: 88.2636,
    elevation: 12,
    slopeAngle: 2.0,
    riverBasin: 'Hooghly / Damodar Basin',
    isHillyRegion: false,
    type: 'Riverine Industrial District'
  },
  {
    id: 'in-haldia',
    name: 'Haldia',
    district: 'Purba Medinipur',
    state: 'West Bengal',
    latitude: 22.0620,
    longitude: 88.0772,
    elevation: 8,
    slopeAngle: 1.5,
    riverBasin: 'Haldi & Hooghly Confluence',
    isHillyRegion: false,
    type: 'Coastal Estuary Port'
  },
  {
    id: 'in-chennai',
    name: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    elevation: 6,
    slopeAngle: 2.5,
    riverBasin: 'Adyar & Cooum River Basin',
    isHillyRegion: false,
    type: 'Coastal Flood-Prone Metropolis'
  },
  {
    id: 'in-delhi',
    name: 'Delhi NCR',
    district: 'Central Delhi',
    state: 'Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    elevation: 216,
    slopeAngle: 3.5,
    riverBasin: 'Yamuna Floodplain',
    isHillyRegion: false,
    type: 'Riparian Floodplain Capital'
  },
  {
    id: 'in-patna',
    name: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    latitude: 25.5941,
    longitude: 85.1376,
    elevation: 53,
    slopeAngle: 2.0,
    riverBasin: 'Ganga-Son-Gandak Confluence',
    isHillyRegion: false,
    type: 'Riparian Lowland'
  },
  {
    id: 'in-ranchi',
    name: 'Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    latitude: 23.3441,
    longitude: 85.3096,
    elevation: 651,
    slopeAngle: 11.5,
    riverBasin: 'Subarnarekha River Basin',
    isHillyRegion: false,
    type: 'Chota Nagpur Plateau'
  },
  {
    id: 'in-kochi',
    name: 'Kochi (Ernakulam)',
    district: 'Ernakulam',
    state: 'Kerala',
    latitude: 9.9312,
    longitude: 76.2673,
    elevation: 3,
    slopeAngle: 1.8,
    riverBasin: 'Periyar River Estuary',
    isHillyRegion: false,
    type: 'Backwater Coastal Delta'
  }
];

export async function searchLocations(query: string): Promise<LocationData[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return INDIAN_LOCATIONS_DATABASE.slice(0, 8);

  // 1. First search in our curated high-resolution Indian Geo-database
  const localMatches = INDIAN_LOCATIONS_DATABASE.filter(loc => 
    loc.name.toLowerCase().includes(clean) ||
    loc.state.toLowerCase().includes(clean) ||
    (loc.district && loc.district.toLowerCase().includes(clean)) ||
    (loc.riverBasin && loc.riverBasin.toLowerCase().includes(clean))
  );

  // If we found good local matches, return them immediately
  if (localMatches.length >= 3) {
    return localMatches;
  }

  // 2. Perform live OpenStreetMap Nominatim search for any town, district, or village in India
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=8&addressdetails=1`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'FloodCastAI-SIH2026/1.0 (disaster-management-india@floodcast.ai)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const nominatimResults: LocationData[] = data.map((item: any) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const address = item.address || {};
        const state = address.state || address.state_district || 'India';
        const district = address.state_district || address.county || address.city || address.town || '';
        const name = item.display_name.split(',')[0] || query;

        // Estimate elevation and slope for hilly states
        const isHilly = ['Uttarakhand', 'Himachal Pradesh', 'Jammu and Kashmir', 'Ladakh', 'Sikkim', 'Arunachal Pradesh', 'Meghalaya', 'Nagaland', 'Mizoram', 'Manipur', 'Tripura'].some(s => state.toLowerCase().includes(s.toLowerCase())) ||
          (state.toLowerCase().includes('kerala') && (lat > 11.0 || (item.display_name.toLowerCase().includes('ghat') || item.display_name.toLowerCase().includes('hill'))));

        const estimatedElevation = isHilly ? 1250 : 85;
        const estimatedSlope = isHilly ? 27.5 : 4.0;

        return {
          id: `nom-${item.place_id || Math.random().toString(36).substring(7)}`,
          name,
          state,
          district,
          latitude: lat,
          longitude: lon,
          elevation: estimatedElevation,
          slopeAngle: estimatedSlope,
          riverBasin: isHilly ? 'Highland Drainage Basin' : 'Regional Drainage Catchment',
          isHillyRegion: isHilly,
          type: item.type || 'Geocoded Indian Location'
        };
      });

      // Combine local matches and geocoded matches
      const combined = [...localMatches];
      nominatimResults.forEach(nr => {
        if (!combined.some(c => Math.abs(c.latitude - nr.latitude) < 0.05 && Math.abs(c.longitude - nr.longitude) < 0.05)) {
          combined.push(nr);
        }
      });
      return combined.slice(0, 10);
    }
  } catch (err) {
    console.warn('Live geocoding error, falling back to local database:', err);
  }

  return localMatches.length > 0 ? localMatches : INDIAN_LOCATIONS_DATABASE.slice(0, 6);
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationData> {
  // Check if near any pre-indexed database location (< 25km)
  for (const loc of INDIAN_LOCATIONS_DATABASE) {
    const dLat = Math.abs(loc.latitude - lat);
    const dLon = Math.abs(loc.longitude - lon);
    if (dLat < 0.25 && dLon < 0.25) {
      return {
        ...loc,
        latitude: lat,
        longitude: lon
      };
    }
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
      headers: {
        'User-Agent': 'FloodCastAI-SIH2026/1.0 (disaster-management-india@floodcast.ai)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const name = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || 'Current Location';
      const state = addr.state || 'India';
      const district = addr.state_district || addr.county || '';
      
      const isHilly = ['Uttarakhand', 'Himachal Pradesh', 'Jammu', 'Ladakh', 'Sikkim', 'Arunachal', 'Meghalaya'].some(s => state.toLowerCase().includes(s.toLowerCase()));

      return {
        id: `gps-${Date.now()}`,
        name,
        state,
        district,
        latitude: lat,
        longitude: lon,
        elevation: isHilly ? 1400 : 95,
        slopeAngle: isHilly ? 28.0 : 3.5,
        riverBasin: isHilly ? 'Mountain Catchment Zone' : 'Local Drainage Catchment',
        isHillyRegion: isHilly,
        type: 'GPS Resolved Location'
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }

  // Fallback if offline
  return {
    id: `gps-coord-${lat.toFixed(2)}-${lon.toFixed(2)}`,
    name: `Location (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`,
    state: 'India',
    latitude: lat,
    longitude: lon,
    elevation: 250,
    slopeAngle: 12.0,
    riverBasin: 'Monitored Drainage Basin',
    isHillyRegion: lat > 28.0,
    type: 'GPS Coordinates'
  };
}
