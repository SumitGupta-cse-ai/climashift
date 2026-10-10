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
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] border-t-4 border-t-[#FACC15] rounded-2xl p-5 sm:p-6 shadow-tactile relative overflow-hidden flex flex-col justify-between transition-all">
      {/* Top Meta Bar */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              {language === 'hi' ? 'आज का परिचालन निर्देश' : 'OPERATIONAL DIRECTIVE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D] font-mono uppercase shadow-xs">
              {siteProfile.grapStage.replace('_', ' ')} ACTIVE
            </span>
          </div>
        </div>

        {/* Primary Status Banner */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black tracking-wide shadow-xs ${
              primaryStatus === 'RESCHEDULE'
                ? 'bg-[#FEF08A] text-[#854D0E] border-2 border-[#EAB308] dark:bg-[#422006] dark:text-[#FACC15] dark:border-[#CA8A04]'
                : primaryStatus === 'RESTRICTED'
                ? 'bg-[#FEE2E2] text-[#991B1B] border-2 border-[#FCA5A5] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#7F1D1D]'
                : 'bg-[#DCFCE7] text-[#166534] border-2 border-[#86EFAC] dark:bg-[#064E3B] dark:text-[#4ADE80] dark:border-[#065F46]'
            }`}>
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{primaryStatus === 'RESCHEDULE' ? 'SHIFT TO MORNING WINDOW' : primaryStatus}</span>
            </span>

            <span className="text-[11px] font-bold text-[#166534] dark:text-[#4ADE80] bg-[#DCFCE7] dark:bg-[#064E3B]/60 px-2.5 py-0.5 rounded-md border border-[#86EFAC] dark:border-[#047857] shadow-xs">
              ↓ 59% Exposure Avoided
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] font-mono">
            {recommendedWindowStr}
          </h2>

          <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium leading-relaxed">
            {language === 'hi'
              ? 'दोपहर के गंभीर प्रदूषण (AQI 395+) व अत्यधिक तापमान (41°C) से बचाव हेतु बाहरी कार्यों को सुबह की सुरक्षित खिड़की में स्थानांतरित किया गया है।'
              : 'Outdoor plastering & unloading shifted to the cool morning slot before peak afternoon smog & 41°C heat index.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-4 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setActiveNav('replan')}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs text-[#0F172A] bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#CA8A04] active:scale-[0.98] transition shadow-lamy cursor-pointer"
        >
          <span>{language === 'hi' ? 'सिफारिश देखें व लागू करें' : 'Review & Dispatch Plan'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          onClick={() => executeReplan()}
          disabled={isOptimizing}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-[#FFFFFF] dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] border-2 border-[#CBD5E1] dark:border-[#475569] active:scale-[0.98] transition cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FACC15] ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{language === 'hi' ? 'पुनर्गणना' : 'Re-evaluate'}</span>
        </button>
      </div>
    </div>
  );
}
