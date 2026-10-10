'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { OFFICIAL_REGULATORY_RULES } from '@/data/regulatoryRules';
import { 
  Scale, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Download, 
  Building2, 
  AlertTriangle,
  Info,
  Check
} from 'lucide-react';

export function CompliancePage() {
  const { siteProfile, language } = useApp();
  const [downloading, setDownloading] = useState(false);

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

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Official CAQM Delhi-NCR Statutory Compliance Affidavit downloaded.');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] border-t-4 border-t-[#FACC15] rounded-2xl p-5 sm:p-6 shadow-tactile flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-1 rounded bg-[#FACC15] text-[#0F172A] font-black text-[10px] px-2 uppercase shadow-xs">
              STATUTORY COMPLIANCE PORTAL
            </span>
            <span className="text-xs font-mono font-bold text-[#DC2626] dark:text-[#F87171] bg-[#FEE2E2] dark:bg-[#451A1A] px-2.5 py-0.5 rounded-md border border-[#FECACA] dark:border-[#7F1D1D]">
              {siteProfile.grapStage.replace('_', ' ')} IN EFFECT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            {language === 'hi' ? 'सीएक्यूएम ग्रैप-III वैधानिक अनुपालन' : 'CAQM GRAP-III Statutory Compliance'}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Commission for Air Quality Management in National Capital Region and Adjoining Areas Act, 2021. Real-time curbs enforcement, dust suppression mandates, and statutory legal defense.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs text-[#0F172A] bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#CA8A04] transition shadow-lamy cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{downloading ? 'Generating Report...' : 'Export Legal Audit Affidavit'}</span>
        </button>
      </div>

      {/* Enforcement Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#166534] dark:text-[#4ADE80]">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Inspection Readiness</span>
          </div>
          <div className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
            100% Compliant
          </div>
          <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
            Zero unpermitted outdoor grinding or non-electric earthwork running during Stage III active hours.
          </p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#854D0E] dark:text-[#FACC15]">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>DPCC Sensor Linkage</span>
          </div>
          <div className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Live CAAMS Feed
          </div>
          <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
            Boundary sensors continuously broadcasting PM10 and PM2.5 to Delhi Pollution Control Committee servers.
          </p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626] dark:text-[#F87171]">
            <AlertOctagon className="w-4 h-4 stroke-[2.5]" />
            <span>Active Curbs</span>
          </div>
          <div className="text-2xl font-black text-[#DC2626] dark:text-[#F87171]">
            {activeRules.filter(r => r.status === 'RESTRICTED').length} Restrictions Active
          </div>
          <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
            Outdoor dust generation suspended until regional AQI dips consistently below 350.
          </p>
        </div>
      </div>

      {/* Rules Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
          Enforced Statutory Directives ({activeRules.length})
        </h2>

        <div className="space-y-3">
          {activeRules.map((rule) => {
            const isRestricted = rule.status === 'RESTRICTED';

            return (
              <div 
                key={rule.id}
                className="p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] space-y-3 text-xs shadow-tactile"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F8F9FA] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#334155]">
                      REF: {rule.ruleRef}
                    </span>
                    <h3 className="font-black text-base text-[#0F172A] dark:text-[#F8FAFC]">
                      {rule.name}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border shadow-xs shrink-0 ${
                    isRestricted
                      ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#7F1D1D]'
                      : 'bg-[#FEF08A] text-[#854D0E] border-[#EAB308] dark:bg-[#422006] dark:text-[#FACC15]'
                  }`}>
                    {rule.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#0D1B2A] border-2 border-[#E2E8F0] dark:border-[#1E293B]">
                    <span className="font-black text-[#475569] dark:text-[#94A3B8] block text-[10px] uppercase">Affected Site Trades</span>
                    <span className="text-[#0F172A] dark:text-[#F8FAFC] font-bold text-xs">{rule.affectedActivity}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#0D1B2A] border-2 border-[#E2E8F0] dark:border-[#1E293B]">
                    <span className="font-black text-[#475569] dark:text-[#94A3B8] block text-[10px] uppercase">Enforcement Curbs</span>
                    <span className="text-[#0F172A] dark:text-[#F8FAFC] font-bold text-xs">{rule.restriction}</span>
                  </div>
                </div>

                {rule.exceptions && rule.exceptions.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#DCFCE7]/50 dark:bg-[#064E3B]/30 border border-[#86EFAC] dark:border-[#047857] text-[11px] text-[#166534] dark:text-[#4ADE80]">
                    <strong className="font-bold">Approved Legal Exemptions:</strong> {rule.exceptions.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
