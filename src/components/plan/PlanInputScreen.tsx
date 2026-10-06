import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { parseWorkPlanPrompt } from '@/lib/bedrockParser';
import { TaskReviewGrid } from './TaskReviewGrid';
import { Sparkles, Bot, ArrowRight, Wand2, RefreshCw } from 'lucide-react';

export function PlanInputScreen() {
  const { tasks, setTasks, executeReplan, isOptimizing, showToast } = useApp();

  const [promptText, setPromptText] = useState(
    'Tomorrow morning 8 workers will do plastering on Tower B from 11 AM. Bulk cement and sand unloading is planned at 10 AM with 6 workers. After lunch 6 workers will do electrical wiring in the basement. Scaffolding safety inspection is set for 1 PM with 2 supervisors. Podium housekeeping with 4 workers at 2 PM.'
  );

  const [isParsing, setIsParsing] = useState(false);
  const [parserMeta, setParserMeta] = useState<{ source: string; latency: number } | null>({
    source: 'Amazon Bedrock (Claude 3.5 Sonnet / Resilient Parser)',
    latency: 280
  });

  const presetPlans = [
    {
      title: 'Benchmark Demo Plan (Tower B Commercial)',
      text: 'Tomorrow morning 8 workers will do plastering on Tower B from 11 AM. Bulk cement and sand unloading is planned at 10 AM with 6 workers. After lunch 6 workers will do electrical wiring in the basement. Scaffolding safety inspection is set for 1 PM with 2 supervisors. Podium housekeeping with 4 workers at 2 PM.'
    },
    {
      title: 'Excavation & Heavy Earthwork (GRAP Trigger)',
      text: '8 workers will do foundation excavation at North Gate from 9 AM. 6 workers will do outdoor plastering and mortar mixing at 11 AM. After lunch 4 workers will do interior conduit wiring.'
    },
    {
      title: 'Solar Exposure & Structural Concreting',
      text: '12 workers will pour concrete on open roof deck starting at 12 PM. 4 workers will do facade welding from 10 AM. 5 workers do basement equipment maintenance.'
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
      showToast(`Successfully extracted ${result.tasks.length} structured construction tasks!`, 'success');
    } catch {
      showToast('Error parsing text prompt. Reverting to deterministic template.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Natural Language Intake Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Natural Language Work-Plan Intake</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800">
                  Amazon Bedrock
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dictate or type raw shift instructions. AI extracts structured trades, crews, and duration.
              </p>
            </div>
          </div>

          {parserMeta && (
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span>{parserMeta.source} • {parserMeta.latency}ms</span>
            </div>
          )}
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Supervisor Daily Work Plan (Voice / Text Transcript)
          </label>
          <div className="relative">
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g., Tomorrow morning 8 workers will do plastering on Tower B from 9 AM. Material unloading at 11 AM..."
              className="w-full text-sm p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition leading-relaxed"
            />
          </div>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Load Demo Work-Plans:
          </div>
          <div className="flex flex-wrap gap-2">
            {presetPlans.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPromptText(preset.text)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition font-medium min-h-[36px]"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleParse}
            disabled={isParsing || !promptText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm disabled:opacity-50 min-h-[44px] cursor-pointer"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting Structured Tasks...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>GENERATE STRUCTURED PLAN</span>
              </>
            )}
          </button>

          <button
            onClick={() => executeReplan()}
            disabled={isOptimizing || tasks.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition shadow-md min-h-[44px] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>REPLAN MY DAY NOW</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Task Review and Manual Adjustment Section */}
      <TaskReviewGrid />
    </div>
  );
}
