import React from 'react';
import { useApp } from '@/context/AppContext';
import { OFFICIAL_REGULATORY_RULES } from '@/data/regulatoryRules';
import { Scale, CheckCircle, AlertOctagon, FileText, ExternalLink } from 'lucide-react';

export function RegulatoryCard() {
  const { siteProfile } = useApp();

  // Active rules matching current site stage
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Statutory Compliance & Regulatory Rules Engine</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800">
                {siteProfile.grapStage.replace('_', ' ')}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Commission for Air Quality Management (CAQM) / Graded Response Action Plan (GRAP)
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 sm:text-right">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Jurisdiction:</span> {siteProfile.jurisdiction}
          <div className="text-[11px] text-slate-400">Verified: 2026-10-06 18:30 IST</div>
        </div>
      </div>

      {/* Regulatory Rules List */}
      <div className="space-y-3">
        {activeRules.map((rule) => (
          <div 
            key={rule.id}
            className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-800/40 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {rule.action === 'RESTRICT' ? (
                  <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {rule.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                    <FileText className="w-3 h-3" />
                    <span>Rule ID: {rule.id} • Order: {rule.source}</span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border shrink-0 ${
                rule.action === 'RESTRICT'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              }`}>
                {rule.action === 'RESTRICT' ? 'MANDATORY RESTRICTION' : 'MANDATE PROTECTION'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
              {rule.description}
            </p>

            {rule.exceptions && rule.exceptions.length > 0 && (
              <div className="pl-6 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Statutory Exceptions:</span> {rule.exceptions.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Safety & Legal Disclaimer */}
      <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Legal Notice:</span> ClimaShift provides risk-aware operational recommendations derived from configured CAQM/GRAP rulesets. Verify current site-specific municipal orders and engineer directives.
        </div>
        <a 
          href="https://caqm.nic.in" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline shrink-0"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
