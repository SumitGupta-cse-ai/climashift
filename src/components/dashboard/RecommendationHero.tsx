import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Calendar, AlertTriangle, ShieldCheck, Clock, Sparkles, RefreshCw } from 'lucide-react';

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
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all">
      {/* Top Meta Bar */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse"></span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              {language === 'hi' ? 'आज का परिचालन निर्देश' : 'OPERATIONAL DIRECTIVE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D] font-mono uppercase">
              {siteProfile.grapStage.replace('_', ' ')} ACTIVE
            </span>
          </div>
        </div>

        {/* Primary Status Banner */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
              primaryStatus === 'RESCHEDULE'
                ? 'bg-[#FEF3C7] dark:bg-[#3D2E0B] text-[#D97706] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#78350F]'
                : primaryStatus === 'RESTRICTED'
                ? 'bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D]'
                : 'bg-[#DCFCE7] dark:bg-[#064E3B] text-[#16A34A] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#065F46]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{primaryStatus === 'RESCHEDULE' ? 'SHIFT TO MORNING WINDOW' : primaryStatus}</span>
            </span>

            <span className="text-[11px] font-medium text-[#10B981] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/40 px-2 py-0.5 rounded-md border border-[#A7F3D0] dark:border-[#047857]">
              ↓ 59% Exposure Avoided
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            {recommendedWindowStr}
          </h2>

          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            {language === 'hi'
              ? 'दोपहर के गंभीर प्रदूषण (AQI 395+) व अत्यधिक तापमान (41°C) से बचाव हेतु बाहरी कार्यों को सुबह की सुरक्षित खिड़की में स्थानांतरित किया गया है।'
              : 'Outdoor plastering & unloading shifted to the cool morning slot before peak afternoon smog & 41°C heat index.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-4 border-t border-[#F1F5F9] dark:border-[#1E293B] flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setActiveNav('replan')}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#10B981] hover:bg-[#059669] active:scale-[0.98] transition shadow-sm cursor-pointer"
        >
          <span>{language === 'hi' ? 'सिफारिश देखें व लागू करें' : 'Review & Dispatch Plan'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => executeReplan()}
          disabled={isOptimizing}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs text-[#334155] dark:text-[#CBD5E1] bg-[#F8FAFC] dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] border border-[#E2E8F0] dark:border-[#334155] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8] ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{language === 'hi' ? 'पुनर्गणना' : 'Re-evaluate'}</span>
        </button>
      </div>
    </div>
  );
}
