import React from 'react';
import { ImpactMetrics } from '@/types';
import { ShieldCheck, ArrowRightLeft, AlertOctagon, HardHat, Gauge } from 'lucide-react';

interface ImpactSummaryCardsProps {
  metrics: ImpactMetrics;
}

export function ImpactSummaryCards({ metrics }: ImpactSummaryCardsProps) {
  const cards = [
    {
      title: 'High-Risk Worker-Hours Avoided',
      value: `${metrics.highRiskWorkerHoursAvoided}`,
      unit: 'Worker-Hours',
      subtitle: `Calculated from ${metrics.workersAffectedCount} workers shifted away from peak AQI/heat window`,
      icon: ShieldCheck,
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
    },
    {
      title: 'Tasks Rescheduled',
      value: `${metrics.tasksRescheduled}`,
      unit: 'Activities Moved',
      subtitle: 'Optimized into lower-exposure diurnal windows',
      icon: ArrowRightLeft,
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
    },
    {
      title: 'Statutory Curbs Enforced',
      value: `${metrics.restrictedTasksFlagged}`,
      unit: 'Suspended / Curbs',
      subtitle: 'Prohibited by active CAQM / GRAP Stage III rules',
      icon: AlertOctagon,
      color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
    },
    {
      title: 'Workers Protected',
      value: `${metrics.workersAffectedCount} / ${metrics.totalCrewCount}`,
      unit: 'Crew Safeguarded',
      subtitle: 'Total site workforce directly repositioned',
      icon: HardHat,
      color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60'
    },
    {
      title: 'Schedule Disruption Score',
      value: `${metrics.scheduleDisruptionScore}%`,
      unit: 'Operational Drift',
      subtitle: 'Minimal viable schedule shift penalty applied',
      icon: Gauge,
      color: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">{c.title}</span>
                <div className={`p-1.5 rounded-lg border ${c.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {c.value}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{c.unit}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed">
              {c.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
