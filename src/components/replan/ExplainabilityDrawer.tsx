import React from 'react';
import { TaskExplanation } from '@/types';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { HelpCircle, Wind, HardHat, Scale, ShieldCheck } from 'lucide-react';

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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.whyMovedTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                {language === 'hi' ? 'गणितीय विश्लेषण' : 'Why was this moved?'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.whyMovedSubtitle}
            </p>
          </div>
        </div>

        {/* Task selector tabs */}
        <div className="flex flex-wrap gap-1.5">
          {allExplanations.map((exp) => (
            <button
              key={exp.taskId}
              onClick={() => onSelectTask(exp.taskId)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeExp.taskId === exp.taskId
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {exp.taskName.split(' ')[0]} {exp.moved ? `• ${t.statusReschedule}` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Task Detailed Breakdown */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeExp.taskName}
              </h4>
              <StatusBadge status={activeExp.status} size="sm" />
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {activeExp.headline}
            </div>
          </div>

          <div className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 sm:text-right">
            <div className="text-slate-400">{language === 'hi' ? 'समय परिवर्तन तुलना:' : 'Time Shift Analysis:'}</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {activeExp.originalTime} ➔ {activeExp.recommendedTime}
            </div>
          </div>
        </div>

        {/* 4 Pillars of Explainability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Pillar 1: Environmental Trigger */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <Wind className="w-4 h-4 text-sky-500" />
              <span>{t.envFactor}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExp.environmentalFactor}
            </p>
          </div>

          {/* Pillar 2: Task Characteristics */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <HardHat className="w-4 h-4 text-amber-500" />
              <span>{t.taskFactor}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExp.taskFactor}
            </p>
          </div>

          {/* Pillar 3: Regulatory Rule Citation */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <Scale className="w-4 h-4 text-rose-500" />
              <span>{t.regFactor}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExp.regulatoryFactor}
            </p>
          </div>
        </div>

        {/* Pillar 4: Mitigation & Worker Impact */}
        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs flex items-start gap-2.5 text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{t.mitigationImpact}:</span> {activeExp.mitigationImpact}
          </div>
        </div>
      </div>
    </div>
  );
}
