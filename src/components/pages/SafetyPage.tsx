'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  HeartPulse, 
  Droplet, 
  Sun, 
  FileCheck, 
  HardHat, 
  Check, 
  Download,
  AlertOctagon
} from 'lucide-react';

export function SafetyPage() {
  const { siteProfile, replanResult, tasks, language } = useApp();
  const [downloading, setDownloading] = useState(false);

  const evaluatedTasks = replanResult?.recommendedTasks || tasks;
  const highRiskAvoided = replanResult?.impactMetrics.highRiskWorkerHoursAvoided || 36;
  const exposureReduction = replanResult?.impactMetrics.exposureReductionPercent || 59;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Official ClimaShift Worker Health & Safety Pass Record (CSV/PDF) generated.');
    }, 800);
  };

  const passes = [
    {
      id: 'PASS-7801',
      crewName: 'Tower B Plastering Crew',
      workers: 8,
      lead: 'Rameshwar Singh (Trade Lead)',
      shiftWindow: '07:00 – 10:00 IST',
      originalSlot: '11:00 – 14:00 (Peak Inversion)',
      status: 'APPROVED & CLEARED',
      statusClass: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]',
      ppeRequired: ['FFP2/N95 Mask', 'UV Sunglasses', '2L Water Flask', 'Harness'],
      heatRisk: 'Low (Morning)',
      exposureAvoided: '59% avoided'
    },
    {
      id: 'PASS-7802',
      crewName: 'Bulk Cement Unloading Crew',
      workers: 6,
      lead: 'Devendra Yadav (Foreman)',
      shiftWindow: '08:00 – 11:00 IST',
      originalSlot: '10:00 – 13:00 (Elevated Dust)',
      status: 'APPROVED & CLEARED',
      statusClass: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]',
      ppeRequired: ['Dust Mist Chute', 'Anti-dust Visor', 'N95 Respirator'],
      heatRisk: 'Moderate',
      exposureAvoided: '42% avoided'
    },
    {
      id: 'PASS-7803',
      crewName: 'Basement Conduit Electrical Crew',
      workers: 6,
      lead: 'Sunil Kumar (Master Electrician)',
      shiftWindow: '13:00 – 16:00 IST',
      originalSlot: '13:00 – 16:00 (Indoor Protected)',
      status: 'CONTINUE (INDOOR)',
      statusClass: 'bg-[#EFF6FF] text-[#1E40AF] border-[#93C5FD]',
      ppeRequired: ['Insulated Boots', 'Indoor Ventilation Fans', 'Gloves'],
      heatRisk: 'Safe Indoor',
      exposureAvoided: 'Fully sheltered'
    },
    {
      id: 'PASS-7804',
      crewName: 'North Gate Earthwork Excavation',
      workers: 8,
      lead: 'Baljit Singh (Equipment Lead)',
      shiftWindow: 'STANDBY (TEMPORARILY SUSPENDED)',
      originalSlot: '09:00 – 12:00',
      status: 'MANDATORY STANDBY',
      statusClass: 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]',
      ppeRequired: ['CAQM Anti-Smog Gun On', 'Soil Geotextile Tarpaulin'],
      heatRisk: 'Statutory Curb',
      exposureAvoided: '100% dust curb'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Visual Hero Banner with Generated AI Image */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#CBD5E1] dark:border-[#334155] shadow-tactile bg-[#0F172A]">
        <div className="relative h-60 sm:h-64 w-full">
          <Image
            src="/images/worker-safety.jpg"
            alt="Safety Supervisor Inspecting Workers"
            fill
            priority
            className="object-cover opacity-85 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
        </div>

        {/* Floating Content Over Banner */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 text-white">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#FACC15] text-[#0F172A] font-black text-[10px] px-2 uppercase shadow-xs">
                OCCUPATIONAL HEALTH CONSOLE
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {siteProfile.name} • 38 On-Site Workers Protected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi' ? 'श्रमिक स्वास्थ्य एवं डिजिटल सुरक्षा पास' : 'Crew Health & Digital Safety Passes'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Real-time worker exposure management under NCR extreme pollution and heat waves. Every trade is verified for medical safety and legal compliance.
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs text-[#0F172A] bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#CA8A04] transition shadow-lamy cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{downloading ? 'Generating Report...' : 'Download Safety Passes'}</span>
          </button>
        </div>
      </div>

      {/* Safety Gains Counter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#DCFCE7] dark:bg-[#064E3B] text-[#166534] dark:text-[#4ADE80] border border-[#86EFAC]">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-[#166534] dark:text-[#4ADE80]">
              {highRiskAvoided} hrs
            </div>
            <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              High-Risk Exposure Prevented
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#FEF08A] dark:bg-[#422006] text-[#854D0E] dark:text-[#FACC15] border border-[#EAB308]">
            <Droplet className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-[#854D0E] dark:text-[#FACC15]">
              15 min / hr
            </div>
            <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              Hydration Break Protocol Active
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#1E40AF] dark:text-[#93C5FD] border border-[#93C5FD]">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-[#1E40AF] dark:text-[#93C5FD]">
              100%
            </div>
            <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              Supervisor Sign-Off & Verification
            </div>
          </div>
        </div>
      </div>

      {/* Digital Crew Safety Passes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Active Trade Safety Passes ({passes.length})
          </h2>
          <span className="text-xs font-mono font-bold text-[#166534] dark:text-[#4ADE80] bg-[#DCFCE7] dark:bg-[#064E3B] px-2.5 py-1 rounded-md border border-[#86EFAC]">
            OSHA / CPCB Compliance Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passes.map((pass) => (
            <div
              key={pass.id}
              className="p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#07111C] shadow-tactile space-y-3.5 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F8F9FA] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#334155]">
                      {pass.id}
                    </span>
                    <h3 className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                      {pass.crewName}
                    </h3>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium">
                      {pass.lead} • {pass.workers} Workers
                    </p>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border shadow-xs shrink-0 ${pass.statusClass}`}>
                    {pass.status}
                  </span>
                </div>
              </div>

              {/* Slot Transition Bar */}
              <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#0B1522] border-2 border-[#E2E8F0] dark:border-[#1E293B] space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
                  <span>Authorized Work Slot:</span>
                  <strong className="font-mono text-[#0F172A] dark:text-[#F8FAFC]">{pass.shiftWindow}</strong>
                </div>
                <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
                  <span>Original Risk Slot:</span>
                  <span className="font-mono text-[#DC2626] line-through">{pass.originalSlot}</span>
                </div>
              </div>

              {/* PPE Equipment Badges */}
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                  Mandatory Gear Checklist:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pass.ppeRequired.map((ppe, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FEF08A] text-[#854D0E] dark:bg-[#422006] dark:text-[#FACC15] border border-[#EAB308]"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>{ppe}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
