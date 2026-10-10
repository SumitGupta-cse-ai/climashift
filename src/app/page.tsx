'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { RecommendationHero } from '@/components/dashboard/RecommendationHero';
import { LiveEnvironmentCard } from '@/components/dashboard/LiveEnvironmentCard';
import { ImpactMetricsRow } from '@/components/dashboard/ImpactMetricsRow';
import { TodayTimeline } from '@/components/dashboard/TodayTimeline';
import { RegulatoryCard } from '@/components/dashboard/RegulatoryCard';
import { PlanInputScreen } from '@/components/plan/PlanInputScreen';
import { BeforeAfterView } from '@/components/replan/BeforeAfterView';
import { ActivityView } from '@/components/activity/ActivityView';
import { AwsArchitectureView } from '@/components/architecture/AwsArchitectureView';
import { SettingsView } from '@/components/settings/SettingsView';
import { LayoutDashboard, Calendar, Gauge, Scale, Layers } from 'lucide-react';

export default function HomePage() {
  const { activeNav, language } = useApp();
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'schedule' | 'telemetry' | 'compliance' | 'all'>('overview');

  return (
    <AppShell>
      {activeNav === 'dashboard' && (
        <div className="space-y-4 max-w-7xl mx-auto">
          {/* APK-Style Segmented View Switcher */}
          <div className="flex items-center justify-between gap-3 flex-wrap pb-1">
            <div className="flex items-center p-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] text-xs font-semibold overflow-x-auto shadow-xs">
              <button
                onClick={() => setDashboardTab('overview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  dashboardTab === 'overview'
                    ? 'bg-[#FACC15] text-[#0F172A] font-extrabold shadow-lamy border border-[#EAB308]'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'hi' ? 'अवलोकन' : 'Overview'}</span>
              </button>

              <button
                onClick={() => setDashboardTab('schedule')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  dashboardTab === 'schedule'
                    ? 'bg-[#FACC15] text-[#0F172A] font-extrabold shadow-lamy border border-[#EAB308]'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'hi' ? 'शिफ्ट कार्यक्रम' : 'Shift Schedule'}</span>
              </button>

              <button
                onClick={() => setDashboardTab('telemetry')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  dashboardTab === 'telemetry'
                    ? 'bg-[#FACC15] text-[#0F172A] font-extrabold shadow-lamy border border-[#EAB308]'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <Gauge className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'hi' ? 'टेलीमेट्री' : 'Live Telemetry'}</span>
              </button>

              <button
                onClick={() => setDashboardTab('compliance')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  dashboardTab === 'compliance'
                    ? 'bg-[#FACC15] text-[#0F172A] font-extrabold shadow-lamy border border-[#EAB308]'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <Scale className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'hi' ? 'नियम व निर्देश' : 'Compliance'}</span>
              </button>

              <button
                onClick={() => setDashboardTab('all')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  dashboardTab === 'all'
                    ? 'bg-[#FACC15] text-[#0F172A] font-extrabold shadow-lamy border border-[#EAB308]'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'hi' ? 'सभी' : 'All Views'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE OVERVIEW (DEFAULT CLEAN APK VIEW) */}
          {dashboardTab === 'overview' && (
            <div className="space-y-4">
              {/* Row 1: Decision Directive + Live Environmental Telemetry */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-5 flex flex-col">
                  <RecommendationHero />
                </div>
                <div className="lg:col-span-7 flex flex-col">
                  <LiveEnvironmentCard />
                </div>
              </div>

              {/* Row 2: Measurable Safety Gains */}
              <ImpactMetricsRow />

              {/* Row 3: Actionable Shift Tasks */}
              <TodayTimeline />
            </div>
          )}

          {/* TAB 2: DEDICATED SHIFT SCHEDULE */}
          {dashboardTab === 'schedule' && (
            <div className="space-y-4">
              <TodayTimeline />
            </div>
          )}

          {/* TAB 3: DEDICATED LIVE TELEMETRY */}
          {dashboardTab === 'telemetry' && (
            <div className="space-y-4">
              <LiveEnvironmentCard />
              <ImpactMetricsRow />
            </div>
          )}

          {/* TAB 4: DEDICATED REGULATORY COMPLIANCE */}
          {dashboardTab === 'compliance' && (
            <div className="space-y-4">
              <RegulatoryCard />
            </div>
          )}

          {/* TAB 5: ALL VIEWS (COMPLETE SCROLLABLE REPORT) */}
          {dashboardTab === 'all' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-5 flex flex-col">
                  <RecommendationHero />
                </div>
                <div className="lg:col-span-7 flex flex-col">
                  <LiveEnvironmentCard />
                </div>
              </div>
              <ImpactMetricsRow />
              <TodayTimeline />
              <RegulatoryCard />
            </div>
          )}
        </div>
      )}

      {activeNav === 'plan' && <PlanInputScreen />}

      {activeNav === 'replan' && <BeforeAfterView />}

      {activeNav === 'activity' && <ActivityView />}

      {activeNav === 'architecture' && <AwsArchitectureView />}

      {activeNav === 'settings' && <SettingsView />}
    </AppShell>
  );
}
