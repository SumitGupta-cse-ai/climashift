'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { OverviewPage } from '@/components/pages/OverviewPage';
import { TelemetryPage } from '@/components/pages/TelemetryPage';
import { SchedulePage } from '@/components/pages/SchedulePage';
import { SafetyPage } from '@/components/pages/SafetyPage';
import { CompliancePage } from '@/components/pages/CompliancePage';
import { PlanInputScreen } from '@/components/plan/PlanInputScreen';
import { BeforeAfterView } from '@/components/replan/BeforeAfterView';
import { ActivityView } from '@/components/activity/ActivityView';
import { AwsArchitectureView } from '@/components/architecture/AwsArchitectureView';
import { SettingsView } from '@/components/settings/SettingsView';

export default function HomePage() {
  const { activeNav } = useApp();

  return (
    <AppShell>
      {activeNav === 'dashboard' && <OverviewPage />}
      {activeNav === 'telemetry' && <TelemetryPage />}
      {activeNav === 'schedule' && <SchedulePage />}
      {activeNav === 'safety' && <SafetyPage />}
      {activeNav === 'compliance' && <CompliancePage />}
      {activeNav === 'plan' && <PlanInputScreen />}
      {activeNav === 'replan' && <BeforeAfterView />}
      {activeNav === 'activity' && <ActivityView />}
      {activeNav === 'architecture' && <AwsArchitectureView />}
      {activeNav === 'settings' && <SettingsView />}
    </AppShell>
  );
}
