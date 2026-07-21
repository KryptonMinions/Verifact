# VeriFact

VeriFact is an AI-powered misinformation analysis platform. Give it a piece of text, a URL, an image, or a video/audio clip, and it extracts the factual claims inside it, researches each one against the live web and dedicated fact-checking databases, scores the credibility of the source, and returns a structured, evidence-backed report — not a blunt "true/false" verdict, but probabilistic language like *"High likelihood of being misleading"* or *"Lacks context."*

The project has three parts that work together:

| Component | What it is | Directory |
|---|---|---|
| **Web App** | Next.js dashboard — submit content, browse analysis history, explore trends, run reverse image search | [`web-app/`](web-app) |
| **Analysis Agent** | Python/FastAPI service running a Google ADK multi-agent pipeline that does the actual claim extraction, research, and report generation | [`misinformation-app/`](misinformation-app) |
| **Browser Extension** | Chrome (Manifest V3) extension — right-click any selection on a page and send it straight to the agent for analysis | [`browser-extension/`](browser-extension) |

---

## How it fits together

```
┌─────────────────┐        ┌──────────────────────┐
│  Browser         │        │  Web App (Next.js)   │
│  Extension       │        │  - Dashboard          │
│  (context menu)  │        │  - Trends / Reports   │
└────────┬─────────┘        │  - Image Search UI    │
         │                  └──────────┬────────────┘
         │  multipart/form-data (text/url/file)     │
         └───────────────────┬───────────────────────┘
                              ▼
                 ┌─────────────────────────────┐
                 │  Analysis Agent (FastAPI)    │
                 │  POST /                      │
                 │  POST /reverse-image-search  │
                 └──────────────┬───────────────┘
                                 │
        ┌────────────────────────┼─────────────────────────┐
        ▼                        ▼                          ▼
┌───────────────┐      ┌──────────────────┐      ┌────────────────────┐
│ Claims         │      │ Parallel Research │      │ Report Generator   │
│ Extractor      │──▶──▶│ - Web Scraper     │──▶──▶│ (structured JSON,  │
│ Agent          │      │ - Fact Checker    │      │  Pydantic schema)  │
└───────────────┘      └──────────────────┘      └────────────────────┘
        (Google ADK SequentialAgent / ParallelAgent, Gemini 2.0 Flash)

Supporting infra: Redis (L1 cache) · Firestore (report store) · BigQuery
(analytics + embeddings) · Vertex AI (Gemini multimodal + text embeddings)
```

**Request flow for a text/URL/media submission:**

1. The web app (server action) or the browser extension POSTs the input as `multipart/form-data` to the Analysis Agent's `EXTERNAL_ANALYSIS_API_URL`.
2. The agent hashes the input and checks **Redis** for a cached report ID (L1 cache, 6h TTL). On a hit, it fetches the cached report from **Firestore** and returns immediately.
3. On a cache miss, if a file was uploaded (image/video/audio), Gemini (`gemini-2.0-flash`, via Vertex AI) runs a combined OCR + transcription + description pass on it, and the result is appended to the text prompt.
4. The combined text is handed to the **Google ADK** agent pipeline:
   - `claims_extractor_agent` — pulls out clear, verifiable claims (scraping the page first via ScraperAPI if the input is a URL).
   - `ParallelAgent` running `web_scraper_agent` (Google Search grounding for supporting/opposing evidence) and `FactCheckerAgent` (Google Fact Check Tools API) side by side.
   - `report_generator_agent` — synthesizes everything into a `MisinformationReport` (Pydantic schema): per-claim evidence, fact-check results, a probabilistic conclusion, an overall credibility tag (`True` / `False` / `Partially True` / `Misleading` / `Unverified`), and a summary.
5. The final report is cached back into Firestore + Redis, logged to **BigQuery** (with a semantic embedding of the claims via `text-embedding-005`), and returned to the caller.
6. The web app saves a copy of the result (with the user's `user_id`) into **Supabase** so it shows up in the user's Dashboard history.

**Reverse image search** is a separate path: an uploaded image is forwarded to an external RIS microservice (`RIS_SERVICE_URL`, not part of this repo) which returns a timeline of where else the image has appeared online.

---

## Features

- **Multi-modal input** — analyze raw text, article URLs, images, video, or audio.
- **Claim-level fact-checking** — every factual claim in the content is extracted and independently researched, not just the piece as a whole.
- **Evidence-backed reports** — each claim shows supporting evidence, opposing evidence, and results from the Google Fact Check Tools API, each with a source URL.
- **Source credibility scoring** — a 0–100 score per source, bucketed into High / Medium-High / Medium-Low / Low credibility, with transparency/satire/UGC flags (see below).
- **Reverse image search** — trace an image's timeline of appearances across the web.
- **Browser extension** — select any region of a page and send it for analysis without leaving the tab.
- **Dashboard & history** — every analysis a signed-in user runs is saved to Supabase and browsable later.
- **Trends & public reports** — a live Firestore-backed feed of recently analyzed content and aggregate stats.
- **Shareable results** — share an analysis to X, Reddit, LinkedIn, WhatsApp, Telegram, email, or the native share sheet.
- **PDF export** — download a generated report as a PDF (`jsPDF`).
- **Response caching** — identical submissions (by content hash) are served from a Redis-backed cache instead of re-running the full pipeline.

### Source credibility heuristics

The agent scores sources on a 0–100 scale:

| Range | Category |
|---|---|
| 80–100 | High Credibility — strong track record of factual reporting |
| 60–79 | Medium-High Credibility — generally reliable, minor bias/transparency issues |
| 40–59 | Medium-Low Credibility — mixed reliability, notable bias or unverified claims |
| 0–39 | Low Credibility — history of misinformation, propaganda, or poor factual integrity |

Factors considered: **domain reputation** (historical accuracy, presence on known reliability lists, longevity), **factual reporting practices** (sourcing, corrections policy, opinion vs. news separation), **bias & objectivity** (emotional language, logical fallacies, misleading framing), and **trust flags** (ownership/funding transparency, satire detection, user-generated vs. editorial content).

---

## Tech stack

**Web App** (`web-app/`)
- Next.js 15 (App Router, Turbopack), React 18, TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- Supabase (`@supabase/ssr`) — auth + analysis history persistence
- Firebase (`firebase` JS SDK) — Firestore reads for the public Trends/Reports feeds
- Genkit (`@genkit-ai/googleai`, `@genkit-ai/next`) — available for in-app Gemini calls
- `jspdf` / `jspdf-autotable` — PDF report export
- `apexcharts` / `recharts` — trend charts

**Analysis Agent** (`misinformation-app/`)
- Python, FastAPI, Uvicorn (ASGI)
- **Google ADK** (`google-adk`) — `SequentialAgent` / `ParallelAgent` / `LlmAgent` orchestration
- Gemini 2.0 Flash via Vertex AI — text agents + multimodal (OCR/transcription/description)
- `google-cloud-aiplatform` (Vertex AI) — `text-embedding-005` for semantic embeddings
- `google-cloud-firestore` — report storage (`misinfo-reports` database)
- `google-cloud-bigquery` — submission/analytics logging
- `redis` — L1 response cache
- `langchain_scraperapi` — URL scraping tool for the claims extractor
- Google Fact Check Tools API — dedicated fact-check lookups

**Browser Extension** (`browser-extension/`)
- Vanilla JS, Chrome Extension Manifest V3 (service worker background script)

---

## Project structure

```
Verifact/
├── web-app/                          Next.js frontend
│   ├── src/app/                      Routes: /, /dashboard, /trends, /reports, /image-search, /auth
│   ├── src/app/actions.ts            Server actions — calls the Analysis Agent + RIS service
│   ├── src/components/dashboard/     Analysis form, results view, charts, timeline, PDF/share UI
│   ├── src/lib/supabase/             Supabase client/server/middleware helpers
│   ├── src/lib/firebase/             Firebase client for Firestore-backed trends/reports
│   └── supabase/                     SQL schema for the `analyses` table
│
├── misinformation-app/               FastAPI + Google ADK backend
│   ├── agent.py                      FastAPI app, GCP clients, caching, endpoints
│   └── sub_agents/
│       ├── claims_extractor_agent/   Extracts verifiable claims (+ URL scraping)
│       ├── web_scraper_agent/        Google Search grounding for evidence
│       ├── fact_checking_agent/      Google Fact Check Tools API lookup
│       └── report_generator_agent/   Synthesizes the final structured report
│
└── browser-extension/chrome/         Manifest V3 extension
    ├── background.js                 Context menu + request orchestration
    ├── selection.js                  On-page drag-to-select overlay
    ├── display.js / display.css      Result overlay UI
    └── config.js                     Backend base URL
```

---

## Getting started

### Prerequisites

- Node.js v18+ and npm
- Python 3.12+
- A Google Cloud project with **Vertex AI**, **Firestore**, and **BigQuery** APIs enabled, plus a service account with credentials available to the process (`GOOGLE_APPLICATION_CREDENTIALS` or ADC via `gcloud auth application-default login`)
- A Redis instance reachable from the agent (e.g. local Redis, or GCP Memorystore)
- A [Supabase](https://supabase.com) project (for the web app's auth + history)
- API keys: Google AI/Gemini, [ScraperAPI](https://www.scraperapi.com/), [Google Fact Check Tools API](https://developers.google.com/fact-check/tools/api)

### 1. Analysis Agent (`misinformation-app/`)

```bash
cd misinformation-app
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create `misinformation-app/.env`:

```bash
# Google Cloud / Vertex AI
PROJECT_ID=your-gcp-project-id
REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json   # or use ADC

# Redis (Memorystore or local)
MEMORSTORE_HOST=localhost
MEMORSTORE_PORT=6379

# Firestore
FIRESTORE_REPORT_COLLECTION=reports

# Third-party APIs
SCRAPERAPI_API_KEY=your-scraperapi-key
FACT_CHECK_API_KEY=your-google-fact-check-api-key
GOOGLE_API_KEY=your-gemini-api-key                # if not relying purely on Vertex AI ADC

# Optional: reverse image search microservice (external, not in this repo)
RIS_SERVICE_URL=https://your-ris-service-url
```

Run it:

```bash
uvicorn agent:app --reload --port 8000
```

The service exposes:

| Endpoint | Method | Body | Description |
|---|---|---|---|
| `/` | `POST` | `text` (form field, optional), `file` (optional) | Runs the full claim-extraction → research → report pipeline. Returns a `MisinformationReport` JSON object. |
| `/reverse-image-search` | `POST` | `file` (image, required) | Proxies to `RIS_SERVICE_URL/generate-timeline` and returns the timeline of image appearances. |

### 2. Web App (`web-app/`)

```bash
cd web-app
npm install
```

Create `web-app/.env.local`:

```bash
# Where the web app sends analysis requests (your local or deployed Analysis Agent)
EXTERNAL_ANALYSIS_API_URL=http://localhost:8000/
RIS_SERVICE_URL=http://localhost:8000            # or the RIS microservice directly
MISINFORMATION_APP_NAME=misinformation-app

# Supabase (auth + analysis history)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Firebase (Trends / public Reports feed — Firestore only)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_ID=misinfo-reports

# Genkit / Gemini (optional, if using Genkit flows directly from the web app)
GOOGLE_GENAI_API_KEY=your-gemini-api-key

NEXT_PUBLIC_SITE_URL=http://localhost:9002
```

Apply the Supabase schema (`web-app/supabase/supabase_table_schema.sql` or `web-app/src/lib/supabase/schema.sql`) via the Supabase SQL editor or CLI — it creates the `analyses` table with row-level security so each user only sees their own history.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) (note: the dev script runs on port `9002`, not the Next.js default `3000`).

Other scripts:

```bash
npm run build       # production build
npm run start        # run the production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run genkit:dev    # start the Genkit dev UI for AI flows in src/ai/
```

### 3. Browser Extension (`browser-extension/`)

1. Edit [`browser-extension/chrome/config.js`](browser-extension/chrome/config.js) so `BASE_URL` points at your running Analysis Agent (local `http://localhost:8000` or your deployed Cloud Run URL).
2. Open `chrome://extensions/`, enable **Developer mode**.
3. Click **Load unpacked** and select `browser-extension/chrome`.
4. On any page, right-click and choose **"Analyze selection for misinformation"** to draw a selection box and send it for analysis; results appear in an on-page overlay.

A Firefox build is not implemented yet (`browser-extension/firefox/` is a placeholder).

---

## Deployment

The reference deployment targets **Google Cloud**, matching the GCP-native clients baked into `misinformation-app`:

- **Analysis Agent** — containerize `misinformation-app/` (FastAPI + Uvicorn) and deploy to **Cloud Run**. Grant the service's identity access to Vertex AI, Firestore, and BigQuery, and give it network access to your Redis/Memorystore instance (Cloud Run + Serverless VPC Connector, or a public Redis endpoint). Set all the environment variables listed above as Cloud Run env vars / secrets. The extension's default `config.js` already points at an example Cloud Run URL pattern (`*.run.app`) — update it to your own service.
- **Web App** — deploy `web-app/` to any Next.js host (Vercel, Cloud Run, etc.). Point `EXTERNAL_ANALYSIS_API_URL` / `RIS_SERVICE_URL` at your deployed Analysis Agent, and set the Supabase/Firebase env vars to your production projects.
- **Browser Extension** — update `BASE_URL` in `config.js` to the deployed Analysis Agent URL, zip the `browser-extension/chrome` directory, and upload it via the Chrome Web Store developer dashboard (or distribute unpacked for internal use).
- **Reverse Image Search service** — a separate microservice exposing `POST /generate-timeline`; it is not included in this repository and must be deployed/pointed to independently via `RIS_SERVICE_URL`.

**Data stores to provision:**

| Store | Purpose |
|---|---|
| Supabase Postgres | User auth + per-user analysis history (`analyses` table) |
| Firestore (`misinfo-reports` DB) | Canonical report cache + public trends/reports feed |
| Memorystore/Redis | L1 hash → report-ID cache (6h TTL) |
| BigQuery | Submission logs + semantic embeddings for analytics |

---

## License

[MIT](LICENSE)
