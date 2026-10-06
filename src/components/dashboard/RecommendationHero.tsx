import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function RecommendationHero() {
  const { siteProfile, executeReplan, isOptimizing, replanResult, setActiveNav, t, language } = useApp();

  const highRiskAvoided = replanResult?.impactMetrics.highRiskWorkerHoursAvoided || 16;
  const rescheduledCount = replanResult?.impactMetrics.tasksRescheduled || 2;
  const restrictedCount = replanResult?.impactMetrics.restrictedTasksFlagged || 1;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 p-5 sm:p-7 shadow-elevated text-white">
      {/* Subtle backdrop pattern */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.heroAdvisory} • {siteProfile.grapStage.replace('_', ' ')}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
            {t.heroHeadline}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {t.heroDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{restrictedCount} {language === 'hi' ? 'कार्य कानूनी रूप से रोके गए' : 'task flagged under statutory curbs'}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{rescheduledCount} {language === 'hi' ? 'कार्यों का समय बदला जाना जरूरी' : 'outdoor activities need earlier windows'}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{highRiskAvoided} {language === 'hi' ? 'श्रमिक-घंटे अत्यधिक खतरे से बचाए गए' : 'worker-hours of extreme exposure preventable'}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            onClick={() => executeReplan()}
            disabled={isOptimizing}
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-extrabold text-xs sm:text-sm tracking-wide text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] min-h-[48px] uppercase focus:ring-4 focus:ring-emerald-400/30 cursor-pointer"
          >
            {isOptimizing ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent"></span>
                <span>{t.evaluatingConstraints}</span>
              </>
            ) : (
              <>
                <span>{t.replanMyDay}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>

          <button
            onClick={() => setActiveNav('plan')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition min-h-[44px] cursor-pointer"
          >
            <span>{t.editPlanBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
