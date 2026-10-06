import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { Settings, Sliders, Palette, BellRing, Database, Scale, RotateCcw, Check, Sparkles } from 'lucide-react';

export function SettingsView() {
  const { siteProfile, setSiteProfile, sitesList, showToast, resetToDemo, language } = useApp();

  // General state
  const [workingHoursStart, setWorkingHoursStart] = useState('07:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('19:00');
  
  // Environmental data state
  const [refreshInterval, setRefreshInterval] = useState('15');
  const [safetyThresholdAQI, setSafetyThresholdAQI] = useState(380);
  
  // Notifications state
  const [requireExplicitSignOff, setRequireExplicitSignOff] = useState(true);
  const [snsNotificationsEnabled, setSnsNotificationsEnabled] = useState(true);
  
  // Track changes
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    setHasChanges(false);
    showToast(
      language === 'hi'
        ? 'सेटिंग्स सफलतापूर्वक सहेज ली गई हैं।'
        : 'Enterprise operational settings saved successfully.',
      'success'
    );
  };

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'साइट सेटिंग्स एवं परिचालन नियंत्रण' : 'Site Configuration & Policy Settings'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'कार्य सीमाएं, मौसम डेटा स्रोत और अधिसूचना प्राथमिकताएं कॉन्फ़िगर करें।'
              : 'Configure operational hours, statutory thresholds, telemetry sources, and notification rules.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition min-h-[38px] cursor-pointer shadow-subtle ${
            hasChanges
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
          }`}
        >
          {language === 'hi' ? 'सेव करें' : 'Save Changes'}
        </button>
      </div>

      {/* 1. GENERAL SECTION */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'सामान्य सेटिंग्स (General)' : '1. General Site Parameters'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'hi' ? 'सक्रिय निर्माण साइट' : 'Active Construction Project Site'}
            </label>
            <select
              value={siteProfile.id}
              onChange={(e) => {
                const s = sitesList.find(x => x.id === e.target.value);
                if (s) {
                  setSiteProfile(s);
                  markChanged();
                }
              }}
              className="w-full text-xs font-medium p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {sitesList.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'hi' ? 'कानूनी अधिकार क्षेत्र' : 'Statutory Jurisdiction'}
            </label>
            <input
              type="text"
              readOnly
              value={siteProfile.jurisdiction}
              className="w-full text-xs p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'hi' ? 'कार्य समय (Working Hours)' : 'Permitted Shift Window'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={workingHoursStart}
                onChange={(e) => { setWorkingHoursStart(e.target.value); markChanged(); }}
                className="w-full text-xs font-mono p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-slate-400">to</span>
              <input
                type="time"
                value={workingHoursEnd}
                onChange={(e) => { setWorkingHoursEnd(e.target.value); markChanged(); }}
                className="w-full text-xs font-mono p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'hi' ? 'भाषा (Language)' : 'Display Language'}
            </label>
            <div className="pt-0.5">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      {/* 2. APPEARANCE */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Palette className="w-4 h-4 text-purple-600" />
          <span>{language === 'hi' ? 'थीम एवं दिखावट (Appearance)' : '2. Appearance & Contrast'}</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {language === 'hi' ? 'डार्क / लाइट मोड चयन' : 'Theme Mode Selection'}
            </span>
            <span className="text-slate-500 text-[11px]">
              {language === 'hi' ? 'उच्च कंट्रास्ट के साथ स्क्रीन मोड चुनें।' : 'Select high-contrast dark, crisp light, or system preference.'}
            </span>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* 3. ENVIRONMENTAL DATA */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Database className="w-4 h-4 text-sky-600" />
          <span>{language === 'hi' ? 'पर्यावरणीय डेटा स्रोत (Environmental Data)' : '3. Environmental Data & Telemetry'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Telemetry Data Source
            </label>
            <input
              type="text"
              readOnly
              value={siteProfile.dataSource}
              className="w-full text-xs p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Telemetry Refresh Polling Interval
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => { setRefreshInterval(e.target.value); markChanged(); }}
              className="w-full text-xs p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="5">Every 5 minutes (Real-time)</option>
              <option value="15">Every 15 minutes (Standard)</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Hourly</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Outdoor Heavy Work AQI Alert Threshold
            </label>
            <input
              type="number"
              value={safetyThresholdAQI}
              onChange={(e) => { setSafetyThresholdAQI(parseInt(e.target.value, 10)); markChanged(); }}
              className="w-full text-xs font-mono p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 380 AQI.</span>
          </div>
        </div>
      </div>

      {/* 4. NOTIFICATIONS */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <BellRing className="w-4 h-4 text-amber-600" />
          <span>{language === 'hi' ? 'अधिसूचना एवं अनुमोदन (Notifications)' : '4. Worker Notification Rules'}</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Require Explicit Supervisor Sign-Off</span>
              <span className="text-[11px] text-slate-500">Prevent automated schedule shifts without human supervisor approval.</span>
            </div>
            <input
              type="checkbox"
              checked={requireExplicitSignOff}
              onChange={(e) => { setRequireExplicitSignOff(e.target.checked); markChanged(); }}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Amazon SNS Worker Broadcast Integration</span>
              <span className="text-[11px] text-slate-500">Enable queued SMS/WhatsApp dispatch preview upon supervisor approval.</span>
            </div>
            <input
              type="checkbox"
              checked={snsNotificationsEnabled}
              onChange={(e) => { setSnsNotificationsEnabled(e.target.checked); markChanged(); }}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 5. DEMO & BENCHMARK */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>{language === 'hi' ? 'डेमो व बेंचमार्क रीसेट (Demo Mode)' : '5. Demonstration & Benchmark Controls'}</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {language === 'hi' ? 'मानक टावर B परिदृश्य रीसेट करें' : 'Reset Standard Tower B Scenario'}
            </span>
            <span className="text-[11px] text-slate-500">
              {language === 'hi' ? 'मानक कार्य योजना और GRAP III परिस्थितियों को पुनर्स्थापित करें।' : 'Restores benchmark tasks (plastering, unloading, wiring) and GRAP Stage III conditions.'}
            </span>
          </div>

          <button
            onClick={resetToDemo}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
          >
            {language === 'hi' ? 'डेमो रीसेट करें' : 'Reset Demo Benchmark'}
          </button>
        </div>
      </div>
    </div>
  );
}
