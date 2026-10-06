'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, SiteProfile, ReplanResult, EnvironmentalWindow } from '@/types';
import { DEFAULT_SITE_PROFILE, SITES_LIST, generateHourlyEnvironmentalWindows } from '@/data/mockEnvironment';
import { getStandardDemoTasks } from '@/lib/bedrockParser';
import { runDeterministicScheduler } from '@/lib/schedulingEngine';
import { Language, translations, Translations } from '@/lib/i18n';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppNavView = 'dashboard' | 'plan' | 'replan' | 'activity' | 'architecture' | 'settings';

export interface DecisionLogEntry {
  id: string;
  timestamp: string;
  siteName: string;
  tasksCount: number;
  rescheduledCount: number;
  restrictedCount: number;
  highRiskHoursAvoided: number;
  status: 'Approved & Broadcasted' | 'Reviewed & Archived';
  supervisorNotes: string;
  replanSummary: ReplanResult;
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

  const addDecisionLog = (entry: DecisionLogEntry) => {
    const updated = [entry, ...decisionLogs];
    setDecisionLogs(updated);
    localStorage.setItem('climashift-logs', JSON.stringify(updated));
  };

  const resetToDemo = () => {
    const demoTasks = getStandardDemoTasks();
    setTasks(demoTasks);
    setSiteProfile(DEFAULT_SITE_PROFILE);
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
