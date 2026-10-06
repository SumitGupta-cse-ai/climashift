import React from 'react';
import { useApp } from '@/context/AppContext';
import { Wind, Thermometer, Flame, Droplets, Scale } from 'lucide-react';

export function EnvironmentOverview() {
  const { siteProfile, environmentalWindows, t, language } = useApp();

  const currentWindow = environmentalWindows.find(w => w.hour === 11) || environmentalWindows[0];

  const cards = [
    {
      title: t.cardAqi,
      value: siteProfile.currentAQI.toString(),
      unit: 'PM2.5 / PM10',
      status: siteProfile.currentAQI > 400 ? 'Severe+' : siteProfile.currentAQI > 300 ? (language === 'hi' ? 'गंभीर' : 'Severe') : (language === 'hi' ? 'खराब' : 'Poor'),
      statusBadge: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      icon: Wind,
      detail: `PM2.5: ${currentWindow.pm25} µg/m³ • PM10: ${currentWindow.pm10} µg/m³`,
      source: 'DPCC CAAMS Station'
    },
    {
      title: t.cardTemp,
      value: `${siteProfile.currentTemp}°C`,
      unit: language === 'hi' ? 'परिवेश' : 'Ambient',
      status: siteProfile.currentTemp >= 40 ? (language === 'hi' ? 'अत्यधिक गर्मी' : 'Extreme Heat') : (language === 'hi' ? 'उच्च' : 'High'),
      statusBadge: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      icon: Thermometer,
      detail: language === 'hi' ? 'दोपहर 13:00-15:00 अधिकतम 41°C' : 'Peak: 41°C (13:00-15:00)',
      source: 'IMD Station'
    },
    {
      title: t.cardHeatIndex,
      value: `${currentWindow.heatIndex}°C`,
      unit: language === 'hi' ? 'अनुभूत' : 'Apparent',
      status: currentWindow.heatRisk === 'Danger' ? (language === 'hi' ? 'खतरा' : 'Danger') : (language === 'hi' ? 'सावधानी' : 'Caution'),
      statusBadge: currentWindow.heatRisk === 'Danger' 
        ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900' 
        : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      icon: Flame,
      detail: language === 'hi' ? 'सौर विकिरण पीक 12:00-14:30' : 'Solar peak: 12:00-14:30',
      source: 'NDMA Matrix'
    },
    {
      title: t.cardHumidity,
      value: `${siteProfile.currentHumidity}%`,
      unit: language === 'hi' ? 'सापेक्ष' : 'Relative',
      status: siteProfile.currentHumidity > 65 ? (language === 'hi' ? 'अधिक' : 'Elevated') : (language === 'hi' ? 'सामान्य' : 'Normal'),
      statusBadge: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900',
      icon: Droplets,
      detail: `Wind: ${currentWindow.windSpeed} km/h • Rain: ${currentWindow.rainProb}%`,
      source: 'Surface Sensor'
    },
    {
      title: t.cardRegulatory,
      value: siteProfile.grapStage.replace('_', ' '),
      unit: 'CAQM NCR',
      status: language === 'hi' ? 'प्रतिबंध सक्रिय' : 'Curbs Active',
      statusBadge: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      icon: Scale,
      detail: 'Direction 77 (C&D Restraints)',
      source: 'CAQM Gazette'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 5 Concise Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">{card.title}</span>
                <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                  {card.value}
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">{card.unit}</span>
              </div>

              <div className="mb-2">
                <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border ${card.statusBadge}`}>
                  {card.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 truncate" title={card.source}>
                {card.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Diurnal Exposure Strip */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t.diurnalTitle}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t.diurnalSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {language === 'hi' ? 'कम जोखिम' : 'Lower (<50)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> {language === 'hi' ? 'सावधानी' : 'Caution (50-65)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> {language === 'hi' ? 'उच्च जोखिम' : 'High (>65)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-13 gap-1 pt-1">
          {environmentalWindows.map((w) => {
            const isHigh = w.environmentalRiskScore >= 65;
            const isMed = w.environmentalRiskScore >= 50 && w.environmentalRiskScore < 65;
            const barBg = isHigh 
              ? 'bg-rose-500/15 border-rose-400 dark:border-rose-800 text-rose-700' 
              : isMed 
              ? 'bg-amber-500/15 border-amber-400 dark:border-amber-800 text-amber-700' 
              : 'bg-emerald-500/15 border-emerald-400 dark:border-emerald-800 text-emerald-700';

            return (
              <div key={w.hour} className="flex flex-col items-center">
                <div 
                  className={`w-full h-10 rounded border flex flex-col justify-end p-0.5 transition-all ${barBg}`}
                  title={`${w.timeLabel}: AQI ${w.aqi}, Temp ${w.temperature}°C, Heat Index ${w.heatIndex}°C, Risk: ${w.environmentalRiskScore}/100`}
                >
                  <div 
                    className={`w-full rounded-xs ${isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ height: `${Math.max(15, w.environmentalRiskScore)}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {w.timeLabel.split(':')[0]}h
                </span>
                <span className="text-[9px] font-mono text-slate-400">
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
