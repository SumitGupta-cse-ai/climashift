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
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.todayScheduleTitle}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
              {displayTasks.length} {language === 'hi' ? 'कार्य' : 'Tasks'}
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'सभी सेक्टरों में आज के कार्यों की परिचालन स्थिति।' : 'Real-time operational status across site sectors.'}
          </p>
        </div>

        <button
          onClick={() => setActiveNav('replan')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <span>{t.viewSideBySide}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2.5">
        {displayTasks.map((task) => {
          const isShifted = task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime;

          return (
            <div
              key={task.id}
              className={`p-3 rounded-lg border transition-all ${
                task.status === 'restricted'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : task.status === 'reschedule'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : task.status === 'protect'
                  ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/60'
                  : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {task.name}
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {task.indoorOutdoor.toUpperCase()}
                    </span>
                    <StatusBadge status={task.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{task.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{task.workers} {language === 'hi' ? 'श्रमिक' : 'Workers'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{task.duration}h</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:text-right shrink-0">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {language === 'hi' ? 'मूल:' : 'Original:'} {task.originalStartTime} – {task.originalEndTime}
                    </div>
                    {isShifted && (
                      <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center sm:justify-end gap-1">
                        <span>➔ {task.recommendedStartTime} – {task.recommendedEndTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {task.statusReason && (
                <div className="mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  {task.status === 'restricted' ? (
                    <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
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
