import React, { useState } from 'react';
import { TaskExplanation } from '@/types';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  HelpCircle, 
  Wind, 
  HardHat, 
  Scale, 
  ShieldCheck, 
  ArrowRightCircle, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  FileText, 
  Cpu, 
  Sliders
} from 'lucide-react';

interface ExplainabilityDrawerProps {
  explanation: TaskExplanation | null;
  allExplanations: TaskExplanation[];
  onSelectTask: (taskId: string) => void;
  onClose: () => void;
}

export function ExplainabilityDrawer({
  explanation,
  allExplanations,
  onSelectTask,
}: ExplainabilityDrawerProps) {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'factors' | 'why_this_slot' | 'provenance'>('factors');

  const activeExp = explanation || allExplanations[0];
  if (!activeExp) return null;

  const evidence = activeExp.evidenceRecord;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Drawer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EC] dark:border-[#26384C] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center text-[#16B878]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">
              {t.whyMovedTitle}
            </h3>
            <p className="text-xs text-[#667085] dark:text-[#A7B2C1]">
              {language === 'hi' ? 'गणितीय व कानूनी ऑडिट' : 'Decision Provenance & Multi-Constraint Reasoning'}
            </p>
          </div>
        </div>

        {/* Task selector chips */}
        <div className="flex flex-wrap gap-1.5">
          {allExplanations.map((exp) => (
            <button
              key={exp.taskId}
              onClick={() => onSelectTask(exp.taskId)}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer border ${
                activeExp.taskId === exp.taskId
                  ? 'bg-[#16B878] text-white border-[#16B878] shadow-xs'
                  : 'bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border-[#E4E7EC] dark:border-[#26384C] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
              }`}
            >
              {exp.taskName.split(' ')[0]} {exp.moved ? '• Shifted' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Task Headline & Active View Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7F8FA] dark:bg-[#07111C] p-3 rounded-lg border border-[#E4E7EC] dark:border-[#26384C]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h4 className="text-xs sm:text-sm font-semibold text-[#171A1F] dark:text-[#F5F7FA]">
            {activeExp.taskName}
          </h4>
          <StatusBadge status={activeExp.status} size="sm" />
          <span className="text-xs font-mono font-medium text-[#667085] dark:text-[#A7B2C1]">
            {activeExp.originalTime} ➔ <strong className="text-[#16B878] font-semibold">{activeExp.recommendedTime}</strong>
          </span>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-[#122235] p-1 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] text-xs font-medium">
          <button
            onClick={() => setActiveTab('factors')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'factors'
                ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] font-semibold shadow-xs'
                : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
            }`}
          >
            {language === 'hi' ? '3-कारक विश्लेषण' : '3-Factor Risk'}
          </button>
          <button
            onClick={() => setActiveTab('why_this_slot')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'why_this_slot'
                ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] font-semibold shadow-xs'
                : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
            }`}
          >
            {language === 'hi' ? 'समय का चयन क्यों?' : 'Why This Slot?'}
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'provenance'
                ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] font-semibold shadow-xs'
                : 'text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
            }`}
          >
            {language === 'hi' ? 'साक्ष्य व ऑडिट' : 'Decision Evidence'}
          </button>
        </div>
      </div>

      {/* TAB 1: 3-FACTOR RISK ANALYSIS */}
      {activeTab === 'factors' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Factor 1: Environmental */}
            <div className="p-3.5 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#667085] dark:text-[#A7B2C1]">
                <Wind className="w-3.5 h-3.5 text-[#2F80ED]" />
                <span>{t.envFactor}</span>
              </div>
              <p className="text-xs text-[#171A1F] dark:text-[#F5F7FA] leading-relaxed font-normal">
                {activeExp.environmentalFactor}
              </p>
            </div>

            {/* Factor 2: Task Characteristics */}
            <div className="p-3.5 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#667085] dark:text-[#A7B2C1]">
                <HardHat className="w-3.5 h-3.5 text-[#D99A24]" />
                <span>{t.taskFactor}</span>
              </div>
              <p className="text-xs text-[#171A1F] dark:text-[#F5F7FA] leading-relaxed font-normal">
                {activeExp.taskFactor}
              </p>
            </div>

            {/* Factor 3: Regulatory Rules */}
            <div className="p-3.5 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#667085] dark:text-[#A7B2C1]">
                <Scale className="w-3.5 h-3.5 text-[#D94A4A]" />
                <span>{t.regFactor}</span>
              </div>
              <p className="text-xs text-[#171A1F] dark:text-[#F5F7FA] leading-relaxed font-normal">
                {activeExp.regulatoryFactor}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#122235] border border-[#E4E7EC] dark:border-[#26384C] flex items-start gap-2.5">
              <ArrowRightCircle className="w-4 h-4 text-[#16B878] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold uppercase text-[#667085] dark:text-[#A7B2C1] block mb-0.5">
                  {language === 'hi' ? 'निर्णय (Decision)' : 'Decision'}
                </span>
                <span className="text-xs font-medium text-[#171A1F] dark:text-[#F5F7FA]">{activeExp.headline}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] border border-[#C3ECD8] dark:border-[#1E4B39] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#16B878] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold uppercase text-[#16B878] block mb-0.5">
                  {language === 'hi' ? 'प्रभाव (Impact)' : 'Impact'}
                </span>
                <span className="text-xs font-medium text-[#171A1F] dark:text-[#F5F7FA]">{activeExp.mitigationImpact}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHY THIS SLOT & WHY NOT LOWEST-RISK SLOT */}
      {activeTab === 'why_this_slot' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left: Why this slot was picked */}
            <div className="p-3.5 rounded-lg border border-[#C3ECD8] dark:border-[#1E4B39] bg-[#EBF8F2]/60 dark:bg-[#0E3A31]/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16B878]">
                <CheckCircle2 className="w-4 h-4 text-[#16B878]" />
                <span>WHY {activeExp.recommendedTime}?</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#171A1F] dark:text-[#F5F7FA] font-normal">
                {activeExp.whyThisSlot?.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#16B878] font-bold shrink-0">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Why NOT the lowest-risk slot */}
            <div className="p-3.5 rounded-lg border border-[#FBE3B8] dark:border-[#4B3B24] bg-[#FEF7EB]/60 dark:bg-[#2C2214]/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A24] dark:text-[#F59E0B]">
                <AlertCircle className="w-4 h-4 text-[#D99A24]" />
                <span>WHY NOT THE LOWEST-RISK SLOT?</span>
              </div>
              <p className="text-xs text-[#171A1F] dark:text-[#F5F7FA] leading-relaxed">
                {activeExp.whyNotLowestRiskSlot || 'The lowest-risk slot was selected for this task.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DECISION PROVENANCE & AUDIT */}
      {activeTab === 'provenance' && evidence && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#667085] dark:text-[#A7B2C1] uppercase tracking-wider text-[11px]">
                <Database className="w-3.5 h-3.5 text-[#16B878]" />
                <span>Telemetry Ingestion</span>
              </div>
              <div className="space-y-1 text-[#171A1F] dark:text-[#F5F7FA]">
                <div>Station: <strong className="font-mono">{evidence.environmentalInput?.source || 'DPCC CAAMS'}</strong></div>
                <div>Station AQI: <strong className="font-mono">{evidence.environmentalInput?.currentAQI}</strong></div>
                <div>Peak Wet-Bulb Heat Index: <strong className="font-mono">{evidence.environmentalInput?.forecastHeatIndex}°C</strong></div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F7F8FA] dark:bg-[#07111C] border border-[#E4E7EC] dark:border-[#26384C] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#667085] dark:text-[#A7B2C1] uppercase tracking-wider text-[11px]">
                <Scale className="w-3.5 h-3.5 text-[#D94A4A]" />
                <span>Regulatory Mandate</span>
              </div>
              <div className="space-y-1 text-[#171A1F] dark:text-[#F5F7FA]">
                <div>Rule Ref: <strong className="font-mono">{evidence.regulatoryInput?.ruleRef}</strong></div>
                <div>Title: <strong className="font-mono">{evidence.regulatoryInput?.ruleTitle}</strong></div>
                <div>Statutory Restriction: <span>{evidence.regulatoryInput?.restriction}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
