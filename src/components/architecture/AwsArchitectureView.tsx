import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Cpu, 
  Server, 
  Database, 
  Radio, 
  BellRing, 
  ShieldCheck, 
  ArrowDown, 
  ArrowRight,
  Lock,
  Globe,
  Sparkles,
  Layers,
  Cloud
} from 'lucide-react';

export function AwsArchitectureView() {
  const { language } = useApp();
  const [activeHighlight, setActiveHighlight] = useState<'bedrock' | 'lambda' | 'dynamodb' | 'eventbridge' | 'sns' | null>(null);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'AWS क्लाउड सिस्टम आर्किटेक्चर' : 'AWS Cloud System Architecture'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'औद्योगिक सुरक्षा के लिए सर्वरलेस एवं शून्य-भ्रम (Zero Hallucination) आर्किटेक्चर।'
              : 'Production serverless architecture decoupling AI understanding from deterministic safety decisions.'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Deterministic Safety Separation</span>
        </div>
      </div>

      {/* THREE-TIER RESPONSIBILITY BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400 block">
            1. WHAT AI (BEDROCK) DOES
          </span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Natural-language task parsing and trade attribute structuring only. <strong>Zero final safety or legal decisions.</strong>
          </p>
        </div>

        <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 block">
            2. WHAT DETERMINISTIC ENGINE DOES
          </span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Linear constraint solver calculating exposure scores, evaluating CAQM GRAP curbs, and scheduling safe shifts.
          </p>
        </div>

        <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 block">
            3. WHAT AWS INFRASTRUCTURE DOES
          </span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Serverless execution (Lambda), immutable decision logs (DynamoDB), and worker broadcast dispatch (SNS).
          </p>
        </div>
      </div>

      {/* AUTHENTIC SYSTEM FLOWCHART DIAGRAM */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-card space-y-5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Layers className="w-4 h-4 text-slate-400" />
          <span>End-to-End Operational Decision Flow</span>
        </h3>

        {/* FLOW STAGE 1: INGESTION */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            [STAGE 1: WORK PLAN INGESTION]
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">Construction Site Supervisor</span>
              <span className="text-[11px] text-slate-500">Inputs spoken or raw text shift instructions.</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>Amazon API Gateway</span>
              </div>
              <span className="text-[11px] text-slate-500">SSL termination, rate limiting, and CORS inspection.</span>
            </div>

            <div 
              onMouseEnter={() => setActiveHighlight('bedrock')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`p-3 rounded-lg border text-xs transition cursor-pointer ${
                activeHighlight === 'bedrock' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 shadow-xs' 
                  : 'border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                <Cpu className="w-3.5 h-3.5" />
                <span>Amazon Bedrock (Claude 3.5 Sonnet)</span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Structures raw dictation into JSON tasks with duration & crew counts.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* FLOW STAGE 2: DETERMINISTIC OPTIMIZATION */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            [STAGE 2: CONSTRAINTS & DETERMINISTIC ENGINE]
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="font-semibold block text-[11px]">Telemetry Feeds</span>
              <span className="text-[10px] text-slate-500">Hourly AQI, PM2.5, Heat Index</span>
            </div>

            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="font-semibold block text-[11px]">Regulatory Rules</span>
              <span className="text-[10px] text-slate-500">CAQM GRAP Stage I–IV Orders</span>
            </div>

            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="font-semibold block text-[11px]">Task Precedence</span>
              <span className="text-[10px] text-slate-500">Duration & Trade Dependencies</span>
            </div>

            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="font-semibold block text-[11px]">Crew Capacities</span>
              <span className="text-[10px] text-slate-500">Shift Window 07:00–19:00</span>
            </div>
          </div>

          <div 
            onMouseEnter={() => setActiveHighlight('lambda')}
            onMouseLeave={() => setActiveHighlight(null)}
            className={`p-3.5 rounded-lg border text-xs text-center transition cursor-pointer ${
              activeHighlight === 'lambda' 
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-xs' 
                : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20'
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <Server className="w-4 h-4" />
              <span>AWS Lambda — Deterministic Optimization Solver Microservice</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 max-w-xl mx-auto">
              Executes linear risk minimization equation, filters restricted time windows, applies shift penalties, and yields the explainable before-vs-after schedule.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* FLOW STAGE 3: APPROVAL & NOTIFICATION */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            [STAGE 3: PERSISTENCE & WORKER NOTIFICATION]
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              onMouseEnter={() => setActiveHighlight('dynamodb')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`p-3 rounded-lg border text-xs transition cursor-pointer ${
                activeHighlight === 'dynamodb' 
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 shadow-xs' 
                  : 'border-sky-200 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300">
                <Database className="w-3.5 h-3.5" />
                <span>Amazon DynamoDB</span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Immutable audit store recording supervisor sign-off, decision timestamp, and telemetry snapshots.
              </span>
            </div>

            <div 
              onMouseEnter={() => setActiveHighlight('sns')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`p-3 rounded-lg border text-xs transition cursor-pointer ${
                activeHighlight === 'sns' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs' 
                  : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <BellRing className="w-3.5 h-3.5" />
                <span>Amazon SNS</span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Multi-channel broadcast topic delivering approved schedule notifications to site mobile endpoints.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT SECTION: WHY AWS? */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Cloud className="w-4 h-4 text-emerald-600" />
          <span>Why AWS for ClimaShift?</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Amazon Bedrock</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Extracts messy supervisor voice transcripts into typed data with enterprise data privacy.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">AWS Lambda</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Serverless execution of the linear solver with sub-second response times and zero server maintenance.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Amazon DynamoDB</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides millisecond latency and point-in-time recovery for legal compliance and decision records.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Amazon EventBridge</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Orchestrates hourly automated syncing of official environmental stations and CAQM rule updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
