import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { History, ArrowRight, FileText, Play, Cpu, ShieldCheck, Search, Filter, CheckCircle2, AlertOctagon } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export function ActivityView() {
  const { decisionLogs, replayDecision, setActiveNav, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = decisionLogs.filter(log => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.id.toLowerCase().includes(q) ||
      log.siteName.toLowerCase().includes(q) ||
      log.supervisorNotes.toLowerCase().includes(q) ||
      log.replanSummary.recommendedTasks.some(t => t.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'निर्णय ऑडिट लॉग एवं पुनरुत्पादन' : 'Decision Audit Log & Replay'}
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#A7B2C1] mt-1">
            {language === 'hi'
              ? 'पर्यवेक्षक द्वारा अनुमोदित किए गए निर्णयों का क्रमानुसार इतिहास व निर्णय पुनरुत्पादन।'
              : 'Immutable chronological audit trail. Click "Replay Decision" to reproduce complete optimizer reasoning.'}
          </p>
        </div>

        <span className="text-xs font-mono font-semibold text-[#667085] dark:text-[#A7B2C1] bg-[#F7F8FA] dark:bg-[#122235] px-3 py-1.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] w-fit">
          {decisionLogs.length} {language === 'hi' ? 'सत्यापित निर्णय' : 'Approved Decisions'}
        </span>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#667085] dark:text-[#A7B2C1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions by ID, site, or task name..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] placeholder:text-[#667085] focus:outline-none focus:border-[#16B878]"
          />
        </div>

        <div className="text-xs text-[#667085] dark:text-[#A7B2C1] flex items-center gap-2">
          <span>Engine: <strong className="font-mono text-[#171A1F] dark:text-[#F5F7FA]">Deterministic v2.4</strong></span>
          <span>•</span>
          <span>Standard: <strong className="font-mono text-[#171A1F] dark:text-[#F5F7FA]">CAQM GRAP-III</strong></span>
        </div>
      </div>

      {/* Empty State */}
      {decisionLogs.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] dark:bg-[#0D1B2A] rounded-xl border border-[#E4E7EC] dark:border-[#26384C] space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center text-[#16B878] mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'अभी तक कोई निर्णय दर्ज नहीं हुआ है' : 'No Decisions Logged Yet'}
          </h3>
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1] max-w-sm mx-auto leading-relaxed">
            {language === 'hi'
              ? 'जब पर्यवेक्षक रीप्लान योजना की समीक्षा करके उसे अनुमोदित करता है, तो रिकॉर्ड यहां सुरक्षित होता है।'
              : 'Decisions are registered here once a supervisor reviews and explicitly approves a replanned work schedule.'}
          </p>
          <button
            onClick={() => setActiveNav('replan')}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#16B878] hover:bg-[#139c65] text-white transition shadow-sm cursor-pointer min-h-[40px]"
          >
            {language === 'hi' ? 'रीप्लान स्क्रीन पर जाएं' : 'Go to Replan Engine'}
          </button>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-[#FFFFFF] dark:bg-[#0D1B2A] rounded-xl border border-[#E4E7EC] dark:border-[#26384C] space-y-2">
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1]">No decision logs matching &quot;{searchQuery}&quot;.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const replan = log.replanSummary;
            const movedTasks = replan.recommendedTasks.filter(t => t.status === 'reschedule');
            const restrictedTasks = replan.recommendedTasks.filter(t => t.status === 'restricted');

            return (
              <div
                key={log.id}
                className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm hover:border-[#16B878]/50 transition space-y-4"
              >
                {/* Decision Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EC] dark:border-[#26384C] pb-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] font-bold border border-[#C3ECD8] dark:border-[#1E4B39]">
                      {log.status}
                    </span>
                    <span className="text-sm font-bold text-[#171A1F] dark:text-[#F5F7FA] font-mono">{log.id}</span>
                    <span className="text-xs text-[#667085] dark:text-[#A7B2C1]">• {log.timestamp}</span>
                    <span className="text-xs text-[#667085] dark:text-[#A7B2C1]">• {log.siteName}</span>
                  </div>

                  {/* Replay CTA */}
                  <button
                    onClick={() => replayDecision(log.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F7F8FA] dark:bg-[#122235] hover:bg-[#E4E7EC] dark:hover:bg-[#1B2E46] text-[#171A1F] dark:text-[#F5F7FA] border border-[#E4E7EC] dark:border-[#26384C] transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-[#16B878]" />
                    <span>{language === 'hi' ? 'निर्णय दोहराएं (Replay)' : 'Replay Decision'}</span>
                  </button>
                </div>

                {/* Supervisor Remarks */}
                {log.supervisorNotes && (
                  <div className="p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] text-xs text-[#171A1F] dark:text-[#F5F7FA]">
                    <strong className="text-[#667085] dark:text-[#A7B2C1] uppercase text-[10px] block mb-0.5">Supervisor Sign-Off Remarks:</strong>
                    {log.supervisorNotes}
                  </div>
                )}

                {/* Rescheduled & Restricted Tasks */}
                <div className="space-y-2">
                  {movedTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-[#FEF7EB] dark:bg-[#2C2214]/40 border border-[#FBE3B8] dark:border-[#4B3B24] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-2">
                          <span>{t.name}</span>
                          <span className="text-[11px] font-normal text-[#667085] dark:text-[#A7B2C1]">({t.location})</span>
                        </div>
                        <div className="text-xs text-[#667085] dark:text-[#A7B2C1]">
                          <strong className="text-[#171A1F] dark:text-[#F5F7FA] font-medium">Reason:</strong> {t.statusReason}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-[#D99A24] dark:text-[#F59E0B]">
                          {t.originalStartTime} → {t.recommendedStartTime}–{t.recommendedEndTime}
                        </span>
                      </div>
                    </div>
                  ))}

                  {restrictedTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-[#FEEFEF] dark:bg-[#2D1818]/40 border border-[#FBC8C8] dark:border-[#4E2424] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-2">
                          <span>{t.name}</span>
                          <span className="text-[11px] font-normal text-[#667085] dark:text-[#A7B2C1]">({t.location})</span>
                        </div>
                        <div className="text-xs text-[#667085] dark:text-[#A7B2C1]">
                          <strong className="text-[#171A1F] dark:text-[#F5F7FA] font-medium">Statutory Curb:</strong> {t.statusReason}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-[#D94A4A] dark:text-[#F87171] uppercase">
                          STANDBY
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantitative Impact Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085] dark:text-[#A7B2C1] pt-3 border-t border-[#E4E7EC] dark:border-[#26384C]/60">
                  <div className="flex items-center gap-3">
                    <span><strong>{log.rescheduledCount}</strong> tasks shifted</span>
                    <span>•</span>
                    <span><strong>{log.restrictedCount}</strong> curbs enforced</span>
                    <span>•</span>
                    <span className="text-[#16B878] font-semibold">{log.highRiskHoursAvoided} worker-hours protected</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#667085]">
                    {log.engineVersion}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
