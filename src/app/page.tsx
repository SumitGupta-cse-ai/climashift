'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { EnvironmentOverview } from '@/components/dashboard/EnvironmentOverview';
import { RecommendationHero } from '@/components/dashboard/RecommendationHero';
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
        <div className="space-y-4 sm:space-y-5">
          <RecommendationHero />
          <EnvironmentOverview />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <TodayTimeline />
            <RegulatoryCard />
          </div>
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
