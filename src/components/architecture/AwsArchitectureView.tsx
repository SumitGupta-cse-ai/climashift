import React, { useState } from 'react';
import { 
  Cpu, 
  Cloud, 
  Server, 
  Database, 
  Radio, 
  BellRing, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

export function AwsArchitectureView() {
  const [selectedService, setSelectedService] = useState<string>('bedrock');

  const awsServices = [
    {
      id: 'bedrock',
      name: 'Amazon Bedrock',
      role: 'Generative AI Foundation Model Ingestion',
      icon: Cpu,
      color: 'purple',
      headline: 'Natural Language Work-Plan Understanding',
      whyUsed: 'Decoupled AI engine specifically responsible for unstructured trade transcription and attribute parsing without hallucinating safety constraints.',
      implementation: 'Claude 3.5 Sonnet / AWS Bedrock Runtime Invoke API with deterministic JSON schema validation.',
      security: 'IAM role-based invocation, no prompt caching or model training on customer PII.'
    },
    {
      id: 'lambda',
      name: 'AWS Lambda',
      role: 'Serverless Deterministic Solver & Business Logic',
      icon: Server,
      color: 'amber',
      headline: 'Deterministic Optimization & Constraint Engine',
      whyUsed: 'Stateless, zero-cold-start microservices executing the linear constraint optimization model against hourly AQI and heat indexes.',
      implementation: 'Node.js / Python serverless functions wrapped in strict TypeScript types.',
      security: 'VPC private subnet deployment with Least-Privilege IAM execution roles.'
    },
    {
      id: 'apigateway',
      name: 'Amazon API Gateway',
      role: 'Secure Enterprise REST & WebSocket API',
      icon: Globe,
      color: 'sky',
      headline: 'Managed API Ingestion & Rate Throttling',
      whyUsed: 'Provides managed SSL termination, rate limiting, and CORS validation between supervisor mobile/web frontends and Lambda engines.',
      implementation: 'HTTP APIs with JWT Authorizer and WAF inspection rules.',
      security: 'AWS WAF token validation against DDoS and SQLi attacks.'
    },
    {
      id: 'dynamodb',
      name: 'Amazon DynamoDB',
      role: 'Single-Digit Millisecond Audit & Plan Store',
      icon: Database,
      color: 'blue',
      headline: 'Permanent Supervisor Decision & Compliance Log',
      whyUsed: 'High-availability NoSQL database maintaining an immutable audit log of regulatory evaluations, approved schedules, and broadcast timestamps.',
      implementation: 'Partition Key: SiteId, Sort Key: Timestamp/DecisionId with point-in-time recovery (PITR).',
      security: 'KMS-managed customer master encryption keys (CMK) at rest.'
    },
    {
      id: 'eventbridge',
      name: 'Amazon EventBridge',
      role: 'Statutory Telemetry Cron & Rules Sync',
      icon: Radio,
      color: 'rose',
      headline: 'Hourly Environmental & Regulatory Ingestion',
      whyUsed: 'Scheduled rules triggering continuous synchronization of CPCB / DPCC air quality stations and IMD meteorological feeds.',
      implementation: 'EventBridge Scheduled Rules emitting hourly cron events into Lambda ingestion pipelines.',
      security: 'Resource-based policies guaranteeing event origin authenticity.'
    },
    {
      id: 'sns',
      name: 'Amazon SNS',
      role: 'Worker Broadcast & Push Notification Pipeline',
      icon: BellRing,
      color: 'emerald',
      headline: 'SMS / WhatsApp Critical Shift Dispatch',
      whyUsed: 'Scalable multi-channel fanout for broadcasting supervisor-approved schedule adjustments directly to workers and subcontractors.',
      implementation: 'SNS Topic per site with subscription filtering based on trade tags (e.g. #masonry, #electrical).',
      security: 'Phone number tokenization and strict rate limiting to prevent notification spam.'
    },
    {
      id: 'amplify',
      name: 'AWS Amplify & CloudFront',
      role: 'Edge CDN Delivery & Fullstack Hosting',
      icon: Cloud,
      color: 'teal',
      headline: 'Global High-Performance Edge Delivery',
      whyUsed: 'Serves the responsive supervisor dashboard with sub-second asset latency, SSL certificates, and CI/CD git integration.',
      implementation: 'Next.js App Router hybrid SSR/SSG hosting on AWS Amplify Gen 2.',
      security: 'Edge HTTPS redirection and strict HTTP Content-Security-Policy headers.'
    }
  ];

  const active = awsServices.find(s => s.id === selectedService) || awsServices[0];
  const ActiveIcon = active.icon;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-emerald-500" />
            <span>AWS Cloud Architecture & System Design</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Production-ready serverless cloud topology built for high-reliability industrial workforce safety.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero Hallucination Architecture</span>
        </div>
      </div>

      {/* Cloud Topology Flowchart */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-elevated space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Cloud Data & Decision Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-purple-800/60 bg-purple-950/20 space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold">1. INTAKE</span>
            <h4 className="text-sm font-bold text-white">Amazon Bedrock</h4>
            <p className="text-xs text-slate-400">
              Unstructured voice/text dictation transcribed into strongly typed JSON schema.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-sky-800/60 bg-sky-950/20 space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-900/60 text-sky-300 font-bold">2. TELEMETRY</span>
            <h4 className="text-sm font-bold text-white">EventBridge + CPCB</h4>
            <p className="text-xs text-slate-400">
              Hourly automated ingestion of air quality and meteorological sensor feeds.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-amber-800/60 bg-amber-950/20 space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold">3. SOLVER</span>
            <h4 className="text-sm font-bold text-white">AWS Lambda</h4>
            <p className="text-xs text-slate-400">
              Deterministic mathematical optimization applying CAQM statutory rules and shift penalties.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">4. BROADCAST</span>
            <h4 className="text-sm font-bold text-white">Amazon SNS + DDB</h4>
            <p className="text-xs text-slate-400">
              Supervisor signs off; immutable audit logged in DynamoDB; SMS queued via SNS.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Service Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services List Column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-subtle space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            AWS Architecture Components
          </div>

          {awsServices.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition min-h-[48px] ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{service.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">{service.role}</span>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-500' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Service Detailed View */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ActiveIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {active.name}
              </h3>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {active.headline}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Strategic Rationale & Architectural Necessity
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {active.whyUsed}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Technical Implementation
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {active.implementation}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Security & Compliance Guardrails</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {active.security}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
