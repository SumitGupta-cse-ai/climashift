import React from 'react';
import { ImpactMetrics } from '@/types';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, ArrowRightLeft, AlertOctagon, HardHat, Gauge } from 'lucide-react';

interface ImpactSummaryCardsProps {
  metrics: ImpactMetrics;
}

export function ImpactSummaryCards({ metrics }: ImpactSummaryCardsProps) {
  const { t, language } = useApp();

  const cards = [
    {
      title: t.impactHoursAvoided,
      value: `${metrics.highRiskWorkerHoursAvoided}`,
      unit: language === 'hi' ? 'श्रमिक-घंटे' : 'Worker-Hours',
      subtitle: language === 'hi' 
        ? `${metrics.workersAffectedCount} श्रमिक अत्यधिक प्रदूषण/गर्मी से बचाए गए`
        : `${metrics.workersAffectedCount} workers shifted from high-exposure slots`,
      icon: ShieldCheck,
      color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
    },
    {
      title: t.impactTasksRescheduled,
      value: `${metrics.tasksRescheduled}`,
      unit: language === 'hi' ? 'कार्य' : 'Tasks Shifted',
      subtitle: language === 'hi' ? 'सुरक्षित समय में स्थानांतरित' : 'Optimized into lower-exposure windows',
      icon: ArrowRightLeft,
      color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
    },
    {
      title: t.impactCurbsEnforced,
      value: `${metrics.restrictedTasksFlagged}`,
      unit: language === 'hi' ? 'कार्य' : 'Curbs Flagged',
      subtitle: language === 'hi' ? 'सक्रिय CAQM GRAP Stage III नियमों के अनुसार' : 'Flagged per statutory C&D restrictions',
      icon: AlertOctagon,
      color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
    },
    {
      title: t.impactWorkersProtected,
      value: `${metrics.workersAffectedCount} / ${metrics.totalCrewCount}`,
      unit: language === 'hi' ? 'श्रमिक' : 'Crew Protected',
      subtitle: language === 'hi' ? 'साइट कार्यबल का हिस्सा' : 'Of total daily workforce directly repositioned',
      icon: HardHat,
      color: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60'
    },
    {
      title: t.impactDisruption,
      value: `${metrics.scheduleDisruptionScore}%`,
      unit: language === 'hi' ? 'विचलन' : 'Operational Drift',
      subtitle: language === 'hi' ? 'न्यूनतम संभव समय परिवर्तन' : 'Minimal schedule movement penalty applied',
      icon: Gauge,
      color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">{c.title}</span>
                <div className={`p-1 rounded border ${c.color} shrink-0`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                  {c.value}
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">{c.unit}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80 truncate">
              {c.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
