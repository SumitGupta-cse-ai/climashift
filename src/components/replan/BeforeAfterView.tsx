import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ExplainabilityDrawer } from './ExplainabilityDrawer';
import { ApprovalModal } from './ApprovalModal';
import { ImpactSummaryCards } from './ImpactSummaryCards';
import { 
  Users, 
  Clock, 
  Sparkles, 
  Send, 
  Info,
  Calendar,
  ArrowRight
} from 'lucide-react';

export function BeforeAfterView() {
  const { replanResult, siteProfile, setActiveNav, t, language } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (!replanResult) {
    return (
      <div className="text-center py-12 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {language === 'hi' ? 'कोई सक्रिय रीप्लान उपलब्ध नहीं है' : 'No active replan evaluation'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {language === 'hi'
            ? 'कृपया वर्तमान मौसम परिस्थितियों के अनुसार कार्य योजना की जांच करने के लिए कार्य योजना टैब से रीप्लान चलाएं।'
            : 'Please run the optimizer from the Dashboard or Work Plan tab to evaluate tasks against current environmental conditions.'}
        </p>
        <button
          onClick={() => setActiveNav('plan')}
          className="px-4 py-2 rounded-lg font-bold text-xs uppercase bg-emerald-600 text-white cursor-pointer"
        >
          {t.editPlanBtn}
        </button>
      </div>
    );
  }

  const { originalTasks, recommendedTasks, impactMetrics, explanations } = replanResult;
  const selectedExplanation = explanations.find(e => e.taskId === selectedTaskId) || null;

  return (
    <div className="space-y-5">
      {/* Optimization Header Banner */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {t.replanHeaderTitle}
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {language === 'hi' ? 'सत्यापित' : 'Evaluated'} {replanResult.generatedAt}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {siteProfile.name} • {siteProfile.jurisdiction} • {siteProfile.grapStage.replace('_', ' ')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveNav('plan')}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer min-h-[38px]"
          >
            {t.editConstraintsBtn}
          </button>

          <button
            onClick={() => setShowApprovalModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-subtle min-h-[38px] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.reviewNotifyBtn}</span>
          </button>
        </div>
      </div>

      {/* Transparent Impact Metrics */}
      <ImpactSummaryCards metrics={impactMetrics} />

      {/* Side-by-Side (Desktop) / Stacked (Mobile) BEFORE vs AFTER Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* BEFORE COLUMN: Original Work Plan */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="font-bold text-xs tracking-tight text-slate-600 dark:text-slate-400 uppercase">
                {t.beforeTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {originalTasks.length} {language === 'hi' ? 'कार्य' : 'Tasks'}
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {originalTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                      {task.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {task.location}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {task.originalStartTime} – {task.originalEndTime}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{task.workers} {language === 'hi' ? 'श्रमिक' : 'workers'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{task.duration}h</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    {task.indoorOutdoor} • {task.dustPotential} dust
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER COLUMN: Optimized Safety Schedule */}
        <div className="bg-white dark:bg-[#111827] border-2 border-emerald-500/40 dark:border-emerald-600/40 rounded-xl p-4 shadow-card flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-xs tracking-tight text-emerald-700 dark:text-emerald-400 uppercase">
                {t.afterTitle}
              </h3>
            </div>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">
              Deterministic Engine
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {recommendedTasks.map((task) => {
              const isMoved = task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime;
              const isRestricted = task.status === 'restricted';
              const isSelected = selectedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-1 ring-emerald-500 border-transparent shadow-xs'
                      : 'hover:border-slate-300 dark:hover:border-slate-700'
                  } ${
                    isRestricted
                      ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                      : isMoved
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                      : task.status === 'protect'
                      ? 'bg-orange-50/70 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {task.name}
                        </h4>
                        <StatusBadge status={task.status} size="sm" />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {task.location}
                      </span>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {isRestricted ? (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                          {language === 'hi' ? 'कार्य स्थगित' : 'SUSPENDED'}
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                            isMoved 
                              ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200' 
                              : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                          }`}>
                            {task.recommendedStartTime} – {task.recommendedEndTime}
                          </span>
                          {isMoved && (
                            <div className="text-[9px] text-amber-700 dark:text-amber-400 font-medium">
                              ({language === 'hi' ? 'पहले' : 'Was'} {task.originalStartTime})
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reason & Action link */}
                  <div className="mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800 text-[11px] flex items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
                    <span className="truncate">{task.statusReason}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTaskId(task.id);
                      }}
                      className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{language === 'hi' ? 'कारण देखें' : 'Inspect'}</span>
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explainability Section */}
      <ExplainabilityDrawer
        explanation={selectedExplanation}
        allExplanations={explanations}
        onSelectTask={(id) => setSelectedTaskId(id)}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Supervisor Approval & Notification Modal */}
      {showApprovalModal && (
        <ApprovalModal
          replanResult={replanResult}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}
