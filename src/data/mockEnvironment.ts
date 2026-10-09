import { EnvironmentalWindow, SiteProfile, GRAPStage } from '@/types';

export const DEFAULT_SITE_PROFILE: SiteProfile = {
  id: 'site-delhi-tower-b',
  name: 'Tower B Commercial Complex (Sector 62)',
  location: 'Noida / Delhi-NCR',
  jurisdiction: 'Delhi-NCR (CAQM Jurisdiction)',
  grapStage: 'STAGE_3',
  currentAQI: 395,
  currentTemp: 34,
  currentHumidity: 58,
  weatherCondition: 'Winter Smog / Atmospheric Inversion',
  dataSource: 'CPCB / DPCC Continuous Ambient Air Monitoring Station (CAAMS)',
  isDemoData: true, // Clearly indicated as Demo Scenario / Fallback Data
  lastUpdated: '07:15 IST (Benchmark Archetype)'
};

export const SITES_LIST: SiteProfile[] = [
  DEFAULT_SITE_PROFILE,
  {
    id: 'site-gurgaon-phase5',
    name: 'DLF Phase V Residential Towers',
    location: 'Gurugram, Haryana',
    jurisdiction: 'Delhi-NCR (CAQM Jurisdiction)',
    grapStage: 'STAGE_2',
    currentAQI: 312,
    currentTemp: 33,
    currentHumidity: 52,
    weatherCondition: 'Moderate Smog / High PM10',
    dataSource: 'Haryana State Pollution Control Board (HSPCB)',
    isDemoData: true,
    lastUpdated: '07:11 IST (Benchmark Archetype)'
  },
  {
    id: 'site-mumbai-metro',
    name: 'Line 3 Underground & Depot Works',
    location: 'Aarey / Bandra, Mumbai',
    jurisdiction: 'Maharashtra (MPCB Jurisdiction)',
    grapStage: 'NONE',
    currentAQI: 142,
    currentTemp: 31,
    currentHumidity: 78,
    weatherCondition: 'High Humidity / Heat Index Caution',
    dataSource: 'SAFAR Mumbai Air Quality Network',
    isDemoData: true,
    lastUpdated: '07:20 IST (Benchmark Archetype)'
  }
];

export function generateHourlyEnvironmentalWindows(baseAQI = 385, grapStage: GRAPStage = 'STAGE_3'): EnvironmentalWindow[] {
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  
  return hours.map((hour) => {
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    
    // Realistic diurnal curve for Delhi-NCR:
    // Inversion traps particles early morning and evening; mid-day sees solar heating peak.
    let aqiModifier = 0;
    let temp = 24;
    let humidity = 65;

    if (hour <= 9) {
      aqiModifier = 25; // Surface inversion trapped smoke
      temp = 23 + (hour - 7) * 2.5;
      humidity = 68 - (hour - 7) * 4;
    } else if (hour <= 12) {
      aqiModifier = -15; // Mixing height rises
      temp = 29 + (hour - 9) * 3;
      humidity = 58 - (hour - 9) * 5;
    } else if (hour <= 15) {
      aqiModifier = 10; // Peak traffic & ozone
      temp = 38 + (hour - 12) * 1.5; // Peak 41-42°C
      humidity = 42;
    } else if (hour <= 17) {
      aqiModifier = 20;
      temp = 37 - (hour - 15) * 2;
      humidity = 48;
    } else {
      aqiModifier = 35; // Evening temperature drop causes rapid particle accumulation
      temp = 31 - (hour - 17) * 3;
      humidity = 56;
    }

    const aqi = Math.max(80, Math.min(480, Math.round(baseAQI + aqiModifier)));
    const pm25 = Math.round(aqi * 0.65);
    const pm10 = Math.round(aqi * 1.25);
    const heatIndex = Math.round(temp + (humidity / 100) * 4.5);
    const windSpeed = hour >= 12 && hour <= 16 ? 12 : 6;
    const rainProb = 5;

    let airCategory: EnvironmentalWindow['airQualityCategory'] = 'Moderate';
    if (aqi <= 100) airCategory = 'Satisfactory';
    else if (aqi <= 200) airCategory = 'Moderate';
    else if (aqi <= 300) airCategory = 'Poor';
    else if (aqi <= 400) airCategory = 'Very Poor';
    else if (aqi <= 450) airCategory = 'Severe';
    else airCategory = 'Severe+';

    let heatRisk: EnvironmentalWindow['heatRisk'] = 'Normal';
    if (heatIndex >= 41) heatRisk = 'Danger';
    else if (heatIndex >= 36) heatRisk = 'Extreme Caution';
    else if (heatIndex >= 31) heatRisk = 'Caution';

    // Risk calculation normalized 0-100
    // Factor 1: AQI risk (0-100)
    const aqiRisk = Math.min(100, (aqi / 450) * 100);
    // Factor 2: Heat risk (0-100)
    const heatRiskScore = Math.min(100, Math.max(0, (heatIndex - 26) * 5));
    
    // Composite environmental risk score
    const environmentalRiskScore = Math.round(0.6 * aqiRisk + 0.4 * heatRiskScore);
    const isSafeForHeavyOutdoor = environmentalRiskScore < 65 && aqi < 400;

    return {
      hour,
      timeLabel,
      aqi,
      pm25,
      pm10,
      temperature: Math.round(temp),
      humidity: Math.round(humidity),
      heatIndex,
      windSpeed,
      rainProb,
      grapStage,
      airQualityCategory: airCategory,
      heatRisk,
      isSafeForHeavyOutdoor,
      environmentalRiskScore
    };
  });
}
