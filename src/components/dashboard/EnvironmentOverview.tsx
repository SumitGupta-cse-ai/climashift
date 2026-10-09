import React from 'react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Wind, 
  Thermometer, 
  Flame, 
  Droplets, 
  Scale, 
  AlertTriangle, 
  RefreshCw, 
  ListOrdered, 
  Table, 
  ChevronRight
} from 'lucide-react';

export function EnvironmentOverview() {
  const { 
    siteProfile, 
    environmentalWindows, 
    tasks, 
    replanResult, 
    conditionsChanged, 
    triggerConditionsChanged, 
    reevaluatePlan,
    isOptimizing,
    setActiveNav,
    language 
  } = useApp();

  const currentWindow = environmentalWindows.find(w => w.hour === 11) || environmentalWindows[0];

  const aqi = siteProfile.currentAQI;
  let aqiStatus = 'Very Poor';
  let aqiClass = 'text-[#B7791F] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';

  if (aqi <= 50) {
    aqiStatus = language === 'hi' ? 'अच्छा' : 'Good';
    aqiClass = 'text-[#16855B] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#132B22] dark:text-[#38D9A9] dark:border-[#1E4B39]';
  } else if (aqi <= 100) {
    aqiStatus = language === 'hi' ? 'संतोषजनक' : 'Satisfactory';
    aqiClass = 'text-[#16855B] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#132B22] dark:text-[#38D9A9] dark:border-[#1E4B39]';
  } else if (aqi <= 200) {
    aqiStatus = language === 'hi' ? 'मध्यम' : 'Moderate';
    aqiClass = 'text-[#B7791F] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';
  } else if (aqi <= 300) {
    aqiStatus = language === 'hi' ? 'खराब' : 'Poor';
    aqiClass = 'text-[#B7791F] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';
  } else if (aqi <= 400) {
    // CPCB Standard: 301-400 is strictly VERY POOR
    aqiStatus = language === 'hi' ? 'बहुत खराब' : 'Very Poor';
    aqiClass = 'text-[#B7791F] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]';
  } else if (aqi <= 450) {
    aqiStatus = language === 'hi' ? 'गंभीर' : 'Severe';
    aqiClass = 'text-[#D64545] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]';
  } else {
    aqiStatus = language === 'hi' ? 'अत्यंत गंभीर' : 'Severe+';
    aqiClass = 'text-[#D64545] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]';
  }

  const modules = [
    {
      title: 'AQI',
      value: aqi.toString(),
      unit: 'CPCB',
      status: aqiStatus,
      statusClass: aqiClass,
      icon: Wind,
      detail: `PM2.5: ${currentWindow.pm25} µg/m³ • PM10: ${currentWindow.pm10}`,
      source: 'DPCC CAAMS Station'
    },
    {
      title: 'Temperature',
      value: `${siteProfile.currentTemp}°C`,
      unit: 'Ambient',
      status: siteProfile.currentTemp >= 38 ? 'High' : 'Moderate',
      statusClass: 'text-[#B7791F] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]',
      icon: Thermometer,
      detail: 'Peak 41°C (13:00–15:00)',
      source: 'IMD Surface Stn'
    },
    {
      title: 'Heat Index',
      value: `${currentWindow.heatIndex}°C`,
      unit: 'Apparent',
      status: currentWindow.heatRisk === 'Danger' ? 'Danger' : 'Caution',
      statusClass: currentWindow.heatRisk === 'Danger'
        ? 'text-[#D64545] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]'
        : 'text-[#B7791F] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]',
      icon: Flame,
      detail: 'Solar peak 12:00–14:30',
      source: 'NDMA Heat Matrix'
    },
    {
      title: 'Humidity',
      value: `${siteProfile.currentHumidity}%`,
      unit: 'Relative',
      status: 'Normal',
      statusClass: 'text-[#16855B] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#132B22] dark:text-[#38D9A9] dark:border-[#1E4B39]',
      icon: Droplets,
      detail: `Wind ${currentWindow.windSpeed} km/h • 0% Rain`,
      source: 'Surface Hygrometer'
    },
    {
      title: 'Regulatory',
      value: siteProfile.grapStage.replace('_', ' '),
      unit: 'CAQM',
      status: 'Active Curbs',
      statusClass: 'text-[#D64545] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]',
      icon: Scale,
      detail: 'Direction 79 Order Enforced',
      source: 'CAQM Gazette Order'
    }
  ];

  // Feature 6: Priority Queue
  const evaluatedTasks = replanResult?.recommendedTasks || tasks;
  const prioritizedTasks = [...evaluatedTasks].sort((a, b) => {
    const rankWeight: Record<string, number> = {
      restricted: 5,
      reschedule: 4,
      protect: 3,
      manual_review: 4,
      continue: 1
    };
    const scoreA = (rankWeight[a.status] || 2) * (a.indoorOutdoor === 'outdoor' ? 2 : 1) * a.workers;
    const scoreB = (rankWeight[b.status] || 2) * (b.indoorOutdoor === 'outdoor' ? 2 : 1) * b.workers;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-4">
      {/* Conditions Changed Alert Banner - Restrained & Clean */}
      {conditionsChanged ? (
        <div className="rounded-lg border border-[#D64545] bg-[#FEEFEF] dark:bg-[#2D1818] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D64545] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#D64545] dark:text-[#F87171] uppercase tracking-wide">
                Conditions Changed — Sensor Surge Detected
              </div>
              <p className="text-xs text-[#171A1F] dark:text-[#F2F4F7] mt-0.5">
                Ambient AQI spiked to <strong>{siteProfile.currentAQI}</strong> (Severe Inversion). Work plan may no longer be optimal.
              </p>
            </div>
          </div>
          <button
            onClick={reevaluatePlan}
            disabled={isOptimizing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#D64545] hover:bg-[#b93838] transition cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>Re-evaluate Plan</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <button
            onClick={triggerConditionsChanged}
            className="text-[11px] font-medium text-[#667085] hover:text-[#B7791F] transition cursor-pointer flex items-center gap-1"
          >
            <span>Simulate Ambient Sensor Surge</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Clean Environmental Summary Row - Single Unified Enterprise Container */}
      <div className="bg-[#FFFFFF] dark:bg-[#11161D] border border-[#E4E7EC] dark:border-[#27303A] rounded-xl shadow-subtle grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#E4E7EC] dark:divide-[#27303A]">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <div key={i} className="p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[#667085] dark:text-[#98A2B3] mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{mod.title}</span>
                  <Icon className="w-3.5 h-3.5 text-[#667085] dark:text-[#98A2B3]" />
                </div>

                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span className="text-2xl font-semibold tracking-tight text-[#171A1F] dark:text-[#F2F4F7] font-mono">
                    {mod.value}
                  </span>
                  <span className="text-[11px] text-[#667085] font-medium">{mod.unit}</span>
                </div>

                <div className="mb-2">
                  <span className={`inline-block text-[11px] font-medium px-2 py-0.2 rounded border ${mod.statusClass}`}>
                    {mod.status}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-[#667085] dark:text-[#98A2B3] truncate border-t border-[#E4E7EC]/60 dark:border-[#27303A]/60 pt-2" title={mod.source}>
                {mod.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Diurnal Exposure Strip - Clean, Flat 13-Bar Schedule Strip */}
      <div className="bg-[#FFFFFF] dark:bg-[#11161D] border border-[#E4E7EC] dark:border-[#27303A] rounded-xl p-4 sm:p-5 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A1F] dark:text-[#F2F4F7]">
              Diurnal Environmental Exposure & Safe Work Windows (07:00 – 19:00)
            </h3>
            <p className="text-xs text-[#667085] dark:text-[#98A2B3] mt-0.5">
              Evaluated composite particulate index (AQI) and wet-bulb heat index throughout shift hours.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#667085] dark:text-[#98A2B3]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16855B]"></span> Lower (&lt;50)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B7791F]"></span> Caution (50–65)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D64545]"></span> High (&gt;65)
            </span>
          </div>
        </div>

        {/* 13-hour Discrete Work Window Graph */}
        <div className="grid grid-cols-13 gap-1 pt-1">
          {environmentalWindows.map((w) => {
            const isHigh = w.environmentalRiskScore >= 65;
            const isMed = w.environmentalRiskScore >= 50 && w.environmentalRiskScore < 65;
            const barFill = isHigh ? 'bg-[#D64545]' : isMed ? 'bg-[#B7791F]' : 'bg-[#16855B]';
            const barBg = isHigh ? 'bg-[#FEEFEF] dark:bg-[#2D1818]' : isMed ? 'bg-[#FEF7EB] dark:bg-[#2C2214]' : 'bg-[#EBF8F2] dark:bg-[#132B22]';

            return (
              <div key={w.hour} className="flex flex-col items-center">
                <div 
                  className={`w-full h-10 rounded border border-[#E4E7EC] dark:border-[#27303A] flex flex-col justify-end p-0.5 ${barBg}`}
                  title={`${w.timeLabel}: AQI ${w.aqi}, Heat Index ${w.heatIndex}°C, Risk: ${w.environmentalRiskScore}/100`}
                >
                  <div 
                    className={`w-full rounded-xs ${barFill}`} 
                    style={{ height: `${Math.max(20, w.environmentalRiskScore)}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-medium text-[#171A1F] dark:text-[#F2F4F7] mt-1">
                  {w.timeLabel.split(':')[0]}h
                </span>
                <span className="text-[9px] font-mono text-[#667085] dark:text-[#98A2B3]">
                  {w.aqi}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Tasks Requiring Attention + Task × Environment Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Module A: Tasks Requiring Attention */}
        <div className="bg-[#FFFFFF] dark:bg-[#11161D] border border-[#E4E7EC] dark:border-[#27303A] rounded-xl p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] dark:border-[#27303A] pb-2.5">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-[#087F5B]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A1F] dark:text-[#F2F4F7]">
                Tasks Requiring Attention (Priority Queue)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#667085]">
              Ranked by Exposure Risk
            </span>
          </div>

          <div className="space-y-2">
            {prioritizedTasks.slice(0, 4).map((task, idx) => (
              <div
                key={task.id}
                className="p-2.5 rounded-md border border-[#E4E7EC] dark:border-[#27303A] bg-[#F9FAFB] dark:bg-[#171D25] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#E4E7EC] dark:bg-[#27303A] flex items-center justify-center font-bold text-[10px] text-[#667085] dark:text-[#98A2B3] shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-medium text-[#171A1F] dark:text-[#F2F4F7]">
                      {task.name}
                    </div>
                    <div className="text-[11px] text-[#667085] dark:text-[#98A2B3]">
                      {task.workers} workers • {task.duration}h • {task.indoorOutdoor}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={task.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module B: Task × Environment Operational Matrix */}
        <div className="bg-[#FFFFFF] dark:bg-[#11161D] border border-[#E4E7EC] dark:border-[#27303A] rounded-xl p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] dark:border-[#27303A] pb-2.5">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-[#087F5B]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A1F] dark:text-[#F2F4F7]">
                Task × Environment Operational Matrix
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#667085]">
              Exposure Parameters
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E4E7EC] dark:border-[#27303A] text-[#667085] dark:text-[#98A2B3] text-[10px] font-semibold uppercase">
                  <th className="pb-2">Task</th>
                  <th className="pb-2">AQI</th>
                  <th className="pb-2">Heat</th>
                  <th className="pb-2">Dust</th>
                  <th className="pb-2">Outdoor</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] dark:divide-[#27303A]">
                {evaluatedTasks.slice(0, 5).map((t) => (
                  <tr key={t.id} className="text-[#171A1F] dark:text-[#F2F4F7]">
                    <td className="py-2 font-medium truncate max-w-[130px]">{t.name}</td>
                    <td className="py-2 text-[11px] font-mono text-[#667085]">{t.airExposure.toUpperCase()}</td>
                    <td className="py-2 text-[11px] font-mono text-[#667085]">{t.heatExposure.toUpperCase()}</td>
                    <td className="py-2 text-[11px] font-mono text-[#667085]">{t.dustPotential.toUpperCase()}</td>
                    <td className="py-2 text-[11px] font-mono text-[#667085]">{t.indoorOutdoor === 'outdoor' ? 'YES' : 'NO'}</td>
                    <td className="py-2 text-right">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
