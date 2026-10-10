import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { parseWorkPlanPrompt, checkAwsBedrockStatus, AwsBedrockStatus } from '@/lib/bedrockParser';
import { TaskReviewGrid } from './TaskReviewGrid';
import { Bot, ArrowRight, Wand2, RefreshCw, Sparkles, AlertCircle, RefreshCcw, Calendar, HardHat } from 'lucide-react';

export function PlanInputScreen() {
  const { tasks, setTasks, executeReplan, isOptimizing, showToast, t, language } = useApp();

  const [promptText, setPromptText] = useState(
    language === 'hi'
      ? 'कल सुबह 8 मजदूर टावर B पर 11 बजे प्लास्टर करेंगे। 10 बजे नॉर्थ गेट पर 6 मजदूर सीमेंट अनलोडिंग करेंगे। लंच के बाद बेसमेंट में 6 मजदूर बिजली की वायरिंग करेंगे।'
      : 'Tomorrow morning 8 workers will do exterior plastering on Tower B from 11 AM. Bulk cement unloading is planned at 10 AM with 6 workers. After lunch 6 workers will do electrical conduit work in the basement.'
  );

  const [isParsing, setIsParsing] = useState(false);
  const [awsStatus, setAwsStatus] = useState<AwsBedrockStatus | null>(null);
  const [isCheckingAws, setIsCheckingAws] = useState(false);
  const [parserMeta, setParserMeta] = useState<{
    source: string;
    isDemoFallback: boolean;
    latency?: number;
    statusMessage?: string;
  }>({
    source: 'Deterministic NLP Fallback',
    isDemoFallback: true,
    statusMessage: 'Ready to parse. AWS Bedrock status pending.'
  });

  const checkConnection = async () => {
    setIsCheckingAws(true);
    try {
      const status = await checkAwsBedrockStatus();
      setAwsStatus(status);
    } catch {
      setAwsStatus({
        configured: false,
        mode: 'demo_fallback',
        region: 'us-east-1',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        message: 'Demo / fallback mode — AWS Bedrock is not currently connected.'
      });
    } finally {
      setIsCheckingAws(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

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
        source: result.source === 'amazon-bedrock-claude' ? 'Amazon Bedrock (Claude Sonnet 4.6)' : 'Deterministic NLP Fallback',
        isDemoFallback: result.isDemoFallback,
        latency: result.parsingLatencyMs,
        statusMessage: result.statusMessage
      });

      if (result.isDemoFallback) {
        showToast(
          language === 'hi'
            ? `${result.tasks.length} कार्य निकाले गए (निर्धारक फॉलबैक मोड)`
            : `Amazon Bedrock in fallback mode — structured ${result.tasks.length} tasks via deterministic parser.`,
          'info'
        );
      } else {
        showToast(
          language === 'hi'
            ? `Amazon Bedrock द्वारा ${result.tasks.length} कार्य सफलतापूर्वक निकाले गए!`
            : `Amazon Bedrock extracted ${result.tasks.length} structured construction tasks!`,
          'success'
        );
      }
    } catch {
      showToast(
        language === 'hi'
          ? 'Amazon Bedrock अनुपलब्ध — निर्धारक फॉलबैक पार्सर का उपयोग किया जा रहा है।'
          : 'Amazon Bedrock unavailable — using deterministic fallback parser.',
        'warning'
      );
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'कार्य योजना इनपुट व पार्सर' : 'Work Plan Intake & Configuration'}
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#A7B2C1] mt-1">
            {language === 'hi' 
              ? 'पर्यवेक्षक वॉयस ट्रांसक्रिप्ट या टेक्स्ट दर्ज करें — क्लाइमाशिफ्ट कार्यों को संरचित करता है।'
              : 'Enter natural-language supervisor instructions or transcripts to parse and structure shift activities.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {awsStatus?.configured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#18A66A] border border-[#C3ECD8] dark:border-[#1E4B39]">
              <span className="w-2 h-2 rounded-full bg-[#18A66A] animate-pulse"></span>
              <span>AWS Bedrock: Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border border-[#FBE3B8] dark:border-[#4B3B24]">
              <span className="w-2 h-2 rounded-full bg-[#D99A24]"></span>
              <span>Demo / Fallback Mode</span>
            </span>
          )}

          <button
            onClick={checkConnection}
            disabled={isCheckingAws}
            className="p-2 rounded-lg bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] text-[#667085] dark:text-[#A7B2C1] hover:text-[#171A1F] dark:hover:text-[#F5F7FA] transition cursor-pointer"
            title="Recheck AWS Bedrock connection"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isCheckingAws ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Natural Language Prompt Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#E4E7EC] dark:border-[#26384C] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center text-[#16B878]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">
                {t.planIntakeTitle}
              </h2>
              <p className="text-xs text-[#667085] dark:text-[#A7B2C1]">
                {t.planIntakeSubtitle}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border border-[#E4E7EC] dark:border-[#26384C]">
            Natural Language AI Intake
          </span>
        </div>

        {/* Truthful Connection Notice Banner if in fallback */}
        {!awsStatus?.configured && (
          <div className="p-3.5 rounded-lg bg-[#FEF7EB] dark:bg-[#2C2214]/60 border border-[#FBE3B8] dark:border-[#4B3B24] text-xs text-[#171A1F] dark:text-[#F5F7FA] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#D99A24] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold text-[#D99A24] dark:text-[#F59E0B]">DEMO / FALLBACK MODE:</strong> Amazon Bedrock is operating in local demonstration mode. Work plans are parsed via ClimaShift&apos;s deterministic NLP engine. When deployed on AWS with IAM role permissions, requests flow natively to Amazon Bedrock (Claude 3.5 Sonnet).
            </div>
          </div>
        )}

        {/* Transcript Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#667085] dark:text-[#A7B2C1] uppercase tracking-wider block">
            {t.supervisorTranscriptLabel}
          </label>
          <textarea
            rows={4}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="e.g., Tomorrow morning 8 workers will do exterior plastering on Tower B. After lunch they will do electrical conduit work in the basement."
            className="w-full text-sm p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] text-[#171A1F] dark:text-[#F5F7FA] placeholder:text-[#667085] dark:placeholder:text-[#667085] focus:outline-none focus:border-[#16B878] focus:ring-1 focus:ring-[#16B878] leading-relaxed transition"
          />
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-[#667085] dark:text-[#A7B2C1] uppercase tracking-wider">{t.loadDemoPlans}:</span>
          {presetPlans.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setPromptText(preset.text)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#F7F8FA] dark:bg-[#122235] hover:bg-[#E4E7EC] dark:hover:bg-[#1B2E46] text-[#171A1F] dark:text-[#F5F7FA] border border-[#E4E7EC] dark:border-[#26384C] transition font-medium cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Action Controls & Engine Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E4E7EC] dark:border-[#26384C]">
          <div className="flex items-center gap-2 text-xs text-[#667085] dark:text-[#A7B2C1]">
            <span className="font-medium">{parserMeta.source}</span>
            {parserMeta.latency !== undefined && (
              <span className="font-mono">• {parserMeta.latency}ms</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleParse}
              disabled={isParsing || !promptText.trim()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-xs text-[#171A1F] dark:text-[#F5F7FA] bg-[#F7F8FA] dark:bg-[#122235] hover:bg-[#E4E7EC] dark:hover:bg-[#1B2E46] border border-[#E4E7EC] dark:border-[#26384C] transition cursor-pointer min-h-[40px] disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.extractingBtn}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-[#667085] dark:text-[#A7B2C1]" />
                  <span>{t.generatePlanBtn}</span>
                </>
              )}
            </button>

            <button
              onClick={() => executeReplan()}
              disabled={isOptimizing || tasks.length === 0}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs text-white bg-[#16B878] hover:bg-[#139c65] transition shadow-sm min-h-[40px] cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.replanMyDay}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Structured Task Review Component */}
      <TaskReviewGrid />
    </div>
  );
}
