import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { Settings, Sliders, Palette, BellRing, Database, Scale, RotateCcw, Check, Sparkles, Building, Clock, Globe } from 'lucide-react';

export function SettingsView() {
  const { siteProfile, setSiteProfile, sitesList, showToast, resetToDemo, language } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'telemetry' | 'notifications' | 'demo'>('general');

  // General state
  const [workingHoursStart, setWorkingHoursStart] = useState('07:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('19:00');
  
  // Environmental data state
  const [refreshInterval, setRefreshInterval] = useState('15');
  const [safetyThresholdAQI, setSafetyThresholdAQI] = useState(380);
  
  // Notifications state
  const [requireExplicitSignOff, setRequireExplicitSignOff] = useState(true);
  const [snsNotificationsEnabled, setSNSNotificationsEnabled] = useState(true);
  
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

  const navItems = [
    { id: 'general', label: language === 'hi' ? 'सामान्य पैरामीटर' : 'General Site Parameters', icon: Sliders },
    { id: 'appearance', label: language === 'hi' ? 'दिखावट एवं भाषा' : 'Appearance & Language', icon: Palette },
    { id: 'telemetry', label: language === 'hi' ? 'पर्यावरणीय टेलीमेट्री' : 'Environmental Telemetry', icon: Database },
    { id: 'notifications', label: language === 'hi' ? 'अधिसूचना एवं अनुमोदन' : 'Notifications & Sign-Off', icon: BellRing },
    { id: 'demo', label: language === 'hi' ? 'डेमो सैंडबॉक्स' : 'Demo & Benchmarks', icon: RotateCcw }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'साइट सेटिंग्स एवं परिचालन नियंत्रण' : 'Site Configuration & Policy Settings'}
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#A7B2C1] mt-1">
            {language === 'hi'
              ? 'कार्य सीमाएं, मौसम डेटा स्रोत और अधिसूचना प्राथमिकताएं कॉन्फ़िगर करें।'
              : 'Configure operational shift windows, statutory thresholds, telemetry cadence, and human sign-off policies.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition min-h-[40px] shadow-sm cursor-pointer ${
            hasChanges
              ? 'bg-[#16B878] hover:bg-[#139c65] text-white'
              : 'bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] cursor-not-allowed border border-[#E4E7EC] dark:border-[#26384C]'
          }`}
        >
          {language === 'hi' ? 'सेव करें' : 'Save Changes'}
        </button>
      </div>

      {/* Two-Column Enterprise Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Navigation Column */}
        <div className="md:col-span-4 space-y-1.5">
          <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-2 shadow-sm space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border border-[#C3ECD8] dark:border-[#1E4B39]'
                      : 'text-[#667085] dark:text-[#A7B2C1] hover:bg-[#F7F8FA] dark:hover:bg-[#122235] hover:text-[#171A1F] dark:hover:text-[#F5F7FA]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] text-xs space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-[#667085] dark:text-[#A7B2C1]">Active Profile</span>
            <div className="space-y-1">
              <div className="font-semibold text-[#171A1F] dark:text-[#F5F7FA]">{siteProfile.name}</div>
              <div className="text-[#667085] dark:text-[#A7B2C1] font-mono text-[11px]">{siteProfile.jurisdiction}</div>
              <div className="text-[#16B878] font-bold text-[11px] uppercase">{siteProfile.grapStage.replace('_', ' ')} ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Right Settings Form Column */}
        <div className="md:col-span-8">
          {/* TAB 1: GENERAL PARAMETERS */}
          {activeTab === 'general' && (
            <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-6 shadow-sm space-y-5">
              <div className="border-b border-[#E4E7EC] dark:border-[#26384C] pb-3">
                <h2 className="text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">General Site Parameters</h2>
                <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">Project identification, operational shift hours, and statutory location.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] block mb-1.5">
                    Active Construction Project Site
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
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  >
                    {sitesList.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] block mb-1.5">
                    Statutory Jurisdiction & Authority
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={siteProfile.jurisdiction}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] cursor-not-allowed font-medium font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] block mb-1.5">
                    Permitted Daily Shift Window
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={workingHoursStart}
                      onChange={(e) => { setWorkingHoursStart(e.target.value); markChanged(); }}
                      className="w-full text-xs font-mono p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                    />
                    <span className="text-[#667085] text-xs">to</span>
                    <input
                      type="time"
                      value={workingHoursEnd}
                      onChange={(e) => { setWorkingHoursEnd(e.target.value); markChanged(); }}
                      className="w-full text-xs font-mono p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE & LANGUAGE */}
          {activeTab === 'appearance' && (
            <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-6 shadow-sm space-y-5">
              <div className="border-b border-[#E4E7EC] dark:border-[#26384C] pb-3">
                <h2 className="text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">Appearance & Language</h2>
                <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">High-contrast visual themes and localized bilingual display.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C]">
                  <div>
                    <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA] block">Display Language (Bilingual)</span>
                    <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Switch between English and Hindi for supervisors and crew.</span>
                  </div>
                  <LanguageToggle />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C]">
                  <div>
                    <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA] block">Theme Mode Selection</span>
                    <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Select high-contrast dark mode or clean enterprise light mode.</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENVIRONMENTAL TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-6 shadow-sm space-y-5">
              <div className="border-b border-[#E4E7EC] dark:border-[#26384C] pb-3">
                <h2 className="text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">Environmental Telemetry</h2>
                <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">Station ingestion sources, polling frequency, and site thresholds.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] block mb-1.5">
                    Telemetry Ingestion Source
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={siteProfile.dataSource}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] block mb-1.5">
                    Sensor Polling Refresh Frequency
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => { setRefreshInterval(e.target.value); markChanged(); }}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  >
                    <option value="5">Every 5 minutes (Real-time)</option>
                    <option value="15">Every 15 minutes (Standard)</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Hourly</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] block mb-1.5">
                    Site Operational AQI Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={safetyThresholdAQI}
                    onChange={(e) => { setSafetyThresholdAQI(parseInt(e.target.value, 10)); markChanged(); }}
                    className="w-full sm:w-64 text-xs font-mono p-2.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  />
                  <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1] mt-1 block">
                    Default: 380 AQI. Operational alert threshold configured by supervisor; does not alter statutory CAQM classifications.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS & SIGN-OFF */}
          {activeTab === 'notifications' && (
            <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-6 shadow-sm space-y-5">
              <div className="border-b border-[#E4E7EC] dark:border-[#26384C] pb-3">
                <h2 className="text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">Worker Notification & Sign-Off Rules</h2>
                <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">Control automated broadcasts and mandatory supervisor sign-off requirements.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C]">
                  <div>
                    <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA] block">Require Explicit Supervisor Sign-Off</span>
                    <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Never dispatch automated shift alterations without human sign-off.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireExplicitSignOff}
                    onChange={(e) => { setRequireExplicitSignOff(e.target.checked); markChanged(); }}
                    className="w-4 h-4 rounded text-[#16B878] focus:ring-[#16B878] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C]">
                  <div>
                    <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA] block">Worker Advisory Broadcast Preview (Amazon SNS Ready)</span>
                    <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Generate copyable SMS/WhatsApp shift advisory preview upon supervisor sign-off.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={snsNotificationsEnabled}
                    onChange={(e) => { setSNSNotificationsEnabled(e.target.checked); markChanged(); }}
                    className="w-4 h-4 rounded text-[#16B878] focus:ring-[#16B878] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEMO & BENCHMARKS */}
          {activeTab === 'demo' && (
            <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-6 shadow-sm space-y-5">
              <div className="border-b border-[#E4E7EC] dark:border-[#26384C] pb-3">
                <h2 className="text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">Demonstration & Benchmark Controls</h2>
                <p className="text-xs text-[#667085] dark:text-[#A7B2C1] mt-0.5">Reset simulator state to standard hackathon presentation scenarios.</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-xs">
                <div>
                  <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA] block">
                    Reset Standard Tower B Benchmark
                  </span>
                  <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1] mt-0.5 block">
                    Restores benchmark shift tasks (plastering, unloading, wiring) and GRAP Stage III conditions.
                  </span>
                </div>

                <button
                  onClick={resetToDemo}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#171A1F] dark:text-[#F5F7FA] border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#122235] hover:bg-[#E4E7EC] dark:hover:bg-[#1B2E46] transition cursor-pointer shrink-0 min-h-[38px]"
                >
                  Reset Demo Benchmark
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
