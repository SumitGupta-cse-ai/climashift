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
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-[#CBD5E1] dark:hover:border-[#334155] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            {language === 'hi' ? 'सुरक्षा लाभ' : 'SAFETY DELTA'}
          </span>
          <span className="p-1 rounded-lg bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#10B981] dark:text-[#34D399]">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-[#059669] dark:text-[#34D399]">
              {highRiskAvoided}
            </span>
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
              worker-hours saved
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-[#F8FAFC]">
            <span className="inline-flex items-center gap-1 font-bold text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/40 px-2 py-0.5 rounded-md text-[11px]">
              <TrendingDown className="w-3 h-3" />
              <span>↓ {exposureReduction}%</span>
            </span>
            <span className="text-[#64748B] dark:text-[#94A3B8]">exposure load avoided</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F1F5F9] dark:border-[#1E293B] text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">
          Across {totalTasks} crew tasks evaluated
        </div>
      </div>

      {/* Metric 2: Exposure Load Bar Comparison */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-[#CBD5E1] dark:hover:border-[#334155] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            {language === 'hi' ? 'जोखिम तुलना' : 'EXPOSURE LOAD INDEX'}
          </span>
          <span className="p-1 rounded-lg bg-[#EFF6FF] dark:bg-[#172554] text-[#3B82F6] dark:text-[#60A5FA]">
            <Activity className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-3">
          {/* Baseline Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Original Planned Load</span>
              <span className="font-mono font-bold text-[#DC2626]">100%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] overflow-hidden">
              <div className="h-full bg-[#EF4444] rounded-full w-full"></div>
            </div>
          </div>

          {/* ClimaShift Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="text-[#059669] dark:text-[#34D399] font-semibold">ClimaShift Rescheduled</span>
              <span className="font-mono font-bold text-[#059669] dark:text-[#34D399]">{remainingExposure}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] overflow-hidden">
              <div 
                className="h-full bg-[#10B981] rounded-full transition-all duration-500" 
                style={{ width: `${remainingExposure}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F1F5F9] dark:border-[#1E293B] text-[11px] text-[#059669] dark:text-[#34D399] font-medium flex items-center justify-between">
          <span>Net Hazard Mitigation</span>
          <span className="font-bold">Safe Operating Zone</span>
        </div>
      </div>

      {/* Metric 3: Active Alert & Directive */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-[#CBD5E1] dark:hover:border-[#334155] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            {language === 'hi' ? 'साइट स्थिति' : 'ACTIVE SITE DIRECTIVE'}
          </span>
          <span className="p-1 rounded-lg bg-[#FEF2F2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171]">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#451A1A]/50 border border-[#FECACA] dark:border-[#7F1D1D] space-y-1">
          <div className="text-xs font-bold text-[#DC2626] dark:text-[#FCA5A5] flex items-center gap-1.5">
            <span>CAQM Stage III Inversion Peak</span>
          </div>
          <p className="text-[11px] text-[#7F1D1D] dark:text-[#FECACA] leading-relaxed">
            Severe midday particulate spike (12:00–16:00). All outdoor grinding and diesel earthmoving strictly prohibited.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F1F5F9] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          <span>{rescheduleCount} shifted to morning</span>
          <span>• {restrictedCount} standby</span>
        </div>
      </div>
    </div>
  );
}
