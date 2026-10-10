'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { 
  Radio, 
  Wind, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Sun, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function TelemetryPage() {
  const { siteProfile, environmentalWindows, conditionsChanged, reevaluatePlan, isOptimizing, language } = useApp();
  const [showHourly, setShowHourly] = useState(true);

  const currentWindow = environmentalWindows.find(w => w.hour === 11) || environmentalWindows[0];

  const aqi = siteProfile.currentAQI;
  let aqiBadge = {
    label: 'Very Poor',
    color: 'bg-[#FEF08A] text-[#854D0E] border-[#EAB308]',
    dot: 'bg-[#EAB308]'
  };

  if (aqi <= 100) {
    aqiBadge = { label: 'Satisfactory', color: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]', dot: 'bg-[#16A34A]' };
  } else if (aqi <= 200) {
    aqiBadge = { label: 'Moderate', color: 'bg-[#FEF08A] text-[#854D0E] border-[#EAB308]', dot: 'bg-[#CA8A04]' };
  } else if (aqi <= 300) {
    aqiBadge = { label: 'Poor', color: 'bg-[#FFEDD5] text-[#9A3412] border-[#FDBA74]', dot: 'bg-[#EA580C]' };
  } else if (aqi <= 400) {
    aqiBadge = { label: 'Very Poor', color: 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]', dot: 'bg-[#DC2626]' };
  } else {
    aqiBadge = { label: 'Severe', color: 'bg-[#450A0A] text-[#FEE2E2] border-[#991B1B]', dot: 'bg-[#EF4444]' };
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Visual Hero Banner with Generated AI Image */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#CBD5E1] dark:border-[#334155] shadow-tactile bg-[#0F172A]">
        <div className="relative h-64 sm:h-72 w-full">
          <Image
            src="/images/site-telemetry.jpg"
            alt="Site Telemetry Monitoring Station"
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
                LIVE SENSOR TOWER
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {siteProfile.name} • CPCB / DPCC CAAMS Node #4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi' ? 'लाइव पर्यावरणीय टेलीमेट्री स्टेशन' : 'Live Environmental Telemetry Console'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Continuous solar-powered micro-climate sensors monitoring PM2.5, apparent heat index, thermal inversion, and statutory curbs in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border shadow-sm ${aqiBadge.color}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${aqiBadge.dot} animate-pulse`}></span>
              <span>AQI {aqi} • {aqiBadge.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sensor Surge Alert if active */}
      {conditionsChanged && (
        <div className="rounded-2xl border-2 border-[#FCA5A5] dark:border-[#7F1D1D] bg-[#FEF2F2] dark:bg-[#451A1A]/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-tactile">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 stroke-[2.5]" />
            <div>
              <div className="text-xs font-black text-[#DC2626] dark:text-[#FCA5A5] uppercase">
                Sensor Spike Detected in NCR Grid
              </div>
              <div className="text-xs text-slate-800 dark:text-slate-200">
                AQI rose rapidly to {siteProfile.currentAQI}. Midday outdoor tasks require immediate re-evaluation.
              </div>
            </div>
          </div>
          <button
            onClick={reevaluatePlan}
            disabled={isOptimizing}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#DC2626] hover:bg-[#B91C1C] transition cursor-pointer shadow-xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>Re-evaluate Schedule Now</span>
          </button>
        </div>
      )}

      {/* 4 Clean Big Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Air Quality */}
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              AIR QUALITY INDEX
            </span>
            <div className="p-2 rounded-xl bg-[#FEF08A] dark:bg-[#422006] text-[#854D0E] dark:text-[#FACC15] border border-[#EAB308]">
              <Gauge className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {aqi}
            </div>
            <div className="text-xs font-bold text-[#DC2626] dark:text-[#F87171] mt-0.5">
              PM2.5: {currentWindow.pm25} µg/m³
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-[11px] text-[#475569] dark:text-[#94A3B8] font-medium flex items-center justify-between">
            <span>Severe Inversion Risk</span>
            <span className="font-bold text-[#854D0E] dark:text-[#FACC15]">N95 Mandatory</span>
          </div>
        </div>

        {/* Card 2: Temperature & Solar */}
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              AMBIENT TEMPERATURE
            </span>
            <div className="p-2 rounded-xl bg-[#FFEDD5] dark:bg-[#7C2D12] text-[#C2410C] dark:text-[#FDBA74] border border-[#FB923C]">
              <Thermometer className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {siteProfile.currentTemp}°C
            </div>
            <div className="text-xs font-bold text-[#EA580C] mt-0.5">
              Heat Index: {currentWindow.heatIndex}°C
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-[11px] text-[#475569] dark:text-[#94A3B8] font-medium flex items-center justify-between">
            <span>Afternoon Solar Peak</span>
            <span className="font-bold text-[#EA580C]">Hydration Alert</span>
          </div>
        </div>

        {/* Card 3: Humidity & Moisture */}
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              HUMIDITY & WIND
            </span>
            <div className="p-2 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#1D4ED8] dark:text-[#93C5FD] border border-[#93C5FD]">
              <Droplets className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {siteProfile.currentHumidity}%
            </div>
            <div className="text-xs font-bold text-[#1D4ED8] dark:text-[#60A5FA] mt-0.5">
              Wind: {currentWindow.windSpeed} km/h (NW)
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-[11px] text-[#475569] dark:text-[#94A3B8] font-medium flex items-center justify-between">
            <span>Low Dispersion Stagnation</span>
            <span className="font-bold text-[#16A34A]">Mist Cannons On</span>
          </div>
        </div>

        {/* Card 4: Curbs & Protocol */}
        <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              REGULATORY CURBS
            </span>
            <div className="p-2 rounded-xl bg-[#FEE2E2] dark:bg-[#451A1A] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA]">
              <Wind className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#DC2626] dark:text-[#F87171]">
              STAGE III
            </div>
            <div className="text-xs font-bold text-[#991B1B] dark:text-[#FECACA] mt-0.5">
              CAQM NCR Directive
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-[11px] text-[#475569] dark:text-[#94A3B8] font-medium flex items-center justify-between">
            <span>Statutory Status</span>
            <span className="font-bold text-[#DC2626]">Enforced</span>
          </div>
        </div>
      </div>

      {/* Hourly Diurnal Forecast Exposure Curve */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border-2 border-[#CBD5E1] dark:border-[#334155] rounded-2xl p-5 sm:p-6 shadow-tactile space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] pb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#CA8A04] dark:text-[#FACC15]" />
            <h3 className="font-black text-sm text-[#0F172A] dark:text-[#F8FAFC]">
              Today&apos;s Diurnal Exposure Windows (07:00 – 19:00 IST)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#166534] dark:text-[#4ADE80]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
              <span>Safe Shift Window (07:00–10:00)</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#DC2626] dark:text-[#F87171]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
              <span>Peak Hazard (12:00–16:00)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {environmentalWindows.slice(0, 12).map((w) => {
            const isMorningSafe = w.hour >= 7 && w.hour <= 10;
            const isPeakDanger = w.hour >= 12 && w.hour <= 16;

            return (
              <div 
                key={w.hour}
                className={`p-3 rounded-xl border-2 text-center transition-all shadow-xs ${
                  isMorningSafe
                    ? 'bg-[#DCFCE7] border-[#86EFAC] dark:bg-[#064E3B]/60 dark:border-[#047857]'
                    : isPeakDanger
                    ? 'bg-[#FEF2F2] border-[#FCA5A5] dark:bg-[#451A1A]/60 dark:border-[#7F1D1D]'
                    : 'bg-[#F8F9FA] border-[#CBD5E1] dark:bg-[#0B1522] dark:border-[#334155]'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-[#475569] dark:text-[#94A3B8]">
                  {w.timeLabel?.split(':')[0] || `${w.hour}`}h IST
                </div>
                <div className={`text-sm font-black font-mono my-1 ${
                  isMorningSafe ? 'text-[#166534] dark:text-[#4ADE80]' : isPeakDanger ? 'text-[#DC2626] dark:text-[#F87171]' : 'text-[#0F172A] dark:text-[#CBD5E1]'
                }`}>
                  {w.aqi} AQI
                </div>
                <div className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-mono font-bold">
                  {w.temperature}°C
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
