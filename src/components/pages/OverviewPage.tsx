'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { RecommendationHero } from '@/components/dashboard/RecommendationHero';
import { ImpactMetricsRow } from '@/components/dashboard/ImpactMetricsRow';
import { 
  Radio, 
  Calendar, 
  HardHat, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Gauge, 
  ShieldCheck,
  Clock,
  MapPin
} from 'lucide-react';

export function OverviewPage() {
  const { siteProfile, setActiveNav, language, replanResult, tasks } = useApp();

  const evaluatedTasks = replanResult?.recommendedTasks || tasks;
  const rescheduledCount = evaluatedTasks.filter(t => t.status === 'reschedule').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Main Operational Directive Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <RecommendationHero />
        </div>

        {/* Quick Visual Status Feature Card */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border-2 border-[#CBD5E1] dark:border-[#334155] shadow-tactile bg-[#0F172A] flex flex-col justify-between p-6">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/crane-sunrise.jpg"
              alt="Project Site Tower"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/40"></div>
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#FACC15] text-[#0F172A] font-black text-[10px] px-2 uppercase shadow-xs">
                NCR AIR QUALITY ADVISORY
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {siteProfile.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              CAQM Stage III curbs active. Shift outdoor activities to the cool morning slot before particulate inversion spikes at noon.
            </p>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-slate-700 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <span className="font-mono text-white font-bold">{rescheduledCount} tasks</span> shifted to morning
            </div>
            <button
              onClick={() => setActiveNav('schedule')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs text-[#0F172A] bg-[#FACC15] hover:bg-[#EAB308] border border-[#CA8A04] transition shadow-xs cursor-pointer"
            >
              <span>View Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Safety Gains Impact Metrics Strip */}
      <ImpactMetricsRow />

      {/* 4 Clean Dedicated Feature Navigation Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
            {language === 'hi' ? 'समर्पित परिचालन केंद्र' : 'Dedicated Operational Hubs'}
          </h3>
          <span className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
            Click any hub to access full tools & data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hub 1: Telemetry */}
          <div
            onClick={() => setActiveNav('telemetry')}
            className="group p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#0D1B2A] hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-all cursor-pointer shadow-tactile flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-3 w-fit rounded-xl bg-[#FEF08A] dark:bg-[#422006] text-[#854D0E] dark:text-[#FACC15] border border-[#EAB308] group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-black text-base text-[#0F172A] dark:text-[#F8FAFC]">
                Live Telemetry
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium leading-relaxed">
                Real-time CPCB sensor readings, AQI gauge, temperature, humidity, and 12-hour forecast curves.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#854D0E] dark:text-[#FACC15]">
              <span>Open Sensors</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 2: Schedule */}
          <div
            onClick={() => setActiveNav('schedule')}
            className="group p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#0D1B2A] hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-all cursor-pointer shadow-tactile flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-3 w-fit rounded-xl bg-[#DCFCE7] dark:bg-[#064E3B] text-[#166534] dark:text-[#4ADE80] border border-[#86EFAC] group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-black text-base text-[#0F172A] dark:text-[#F8FAFC]">
                Shift Schedule
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium leading-relaxed">
                Full task timeline with trade cards, table view, planned vs rescheduled windows, and search filters.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#166534] dark:text-[#4ADE80]">
              <span>Open Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 3: Safety */}
          <div
            onClick={() => setActiveNav('safety')}
            className="group p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#0D1B2A] hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-all cursor-pointer shadow-tactile flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-3 w-fit rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#1E40AF] dark:text-[#93C5FD] border border-[#93C5FD] group-hover:scale-110 transition-transform">
                <HardHat className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-black text-base text-[#0F172A] dark:text-[#F8FAFC]">
                Crew Safety Passes
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium leading-relaxed">
                Digital crew authorization passes, mandatory PPE checklists, and heat stress hydration countdowns.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E40AF] dark:text-[#93C5FD]">
              <span>View Safety Passes</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 4: Compliance */}
          <div
            onClick={() => setActiveNav('compliance')}
            className="group p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-[#334155] bg-[#FFFFFF] dark:bg-[#0D1B2A] hover:border-[#CA8A04] dark:hover:border-[#FACC15] transition-all cursor-pointer shadow-tactile flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-3 w-fit rounded-xl bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] group-hover:scale-110 transition-transform">
                <Scale className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-black text-base text-[#0F172A] dark:text-[#F8FAFC]">
                GRAP Compliance
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium leading-relaxed">
                CAQM Stage III statutory curbs, prohibited earthwork directives, and legal affidavit export.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#DC2626] dark:text-[#F87171]">
              <span>Open Compliance</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
