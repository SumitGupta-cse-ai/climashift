import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { Settings, Sliders, Cpu, Languages } from 'lucide-react';

export function SettingsView() {
  const { siteProfile, setSiteProfile, sitesList, showToast, resetToDemo, language } = useApp();

  const [awsRegion, setAwsRegion] = useState('ap-south-1 (Mumbai)');
  const [bedrockModel, setBedrockModel] = useState('anthropic.claude-3-5-sonnet-20241022-v2:0');
  const [snsNotificationsEnabled, setSnsNotificationsEnabled] = useState(true);
  const [safetyThresholdAQI, setSafetyThresholdAQI] = useState(380);

  const handleSave = () => {
    showToast(
      language === 'hi' 
        ? 'साइट सेटिंग्स सफलतापूर्वक सहेज ली गई हैं।' 
        : 'Site operational parameters updated successfully.', 
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-500" />
            <span>{language === 'hi' ? 'साइट सेटिंग्स एवं पर्यावरण नियंत्रण' : 'Site Settings & Environmental Controls'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'मौसम डेटा स्रोत, कानूनी अधिकार क्षेत्र और AWS क्लाउड सेवाओं को कॉन्फ़िगर करें।'
              : 'Configure telemetry sources, regulatory jurisdiction thresholds, and AWS service integrations.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition shadow-xs cursor-pointer min-h-[44px]"
        >
          {language === 'hi' ? 'सेव करें' : 'Save Changes'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span>{language === 'hi' ? 'परिचालन सीमाएं एवं साइट प्रोफ़ाइल' : 'Operational Thresholds & Site Profile'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'hi' ? 'सक्रिय प्रोजेक्ट साइट' : 'Active Project Site'}
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
              {language === 'hi' ? 'कानूनी अधिकार क्षेत्र' : 'Regulatory Jurisdiction'}
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
              {language === 'hi' ? 'खुले में भारी कार्य के लिए AQI सीमा' : 'Heavy Outdoor Work AQI Action Threshold'}
            </label>
            <input
              type="number"
              value={safetyThresholdAQI}
              onChange={(e) => setSafetyThresholdAQI(parseInt(e.target.value, 10))}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {language === 'hi'
                ? 'डिफ़ॉल्ट: 380 AQI (गैर-छूट वाले बाहरी कार्यों पर रोक या समय परिवर्तन)।'
                : 'Default: 380 AQI (Mandates task shifting or suspension for non-exempt trades).'}
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'hi' ? 'भाषा (Language)' : 'Language'}
            </label>
            <div className="pt-0.5">
              <LanguageToggle />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'hi' ? 'थीम (दिखावट)' : 'Appearance & Theme'}
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
          <span>{language === 'hi' ? 'Amazon Bedrock और क्लाउड सेवाएं' : 'Amazon Bedrock & Cloud Integrations'}</span>
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
            <span className="font-bold text-slate-900 dark:text-white block">
              {language === 'hi' ? 'श्रमिकों को SMS ब्रॉडकास्ट (Amazon SNS)' : 'Amazon SNS Worker Broadcast Integration'}
            </span>
            <span className="text-[11px] text-slate-500">
              {language === 'hi' ? 'स्वीकृत कार्य शेड्यूल को श्रमिकों के फोन पर भेजने की अनुमति दें।' : 'Allow queued notification payloads to dispatch to site mobile endpoints.'}
            </span>
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
          <span className="font-bold text-slate-900 dark:text-white block">
            {language === 'hi' ? 'मानक डेमो वातावरण रीसेट करें' : 'Reset Benchmark Demo Environment'}
          </span>
          <span className="text-[11px] text-slate-500">
            {language === 'hi' ? 'टावर B के सभी मानक कार्यों और GRAP Stage III को पुनर्स्थापित करें।' : 'Restores standard Tower B Commercial site tasks and default GRAP Stage III conditions.'}
          </span>
        </div>

        <button
          onClick={resetToDemo}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[40px] cursor-pointer"
        >
          {language === 'hi' ? 'डेमो रीसेट करें' : 'Reset to Demo'}
        </button>
      </div>
    </div>
  );
}
