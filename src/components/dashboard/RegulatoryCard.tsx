import React from 'react';
import { useApp } from '@/context/AppContext';
import { OFFICIAL_REGULATORY_RULES } from '@/data/regulatoryRules';
import { Scale, CheckCircle2, AlertOctagon, FileText, ExternalLink, HelpCircle } from 'lucide-react';

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
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.regulatoryTitle}</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
                {siteProfile.grapStage.replace('_', ' ')}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.regulatorySubtitle}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-right font-medium">
          <div>{siteProfile.jurisdiction}</div>
          <div className="text-[10px] text-slate-400">Verified: 2026-10-06 18:30 IST</div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {language === 'hi' ? 'सक्रिय प्रतिबंध एवं वैधानिक नियम' : 'Applicable Statutory Restraints'}
        </div>

        {activeRules.map((rule) => {
          const isRestricted = rule.action === 'RESTRICT';
          return (
            <div 
              key={rule.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isRestricted ? (
                    <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {rule.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {rule.id} • {rule.source}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                  isRestricted
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}>
                  {isRestricted ? (language === 'hi' ? 'प्रतिबंधित' : 'RESTRICTED') : (language === 'hi' ? 'सुरक्षा अनिवार्य' : 'REVIEW REQUIRED')}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                {rule.description}
              </p>

              {rule.exceptions && rule.exceptions.length > 0 && (
                <div className="pl-6 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{language === 'hi' ? 'छूट:' : 'Exceptions:'}</span> {rule.exceptions.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Authoritative Disclaimer */}
      <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
        <span>
          <strong>Notice:</strong> Verify current site-specific requirements with your safety officer. ClimaShift applies configured CAQM directions.
        </span>
        <a 
          href="https://caqm.nic.in" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline shrink-0"
        >
          <span>Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
