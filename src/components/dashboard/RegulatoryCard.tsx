import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { OFFICIAL_REGULATORY_RULES } from '@/data/regulatoryRules';
import { Scale, AlertOctagon, CheckCircle2, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export function RegulatoryCard() {
  const { siteProfile, language } = useApp();
  const [expanded, setExpanded] = useState(true);

  const activeRules = OFFICIAL_REGULATORY_RULES.filter(r => {
    if (siteProfile.grapStage === 'STAGE_3') {
      return r.grapStageTrigger === 'STAGE_3' || r.grapStageTrigger === 'STAGE_2';
    }
    if (siteProfile.grapStage === 'STAGE_2') {
      return r.grapStageTrigger === 'STAGE_2';
    }
    if (siteProfile.grapStage === 'STAGE_4') {
      return true;
    }
    return r.grapStageTrigger === 'NONE';
  });

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] dark:border-[#1E293B] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F0FDF4] dark:bg-[#064E3B]/40 text-[#16A34A] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#047857]">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Statutory Compliance Directives (CAQM / GRAP)
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Commission for Air Quality Management in NCR & Adjoining Areas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D] font-mono">
            {siteProfile.grapStage.replace('_', ' ')} ENFORCED
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rules Feed */}
      {expanded && (
        <div className="space-y-3">
          {activeRules.map((rule) => {
            const isRestricted = rule.status === 'RESTRICTED';

            return (
              <div 
                key={rule.id}
                className="p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#07111C] space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">
                      {rule.name}
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                      Statutory Directive: {rule.ruleRef}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                    isRestricted
                      ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#7F1D1D]'
                      : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] dark:bg-[#3D2E0B] dark:text-[#FBBF24] dark:border-[#78350F]'
                  }`}>
                    {rule.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-white dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B]">
                    <span className="font-semibold text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase">Affected Trade</span>
                    <span className="text-[#0F172A] dark:text-[#F8FAFC] font-medium">{rule.affectedActivity}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B]">
                    <span className="font-semibold text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase">Enforcement Curbs</span>
                    <span className="text-[#0F172A] dark:text-[#F8FAFC] font-medium">{rule.restriction}</span>
                  </div>
                </div>

                {rule.exceptions && rule.exceptions.length > 0 && (
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] pt-1">
                    <strong className="text-[#0F172A] dark:text-[#F8FAFC]">Approved Exemptions:</strong> {rule.exceptions.join(', ')}
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
