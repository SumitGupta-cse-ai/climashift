import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ReplanResult } from '@/types';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertTriangle,
  Building,
  Users
} from 'lucide-react';

interface ApprovalModalProps {
  replanResult: ReplanResult;
  onClose: () => void;
}

export function ApprovalModal({ replanResult, onClose }: ApprovalModalProps) {
  const { addDecisionLog, showToast, setActiveNav } = useApp();
  
  const [supervisorNotes, setSupervisorNotes] = useState('Reviewed environmental constraints; morning plastering window approved.');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(replanResult.notificationPreviewText);
    setCopied(true);
    showToast('Advisory message copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApproveAndBroadcast = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Create permanent audit entry
      addDecisionLog({
        id: `DEC-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString(),
        siteName: replanResult.siteProfile.name,
        tasksCount: replanResult.recommendedTasks.length,
        rescheduledCount: replanResult.impactMetrics.tasksRescheduled,
        restrictedCount: replanResult.impactMetrics.restrictedTasksFlagged,
        highRiskHoursAvoided: replanResult.impactMetrics.highRiskWorkerHoursAvoided,
        status: 'Approved & Broadcasted',
        supervisorNotes,
        replanSummary: replanResult
      });

      replanResult.approvalStatus = 'approved';
      setIsSubmitting(false);
      onClose();
      showToast('Work plan approved! Notification preview queued for dispatch.', 'success');
      setActiveNav('activity');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Supervisor Approval & Worker Notification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explicit sign-off required prior to site broadcast dispatch.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Metrics Bar */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{replanResult.siteProfile.name}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <span><strong>{replanResult.impactMetrics.tasksRescheduled}</strong> Tasks Moved</span>
              <span><strong>{replanResult.impactMetrics.restrictedTasksFlagged}</strong> Statutory Curbs</span>
              <span><strong>{replanResult.impactMetrics.highRiskWorkerHoursAvoided}</strong> Worker-Hours Avoided</span>
            </div>
          </div>

          {/* SMS / WhatsApp Notification Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>Site Dispatch Preview (SMS / WhatsApp / Radio Broadcast)</span>
              </label>

              <button
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 whitespace-pre-wrap select-all shadow-inner">
              {replanResult.notificationPreviewText}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Amazon SNS / Twilio Integration Mode: <strong>Preview & Demo Dispatch</strong></span>
            </div>
          </div>

          {/* Supervisor Sign-Off Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Supervisor Verification & Log Notes
            </label>
            <textarea
              rows={2}
              value={supervisorNotes}
              onChange={(e) => setSupervisorNotes(e.target.value)}
              placeholder="Add shift remarks or verbal coordination notes..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Compliance Safe-Fail Assurance */}
          <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Human-in-the-loop Protocol:</strong> No schedule changes or worker messages are dispatched without this explicit supervisor confirmation.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition min-h-[44px]"
          >
            Back to Edit Schedule
          </button>

          <button
            onClick={handleApproveAndBroadcast}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md min-h-[44px] cursor-pointer"
          >
            {isSubmitting ? (
              <span>Registering Audit Record...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Approve & Notify Workers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
