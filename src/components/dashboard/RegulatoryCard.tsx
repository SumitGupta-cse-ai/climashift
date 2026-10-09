import React from 'react';
import { useApp } from '@/context/AppContext';
import { OFFICIAL_REGULATORY_RULES } from '@/data/regulatoryRules';
import { Scale, AlertOctagon, CheckCircle2, ExternalLink } from 'lucide-react';

export function RegulatoryCard() {
  const { siteProfile, t, language } = useApp();

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
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E4E7EC] dark:border-[#26384C] pb-3">
        <div className="flex items-center gap-2.5">
          <Scale className="w-4 h-4 text-[#087F5B]" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A1F] dark:text-[#F2F4F7]">
              Regulatory Compliance Status (CAQM / GRAP)
            </h3>
            <p className="text-xs text-[#667085] dark:text-[#98A2B3] mt-0.5">
              Commission for Air Quality Management • Graded Response Action Plan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#FEEFEF] text-[#D64545] border border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]">
            {siteProfile.grapStage.replace('_', ' ')} ACTIVE
          </span>
          <span className="text-[11px] font-mono text-[#667085] dark:text-[#98A2B3]">
            {siteProfile.jurisdiction}
          </span>
        </div>
      </div>

      {/* Rules List - Restrained Enterprise Format */}
      <div className="space-y-3">
        {activeRules.map((rule) => {
          const isRestricted = rule.status === 'RESTRICTED';

          return (
            <div 
              key={rule.id}
              className="p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] space-y-2.5 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-[#171A1F] dark:text-[#F5F7FA]">
                    {rule.name}
                  </div>
                  <div className="text-[11px] font-mono text-[#667085] dark:text-[#A7B2C1]">
                    Ref: {rule.ruleRef} • Authority: {rule.source}
                  </div>
                </div>

                <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded border shrink-0 ${
                  isRestricted
                    ? 'bg-[#FEEFEF] text-[#D94A4A] border-[#FBC8C8] dark:bg-[#2D1818] dark:text-[#F87171] dark:border-[#4E2424]'
                    : 'bg-[#FEF7EB] text-[#D99A24] border-[#FBE3B8] dark:bg-[#2C2214] dark:text-[#F59E0B] dark:border-[#4B3B24]'
                }`}>
                  {rule.status}
                </span>
              </div>

              {/* Grid: Affected Activity & Restriction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C]">
                  <span className="font-medium text-[#667085] dark:text-[#A7B2C1] block text-[10px] uppercase">Affected Activities</span>
                  <span className="text-[#171A1F] dark:text-[#F5F7FA] font-medium">{rule.affectedActivity}</span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C]">
                  <span className="font-medium text-[#667085] dark:text-[#A7B2C1] block text-[10px] uppercase">Statutory Restriction</span>
                  <span className="text-[#171A1F] dark:text-[#F5F7FA] font-medium">{rule.restriction}</span>
                </div>
              </div>

              {rule.exceptions && rule.exceptions.length > 0 && (
                <div className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">
                  <strong>Permitted Exceptions:</strong> {rule.exceptions.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controlled Regulatory Notice */}
      <div className="p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] text-xs text-[#667085] dark:text-[#A7B2C1] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <strong className="text-[#171A1F] dark:text-[#F2F4F7]">Operational Boundary:</strong> ClimaShift provides risk-aware hazard scheduling recommendations based on published orders. Adjustments require supervisor operational sign-off.
        </div>
        <a 
          href="https://caqm.nic.in" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[#087F5B] font-medium hover:underline shrink-0"
        >
          <span>CAQM Gazette Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
