import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function RecommendationHero() {
  const { siteProfile, executeReplan, isOptimizing, replanResult, setActiveNav, t, language } = useApp();

  const highRiskAvoided = replanResult?.impactMetrics.highRiskWorkerHoursAvoided || 16;
  const rescheduledCount = replanResult?.impactMetrics.tasksRescheduled || 2;
  const restrictedCount = replanResult?.impactMetrics.restrictedTasksFlagged || 1;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 sm:p-5 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              {t.heroAdvisory}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {siteProfile.name} • {siteProfile.grapStage.replace('_', ' ')}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
            {t.heroHeadline}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t.heroDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{restrictedCount} {language === 'hi' ? 'प्रतिबंधित कार्य' : 'statutory curb flagged'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{rescheduledCount} {language === 'hi' ? 'पुनर्निर्धारण योग्य' : 'tasks rescheduled'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{highRiskAvoided} {language === 'hi' ? 'श्रमिक-घंटे सुरक्षित' : 'worker-hours avoided'}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => executeReplan()}
            disabled={isOptimizing}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition min-h-[42px] cursor-pointer shadow-subtle disabled:opacity-50"
          >
            {isOptimizing ? (
              <>
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></span>
                <span>{t.evaluatingConstraints}</span>
              </>
            ) : (
              <>
                <span>{t.replanMyDay}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            onClick={() => setActiveNav('plan')}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition min-h-[38px] cursor-pointer"
          >
            <span>{t.editPlanBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
