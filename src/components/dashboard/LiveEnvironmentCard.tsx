import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, ChevronDown, ChevronUp, AlertTriangle, RefreshCw } from 'lucide-react';

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

  const [showDetails, setShowDetails] = useState(false);

  const currentWindow = environmentalWindows.find(w => w.hour === 11) || environmentalWindows[0];

  const aqi = siteProfile.currentAQI;
  let aqiStatus = 'Very Poor';
  let aqiBadgeStyle = 'text-[#D99A24] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';

  if (aqi <= 50) {
    aqiStatus = language === 'hi' ? 'अच्छा' : 'Good';
    aqiBadgeStyle = 'text-[#18A66A] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#132B22] dark:text-[#18A66A] dark:border-[#1E4B39]';
  } else if (aqi <= 100) {
    aqiStatus = language === 'hi' ? 'संतोषजनक' : 'Satisfactory';
    aqiBadgeStyle = 'text-[#18A66A] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#132B22] dark:text-[#18A66A] dark:border-[#1E4B39]';
  } else if (aqi <= 200) {
    aqiStatus = language === 'hi' ? 'मध्यम' : 'Moderate';
    aqiBadgeStyle = 'text-[#D99A24] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';
  } else if (aqi <= 300) {
    aqiStatus = language === 'hi' ? 'खराब' : 'Poor';
    aqiBadgeStyle = 'text-[#D99A24] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';
  } else if (aqi <= 400) {
    aqiStatus = language === 'hi' ? 'बहुत खराब' : 'Very Poor';
    aqiBadgeStyle = 'text-[#D99A24] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';
  } else {
    aqiStatus = language === 'hi' ? 'गंभीर' : 'Severe';
    aqiBadgeStyle = 'text-[#D94A4A] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]';
  }

  const metrics = [
    {
      label: 'AQI',
      value: aqi.toString(),
      status: aqiStatus,
      statusClass: aqiBadgeStyle,
      sublabel: `PM2.5: ${currentWindow.pm25} µg/m³`
    },
    {
      label: 'Temperature',
      value: `${siteProfile.currentTemp}°C`,
      status: siteProfile.currentTemp >= 35 ? 'High' : 'Moderate',
      statusClass: 'text-[#D99A24] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]',
      sublabel: 'Peak 41°C'
    },
    {
      label: 'Heat Index',
      value: `${currentWindow.heatIndex}°C`,
      status: currentWindow.heatRisk === 'Danger' ? 'Danger' : 'Caution',
      statusClass: currentWindow.heatRisk === 'Danger'
        ? 'text-[#D94A4A] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]'
        : 'text-[#D99A24] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]',
      sublabel: 'Solar peak 13:00'
    },
    {
      label: 'Humidity',
      value: `${siteProfile.currentHumidity}%`,
      status: 'Normal',
      statusClass: 'text-[#18A66A] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#132B22] dark:text-[#18A66A] dark:border-[#1E4B39]',
      sublabel: `Wind ${currentWindow.windSpeed} km/h`
    },
    {
      label: 'Regulatory',
      value: siteProfile.grapStage.replace('_', ' '),
      status: 'Active Curbs',
      statusClass: 'text-[#D94A4A] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]',
      sublabel: 'CAQM Dir 79'
    }
  ];

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'लाइव पर्यावरणीय स्थितियां' : 'Live Environmental Conditions'}
          </h2>
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">
            {language === 'hi' ? 'डीपीसीसी सीएएएमएस स्टेशन से रीयल-टाइम डेटा' : 'Real-time readings from DPCC CAAMS Station'}
          </p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#16B878] hover:text-[#139c65] transition cursor-pointer shrink-0"
        >
          <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Conditions Changed Alert Banner if active */}
      {conditionsChanged && (
        <div className="mb-4 rounded-lg border border-[#D94A4A] bg-[#FEEFEF] dark:bg-[#2D1818] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D94A4A] shrink-0" />
            <span className="text-xs font-semibold text-[#D94A4A] dark:text-[#F87171]">
              Sensor Surge: AQI spiked to {siteProfile.currentAQI}
            </span>
          </div>
          <button
            onClick={reevaluatePlan}
            disabled={isOptimizing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-white bg-[#D94A4A] hover:bg-[#b93838] transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>Re-evaluate</span>
          </button>
        </div>
      )}

      {/* 5 Column Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] rounded-lg p-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
                {item.value}
              </div>
              <div className="text-xs font-medium text-[#667085] dark:text-[#A7B2C1] mt-0.5">
                {item.label}
              </div>
            </div>

            <div className="mt-3">
              <span className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${item.statusClass}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Deep Diurnal Strip */}
      {showDetails && (
        <div className="mt-5 pt-4 border-t border-[#E4E7EC] dark:border-[#26384C] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#667085] dark:text-[#A7B2C1]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Diurnal Exposure Window (07:00 – 19:00 IST)
            </span>
            <button
              onClick={triggerConditionsChanged}
              className="text-[11px] text-[#D99A24] hover:underline cursor-pointer"
            >
              Simulate Surge
            </button>
          </div>

          <div className="grid grid-cols-13 gap-1 pt-1">
            {environmentalWindows.map((w) => {
              const isHigh = w.environmentalRiskScore >= 65;
              const isMed = w.environmentalRiskScore >= 50 && w.environmentalRiskScore < 65;
              const barFill = isHigh ? 'bg-[#D94A4A]' : isMed ? 'bg-[#D99A24]' : 'bg-[#18A66A]';
              const barBg = isHigh ? 'bg-[#FEEFEF] dark:bg-[#2D1818]' : isMed ? 'bg-[#FEF7EB] dark:bg-[#2C2214]' : 'bg-[#EBF8F2] dark:bg-[#132B22]';

              return (
                <div key={w.hour} className="flex flex-col items-center">
                  <div 
                    className={`w-full h-8 rounded border border-[#E4E7EC] dark:border-[#26384C] flex flex-col justify-end p-0.5 ${barBg}`}
                    title={`${w.timeLabel}: AQI ${w.aqi}, Heat Index ${w.heatIndex}°C, Risk: ${w.environmentalRiskScore}/100`}
                  >
                    <div 
                      className={`w-full rounded-xs ${barFill}`} 
                      style={{ height: `${Math.max(25, w.environmentalRiskScore)}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono font-medium text-[#171A1F] dark:text-[#F5F7FA] mt-1">
                    {w.timeLabel.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
