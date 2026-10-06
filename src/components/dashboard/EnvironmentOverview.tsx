import React from 'react';
import { useApp } from '@/context/AppContext';
import { Wind, Thermometer, Flame, Droplets, Scale } from 'lucide-react';

export function EnvironmentOverview() {
  const { siteProfile, environmentalWindows } = useApp();

  // Determine current window (e.g. current or 11:00 peak)
  const currentWindow = environmentalWindows.find(w => w.hour === 11) || environmentalWindows[0];

  const cards = [
    {
      title: 'Air Quality (AQI)',
      value: siteProfile.currentAQI.toString(),
      unit: 'PM2.5 / PM10',
      status: siteProfile.currentAQI > 400 ? 'Severe+' : siteProfile.currentAQI > 300 ? 'Severe' : 'Poor',
      statusColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      icon: Wind,
      detail: `PM2.5: ${currentWindow.pm25} µg/m³ • PM10: ${currentWindow.pm10} µg/m³`,
      source: 'DPCC Continuous Ambient Station'
    },
    {
      title: 'Ambient Temperature',
      value: `${siteProfile.currentTemp}°`,
      unit: 'Celsius',
      status: siteProfile.currentTemp >= 40 ? 'Extreme Heat' : siteProfile.currentTemp >= 35 ? 'High Temperature' : 'Moderate',
      statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      icon: Thermometer,
      detail: `Diurnal peak: 41°C between 13:00 - 15:00`,
      source: 'IMD Automatic Weather Station'
    },
    {
      title: 'Heat Index / Solar Stress',
      value: `${currentWindow.heatIndex}°C`,
      unit: 'Apparent Temp',
      status: currentWindow.heatRisk,
      statusColor: currentWindow.heatRisk === 'Danger' 
        ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900' 
        : 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900',
      icon: Flame,
      detail: 'Solar radiation peak 12:00–14:30',
      source: 'NDMA Heat Stress Matrix'
    },
    {
      title: 'Relative Humidity',
      value: `${siteProfile.currentHumidity}%`,
      unit: 'Moisture Level',
      status: siteProfile.currentHumidity > 65 ? 'Elevated' : 'Normal',
      statusColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900',
      icon: Droplets,
      detail: `Wind: ${currentWindow.windSpeed} km/h • Rain: ${currentWindow.rainProb}%`,
      source: 'Surface Meteorological Sensor'
    },
    {
      title: 'Regulatory Mandate',
      value: siteProfile.grapStage.replace('_', ' '),
      unit: siteProfile.jurisdiction,
      status: 'Mandatory Restrictions Active',
      statusColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      icon: Scale,
      detail: 'CAQM Direction 77 (Non-essential C&D Curbs)',
      source: 'Commission for Air Quality Management'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {card.value}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{card.unit}</span>
              </div>

              <div className="mb-3">
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${card.statusColor}`}>
                  {card.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                <div className="truncate">{card.detail}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate" title={card.source}>
                  Source: {card.source}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Diurnal Risk Timeline Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Diurnal Environmental Exposure & Safe Work Windows (07:00 – 19:00)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Evaluated composite risk combining particulate index (AQI) and wet-bulb heat index.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Lower Risk (&lt;50)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Caution (50–65)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Risk (&gt;65)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-13 gap-1 pt-2">
          {environmentalWindows.map((w) => {
            const isHigh = w.environmentalRiskScore >= 65;
            const isMed = w.environmentalRiskScore >= 50 && w.environmentalRiskScore < 65;
            const colorBg = isHigh 
              ? 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-400' 
              : isMed 
              ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-400' 
              : 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-400';

            return (
              <div key={w.hour} className="flex flex-col items-center">
                <div 
                  className={`w-full h-12 rounded border flex flex-col justify-end p-1 transition-all ${colorBg}`}
                  title={`${w.timeLabel}: AQI ${w.aqi}, Temp ${w.temperature}°C, Heat Index ${w.heatIndex}°C, Composite Risk: ${w.environmentalRiskScore}/100`}
                >
                  <div 
                    className={`w-full rounded-xs ${isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ height: `${Math.max(15, w.environmentalRiskScore)}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {w.timeLabel.split(':')[0]}h
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                  {w.aqi}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
