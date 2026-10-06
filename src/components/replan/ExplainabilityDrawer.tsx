import React from 'react';
import { TaskExplanation } from '@/types';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { HelpCircle, Wind, HardHat, Scale, ShieldCheck, ArrowRightCircle } from 'lucide-react';

interface ExplainabilityDrawerProps {
  explanation: TaskExplanation | null;
  allExplanations: TaskExplanation[];
  onSelectTask: (taskId: string) => void;
  onClose: () => void;
}

export function ExplainabilityDrawer({
  explanation,
  allExplanations,
  onSelectTask,
}: ExplainabilityDrawerProps) {
  const { t, language } = useApp();

  const activeExp = explanation || allExplanations[0];
  if (!activeExp) return null;

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.whyMovedTitle}
          </h3>
          <span className="text-[10px] text-slate-400">
            ({language === 'hi' ? 'गणितीय व कानूनी ऑडिट' : '3-Factor Risk Analysis'})
          </span>
        </div>

        {/* Task selector chips */}
        <div className="flex flex-wrap gap-1">
          {allExplanations.map((exp) => (
            <button
              key={exp.taskId}
              onClick={() => onSelectTask(exp.taskId)}
              className={`text-[10px] px-2 py-1 rounded font-medium transition cursor-pointer ${
                activeExp.taskId === exp.taskId
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {exp.taskName.split(' ')[0]} {exp.moved ? '• Shifted' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Task Details */}
      <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {activeExp.taskName}
            </h4>
            <StatusBadge status={activeExp.status} size="sm" />
          </div>

          <div className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300">
            {activeExp.originalTime} ➔ <strong className="text-emerald-600 dark:text-emerald-400">{activeExp.recommendedTime}</strong>
          </div>
        </div>

        {/* 3 FACTORS: Environmental | Task/Exposure | Regulatory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          {/* Factor 1 */}
          <div className="p-3 rounded-md bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500">
              <Wind className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.envFactor}</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExp.environmentalFactor}
            </p>
          </div>

          {/* Factor 2 */}
          <div className="p-3 rounded-md bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500">
              <HardHat className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.taskFactor}</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExp.taskFactor}
            </p>
          </div>

          {/* Factor 3 */}
          <div className="p-3 rounded-md bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500">
              <Scale className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.regFactor}</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExp.regulatoryFactor}
            </p>
          </div>
        </div>

        {/* DECISION & IMPACT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
            <ArrowRightCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                {language === 'hi' ? 'निर्णय (Decision)' : 'Decision'}
              </span>
              <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200">{activeExp.headline}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block">
                {language === 'hi' ? 'प्रभाव (Impact)' : 'Impact'}
              </span>
              <span className="text-[11px] font-medium text-emerald-900 dark:text-emerald-200">{activeExp.mitigationImpact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
