import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { checkAwsBedrockStatus, AwsBedrockStatus } from '@/lib/bedrockParser';
import { 
  Cpu, 
  Server, 
  Globe, 
  ShieldCheck, 
  ArrowDown, 
  Layers, 
  Cloud,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  FileCode2,
  Code2,
  HardHat,
  Database,
  BellRing,
  CalendarCheck
} from 'lucide-react';

export function AwsArchitectureView() {
  const { language } = useApp();
  const [awsStatus, setAwsStatus] = useState<AwsBedrockStatus | null>(null);

  useEffect(() => {
    checkAwsBedrockStatus().then(status => setAwsStatus(status));
  }, []);

  const isBedrockLive = Boolean(awsStatus?.configured);

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A1F] dark:text-[#F5F7FA]">
            {language === 'hi' ? 'AWS क्लाउड सिस्टम आर्किटेक्चर' : 'AWS Cloud Architecture & Authenticity Audit'}
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#A7B2C1] mt-1">
            {language === 'hi'
              ? 'नियंत्रित AI निर्णय सीमा (Controlled AI Decision Boundary) के साथ सुरक्षित AWS सेवा पृथक्करण।'
              : 'Truthful cloud architecture decoupling AI understanding from deterministic safety decisions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBedrockLive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#18A66A] border border-[#C3ECD8] dark:border-[#1E4B39]">
              <span className="w-2 h-2 rounded-full bg-[#18A66A] animate-pulse"></span>
              <span>Amazon Bedrock: Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border border-[#FBE3B8] dark:border-[#4B3B24]">
              <span className="w-2 h-2 rounded-full bg-[#D99A24]"></span>
              <span>Bedrock: Demo / Fallback Mode</span>
            </span>
          )}
        </div>
      </div>

      {/* THREE PILLARS: BEDROCK (UNDERSTAND) → ENGINE (DECIDE) → SUPERVISOR (APPROVE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2F80ED]">
              1. BEDROCK = UNDERSTAND
            </span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#EDF5FF] dark:bg-[#10243E] text-[#2F80ED] border border-[#CCE2FF] dark:border-[#1E3A5F]">
              AWS AI Service
            </span>
          </div>
          <p className="text-[#667085] dark:text-[#A7B2C1] leading-relaxed text-xs">
            Natural-language work description parsing only. Extracts duration, crew size, trade category, and location. <strong className="text-[#171A1F] dark:text-[#F5F7FA] font-medium">Bedrock does NOT make final safety or regulatory decisions.</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#16B878]">
              2. CLIMASHIFT = DECIDE
            </span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border border-[#C3ECD8] dark:border-[#1E4B39]">
              Application Logic
            </span>
          </div>
          <p className="text-[#667085] dark:text-[#A7B2C1] leading-relaxed text-xs">
            Deterministic constraint solver applying linear risk minimization, CAQM GRAP stage curbs, diurnal solar peaks, and dependency chains. <strong className="text-[#171A1F] dark:text-[#F5F7FA] font-medium">Controlled AI Decision Boundary.</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D99A24]">
              3. SUPERVISOR = APPROVE
            </span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border border-[#FBE3B8] dark:border-[#4B3B24]">
              Human-in-the-Loop
            </span>
          </div>
          <p className="text-[#667085] dark:text-[#A7B2C1] leading-relaxed text-xs">
            Human site supervisor reviews explainable reasoning, adjusts operational constraints, and provides explicit supervisor approval before shift dispatch.
          </p>
        </div>
      </div>

      {/* AUTHENTIC VISUAL FLOWCHART */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="border-b border-[#E4E7EC] dark:border-[#26384C] pb-3.5 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#171A1F] dark:text-[#F5F7FA] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#16B878]" />
            <span>End-to-End Operational Decision Architecture</span>
          </h2>
          <span className="text-xs font-mono text-[#667085] dark:text-[#A7B2C1]">Verified Target Topology</span>
        </div>

        {/* STEP 1: SUPERVISOR */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#FFFFFF] dark:bg-[#122235] text-[#171A1F] dark:text-[#F5F7FA] border border-[#E4E7EC] dark:border-[#26384C]">
                <HardHat className="w-4 h-4 text-[#16B878]" />
              </div>
              <div>
                <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA] block">Construction Site Supervisor</span>
                <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Inputs spoken or raw text shift instructions</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border border-[#E4E7EC] dark:border-[#26384C]">
              USER
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#667085] my-2" />

          {/* STEP 2: CLIMASHIFT FRONTEND / AWS AMPLIFY */}
          <div className="w-full max-w-xl p-3.5 rounded-lg border border-[#CCE2FF] dark:border-[#1E3A5F] bg-[#EDF5FF]/50 dark:bg-[#10243E]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#EDF5FF] dark:bg-[#10243E] text-[#2F80ED]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA]">ClimaShift Frontend</span>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#EDF5FF] dark:bg-[#10243E] text-[#2F80ED] border border-[#CCE2FF] dark:border-[#1E3A5F]">
                    AWS AMPLIFY
                  </span>
                </div>
                <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Next.js 14 App Router, Tailwind CSS, Bilingual UI</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border border-[#C3ECD8] dark:border-[#1E4B39]">
              DEPLOYMENT READY
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#667085] my-2" />

          {/* STEP 3: API GATEWAY */}
          <div className="w-full max-w-xl p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#FFFFFF] dark:bg-[#122235] text-[#2F80ED] border border-[#E4E7EC] dark:border-[#26384C]">
                <FileCode2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA]">Amazon API Gateway</span>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#EDF5FF] dark:bg-[#10243E] text-[#2F80ED] border border-[#CCE2FF] dark:border-[#1E3A5F]">
                    AWS SERVICE
                  </span>
                </div>
                <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1] font-mono">POST /api/parse-work-plan</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#EDF5FF] dark:bg-[#10243E] text-[#2F80ED] border border-[#CCE2FF] dark:border-[#1E3A5F]">
              CONFIGURED
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#667085] my-2" />

          {/* STEP 4: AWS LAMBDA */}
          <div className="w-full max-w-xl p-3.5 rounded-lg border border-[#FBE3B8] dark:border-[#4B3B24] bg-[#FEF7EB]/50 dark:bg-[#2C2214]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA]">AWS Lambda Microservice</span>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] border border-[#FBE3B8] dark:border-[#4B3B24]">
                    AWS SERVICE
                  </span>
                </div>
                <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Node.js 20.x, validation & Bedrock SDK invocation</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] border border-[#FBE3B8] dark:border-[#4B3B24]">
              LOCAL / SAM READY
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#667085] my-2" />

          {/* STEP 5: AMAZON BEDROCK */}
          <div className="w-full max-w-xl p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#FFFFFF] dark:bg-[#122235] text-[#2F80ED] border border-[#E4E7EC] dark:border-[#26384C]">
                <Cpu className="w-4 h-4 text-[#16B878]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA]">Amazon Bedrock</span>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border border-[#C3ECD8] dark:border-[#1E4B39]">
                    AWS SERVICE
                  </span>
                </div>
                <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1] font-mono">Anthropic Claude 3.5 Sonnet</span>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
              isBedrockLive 
                ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border-[#C3ECD8] dark:border-[#1E4B39]' 
                : 'bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border-[#FBE3B8] dark:border-[#4B3B24]'
            }`}>
              {isBedrockLive ? 'CONNECTED' : 'DEMO / FALLBACK'}
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#667085] my-2" />

          {/* STEP 6: CLIMASHIFT DETERMINISTIC SCHEDULING ENGINE */}
          <div className="w-full max-w-xl p-4 rounded-lg border border-[#C3ECD8] dark:border-[#1E4B39] bg-[#EBF8F2]/60 dark:bg-[#0E3A31]/40 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#16B878] text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#171A1F] dark:text-[#F5F7FA]">ClimaShift Scheduling Engine</span>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#16B878] text-white">
                    CORE LOGIC
                  </span>
                </div>
                <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Linear risk minimization, CAQM curbs, solar avoidance</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#16B878] text-white">
              ACTIVE
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#667085] my-2" />

          {/* STEP 7: OPTIMIZED WORK PLAN */}
          <div className="w-full max-w-xl p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#FFFFFF] dark:bg-[#122235] text-[#171A1F] dark:text-[#F5F7FA] border border-[#E4E7EC] dark:border-[#26384C]">
                <CalendarCheck className="w-4 h-4 text-[#16B878]" />
              </div>
              <div>
                <span className="font-semibold text-xs text-[#171A1F] dark:text-[#F5F7FA] block">Optimized Work Plan</span>
                <span className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">Explainable schedule, impact metrics & supervisor sign-off</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border border-[#C3ECD8] dark:border-[#1E4B39]">
              OUTPUT
            </span>
          </div>
        </div>
      </div>

      {/* SERVICE STATUS AUDIT TABLE */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-[#171A1F] dark:text-[#F5F7FA] uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#16B878]" />
          <span>AWS Service Implementation & Truthful Status Audit</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C]/60 text-[#667085] dark:text-[#A7B2C1] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">AWS Service</th>
                <th className="py-3 px-4">Product Responsibility</th>
                <th className="py-3 px-4">Implementation Artifact</th>
                <th className="py-3 px-4">Truthful Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC] dark:divide-[#26384C]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#2F80ED]" />
                  <span>Amazon Bedrock</span>
                </td>
                <td className="py-3 px-4 text-[#667085] dark:text-[#A7B2C1]">Natural-language work description structuring (Claude 3.5 Sonnet)</td>
                <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#A7B2C1] text-[11px]">@aws-sdk/client-bedrock-runtime</td>
                <td className="py-3 px-4">
                  <span className={`inline-block font-mono font-bold text-[10px] px-2 py-0.5 rounded border ${
                    isBedrockLive 
                      ? 'bg-[#EBF8F2] dark:bg-[#0E3A31] text-[#16B878] border-[#C3ECD8] dark:border-[#1E4B39]' 
                      : 'bg-[#FEF7EB] dark:bg-[#2C2214] text-[#D99A24] dark:text-[#F59E0B] border-[#FBE3B8] dark:border-[#4B3B24]'
                  }`}>
                    {isBedrockLive ? 'CONNECTED' : 'DEMO / FALLBACK'}
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#D99A24]" />
                  <span>AWS Lambda</span>
                </td>
                <td className="py-3 px-4 text-[#667085] dark:text-[#A7B2C1]">Serverless task intake handler with input validation</td>
                <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#A7B2C1] text-[11px]">lambda/parseWorkPlan/index.mjs</td>
                <td className="py-3 px-4">
                  <span className="inline-block font-mono font-medium text-[10px] px-2 py-0.5 rounded border bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border-[#E4E7EC] dark:border-[#26384C]">
                    LOCAL / SAM READY
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#2F80ED]" />
                  <span>Amazon API Gateway</span>
                </td>
                <td className="py-3 px-4 text-[#667085] dark:text-[#A7B2C1]">REST endpoint contract and routing for task parsing</td>
                <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#A7B2C1] text-[11px]">template.yaml / POST /api/parse-work-plan</td>
                <td className="py-3 px-4">
                  <span className="inline-block font-mono font-medium text-[10px] px-2 py-0.5 rounded border bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border-[#E4E7EC] dark:border-[#26384C]">
                    LOCAL / SAM READY
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#16B878]" />
                  <span>AWS Amplify Hosting</span>
                </td>
                <td className="py-3 px-4 text-[#667085] dark:text-[#A7B2C1]">Full-stack Next.js 14 web application hosting & continuous deployment</td>
                <td className="py-3 px-4 font-mono text-[#667085] dark:text-[#A7B2C1] text-[11px]">amplify.yml</td>
                <td className="py-3 px-4">
                  <span className="inline-block font-mono font-medium text-[10px] px-2 py-0.5 rounded border bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] border-[#E4E7EC] dark:border-[#26384C]">
                    LOCAL / AMPLIFY.YML READY
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FUTURE / OPTIONAL SERVICES */}
      <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] dark:border-[#26384C] pb-3">
          <h2 className="text-xs font-bold text-[#667085] dark:text-[#A7B2C1] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Planned Enterprise Enhancements (Not Claimed in Current Scope)</span>
          </h2>
          <span className="text-[10px] font-mono text-[#667085]">Future Roadmap</span>
        </div>

        <p className="text-xs text-[#667085] dark:text-[#A7B2C1] leading-relaxed">
          The following services were evaluated for enterprise scale and are planned for post-hackathon deployment. To maintain 100% engineering integrity, they are <strong className="font-semibold text-[#171A1F] dark:text-[#F5F7FA]">NOT claimed as currently active</strong> in the MVP:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#667085]" />
                <span>Amazon DynamoDB</span>
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#FFFFFF] dark:bg-[#122235] text-[#667085] border border-[#E4E7EC] dark:border-[#26384C]">
                NOT IMPLEMENTED
              </span>
            </div>
            <p className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">
              Planned for immutable multi-year audit log storage across general contractor enterprise accounts.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-[#667085]" />
                <span>Amazon SNS</span>
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#FFFFFF] dark:bg-[#122235] text-[#667085] border border-[#E4E7EC] dark:border-[#26384C]">
                NOT IMPLEMENTED
              </span>
            </div>
            <p className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">
              Planned for automated SMS/WhatsApp batch delivery directly to worker mobile devices upon supervisor sign-off.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#171A1F] dark:text-[#F5F7FA] flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-[#667085]" />
                <span>Amazon EventBridge</span>
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#FFFFFF] dark:bg-[#122235] text-[#667085] border border-[#E4E7EC] dark:border-[#26384C]">
                NOT USED
              </span>
            </div>
            <p className="text-[11px] text-[#667085] dark:text-[#A7B2C1]">
              Planned for recurring hourly cron polling of official CPCB/IMD environmental feeds and CAQM gazette updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
