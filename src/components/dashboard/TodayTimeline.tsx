import React from 'react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowRight } from 'lucide-react';

export function TodayTimeline() {
  const { tasks, replanResult, setActiveNav, language } = useApp();

  const displayTasks = tasks.map(t => {
    const rec = replanResult?.recommendedTasks.find(r => r.id === t.id);
    return rec || t;
  });

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl shadow-sm overflow-hidden">
      {/* Table Header Row */}
      <div className="p-5 sm:p-6 border-b border-[#E4E7EC] dark:border-[#26384C] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? "आज का कार्य कार्यक्रम" : "Today's Work Schedule"}
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border border-[#C3ECD8] dark:border-[#1E4B39]">
            {displayTasks.length} {language === 'hi' ? 'कार्य' : 'Tasks'}
          </span>
        </div>

        <button
          onClick={() => setActiveNav('replan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16B878] hover:text-[#139c65] transition cursor-pointer"
        >
          <span>{language === 'hi' ? 'पूरी योजना देखें' : 'View Full Plan'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Enterprise Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C]/60 text-[#667085] dark:text-[#A7B2C1] text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">{language === 'hi' ? 'कार्य' : 'Task'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'स्थान' : 'Location'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'श्रमिक' : 'Workers'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'अवधि' : 'Duration'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'मूल समय' : 'Original Time'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'अनुशंसित समय' : 'Recommended Time'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'निर्णय' : 'Decision'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'जोखिम' : 'Risk'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E7EC] dark:divide-[#26384C]">
            {displayTasks.map((task, idx) => {
              const isRestricted = task.status === 'restricted';
              const isShifted = task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime;
              const hasRec = Boolean(task.recommendedStartTime && task.recommendedEndTime);

              let riskColor = 'text-[#18A66A]';
              let riskLabel = 'Low';
              if (task.status === 'restricted' || task.status === 'reschedule') {
                riskColor = 'text-[#D94A4A]';
                riskLabel = 'High';
              } else if (task.status === 'protect') {
                riskColor = 'text-[#D99A24]';
                riskLabel = 'Medium';
              }

              return (
                <tr 
                  key={task.id}
                  className="hover:bg-[#F7F8FA]/60 dark:hover:bg-[#122235]/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-xs text-center text-[#667085] dark:text-[#A7B2C1]">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#171A1F] dark:text-[#F5F7FA]">
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] text-[#667085] dark:text-[#A7B2C1]">
                        {task.indoorOutdoor}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#667085] dark:text-[#A7B2C1]">
                    {task.location}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#171A1F] dark:text-[#F5F7FA]">
                    {task.workers} crew
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#667085] dark:text-[#A7B2C1]">
                    {task.duration}h
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#667085] dark:text-[#A7B2C1]">
                    {task.originalStartTime} – {task.originalEndTime}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    {isRestricted ? (
                      <span className="text-[#D94A4A] dark:text-[#F87171] text-xs uppercase tracking-wide">
                        STANDBY
                      </span>
                    ) : hasRec ? (
                      <span className="text-[#16B878]">
                        {task.recommendedStartTime} – {task.recommendedEndTime}
                      </span>
                    ) : (
                      <span className="text-[#16B878]">
                        {task.originalStartTime} – {task.originalEndTime}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={task.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-medium text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${riskLabel === 'High' ? 'bg-[#D94A4A]' : riskLabel === 'Medium' ? 'bg-[#D99A24]' : 'bg-[#18A66A]'}`}></span>
                      <span className={riskColor}>{riskLabel}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
