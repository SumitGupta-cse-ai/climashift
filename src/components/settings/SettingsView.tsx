import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Settings, ShieldCheck, Cpu, Sliders, CheckCircle, Database } from 'lucide-react';

export function SettingsView() {
  const { siteProfile, setSiteProfile, sitesList, showToast, resetToDemo } = useApp();

  const [awsRegion, setAwsRegion] = useState('ap-south-1 (Mumbai)');
  const [bedrockModel, setBedrockModel] = useState('anthropic.claude-3-5-sonnet-20241022-v2:0');
  const [snsNotificationsEnabled, setSnsNotificationsEnabled] = useState(true);
  const [safetyThresholdAQI, setSafetyThresholdAQI] = useState(380);

  const handleSave = () => {
    showToast('Site operational parameters updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-500" />
            <span>Site Settings & Environmental Controls</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure telemetry sources, regulatory jurisdiction thresholds, and AWS service integrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition shadow-xs cursor-pointer min-h-[44px]"
        >
          Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span>Operational Thresholds & Site Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Active Project Site
            </label>
            <select
              value={siteProfile.id}
              onChange={(e) => {
                const s = sitesList.find(x => x.id === e.target.value);
                if (s) setSiteProfile(s);
              }}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {sitesList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Regulatory Jurisdiction
            </label>
            <input
              type="text"
              readOnly
              value={siteProfile.jurisdiction}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Heavy Outdoor Work AQI Action Threshold
            </label>
            <input
              type="number"
              value={safetyThresholdAQI}
              onChange={(e) => setSafetyThresholdAQI(parseInt(e.target.value, 10))}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default: 380 AQI (Mandates task shifting or suspension for non-exempt trades).
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Appearance & Theme
            </label>
            <div className="pt-0.5">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Cloud & AWS Services Configuration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-purple-500" />
          <span>Amazon Bedrock & Cloud Integrations</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              AWS Target Region
            </label>
            <input
              type="text"
              value={awsRegion}
              onChange={(e) => setAwsRegion(e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Bedrock Foundation Model
            </label>
            <input
              type="text"
              value={bedrockModel}
              onChange={(e) => setBedrockModel(e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Amazon SNS Worker Broadcast Integration</span>
            <span className="text-[11px] text-slate-500">Allow queued notification payloads to dispatch to site mobile endpoints.</span>
          </div>

          <input
            type="checkbox"
            checked={snsNotificationsEnabled}
            onChange={(e) => setSnsNotificationsEnabled(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Demo Reset Safety Button */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">Reset Benchmark Demo Environment</span>
          <span className="text-[11px] text-slate-500">Restores standard Tower B Commercial site tasks and default GRAP Stage III conditions.</span>
        </div>

        <button
          onClick={resetToDemo}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[40px]"
        >
          Reset to Demo
        </button>
      </div>
    </div>
  );
}
