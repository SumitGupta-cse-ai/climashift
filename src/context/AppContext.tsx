'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, SiteProfile, ReplanResult, EnvironmentalWindow, ActionType, OperationalStatus } from '@/types';
import { DEFAULT_SITE_PROFILE, SITES_LIST, generateHourlyEnvironmentalWindows } from '@/data/mockEnvironment';
import { getStandardDemoTasks } from '@/lib/bedrockParser';
import { runDeterministicScheduler, calculateTransparentImpactMetrics } from '@/lib/schedulingEngine';
import { Language, translations, Translations } from '@/lib/i18n';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppNavView = 'dashboard' | 'telemetry' | 'schedule' | 'plan' | 'replan' | 'safety' | 'compliance' | 'activity' | 'architecture' | 'settings';

export interface DecisionLogEntry {
  id: string;
  timestamp: string;
  siteName: string;
  tasksCount: number;
  rescheduledCount: number;
  restrictedCount: number;
  highRiskHoursAvoided: number;
  status: 'APPROVED' | 'Approved & Broadcasted' | 'Reviewed & Archived';
  supervisorNotes: string;
  replanSummary: ReplanResult;
  engineVersion: string;
  ruleSetVersion: string;
}

interface AppContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: Translations;
  activeNav: AppNavView;
  setActiveNav: (v: AppNavView) => void;
  siteProfile: SiteProfile;
  setSiteProfile: (s: SiteProfile) => void;
  sitesList: SiteProfile[];
  environmentalWindows: EnvironmentalWindow[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  replanResult: ReplanResult | null;
  setReplanResult: (r: ReplanResult | null) => void;
  decisionLogs: DecisionLogEntry[];
  addDecisionLog: (entry: DecisionLogEntry) => void;
  executeReplan: (customTasks?: Task[]) => void;
  selectTaskAction: (taskId: string, actionType: ActionType) => void;
  replayDecision: (decisionId: string) => void;
  replayingDecisionId: string | null;
  clearReplay: () => void;
  conditionsChanged: boolean;
  triggerConditionsChanged: () => void;
  reevaluatePlan: () => void;
  judgeMode: boolean;
  toggleJudgeMode: () => void;
  isOptimizing: boolean;
  toastMessage: { text: string; type: 'success' | 'warning' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  resetToDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [language, setLanguageState] = useState<Language>('en');
  const [activeNav, setActiveNav] = useState<AppNavView>('dashboard');
  const [siteProfile, setSiteProfile] = useState<SiteProfile>(DEFAULT_SITE_PROFILE);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [replanResult, setReplanResult] = useState<ReplanResult | null>(null);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null);
  const [replayingDecisionId, setReplayingDecisionId] = useState<string | null>(null);
  const [conditionsChanged, setConditionsChanged] = useState<boolean>(false);
  const [judgeMode, setJudgeMode] = useState<boolean>(false);

  // Generate windows based on current site's AQI and stage
  const [environmentalWindows, setEnvironmentalWindows] = useState<EnvironmentalWindow[]>(() => 
    generateHourlyEnvironmentalWindows(DEFAULT_SITE_PROFILE.currentAQI, DEFAULT_SITE_PROFILE.grapStage)
  );

  const t = translations[language] || translations.en;

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('climashift-theme') as ThemeMode;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyThemeToDoc(savedTheme);
    } else {
      applyThemeToDoc('dark'); // Default to dark mode
    }

    const savedLang = localStorage.getItem('climashift-lang') as Language;
    if (savedLang === 'en' || savedLang === 'hi') {
      setLanguageState(savedLang);
    }

    // Initialize demo tasks
    const initialTasks = getStandardDemoTasks();
    setTasks(initialTasks);

    // Run initial deterministic evaluation
    const initialWindows = generateHourlyEnvironmentalWindows(siteProfile.currentAQI, siteProfile.grapStage);
    const initialResult = runDeterministicScheduler(initialTasks, initialWindows, siteProfile);
    setReplanResult(initialResult);

    // Load decision logs from storage
    const savedLogs = localStorage.getItem('climashift-logs');
    if (savedLogs) {
      try {
        setDecisionLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }
  }, []);

  // Update windows when site changes
  useEffect(() => {
    const updatedWindows = generateHourlyEnvironmentalWindows(siteProfile.currentAQI, siteProfile.grapStage);
    setEnvironmentalWindows(updatedWindows);
    if (tasks.length > 0) {
      const updatedResult = runDeterministicScheduler(tasks, updatedWindows, siteProfile);
      setReplanResult(updatedResult);
    }
  }, [siteProfile]);

  const applyThemeToDoc = (tMode: ThemeMode) => {
    const root = document.documentElement;
    if (tMode === 'dark') {
      root.classList.add('dark');
    } else if (tMode === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  };

  const setTheme = (tMode: ThemeMode) => {
    setThemeState(tMode);
    localStorage.setItem('climashift-theme', tMode);
    applyThemeToDoc(tMode);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('climashift-lang', lang);
    showToast(lang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है।' : 'Language changed to English.', 'info');
  };

  const showToast = (text: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const executeReplan = (customTasks?: Task[]) => {
    setIsOptimizing(true);
    const tasksToProcess = customTasks || tasks;
    
    setTimeout(() => {
      const windows = generateHourlyEnvironmentalWindows(siteProfile.currentAQI, siteProfile.grapStage);
      const result = runDeterministicScheduler(tasksToProcess, windows, siteProfile);
      setReplanResult(result);
      setTasks(tasksToProcess);
      setIsOptimizing(false);
      setActiveNav('replan');
      showToast(
        language === 'hi'
          ? 'कार्य योजना को मौसम व कानूनी नियमों के अनुसार सफलतापूर्वक रीप्लान किया गया!'
          : 'Schedule successfully evaluated against environmental constraints!',
        'success'
      );
    }, 450);
  };

  // Feature 1: Select between Option A, B, or C for any task
  const selectTaskAction = (taskId: string, actionType: ActionType) => {
    if (!replanResult) return;

    const taskOptions = replanResult.optionsByTask?.[taskId];
    const selectedOption = taskOptions?.find(o => o.actionType === actionType);
    if (!selectedOption) return;

    const updatedTasks: Task[] = replanResult.recommendedTasks.map(t => {
      if (t.id !== taskId) return t;
      const newStatus: OperationalStatus = actionType === 'RESCHEDULE' 
        ? (t.status === 'restricted' ? 'restricted' : 'reschedule')
        : (actionType === 'REDUCE_EXPOSURE' ? 'protect' : 'continue');

      return {
        ...t,
        selectedActionType: actionType,
        recommendedStartTime: selectedOption.startTime === 'Standby' ? t.originalStartTime : selectedOption.startTime,
        recommendedEndTime: selectedOption.endTime === 'Standby' ? t.originalEndTime : selectedOption.endTime,
        status: newStatus
      };
    });

    const updatedMetrics = calculateTransparentImpactMetrics(replanResult.originalTasks, updatedTasks, environmentalWindows);

    setReplanResult({
      ...replanResult,
      recommendedTasks: updatedTasks,
      impactMetrics: updatedMetrics
    });

    showToast(
      language === 'hi'
        ? `कार्य का विकल्प बदलकर ${selectedOption.label} किया गया।`
        : `Selected ${selectedOption.label} for task.`,
      'info'
    );
  };

  // Feature 12: Decision Replay
  const replayDecision = (decisionId: string) => {
    const entry = decisionLogs.find(l => l.id === decisionId);
    if (!entry) {
      showToast('Decision log record not found', 'error');
      return;
    }

    setReplanResult(entry.replanSummary);
    setReplayingDecisionId(decisionId);
    setActiveNav('replan');
    showToast(
      language === 'hi'
        ? `निर्णय रिकॉर्ड #${decisionId.slice(-6)} को पुनः सक्रिय किया गया।`
        : `Replaying audited decision #${decisionId.slice(-6)} (${entry.timestamp})`,
      'info'
    );
  };

  const clearReplay = () => {
    setReplayingDecisionId(null);
    if (tasks.length > 0) {
      const windows = generateHourlyEnvironmentalWindows(siteProfile.currentAQI, siteProfile.grapStage);
      const res = runDeterministicScheduler(tasks, windows, siteProfile);
      setReplanResult(res);
    }
  };

  // Feature 14: Conditions Changed / Re-evaluate Plan
  const triggerConditionsChanged = () => {
    const spikedAQI = 425; // Spikes into Severe territory
    const spikedTemp = 40;
    setConditionsChanged(true);
    setSiteProfile(prev => ({
      ...prev,
      currentAQI: spikedAQI,
      currentTemp: spikedTemp,
      weatherCondition: 'Severe Inversion & Particulate Surge (Spike)',
      lastUpdated: '12:45 IST (Sensor Surge Detected)'
    }));
    const newWindows = generateHourlyEnvironmentalWindows(spikedAQI, siteProfile.grapStage);
    setEnvironmentalWindows(newWindows);

    showToast(
      language === 'hi'
        ? '⚠️ चेतावनी: AQI में अचानक वृद्धि (425) दर्ज की गई! योजना को पुनः जांचें।'
        : '⚠️ Alert: Sudden particulate surge detected (AQI 425). Work plan requires re-evaluation!',
      'warning'
    );
  };

  const reevaluatePlan = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const newWindows = generateHourlyEnvironmentalWindows(siteProfile.currentAQI, siteProfile.grapStage);
      const result = runDeterministicScheduler(tasks, newWindows, siteProfile);
      setReplanResult(result);
      setConditionsChanged(false);
      setIsOptimizing(false);
      setActiveNav('replan');
      showToast(
        language === 'hi'
          ? 'अद्यतन स्थितियों के अनुसार योजना का पुनः मूल्यांकन पूर्ण हुआ!'
          : 'Work plan re-evaluated against new environmental parameters.',
        'success'
      );
    }, 400);
  };

  const toggleJudgeMode = () => {
    setJudgeMode(prev => !prev);
    showToast(!judgeMode ? 'Judge / Decision Evidence Mode activated.' : 'Judge Mode deactivated.', 'info');
  };

  const addDecisionLog = (entry: DecisionLogEntry) => {
    const updated = [entry, ...decisionLogs];
    setDecisionLogs(updated);
    localStorage.setItem('climashift-logs', JSON.stringify(updated));
  };

  const resetToDemo = () => {
    const demoTasks = getStandardDemoTasks();
    setTasks(demoTasks);
    setSiteProfile(DEFAULT_SITE_PROFILE);
    setConditionsChanged(false);
    setReplayingDecisionId(null);
    const windows = generateHourlyEnvironmentalWindows(DEFAULT_SITE_PROFILE.currentAQI, DEFAULT_SITE_PROFILE.grapStage);
    setEnvironmentalWindows(windows);
    const result = runDeterministicScheduler(demoTasks, windows, DEFAULT_SITE_PROFILE);
    setReplanResult(result);
    showToast(language === 'hi' ? 'डेमो योजना पुनः स्थापित की गई।' : 'Demo scenario reset to Tower B commercial site benchmark.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        t,
        activeNav,
        setActiveNav,
        siteProfile,
        setSiteProfile,
        sitesList: SITES_LIST,
        environmentalWindows,
        tasks,
        setTasks,
        replanResult,
        setReplanResult,
        decisionLogs,
        addDecisionLog,
        executeReplan,
        selectTaskAction,
        replayDecision,
        replayingDecisionId,
        clearReplay,
        conditionsChanged,
        triggerConditionsChanged,
        reevaluatePlan,
        judgeMode,
        toggleJudgeMode,
        isOptimizing,
        toastMessage,
        showToast,
        resetToDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
