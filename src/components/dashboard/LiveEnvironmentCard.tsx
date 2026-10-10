import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, ChevronDown, ChevronUp, AlertTriangle, RefreshCw, Radio, Wind, Thermometer, Droplets, Gauge } from 'lucide-react';

export function LiveEnvironmentCard() {
  const { 
    siteProfile, 
    environmentalWindows, 
    conditionsChanged, 
    triggerConditionsChanged, 
    reevaluatePlan,
    isOptimizing,
    language 
  } = useApp();

  const [showHourly, setShowHourly] = useState(false);

  const currentWindow = environmentalWindows.find(w => w.hour === 11) || environmentalWindows[0];

  const aqi = siteProfile.currentAQI;
  let aqiStatus = 'Very Poor';
  let aqiBadgeStyle = 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A] dark:bg-[#3D2E0B] dark:text-[#FBBF24] dark:border-[#78350F]';

  if (aqi <= 50) {
    aqiStatus = language === 'hi' ? 'अच्छा' : 'Good';
    aqiBadgeStyle = 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0] dark:bg-[#064E3B] dark:text-[#4ADE80] dark:border-[#065F46]';
  } else if (aqi <= 100) {
    aqiStatus = language === 'hi' ? 'संतोषजनक' : 'Satisfactory';
    aqiBadgeStyle = 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0] dark:bg-[#064E3B] dark:text-[#4ADE80] dark:border-[#065F46]';
  } else if (aqi <= 200) {
    aqiStatus = language === 'hi' ? 'मध्यम' : 'Moderate';
    aqiBadgeStyle = 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A] dark:bg-[#3D2E0B] dark:text-[#FBBF24] dark:border-[#78350F]';
  } else if (aqi <= 300) {
    aqiStatus = language === 'hi' ? 'खराब' : 'Poor';
    aqiBadgeStyle = 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A] dark:bg-[#3D2E0B] dark:text-[#FBBF24] dark:border-[#78350F]';
  } else if (aqi <= 400) {
    aqiStatus = language === 'hi' ? 'बहुत खराब' : 'Very Poor';
    aqiBadgeStyle = 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A] dark:bg-[#3D2E0B] dark:text-[#FBBF24] dark:border-[#78350F]';
  } else {
    aqiStatus = language === 'hi' ? 'गंभीर' : 'Severe';
    aqiBadgeStyle = 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#7F1D1D]';
  }

  const metrics = [
    {
      label: 'Air Quality (AQI)',
      icon: Gauge,
      value: aqi.toString(),
      status: aqiStatus,
      statusClass: aqiBadgeStyle,
      sublabel: `PM2.5: ${currentWindow.pm25} µg/m³`
    },
    {
      label: 'Temperature',
      icon: Thermometer,
      value: `${siteProfile.currentTemp}°C`,
      status: siteProfile.currentTemp >= 35 ? 'High' : 'Moderate',
      statusClass: 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A] dark:bg-[#3D2E0B] dark:text-[#FBBF24] dark:border-[#78350F]',
      sublabel: 'Solar Peak 41°C'
    },
    {
      label: 'Heat Index',
      icon: Thermometer,
      value: `${currentWindow.heatIndex}°C`,
      status: currentWindow.heatRisk === 'Danger' ? 'Danger' : 'Caution',
      statusClass: currentWindow.heatRisk === 'Danger'
        ? 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#7F1D1D]'
        : 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A] dark:bg-[#3D2E0B] dark:text-[#FBBF24] dark:border-[#78350F]',
      sublabel: 'Midday Inversion'
    },
    {
      label: 'Humidity',
      icon: Droplets,
      value: `${siteProfile.currentHumidity}%`,
      status: 'Normal',
      statusClass: 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0] dark:bg-[#064E3B] dark:text-[#4ADE80] dark:border-[#065F46]',
      sublabel: `Wind ${currentWindow.windSpeed} km/h`
    },
    {
      label: 'Curbs & Directives',
      icon: Wind,
      value: siteProfile.grapStage.replace('_', ' '),
      status: 'Mandatory',
      statusClass: 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#7F1D1D]',
      sublabel: 'CAQM Protocol'
    }
  ];

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#10B981] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#047857]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {language === 'hi' ? 'लाइव पर्यावरणीय टेलीमेट्री' : 'Live Environmental Telemetry'}
            </h2>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              {siteProfile.dataSource || 'CPCB / DPCC Continuous Monitoring (CAAMS)'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHourly(!showHourly)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#10B981] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 hover:bg-[#D1FAE5] dark:hover:bg-[#064E3B]/50 transition cursor-pointer shrink-0"
        >
          <span>{showHourly ? 'Hide Forecast' : 'Hourly Curve'}</span>
          {showHourly ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Conditions Changed Alert Banner if active */}
      {conditionsChanged && (
        <div className="mb-3.5 rounded-xl border border-[#FCA5A5] dark:border-[#7F1D1D] bg-[#FEF2F2] dark:bg-[#451A1A]/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span className="text-xs font-bold text-[#DC2626] dark:text-[#FCA5A5]">
              Sensor Surge Detected: AQI jumped to {siteProfile.currentAQI}
            </span>
          </div>
          <button
            onClick={reevaluatePlan}
            disabled={isOptimizing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>Re-evaluate Shift</span>
          </button>
        </div>
      )}

      {/* 5 Column Modern Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#F8FAFC] dark:bg-[#07111C] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-3 flex flex-col justify-between hover:border-[#CBD5E1] dark:hover:border-[#334155] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8] mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider truncate">{item.label}</span>
                  <Icon className="w-3 h-3 shrink-0 opacity-70" />
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  {item.value}
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-1 flex-wrap">
                <span className={`inline-block text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${item.statusClass}`}>
                  {item.status}
                </span>
                <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8] font-mono truncate">
                  {item.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Diurnal Forecast Bar Chart */}
      {showHourly && (
        <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] dark:border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#475569] dark:text-[#94A3B8]">
            <span>Today&apos;s Diurnal Exposure Windows (07:00 – 19:00 IST)</span>
            <span className="text-[10px] text-[#10B981] font-mono">Green = Safe Window</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-13 gap-1">
            {environmentalWindows.slice(0, 13).map((w) => {
              const isMorningSafe = w.hour >= 7 && w.hour <= 10;
              const isPeakDanger = w.hour >= 12 && w.hour <= 16;
              return (
                <div 
                  key={w.hour}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    isMorningSafe
                      ? 'bg-[#ECFDF5] border-[#A7F3D0] dark:bg-[#064E3B]/40 dark:border-[#047857]'
                      : isPeakDanger
                      ? 'bg-[#FEF2F2] border-[#FECACA] dark:bg-[#451A1A]/40 dark:border-[#7F1D1D]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] dark:bg-[#0B1522] dark:border-[#1E293B]'
                  }`}
                >
                  <div className="text-[9px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                    {w.timeLabel?.split(':')[0] || `${w.hour}`}h
                  </div>
                  <div className={`text-[11px] font-bold font-mono ${
                    isMorningSafe ? 'text-[#059669] dark:text-[#34D399]' : isPeakDanger ? 'text-[#DC2626] dark:text-[#F87171]' : 'text-[#475569] dark:text-[#CBD5E1]'
                  }`}>
                    {w.aqi}
                  </div>
                  <div className="text-[8px] text-[#94A3B8] font-mono">
                    {w.temperature}°
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
