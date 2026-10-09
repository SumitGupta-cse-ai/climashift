import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Calendar, AlertTriangle } from 'lucide-react';

export function RecommendationHero() {
  const { siteProfile, executeReplan, isOptimizing, replanResult, tasks, environmentalWindows, setActiveNav, language } = useApp();

  const evaluatedTasks = replanResult?.recommendedTasks || tasks;
  const rescheduleCount = evaluatedTasks.filter(t => t.status === 'reschedule').length;
  const restrictedCount = evaluatedTasks.filter(t => t.status === 'restricted').length;

  // Compute lowest-risk 3-hour outdoor window dynamically
  let lowestRiskStartHour = 7;
  let lowestRiskScore = Infinity;
  if (environmentalWindows && environmentalWindows.length >= 3) {
    for (let i = 0; i <= environmentalWindows.length - 3; i++) {
      const avg = (environmentalWindows[i].environmentalRiskScore + 
                   environmentalWindows[i+1].environmentalRiskScore + 
                   environmentalWindows[i+2].environmentalRiskScore) / 3;
      if (avg < lowestRiskScore) {
        lowestRiskScore = avg;
        lowestRiskStartHour = environmentalWindows[i].hour;
      }
    }
  }
  const recommendedWindowStr = `${lowestRiskStartHour.toString().padStart(2, '0')}:00 – ${(lowestRiskStartHour + 3).toString().padStart(2, '0')}:00 IST`;

  const primaryStatus = rescheduleCount > 0 ? 'RESCHEDULE' : (restrictedCount > 0 ? 'RESTRICTED' : 'CONTINUE');

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col">
      {/* Background Crane Silhouette */}
      <svg 
        className="absolute right-0 bottom-0 w-44 h-44 text-[#1E3146] dark:text-[#18283B] opacity-15 dark:opacity-30 pointer-events-none select-none -mr-4 -mb-4 transition-opacity" 
        viewBox="0 0 100 100" 
        fill="currentColor"
      >
        <path d="M10 90 L90 90 L90 85 L55 85 L55 20 L85 10 L85 8 L50 8 L50 85 L10 85 Z M52 25 L75 17 L52 17 Z M52 40 L70 34 L52 34 Z M20 90 L20 85 L35 85 L35 90 Z" />
      </svg>

      <div className="relative z-10 space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1]">
            {language === 'hi' ? 'आज का कार्य निर्णय' : "TODAY'S WORK DECISION"}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FEEFEF] dark:bg-[#2D1818] text-[#D94A4A] dark:text-[#F87171] border border-[#FBC8C8] dark:border-[#4E2424] font-mono uppercase">
            {siteProfile.grapStage.replace('_', ' ')}
          </span>
        </div>

        {/* Primary Decision Banner */}
        <div className="space-y-2">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border border-[#FBE3B8] dark:border-[#4B3B24]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{primaryStatus}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
            {recommendedWindowStr}
          </h2>

          <p className="text-xs sm:text-sm text-[#667085] dark:text-[#A7B2C1] leading-relaxed max-w-xl">
            {language === 'hi'
              ? 'दोपहर के गंभीर प्रदूषण व अत्यधिक गर्मी से बचने के लिए बाहरी प्लास्टरिंग और सामग्री अनलोडिंग को सुबह की शिफ्ट में स्थानांतरित करें।'
              : 'Outdoor plastering & material unloading should move to the morning window before midday particulate and heat.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 pt-5 mt-4 border-t border-[#E4E7EC] dark:border-[#26384C]/60 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveNav('replan')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs text-white bg-[#16B878] hover:bg-[#139c65] transition shadow-sm cursor-pointer"
        >
          <span>{language === 'hi' ? 'सिफारिश देखें' : 'Review Recommendation'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => executeReplan()}
          disabled={isOptimizing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-xs text-[#171A1F] dark:text-[#F5F7FA] bg-[#F7F8FA] dark:bg-[#122235] hover:bg-[#E4E7EC] dark:hover:bg-[#1B2E46] border border-[#E4E7EC] dark:border-[#26384C] transition cursor-pointer disabled:opacity-50"
        >
          {isOptimizing ? (
            <span className="animate-spin rounded-full h-3 w-3 border-2 border-[#16B878] border-t-transparent"></span>
          ) : (
            <Calendar className="w-3.5 h-3.5 text-[#A7B2C1]" />
          )}
          <span>{language === 'hi' ? 'दिन दोबारा प्लान करें' : 'Replan My Day'}</span>
        </button>
      </div>
    </div>
  );
}
