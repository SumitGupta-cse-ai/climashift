'use client';

import React from 'react';
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

export default function HomePage() {
  const { activeNav } = useApp();

  return (
    <AppShell>
      {activeNav === 'dashboard' && (
        <div className="space-y-5">
          {/* Row 1: Today's Work Decision + Live Environmental Conditions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-5 flex flex-col">
              <RecommendationHero />
            </div>
            <div className="lg:col-span-7 flex flex-col">
              <LiveEnvironmentCard />
            </div>
          </div>

          {/* Row 2: Key Impacts + Exposure Comparison + Risk Summary */}
          <ImpactMetricsRow />

          {/* Row 3: Today's Work Schedule Enterprise Table */}
          <TodayTimeline />

          {/* Compliance & Regulatory Directives */}
          <RegulatoryCard />
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
