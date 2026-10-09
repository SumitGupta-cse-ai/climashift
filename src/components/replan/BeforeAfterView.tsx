import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ExplainabilityDrawer } from './ExplainabilityDrawer';
import { ApprovalModal } from './ApprovalModal';
import { ImpactSummaryCards } from './ImpactSummaryCards';
import { ActionType, ActionOption } from '@/types';
import { 
  Users, 
  Clock, 
  Sparkles, 
  Send, 
  Info,
  Calendar,
  Layers,
  History,
  XCircle,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  TrendingDown,
  HelpCircle,
  MapPin,
  Check,
  AlertTriangle
} from 'lucide-react';

export function BeforeAfterView() {
  const { 
    replanResult, 
    siteProfile, 
    setActiveNav, 
    selectTaskAction,
    replayingDecisionId, 
    clearReplay,
    t, 
    language 
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (!replanResult) {
    return (
      <div className="text-center py-16 bg-[#FFFFFF] dark:bg-[#0D1B2A] rounded-xl border border-[#E4E7EC] dark:border-[#26384C] space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-xl bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center text-[#16B878] mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">
          {language === 'hi' ? 'कोई सक्रिय रीप्लान उपलब्ध नहीं है' : 'No Active Replan Evaluation'}
        </h3>
        <p className="text-xs text-[#667085] dark:text-[#A7B2C1] max-w-sm mx-auto leading-relaxed">
          {language === 'hi'
            ? 'कृपया वर्तमान मौसम परिस्थितियों के अनुसार कार्य योजना की जांच करने के लिए कार्य योजना टैब से रीप्लान चलाएं।'
            : 'Please run the optimizer from the Dashboard or Work Plan tab to evaluate tasks against current environmental conditions.'}
        </p>
        <button
          onClick={() => setActiveNav('plan')}
          className="px-5 py-2.5 rounded-lg font-semibold text-xs text-white bg-[#16B878] hover:bg-[#139c65] transition shadow-sm cursor-pointer"
        >
          {t.editPlanBtn}
        </button>
      </div>
    );
  }

  const { originalTasks, recommendedTasks, impactMetrics, explanations } = replanResult;
  const selectedExplanation = explanations.find(e => e.taskId === selectedTaskId) || null;
  const exposureLoad = impactMetrics.operationalExposureLoad;

  return (
    <div className="space-y-6">
      {/* Replay Banner if Replaying an Audited Decision */}
      {replayingDecisionId && (
        <div className="rounded-xl border border-[#CCE2FF] dark:border-[#1E3A5F] bg-[#EDF5FF] dark:bg-[#10243E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-[#2F80ED] shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#2F80ED]">
                AUDITED DECISION REPLAY MODE
              </div>
              <div className="text-xs text-[#171A1F] dark:text-[#F5F7FA] font-mono mt-0.5">
                Replaying immutable record #{replayingDecisionId.slice(-8)} — Verified supervisor sign-off and engine inputs.
              </div>
            </div>
          </div>
          <button
            onClick={clearReplay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2F80ED] text-white hover:bg-[#256ec4] transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Exit Replay</span>
          </button>
        </div>
      )}

      {/* Optimization Header Banner */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
              {t.replanHeaderTitle}
            </h1>
            <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider border ${
              replanResult.approvalStatus === 'approved'
                ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#18A66A] border-[#C3ECD8] dark:border-[#1E4B39]'
                : 'bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border-[#FBE3B8] dark:border-[#4B3B24]'
            }`}>
              {replanResult.approvalStatus === 'approved' ? 'STATUS: APPROVED' : 'STATUS: PROPOSED'}
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border border-[#E4E7EC] dark:border-[#26384C]">
              {language === 'hi' ? 'सत्यापित' : 'Evaluated'} {replanResult.generatedAt}
            </span>
          </div>
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1]">
            {siteProfile.name} • {siteProfile.jurisdiction} • {siteProfile.grapStage.replace('_', ' ')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveNav('plan')}
            className="px-4 py-2.5 rounded-lg text-xs font-medium text-[#171A1F] dark:text-[#F5F7FA] bg-[#F7F8FA] dark:bg-[#122235] border border-[#E4E7EC] dark:border-[#26384C] hover:bg-[#E4E7EC] dark:hover:bg-[#1B2E46] transition cursor-pointer min-h-[40px]"
          >
            {t.editConstraintsBtn}
          </button>

          <button
            onClick={() => setShowApprovalModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs text-white bg-[#16B878] hover:bg-[#139c65] transition shadow-sm min-h-[40px] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.reviewNotifyBtn}</span>
          </button>
        </div>
      </div>

      {/* Feature 5: Operational Exposure Load Card */}
      {exposureLoad && (
        <div className="rounded-xl border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border border-[#E4E7EC] dark:border-[#26384C] font-mono">
                ENGINE METRIC
              </span>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#171A1F] dark:text-[#F5F7FA]">
                ClimaShift Operational Exposure Load
              </h3>
            </div>
            <p className="text-xs text-[#667085] dark:text-[#A7B2C1] max-w-2xl leading-relaxed">
              {exposureLoad.formulaExplanation}. <span className="italic text-[#667085]">({exposureLoad.disclaimer})</span>
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#667085] dark:text-[#A7B2C1] uppercase">Original Load</div>
              <div className="text-sm font-bold text-[#171A1F] dark:text-[#F5F7FA] font-mono">
                {exposureLoad.beforeLoad} pts
              </div>
            </div>

            <div className="h-8 w-px bg-[#E4E7EC] dark:bg-[#26384C]"></div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-[#667085] dark:text-[#A7B2C1] uppercase">Optimized Load</div>
              <div className="text-sm font-bold text-[#16B878] font-mono">
                {exposureLoad.afterLoad} pts
              </div>
            </div>

            <div className="h-8 w-px bg-[#E4E7EC] dark:bg-[#26384C]"></div>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] border border-[#C3ECD8] dark:border-[#1E4B39] text-[#16B878] font-mono font-bold text-xs">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>↓ {exposureLoad.percentReduction}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Impact Summary Cards Row */}
      <ImpactSummaryCards metrics={impactMetrics} />

      {/* Side-by-Side Column Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl px-5 py-3.5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#667085] dark:text-[#A7B2C1]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1]">
              {t.beforeTitle}
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-[#667085] dark:text-[#A7B2C1]">
            {originalTasks.length} {language === 'hi' ? 'कार्य' : 'Tasks'}
          </span>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl px-5 py-3.5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#16B878]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#16B878]">
              {t.afterTitle} & MULTI-ACTION CHOICES
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] font-mono border border-[#C3ECD8] dark:border-[#1E4B39]">
            Dual Optimizer Active
          </span>
        </div>
      </div>

      {/* Unified Task-by-Task Comparison Rows */}
      <div className="space-y-4">
        {recommendedTasks.map((task, idx) => {
          const originalTask = originalTasks.find(o => o.id === task.id) || originalTasks[idx];
          const isMoved = task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime;
          const isRestricted = task.status === 'restricted';
          const isSelected = selectedTaskId === task.id;
          const options = replanResult.optionsByTask?.[task.id] || [];

          return (
            <div key={task.id} className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
              {/* BEFORE CARD: Original Planned Slot */}
              <div
                onClick={() => setSelectedTaskId(task.id)}
                className={`p-4 rounded-xl border bg-[#FFFFFF] dark:bg-[#0D1B2A] transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                  isSelected
                    ? 'border-[#16B878] ring-1 ring-[#16B878]/30'
                    : 'border-[#E4E7EC] dark:border-[#26384C] hover:border-[#16B878]/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border border-[#E4E7EC] dark:border-[#26384C]">
                          TASK #{idx + 1}
                        </span>
                        <h4 className="font-semibold text-xs sm:text-sm text-[#171A1F] dark:text-[#F5F7FA]">
                          {originalTask.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1] mt-1 block">
                        {originalTask.location}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F7F8FA] dark:bg-[#122235] text-[#171A1F] dark:text-[#F5F7FA] border border-[#E4E7EC] dark:border-[#26384C] shrink-0">
                      {originalTask.originalStartTime} – {originalTask.originalEndTime}
                    </span>
                  </div>

                  {/* Planned Window Context Assessment */}
                  <div className="p-2.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#667085] dark:text-[#A7B2C1] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#D99A24]" />
                        Original Planned Slot Assessment:
                      </span>
                      <span className="font-mono text-[10px] text-[#D99A24]">
                        Peak Window
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667085] dark:text-[#A7B2C1] leading-relaxed">
                      {originalTask.indoorOutdoor === 'outdoor' 
                        ? 'Subject to midday thermal load & elevated particulate concentration.' 
                        : 'Indoor task with reduced direct exposure; maintains critical path continuity.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#667085] dark:text-[#A7B2C1] pt-3 mt-3 border-t border-[#E4E7EC] dark:border-[#26384C]/60">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#667085]" />
                    <span>{originalTask.workers} crew</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#667085]" />
                    <span>{originalTask.duration}h duration</span>
                  </span>
                  <span className="uppercase text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F7F8FA] dark:bg-[#122235] border border-[#E4E7EC] dark:border-[#26384C]">
                    {originalTask.indoorOutdoor} • {originalTask.dustPotential} dust
                  </span>
                </div>
              </div>

              {/* AFTER CARD: Optimized Schedule with Multi-Action Choices */}
              <div
                onClick={() => setSelectedTaskId(task.id)}
                className={`p-4 rounded-xl border bg-[#FFFFFF] dark:bg-[#0D1B2A] transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                  isSelected
                    ? 'border-[#16B878] ring-1 ring-[#16B878]/30'
                    : 'border-[#E4E7EC] dark:border-[#26384C] hover:border-[#16B878]/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border border-[#C3ECD8] dark:border-[#1E4B39]">
                          RECOMMENDED
                        </span>
                        <h4 className="font-semibold text-xs sm:text-sm text-[#171A1F] dark:text-[#F5F7FA]">
                          {task.name}
                        </h4>
                        <StatusBadge status={task.status} size="sm" />
                      </div>
                      <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1] mt-1 block">
                        {task.location} • {task.workers} crew • {task.duration}h
                      </span>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {isRestricted ? (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#FEEFEF] dark:bg-[#2D1818] text-[#D94A4A] dark:text-[#F87171] border border-[#FBC8C8] dark:border-[#4E2424]">
                          {language === 'hi' ? 'कार्य स्थगित' : 'STANDBY / SUSPENDED'}
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                            isMoved 
                              ? 'bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border-[#FBE3B8] dark:border-[#4B3B24]' 
                              : 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border-[#C3ECD8] dark:border-[#1E4B39]'
                          }`}>
                            {task.recommendedStartTime} – {task.recommendedEndTime}
                          </span>
                          {isMoved && (
                            <div className="text-[10px] text-[#D99A24] font-medium">
                              ({language === 'hi' ? 'पहले' : 'Was'} {task.originalStartTime})
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multi-Action Decision Options */}
                  {options.length > 0 && (
                    <div className="pt-2 border-t border-[#E4E7EC] dark:border-[#26384C]/60 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1]">
                        Operational Action Options:
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {options.map((opt) => {
                          const isOptionActive = (task as any).selectedActionType 
                            ? (task as any).selectedActionType === opt.actionType 
                            : opt.isRecommended;

                          return (
                            <button
                              key={opt.actionType}
                              onClick={() => selectTaskAction(task.id, opt.actionType)}
                              className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer ${
                                isOptionActive
                                  ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] border-[#16B878] text-[#171A1F] dark:text-[#F5F7FA]'
                                  : 'bg-[#FFFFFF] dark:bg-[#0D1B2A] border-[#E4E7EC] dark:border-[#26384C] text-[#667085] dark:text-[#A7B2C1] hover:border-[#16B878]/40'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="font-semibold flex items-center gap-1.5">
                                  <span>{opt.label}</span>
                                  {opt.isRecommended && (
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#16B878] text-white">
                                      Recommended
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#667085] dark:text-[#A7B2C1]">
                                  {opt.recommendationReason}
                                </div>
                              </div>
                              {isOptionActive && (
                                <Check className="w-4 h-4 text-[#16B878] shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Task Explainability Section */}
      <ExplainabilityDrawer
        explanation={selectedExplanation}
        allExplanations={explanations}
        onSelectTask={(id) => setSelectedTaskId(id)}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Supervisor Approval & Dispatch Modal */}
      {showApprovalModal && (
        <ApprovalModal
          replanResult={replanResult}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}
