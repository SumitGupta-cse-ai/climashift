import React from 'react';
import { useApp } from '@/context/AppContext';
import { History, ShieldCheck, Clock, Users, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export function ActivityView() {
  const { decisionLogs, setReplanResult, setActiveNav } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-emerald-500" />
            <span>Decision Log & Broadcast Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable supervisor approval log with environmental telemetry snapshots and worker notification records.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <span>{decisionLogs.length} Logged Decisions</span>
        </div>
      </div>

      {decisionLogs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No historical decisions logged yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Decisions are recorded when a supervisor reviews and explicitly approves a replanned work schedule.
          </p>
          <button
            onClick={() => setActiveNav('replan')}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950"
          >
            Review Current Replan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {decisionLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{log.id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                        {log.status}
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Site: {log.siteName} • Approved: {log.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setReplanResult(log.replanSummary);
                    setActiveNav('replan');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline min-h-[36px]"
                >
                  <span>Re-open Schedule Snapshot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Log Stats Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Tasks Evaluated</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {log.tasksCount}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                  <span className="text-amber-700 dark:text-amber-400 text-[10px] uppercase font-bold block">Rescheduled</span>
                  <span className="text-base font-extrabold text-amber-900 dark:text-amber-200 font-mono">
                    {log.rescheduledCount}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                  <span className="text-rose-700 dark:text-rose-400 text-[10px] uppercase font-bold block">Statutory Curbs</span>
                  <span className="text-base font-extrabold text-rose-900 dark:text-rose-200 font-mono">
                    {log.restrictedCount}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-bold block">Worker-Hours Saved</span>
                  <span className="text-base font-extrabold text-emerald-900 dark:text-emerald-200 font-mono">
                    {log.highRiskHoursAvoided}h
                  </span>
                </div>
              </div>

              {/* Notes */}
              {log.supervisorNotes && (
                <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Supervisor Remarks:</span> {log.supervisorNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
