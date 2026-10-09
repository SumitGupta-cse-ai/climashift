import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Key Impacts (Today) */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'मुख्य प्रभाव (आज)' : 'Key Impacts (Today)'}
          </h3>
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">
            {language === 'hi' ? 'मापने योग्य सुरक्षा और परिचालन लाभ' : 'Measurable safety & operational gains'}
          </p>
        </div>

        <div className="space-y-4 my-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#16B878]" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#16B878]">
                {highRiskAvoided}
              </div>
              <div className="text-xs text-[#667085] dark:text-[#A7B2C1]">
                {language === 'hi' ? 'उच्च जोखिम वाले कार्यकर्ता-घंटे टाले गए' : 'high-risk worker-hours avoided'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#16B878]" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#16B878]">
                {exposureReduction}%
              </div>
              <div className="text-xs text-[#667085] dark:text-[#A7B2C1]">
                {language === 'hi' ? 'परिचालन जोखिम में कमी' : 'operational exposure reduction'}
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[#667085] dark:text-[#A7B2C1] pt-2 border-t border-[#E4E7EC] dark:border-[#26384C]/60">
          {totalTasks} {language === 'hi' ? 'कार्यों का मूल्यांकन' : 'tasks evaluated across active shift'}
        </div>
      </div>

      {/* Card 2: Exposure Comparison (Example) */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'जोखिम तुलना' : 'Exposure Comparison (Example)'}
          </h3>
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">
            {language === 'hi' ? 'मूल योजना बनाम क्लाइमाशिफ्ट पुनर्नियोजित' : 'Original plan vs. ClimaShift re-scheduled'}
          </p>
        </div>

        <div className="space-y-4 my-4">
          {/* Original Plan Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#171A1F] dark:text-[#F5F7FA]">
                {language === 'hi' ? 'मूल योजना' : 'Original Plan'}
              </span>
              <span className="font-mono font-semibold text-[#D94A4A]">100%</span>
            </div>
            <div className="w-full h-3 bg-[#E4E7EC] dark:bg-[#122235] rounded-full overflow-hidden">
              <div className="h-full bg-[#D94A4A] rounded-full w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* ClimaShift Plan Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#171A1F] dark:text-[#F5F7FA]">
                {language === 'hi' ? 'क्लाइमाशिफ्ट योजना' : 'ClimaShift Plan'}
              </span>
              <span className="font-mono font-semibold text-[#16B878]">{remainingExposure}%</span>
            </div>
            <div className="w-full h-3 bg-[#E4E7EC] dark:bg-[#122235] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#16B878] rounded-full transition-all duration-500"
                style={{ width: `${remainingExposure}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-[#667085] dark:text-[#A7B2C1] pt-2 border-t border-[#E4E7EC] dark:border-[#26384C]/60">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D94A4A]"></span>
            <span>{language === 'hi' ? 'मूल योजना' : 'Original Plan'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16B878]"></span>
            <span>{language === 'hi' ? 'क्लाइमाशिफ्ट योजना' : 'ClimaShift Plan'}</span>
          </span>
        </div>
      </div>

      {/* Card 3: Risk Summary */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'जोखिम सारांश' : 'Risk Summary'}
          </h3>
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">
            {language === 'hi' ? 'महत्वपूर्ण परिचालन चेतावनी' : 'Critical operational alerts'}
          </p>
        </div>

        {/* Warning Box */}
        <div className="my-3 p-3.5 rounded-lg border border-[#FBC8C8] dark:border-[#4E2424] bg-[#FEEFEF] dark:bg-[#2D1818] space-y-1.5">
          <div className="flex items-center gap-2 text-[#D94A4A] dark:text-[#F87171]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold leading-tight">
              {language === 'hi' ? 'दोपहर में उच्च जोखिम (12:00–16:00)' : 'High exposure risk in afternoon (12:00–16:00)'}
            </span>
          </div>
          <p className="text-[11px] text-[#171A1F] dark:text-[#F5F7FA] leading-relaxed">
            {language === 'hi'
              ? 'अधिकतम एक्यूआई 420 और हीट इंडेक्स 39°C। भारी बाहरी कार्यों को सुबह 07:00–10:00 स्लॉट में स्थानांतरित करें।'
              : 'Peak AQI 420 & Heat Index 39°C. Move heavy outdoor tasks to 07:00–10:00 morning slot.'}
          </p>
        </div>

        <div className="text-[11px] text-[#667085] dark:text-[#A7B2C1] pt-2 border-t border-[#E4E7EC] dark:border-[#26384C]/60 flex items-center justify-between">
          <span>{totalTasks} tasks evaluated</span>
          <span>• {rescheduleCount} rescheduled</span>
          <span>• {restrictedCount} restricted</span>
        </div>
      </div>
    </div>
  );
}
