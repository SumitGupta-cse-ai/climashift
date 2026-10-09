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
  Building
} from 'lucide-react';

interface ApprovalModalProps {
  replanResult: ReplanResult;
  onClose: () => void;
}

export function ApprovalModal({ replanResult, onClose }: ApprovalModalProps) {
  const { addDecisionLog, showToast, setActiveNav, t, language } = useApp();
  
  const [supervisorNotes, setSupervisorNotes] = useState(
    language === 'hi' 
      ? 'मौसम और कानूनी प्रतिबंधों की समीक्षा की गई; सुबह का संशोधित शेड्यूल स्वीकृत है।' 
      : 'Reviewed environmental constraints; morning plastering window approved.'
  );
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(replanResult.notificationPreviewText);
    setCopied(true);
    showToast(language === 'hi' ? 'संदेश क्लिपबोर्ड पर कॉपी हो गया!' : 'Advisory message copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApproveAndBroadcast = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      addDecisionLog({
        id: `DEC-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString(),
        siteName: replanResult.siteProfile.name,
        tasksCount: replanResult.recommendedTasks.length,
        rescheduledCount: replanResult.impactMetrics.tasksRescheduled,
        restrictedCount: replanResult.impactMetrics.restrictedTasksFlagged,
        highRiskHoursAvoided: replanResult.impactMetrics.highRiskWorkerHoursAvoided,
        status: 'APPROVED',
        supervisorNotes,
        replanSummary: replanResult,
        engineVersion: 'ClimaShift Engine v2.4 (Deterministic Constraint Optimizer)',
        ruleSetVersion: 'CAQM-GRAP-2024-R3'
      });

      replanResult.approvalStatus = 'approved';
      setIsSubmitting(false);
      onClose();
      showToast(
        language === 'hi' 
          ? 'कार्य योजना स्वीकृत! निर्णय ऑडिट लॉग में सुरक्षित किया गया।' 
          : 'Work plan approved by supervisor! Registered in Decision Audit Log.', 
        'success'
      );
      setActiveNav('activity');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl max-w-2xl w-full shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E4E7EC] dark:border-[#26384C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center text-[#16B878]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#171A1F] dark:text-[#F5F7FA]">
                {t.approvalModalTitle}
              </h3>
              <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">
                {t.approvalModalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#171A1F] dark:hover:text-[#F5F7FA] p-1.5 rounded-md hover:bg-[#F7F8FA] dark:hover:bg-[#122235] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Metrics Bar */}
          <div className="p-3.5 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#667085]" />
              <span className="font-semibold text-[#171A1F] dark:text-[#F5F7FA]">{replanResult.siteProfile.name}</span>
            </div>
            <div className="flex items-center gap-3.5 text-[#667085] dark:text-[#A7B2C1]">
              <span><strong className="text-[#171A1F] dark:text-[#F5F7FA]">{replanResult.impactMetrics.tasksRescheduled}</strong> {t.impactTasksRescheduled}</span>
              <span><strong className="text-[#171A1F] dark:text-[#F5F7FA]">{replanResult.impactMetrics.restrictedTasksFlagged}</strong> {t.impactCurbsEnforced}</span>
              <span><strong className="text-[#16B878]">{replanResult.impactMetrics.highRiskWorkerHoursAvoided}</strong> {language === 'hi' ? 'घंटे बचाए' : 'Hours Saved'}</span>
            </div>
          </div>

          {/* SMS / WhatsApp Notification Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#16B878]" />
                <span>{t.dispatchPreviewLabel}</span>
              </label>

              <button
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16B878] hover:text-[#139c65] transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी करें' : 'Copy Text')}</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] font-mono text-xs leading-relaxed border border-[#E4E7EC] dark:border-[#26384C] whitespace-pre-wrap select-all">
              {replanResult.notificationPreviewText}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#667085] dark:text-[#A7B2C1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16B878]"></span>
              <span>Worker Dispatch: <strong className="font-semibold text-[#171A1F] dark:text-[#F5F7FA]">NOTIFICATION PREVIEW</strong> (Amazon SNS / SMS Gateway integration ready)</span>
            </div>
          </div>

          {/* Supervisor Approval Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#667085] dark:text-[#A7B2C1] uppercase tracking-wider block">
              {t.supervisorRemarksLabel}
            </label>
            <textarea
              rows={2}
              value={supervisorNotes}
              onChange={(e) => setSupervisorNotes(e.target.value)}
              placeholder="Add shift remarks or verbal coordination notes..."
              className="w-full text-xs p-3 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878] transition"
            />
          </div>

          {/* Compliance Safe-Fail Assurance */}
          <div className="p-3.5 rounded-lg bg-[#FEF7EB] dark:bg-[#2C2214]/60 border border-[#FBE3B8] dark:border-[#4B3B24] text-xs text-[#171A1F] dark:text-[#F5F7FA] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#D99A24]" />
            <p className="leading-relaxed">
              {t.humanInLoopNotice}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E4E7EC] dark:border-[#26384C] flex flex-col sm:flex-row items-center justify-end gap-3 bg-[#F7F8FA] dark:bg-[#07111C]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-medium text-[#171A1F] dark:text-[#F5F7FA] bg-[#FFFFFF] dark:bg-[#122235] border border-[#E4E7EC] dark:border-[#26384C] hover:bg-[#E4E7EC] dark:hover:bg-[#1B2E46] transition cursor-pointer min-h-[40px]"
          >
            {t.backToEditBtn}
          </button>

          <button
            onClick={handleApproveAndBroadcast}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs text-white bg-[#16B878] hover:bg-[#139c65] transition shadow-sm min-h-[40px] cursor-pointer"
          >
            {isSubmitting ? (
              <span>{language === 'hi' ? 'रिकॉर्ड सहेजा जा रहा है...' : 'Registering Audit Record...'}</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{t.approveBroadcastBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
