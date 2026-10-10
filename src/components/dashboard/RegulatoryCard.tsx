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
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 sm:p-6 shadow-tactile space-y-4 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#334155] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FEF08A] dark:bg-[#422006] text-[#854D0E] dark:text-[#FACC15] border border-[#EAB308] dark:border-[#854D0E] shadow-xs">
            <Scale className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">
              Statutory Compliance Directives (CAQM / GRAP)
            </h3>
            <p className="text-[11px] font-medium text-[#475569] dark:text-[#94A3B8]">
              Commission for Air Quality Management in NCR & Adjoining Areas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D] font-mono shadow-xs">
            {siteProfile.grapStage.replace('_', ' ')} ENFORCED
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] transition cursor-pointer shadow-xs"
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
                className="p-3.5 rounded-xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] space-y-2 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-black text-sm text-[#0F172A] dark:text-[#F8FAFC]">
                      {rule.name}
                    </div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] font-mono font-bold">
                      Statutory Directive: {rule.ruleRef}
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shadow-xs shrink-0 ${
                    isRestricted
                      ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#7F1D1D]'
                      : 'bg-[#FEF08A] text-[#854D0E] border-[#EAB308] dark:bg-[#422006] dark:text-[#FACC15] dark:border-[#78350F]'
                  }`}>
                    {rule.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0D1B2A] border-2 border-[#E2E8F0] dark:border-[#1E293B]">
                    <span className="font-black text-[#475569] dark:text-[#94A3B8] block text-[10px] uppercase">Affected Trade</span>
                    <span className="text-[#0F172A] dark:text-[#F8FAFC] font-bold">{rule.affectedActivity}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0D1B2A] border-2 border-[#E2E8F0] dark:border-[#1E293B]">
                    <span className="font-black text-[#475569] dark:text-[#94A3B8] block text-[10px] uppercase">Enforcement Curbs</span>
                    <span className="text-[#0F172A] dark:text-[#F8FAFC] font-bold">{rule.restriction}</span>
                  </div>
                </div>

                {rule.exceptions && rule.exceptions.length > 0 && (
                  <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] pt-1">
                    <strong className="text-[#0F172A] dark:text-[#F8FAFC] font-bold">Approved Exemptions:</strong> {rule.exceptions.join(', ')}
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
