import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ExplainabilityDrawer } from './ExplainabilityDrawer';
import { ApprovalModal } from './ApprovalModal';
import { ImpactSummaryCards } from './ImpactSummaryCards';
import { 
  Users, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export function BeforeAfterView() {
  const { replanResult, siteProfile, setActiveNav } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (!replanResult) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active replan evaluation</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Please run the optimizer from the Dashboard or Work Plan tab to evaluate tasks against current environmental conditions.
        </p>
        <button
          onClick={() => setActiveNav('plan')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase bg-emerald-500 text-slate-950"
        >
          Go to Work Plan
        </button>
      </div>
    );
  }

  const { originalTasks, recommendedTasks, impactMetrics, explanations } = replanResult;
  const selectedExplanation = explanations.find(e => e.taskId === selectedTaskId) || null;

  return (
    <div className="space-y-6">
      {/* Optimization Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Work Plan Successfully Optimized
            </h2>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Evaluated {replanResult.generatedAt}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {siteProfile.name} • {siteProfile.jurisdiction} • Status: {siteProfile.grapStage.replace('_', ' ')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveNav('plan')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition min-h-[44px]"
          >
            Edit Constraints
          </button>

          <button
            onClick={() => setShowApprovalModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md min-h-[44px] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Review & Notify Workers</span>
          </button>
        </div>
      </div>

      {/* Transparent Impact Metrics Cards */}
      <ImpactSummaryCards metrics={impactMetrics} />

      {/* Side-by-Side (Desktop) or Stacked (Mobile) Timeline Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE COLUMN: Original Supervisor Plan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-sm tracking-tight text-slate-700 dark:text-slate-300 uppercase">
                Original Input Schedule (Before)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {originalTasks.length} Planned
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {originalTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2 opacity-85"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {task.name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Sector: {task.location}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {task.originalStartTime} – {task.originalEndTime}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.workers} workers</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.duration}h duration</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {task.indoorOutdoor.toUpperCase()} • {task.dustPotential.toUpperCase()} DUST
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER COLUMN: Recommended Risk-Aware Schedule */}
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/30 rounded-2xl p-5 shadow-elevated flex flex-col relative">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm tracking-tight text-emerald-700 dark:text-emerald-400 uppercase">
                Optimized Safety Schedule (After)
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
              Deterministic Engine
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {recommendedTasks.map((task) => {
              const isMoved = task.recommendedStartTime && task.recommendedStartTime !== task.originalStartTime;
              const isRestricted = task.status === 'restricted';
              const isSelected = selectedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 border-transparent shadow-md'
                      : 'hover:border-slate-300 dark:hover:border-slate-700'
                  } ${
                    isRestricted
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                      : isMoved
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900'
                      : task.status === 'protect'
                      ? 'bg-orange-50/70 dark:bg-orange-950/30 border-orange-300 dark:border-orange-900'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {task.name}
                        </h4>
                        <StatusBadge status={task.status} size="sm" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {task.location}
                      </span>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {isRestricted ? (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                          ACTIVITY SUSPENDED
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            isMoved 
                              ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200' 
                              : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                          }`}>
                            {task.recommendedStartTime} – {task.recommendedEndTime}
                          </span>
                          {isMoved && (
                            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                              (Shifted from {task.originalStartTime})
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Reason Snippet */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
                    <span className="truncate">{task.statusReason}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTaskId(task.id);
                      }}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 flex items-center gap-1"
                    >
                      <span>Explain</span>
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

      {/* Worker Notification & Approval Modal */}
      {showApprovalModal && (
        <ApprovalModal
          replanResult={replanResult}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}
