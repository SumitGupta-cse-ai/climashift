import React from 'react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Users, MapPin, Clock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export function TodayTimeline() {
  const { tasks, replanResult, setActiveNav, t, language } = useApp();

  const displayTasks = tasks.map(t => {
    const rec = replanResult?.recommendedTasks.find(r => r.id === t.id);
    return rec || t;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.todayScheduleTitle}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
              {displayTasks.length} {language === 'hi' ? 'कार्य नियोजित' : 'Planned Activities'}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'सभी सेक्टरों में आज के कार्यों की वास्तविक स्थिति।' : 'Real-time status overview of tasks scheduled across site sectors.'}
          </p>
        </div>

        <button
          onClick={() => setActiveNav('replan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline min-h-[36px] cursor-pointer"
        >
          <span>{t.viewSideBySide}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {displayTasks.map((task) => {
          const isShifted = task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime;

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                task.status === 'restricted'
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : task.status === 'reschedule'
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : task.status === 'protect'
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/60'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {task.name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {task.indoorOutdoor.toUpperCase()}
                    </span>
                    <StatusBadge status={task.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{task.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{task.workers} {language === 'hi' ? 'श्रमिक' : 'Workers'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{task.duration} {language === 'hi' ? 'घंटे' : 'Hours'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right shrink-0">
                  <div>
                    <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                      {language === 'hi' ? 'मूल समय:' : 'Original:'} {task.originalStartTime} – {task.originalEndTime}
                    </div>
                    {isShifted && (
                      <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center sm:justify-end gap-1">
                        <span>➔ {language === 'hi' ? 'नया समय:' : 'Recommended:'} {task.recommendedStartTime} – {task.recommendedEndTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {task.statusReason && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  {task.status === 'restricted' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                  <span>{task.statusReason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
