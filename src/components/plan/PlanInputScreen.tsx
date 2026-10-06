import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { parseWorkPlanPrompt } from '@/lib/bedrockParser';
import { TaskReviewGrid } from './TaskReviewGrid';
import { Bot, ArrowRight, Wand2, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

export function PlanInputScreen() {
  const { tasks, setTasks, executeReplan, isOptimizing, showToast, t, language } = useApp();

  const [promptText, setPromptText] = useState(
    language === 'hi'
      ? 'कल सुबह 8 मजदूर टावर B पर 11 बजे प्लास्टर करेंगे। 10 बजे नॉर्थ गेट पर 6 मजदूर सीमेंट अनलोडिंग करेंगे। लंच के बाद बेसमेंट में 6 मजदूर बिजली की वायरिंग करेंगे।'
      : 'Tomorrow morning 8 workers will do exterior plastering on Tower B from 11 AM. Bulk cement unloading is planned at 10 AM with 6 workers. After lunch 6 workers will do electrical conduit work in the basement.'
  );

  const [isParsing, setIsParsing] = useState(false);
  const [parserMeta, setParserMeta] = useState<{ source: string; latency: number } | null>({
    source: 'Amazon Bedrock (Claude 3.5 Sonnet)',
    latency: 280
  });

  const presetPlans = [
    {
      title: language === 'hi' ? 'मानक साइट डेमो' : 'Standard Tower B Demo',
      text: language === 'hi'
        ? 'कल सुबह 8 मजदूर टावर B पर 11 बजे प्लास्टर करेंगे। 10 बजे नॉर्थ गेट पर 6 मजदूर सीमेंट अनलोडिंग करेंगे। लंच के बाद बेसमेंट में 6 मजदूर बिजली की वायरिंग करेंगे।'
        : 'Tomorrow morning 8 workers will do exterior plastering on Tower B from 11 AM. Bulk cement unloading is planned at 10 AM with 6 workers. After lunch 6 workers will do electrical conduit work in the basement.'
    },
    {
      title: language === 'hi' ? 'खुदाई एवं GRAP प्रतिबंध' : 'Excavation & Dust Curbs',
      text: language === 'hi'
        ? 'कल 8 मजदूर सुबह 9 बजे नॉर्थ गेट पर नींव की खुदाई करेंगे। 11 बजे 6 मजदूर खुले में दीवार की पुट्टी करेंगे।'
        : '8 workers will do foundation excavation at North Gate from 9 AM. 6 workers will do outdoor plastering and wall putty at 11 AM.'
    },
    {
      title: language === 'hi' ? 'अत्यधिक गर्मी व ढलाई' : 'Extreme Heat Concreting',
      text: language === 'hi'
        ? 'दोपहर 12 बजे 12 मजदूर खुली छत पर कंक्रीट स्लैब डालेंगे। 4 मजदूर सुबह 10 बजे वेल्डिंग करेंगे।'
        : '12 workers will pour concrete on open roof deck starting at 12 PM. 4 workers will do structural welding from 10 AM.'
    }
  ];

  const handleParse = async () => {
    if (!promptText.trim()) return;
    setIsParsing(true);

    try {
      const result = await parseWorkPlanPrompt(promptText);
      setTasks(result.tasks);
      setParserMeta({
        source: result.source === 'amazon-bedrock-claude' ? 'Amazon Bedrock (Claude 3.5 Sonnet)' : 'Deterministic NLP Fallback Parser',
        latency: result.parsingLatencyMs
      });
      showToast(
        language === 'hi'
          ? `${result.tasks.length} कार्य योजना में दर्ज किए गए!`
          : `Extracted ${result.tasks.length} structured construction tasks!`,
        'success'
      );
    } catch {
      showToast('Error parsing text prompt. Reverting to deterministic template.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Natural Language Prompt Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{t.planIntakeTitle}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                AI Parser
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t.planIntakeSubtitle}
            </p>
          </div>

          {parserMeta && (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
              {parserMeta.source} • {parserMeta.latency}ms
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t.supervisorTranscriptLabel}
          </label>
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="e.g., Tomorrow morning 8 workers will do exterior plastering on Tower B. After lunch they will do electrical conduit work in the basement."
            className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
          />
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.loadDemoPlans}</span>
          {presetPlans.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setPromptText(preset.text)}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition font-medium cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleParse}
            disabled={isParsing || !promptText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 transition cursor-pointer min-h-[38px] disabled:opacity-50"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{t.extractingBtn}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.generatePlanBtn}</span>
              </>
            )}
          </button>

          <button
            onClick={() => executeReplan()}
            disabled={isOptimizing || tasks.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-subtle min-h-[38px] cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.replanMyDay}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Structured Task Review Component */}
      <TaskReviewGrid />
    </div>
  );
}
