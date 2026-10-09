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
      title: language === 'hi' ? 'बचाए श्रमिक-घंटे' : 'Worker-Hours Shifted',
      value: `${metrics.highRiskWorkerHoursAvoided}`,
      unit: language === 'hi' ? 'घंटे' : 'Crew-Hrs',
      subtitle: language === 'hi' 
        ? 'उच्च जोखिम वाली दोपहर से स्थानांतरित' 
        : 'Shifted away from high exposure hours',
      icon: ShieldCheck,
      badgeColor: 'text-[#18A66A] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#0E3A31] dark:text-[#18A66A] dark:border-[#1E4B39]'
    },
    {
      title: t.impactTasksRescheduled,
      value: `${metrics.tasksRescheduled}`,
      unit: language === 'hi' ? 'कार्य' : 'Tasks Shifted',
      subtitle: language === 'hi' ? 'सुरक्षित समय में स्थानांतरित' : 'Shifted into low-risk safe slots',
      icon: ArrowRightLeft,
      badgeColor: 'text-[#D99A24] bg-[#FEF7EB] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]'
    },
    {
      title: t.impactCurbsEnforced,
      value: `${metrics.restrictedTasksFlagged}`,
      unit: language === 'hi' ? 'प्रतिबंधित' : 'Statutory Curbs',
      subtitle: language === 'hi' ? 'CAQM GRAP नियमों के अनुसार' : 'Flagged per statutory C&D curbs',
      icon: AlertOctagon,
      badgeColor: 'text-[#D94A4A] bg-[#FEEFEF] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]'
    },
    {
      title: language === 'hi' ? 'जोखिम कमी' : 'Exposure Reduction',
      value: `${metrics.exposureReductionPercent}%`,
      unit: language === 'hi' ? 'कमी' : 'Reduction',
      subtitle: language === 'hi' ? 'मूल बनाम नया शेड्यूल' : 'Calculated vs. original plan overlap',
      icon: HardHat,
      badgeColor: 'text-[#16B878] bg-[#EBF8F2] border-[#C3ECD8] dark:bg-[#0E3A31] dark:text-[#16B878] dark:border-[#1E4B39]'
    },
    {
      title: t.impactDisruption,
      value: `${metrics.scheduleDisruptionScore}%`,
      unit: language === 'hi' ? 'विचलन' : 'Schedule Drift',
      subtitle: language === 'hi' ? 'न्यूनतम समय परिवर्तन' : 'Minimal operational displacement',
      icon: Gauge,
      badgeColor: 'text-[#2F80ED] bg-[#EDF5FF] border-[#CCE2FF] dark:bg-[#10243E] dark:text-[#60A5FA] dark:border-[#1E3A5F]'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[#667085] dark:text-[#A7B2C1] mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider truncate" title={c.title}>
                    {c.title}
                  </span>
                  <div className={`p-1.5 rounded-md border ${c.badgeColor} shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl font-bold tracking-tight text-[#171A1F] dark:text-[#F5F7FA] font-mono">
                    {c.value}
                  </span>
                  <span className="text-xs text-[#667085] dark:text-[#A7B2C1] font-medium truncate">
                    {c.unit}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#667085] dark:text-[#A7B2C1] pt-2 border-t border-[#E4E7EC] dark:border-[#26384C]/60 truncate" title={c.subtitle}>
                {c.subtitle}
              </p>
            </div>
          );
        })}
      </div>
      <div className="text-[11px] text-[#667085] dark:text-[#A7B2C1] font-normal px-1 flex items-center justify-between">
        <span>* Deterministic mathematical evaluation based on task overlap & CPCB diurnal curve.</span>
        <span>Operational shift guidance only.</span>
      </div>
    </div>
  );
}
