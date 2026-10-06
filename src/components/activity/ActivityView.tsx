import React from 'react';
import { useApp } from '@/context/AppContext';
import { History, ArrowRight, FileText, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export function ActivityView() {
  const { decisionLogs, setReplanResult, setActiveNav, language } = useApp();

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'निर्णय ऑडिट लॉग' : 'Decision Audit Log'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'पर्यवेक्षक द्वारा अनुमोदित किए गए निर्णयों का क्रमानुसार इतिहास।'
              : 'Chronological audit trail of supervisor-approved schedule adjustments.'}
          </p>
        </div>

        <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 w-fit">
          {decisionLogs.length} {language === 'hi' ? 'सत्यापित निर्णय' : 'Approved Decisions'}
        </span>
      </div>

      {decisionLogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'अभी तक कोई निर्णय दर्ज नहीं हुआ है' : 'No decisions logged yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'hi'
              ? 'जब पर्यवेक्षक रीप्लान योजना की समीक्षा करके उसे अनुमोदित करता है, तो रिकॉर्ड यहां सुरक्षित होता है।'
              : 'Decisions are registered here once a supervisor reviews and explicitly approves a replanned work schedule.'}
          </p>
          <button
            onClick={() => setActiveNav('replan')}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            {language === 'hi' ? 'रीप्लान स्क्रीन पर जाएं' : 'Go to Replan Engine'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {decisionLogs.map((log) => {
            const replan = log.replanSummary;
            const movedTasks = replan.recommendedTasks.filter(t => t.status === 'reschedule');
            const restrictedTasks = replan.recommendedTasks.filter(t => t.status === 'restricted');

            return (
              <div
                key={log.id}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
              >
                {/* Decision Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                      {log.status}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{log.id}</span>
                    <span className="text-[10px] text-slate-400">• {log.timestamp}</span>
                  </div>

                  <button
                    onClick={() => {
                      setReplanResult(log.replanSummary);
                      setActiveNav('replan');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'शेड्यूल स्नैपशॉट देखें' : 'View Schedule Snapshot'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Specific Rescheduled / Restricted Task Items */}
                <div className="space-y-2">
                  {movedTasks.map(t => (
                    <div key={t.id} className="p-2.5 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{t.name}</span>
                          <span className="text-[10px] font-normal text-slate-500">({t.location})</span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          <strong>Reason:</strong> {t.statusReason}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300">
                          {t.originalStartTime}–{t.originalEndTime} ➔ {t.recommendedStartTime}–{t.recommendedEndTime}
                        </span>
                        <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400">RESCHEDULED</div>
                      </div>
                    </div>
                  ))}

                  {restrictedTasks.map(t => (
                    <div key={t.id} className="p-2.5 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{t.name}</span>
                          <span className="text-[10px] font-normal text-slate-500">({t.location})</span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          <strong>Reason:</strong> {t.statusReason}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-[11px] font-mono font-bold text-rose-800 dark:text-rose-300">
                          {t.originalStartTime}–{t.originalEndTime}
                        </span>
                        <div className="text-[10px] font-bold text-rose-700 dark:text-rose-400">SUSPENDED (GRAP III)</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Environmental & Regulatory Context Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Site: <strong>{log.siteName}</strong></span>
                  <span>Context: AQI {replan.siteProfile.currentAQI} • {replan.siteProfile.grapStage} • Avoided {log.highRiskHoursAvoided} worker-hours</span>
                </div>

                {log.supervisorNotes && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="font-semibold">{language === 'hi' ? 'पर्यवेक्षक नोट:' : 'Supervisor Note:'}</span> {log.supervisorNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
