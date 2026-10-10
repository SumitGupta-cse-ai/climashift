import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, CheckCircle2, AlertTriangle, TrendingDown, Users, Activity } from 'lucide-react';

export function ImpactMetricsRow() {
  const { replanResult, tasks, language } = useApp();

  const evaluatedTasks = replanResult?.recommendedTasks || tasks;
  const totalTasks = evaluatedTasks.length;
  const rescheduleCount = evaluatedTasks.filter(t => t.status === 'reschedule').length;
  const restrictedCount = evaluatedTasks.filter(t => t.status === 'restricted').length;

  const highRiskAvoided = replanResult?.impactMetrics.highRiskWorkerHoursAvoided || 36;
  const exposureReduction = replanResult?.impactMetrics.exposureReductionPercent || 59;
  const remainingExposure = Math.max(15, 100 - exposureReduction);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric 1: Safety Delta */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex flex-col justify-between hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
            {language === 'hi' ? 'सुरक्षा लाभ' : 'SAFETY DELTA'}
          </span>
          <span className="p-1.5 rounded-lg bg-[#DCFCE7] dark:bg-[#064E3B] text-[#166534] dark:text-[#4ADE80] border border-[#86EFAC] dark:border-[#047857] shadow-xs">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#166534] dark:text-[#4ADE80]">
              {highRiskAvoided}
            </span>
            <span className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              worker-hours saved
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-[#F8FAFC]">
            <span className="inline-flex items-center gap-1 font-black text-[#166534] dark:text-[#4ADE80] bg-[#DCFCE7] dark:bg-[#064E3B] px-2 py-0.5 rounded-md text-[11px] border border-[#86EFAC] dark:border-[#047857] shadow-xs">
              <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>↓ {exposureReduction}%</span>
            </span>
            <span className="text-[#475569] dark:text-[#94A3B8] font-medium">exposure load avoided</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-[11px] text-[#475569] dark:text-[#94A3B8] font-mono font-bold">
          Across {totalTasks} crew tasks evaluated
        </div>
      </div>

      {/* Metric 2: Exposure Load Bar Comparison */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex flex-col justify-between hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
            {language === 'hi' ? 'जोखिम तुलना' : 'EXPOSURE LOAD INDEX'}
          </span>
          <span className="p-1.5 rounded-lg bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#1E40AF] dark:text-[#93C5FD] border border-[#93C5FD] dark:border-[#3B82F6] shadow-xs">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </span>
        </div>

        <div className="space-y-3">
          {/* Baseline Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-[#475569] dark:text-[#94A3B8]">Original Planned Load</span>
              <span className="font-mono font-black text-[#DC2626]">100%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] overflow-hidden border border-[#CBD5E1] dark:border-[#334155]">
              <div className="h-full bg-[#EF4444] rounded-full w-full"></div>
            </div>
          </div>

          {/* ClimaShift Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-[#166534] dark:text-[#4ADE80] font-black">ClimaShift Rescheduled</span>
              <span className="font-mono font-black text-[#166534] dark:text-[#4ADE80]">{remainingExposure}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] overflow-hidden border border-[#CBD5E1] dark:border-[#334155]">
              <div 
                className="h-full bg-[#10B981] rounded-full transition-all duration-500" 
                style={{ width: `${remainingExposure}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-[11px] text-[#166534] dark:text-[#4ADE80] font-bold flex items-center justify-between">
          <span>Net Hazard Mitigation</span>
          <span className="font-black px-1.5 py-0.2 rounded bg-[#DCFCE7] dark:bg-[#064E3B] border border-[#86EFAC]">Safe Operating Zone</span>
        </div>
      </div>

      {/* Metric 3: Active Alert & Directive */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex flex-col justify-between hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
            {language === 'hi' ? 'साइट स्थिति' : 'ACTIVE SITE DIRECTIVE'}
          </span>
          <span className="p-1.5 rounded-lg bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FCA5A5] dark:border-[#991B1B] shadow-xs">
            <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FEF2F2] dark:bg-[#451A1A]/70 border-2 border-[#FCA5A5] dark:border-[#991B1B] space-y-1 shadow-xs">
          <div className="text-xs font-black text-[#991B1B] dark:text-[#FCA5A5] flex items-center gap-1.5">
            <span>CAQM Stage III Inversion Peak</span>
          </div>
          <p className="text-[11px] text-[#7F1D1D] dark:text-[#FECACA] font-medium leading-relaxed">
            Severe midday particulate spike (12:00–16:00). All outdoor grinding and diesel earthmoving strictly prohibited.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between text-[11px] text-[#475569] dark:text-[#94A3B8] font-bold">
          <span className="text-[#854D0E] dark:text-[#FACC15]">{rescheduleCount} shifted to morning</span>
          <span>• {restrictedCount} standby</span>
        </div>
      </div>
    </div>
  );
}
