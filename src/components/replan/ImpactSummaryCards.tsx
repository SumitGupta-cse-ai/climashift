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
        ? `${metrics.workersAffectedCount} श्रमिकों को अत्यधिक प्रदूषण/गर्मी समय से हटाया गया`
        : `Calculated from ${metrics.workersAffectedCount} workers shifted away from peak AQI/heat window`,
      icon: ShieldCheck,
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
    },
    {
      title: t.impactTasksRescheduled,
      value: `${metrics.tasksRescheduled}`,
      unit: language === 'hi' ? 'कार्य बदले गए' : 'Activities Moved',
      subtitle: language === 'hi' ? 'सुरक्षित दिनचर्या समय में स्थानांतरित' : 'Optimized into lower-exposure diurnal windows',
      icon: ArrowRightLeft,
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
    },
    {
      title: t.impactCurbsEnforced,
      value: `${metrics.restrictedTasksFlagged}`,
      unit: language === 'hi' ? 'रोक लगे कार्य' : 'Suspended / Curbs',
      subtitle: language === 'hi' ? 'सक्रिय CAQM GRAP Stage III नियमों के अनुसार' : 'Prohibited by active CAQM / GRAP Stage III rules',
      icon: AlertOctagon,
      color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
    },
    {
      title: t.impactWorkersProtected,
      value: `${metrics.workersAffectedCount} / ${metrics.totalCrewCount}`,
      unit: language === 'hi' ? 'श्रमिक सुरक्षित' : 'Crew Safeguarded',
      subtitle: language === 'hi' ? 'कुल कार्यबल सीधे तौर पर सुरक्षित किया गया' : 'Total site workforce directly repositioned',
      icon: HardHat,
      color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60'
    },
    {
      title: t.impactDisruption,
      value: `${metrics.scheduleDisruptionScore}%`,
      unit: language === 'hi' ? 'शेड्यूल विचलन' : 'Operational Drift',
      subtitle: language === 'hi' ? 'न्यूनतम संभव समय परिवर्तन लागू किया गया' : 'Minimal viable schedule shift penalty applied',
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
