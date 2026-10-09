# ClimaShift

> **“Don’t just monitor the environment. Plan the work around it.”**
> 
> *Environmental Work-Safety & Deterministic Scheduling Engine for Outdoor Construction Workforces.*

---

## 1. Executive Summary

Most environmental platforms merely report telemetry: AQI, PM2.5, ambient temperature, humidity, and heat index.

A construction site supervisor cannot operationalize raw numbers alone. They must answer:
> *“Given today’s environmental conditions, regulatory orders, and my planned tasks, what should my workforce actually do, when should they do it, and which activities must be rescheduled or suspended?”*

**ClimaShift** transforms raw environmental forecasts, statutory curbs (such as CAQM GRAP Stage I–IV in Delhi-NCR), and shift constraints into **risk-aware, explainable work schedule recommendations**.

### Core Philosophy:
`DATA → RISK → CONSTRAINT → DECISION → ACTION → IMPACT`

---

## 2. Authentic AWS Cloud Architecture

ClimaShift implements a **truthful serverless architecture** that strictly decouples probabilistic AI understanding from deterministic safety and compliance decisions.

```
┌──────────────────────────────────────────────┐
│        CONSTRUCTION SITE SUPERVISOR          │
└──────────────────────┬───────────────────────┘
                       │ (Spoken or typed shift log)
                       ▼
┌──────────────────────────────────────────────┐
│             CLIMASHIFT FRONTEND              │
│       [AWS Amplify Hosting Compatible]       │
│     Next.js 14 App Router, Tailwind CSS      │
└──────────────────────┬───────────────────────┘
                       │ POST /api/parse-work-plan
                       ▼
┌──────────────────────────────────────────────┐
│             AMAZON API GATEWAY               │
│        [AWS Managed Service Endpoint]        │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 AWS LAMBDA                   │
│        [Serverless Backend Handler]          │
│    Node.js 20.x, validation & Bedrock SDK    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│               AMAZON BEDROCK                 │
│      [Anthropic Claude 3.5 Sonnet]           │
│     Role: Natural-Language Understanding     │
└──────────────────────┬───────────────────────┘
                       │ (Structured Task JSON)
                       ▼
┌──────────────────────────────────────────────┐
│    CLIMASHIFT DETERMINISTIC SCHEDULING       │
│        & CONSTRAINT EVALUATION ENGINE        │
│          [Core Application Logic]            │
│  - Linear risk minimization equation         │
│  - CAQM GRAP statutory restrictions          │
│  - Diurnal solar peak & heat avoidance       │
│  - Trade dependencies & crew constraints     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             OPTIMIZED WORK PLAN              │
│    - Before vs. After schedule comparison    │
│    - 3-factor explainable reasoning drawer   │
│    - Human supervisor sign-off & dispatch    │
└──────────────────────────────────────────────┘
```

### Critical Architectural Principle:
* **BEDROCK = UNDERSTAND:** Converts unstructured supervisor notes into typed JSON schema (trade category, crew size, location, estimated duration). Bedrock does **NOT** make legal compliance or medical safety decisions.
* **CLIMASHIFT ENGINE = DECIDE:** A mathematical constraint solver evaluates statutory curbs, heat index thresholds, and exposure windows with zero AI hallucination.
* **SUPERVISOR = APPROVE:** Explicit human-in-the-loop sign-off before shift advisories are generated.

---

## 3. AWS Service Implementation Status

| Service | Category | Implementation Artifact | Truthful Status |
| :--- | :--- | :--- | :--- |
| **Amazon Bedrock** | AI / Foundation Model | `@aws-sdk/client-bedrock-runtime` (`src/lib/bedrockService.ts`) | **CONNECTED** (when AWS keys configured) / **DEMO FALLBACK** (when offline) |
| **AWS Lambda** | Serverless Backend | `lambda/parseWorkPlan/index.mjs` | **DEPLOYABLE / LOCAL BACKEND** |
| **Amazon API Gateway** | API Management | `template.yaml` (`POST /api/parse-work-plan`) | **CONFIGURED** |
| **AWS Amplify** | Hosting & CI/CD | `amplify.yml` (Next.js 14 SSR/SSG spec) | **READY FOR DEPLOYMENT** |
| **Amazon DynamoDB** | Database | Planned enterprise multi-year audit log | *ROADMAP (Not in MVP)* |
| **Amazon SNS** | Push Notifications | Planned worker SMS/WhatsApp batch dispatch | *ROADMAP (Not in MVP)* |
| **Amazon EventBridge** | Event Bus / Cron | Planned hourly CPCB/IMD telemetry sync | *ROADMAP (Not in MVP)* |

---

## 4. Dual Operational Modes

To ensure 100% demo reliability without false claims:

1. **Live AWS Mode:**
   * When AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) are present in the server environment, the application invokes Amazon Bedrock Claude 3.5 Sonnet directly.
   * Clearly labeled in the UI as: `Amazon Bedrock (Claude 3.5 Sonnet)`.

2. **Demo / Fallback Mode:**
   * When credentials are not configured or the network is offline, ClimaShift activates its built-in deterministic NLP rule engine.
   * The UI transparently states: `Demo / Fallback Mode — AWS Bedrock credentials not connected.`
   * **Never pretends** the result came from Bedrock when in fallback mode.

---

## 5. Security & Credentials

* **Zero Credentials in Client Bundles:** All AWS SDK interactions occur server-side inside Next.js API routes or AWS Lambda. No AWS secret keys are ever bundled or exposed to the browser.
* **Configuration:** Copy `.env.example` to `.env.local` to configure keys:

```bash
# AWS Bedrock & Backend Configuration (Server-Side Only)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```

---

## 6. Local Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Build production Next.js bundle
npm run build

# 3. Start local production server
npm run start -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. AWS Deployment Options

### Option A: AWS Amplify Hosting (Web Application)
The repository includes `amplify.yml`. Connect the repository in the AWS Amplify console for zero-config Next.js 14 deployment.

### Option B: AWS SAM (Serverless Backend)
```bash
# Deploy the API Gateway and Lambda stack
sam build
sam deploy --guided
```
