# IPSentinel — Master Build Plan

> Single source of truth for Team Amigos.
> Every decision, every task, every endpoint is in this file.

---

## Project summary

**What:** IPSentinel is an AI-powered intellectual property protection platform. It lets founders, inventors, and students check patent novelty, draft patent claims, scan trademarks, and monitor copyright — without needing a lawyer.

**Who:** Team Amigos · Vishwakarma Institute of Technology · Ideathon 2026

**What we ship for the demo:**
- Free tier: all 4 tools fully functional with real AI and real patent databases
- Startup and Enterprise plans: shown on the site with full feature descriptions, locked with "Coming soon" — no backend needed for these

**What judges see:** A working web app live on a public URL where they can type an invention and get a real patent conflict score in under 30 seconds.

---

## Team and roles

| Member | Role | Owns |
|--------|------|------|
| TM 1 | Frontend lead | Landing page, routing, API wiring, dashboard |
| TM 2 | Frontend UI | All tool pages, components, result cards, pricing pages |
| TM 3 | Backend lead | FastAPI server, USPTO integration, Gemini service, /api/novelty, /api/copyright, Render deploy |
| TM 4 | Backend APIs | Groq service, Brave Search service, /api/draft, /api/trademark, Vercel deploy |

---

## Tech stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Vite + React + Tailwind CSS + React Router | Free |
| Backend | FastAPI + Python 3.11 + uvicorn | Free |
| AI — private zone | Groq API + Llama 3.3 70B | Free tier |
| AI — public data zone | Gemini 2.5 Flash | Free tier |
| Patent search | USPTO PatentsView REST API | Free, no key |
| Web search | Brave Search API | Free, 2000 req/month |
| Phonetic matching | jellyfish (Python library) | Free |
| Text similarity | Python difflib (built-in) | Free |
| Frontend deploy | Vercel | Free |
| Backend deploy | Render.com | Free |

---

## API keys — get these on Day 0

All free. No credit card required for any of them.

| Service | Who gets it | Where |
|---------|------------|-------|
| Gemini API key | TM 3 | aistudio.google.com → Get API key |
| Groq API key | TM 4 | console.groq.com → API Keys → Create |
| Brave Search API key | TM 4 | brave.com/search/api → Data for AI plan |
| USPTO PatentsView | No key needed | search.patentsview.org/api/v1/patent/ |

**Share all keys via one shared .env file. Never commit them to GitHub.**

---

## Day-by-day plan

### Day 0 — Setup (half day, all 4 people simultaneously)

**TM 1**
- Init Vite + React + React Router + Tailwind: `npm create vite@latest frontend -- --template react`
- Create folder structure: pages/, components/, services/, hooks/
- Push to GitHub, create `dev` branch, protect main
- Create `mock_responses.json` with dummy API response shapes so TM 2 can build without waiting for backend
- Write `.env.example` with all variable names but no real values

**TM 2**
- Clone repo, install deps: `npm i axios clsx react-router-dom`
- Configure Tailwind with custom theme (brand purple `#7C3AED`, dark backgrounds, semantic risk colors)
- Re-read the ideathon deck — copy tool names, descriptions, pricing text exactly as written
- Sketch wireframes for all 4 tool pages (paper or Figma, 15 min each)

**TM 3**
- Init FastAPI + virtualenv: `pip install fastapi uvicorn httpx python-dotenv google-generativeai groq jellyfish`
- Test USPTO PatentsView manually with curl — verify patent abstracts come back
- Write the API contract (exact request + response shape for all 4 endpoints) and share with team before Day 1 starts
- Get Gemini API key, add to `.env`

**TM 4**
- Get Groq API key, run a quick test prompt to confirm it works
- Get Brave Search API key, run a test query to confirm results come back
- Test jellyfish library: `soundex()` + `double_metaphone()` on 5 sample brand names in a Python script
- Share all working keys with TM 3 via agreed secure channel

---

### Day 1 — Foundation

**TM 1**
- React Router setup: 6 routes (`/` `/dashboard` `/novelty` `/draft` `/trademark` `/copyright`)
- Navbar: logo left, nav links center ("Features" "Pricing" "Dashboard"), "Try free" CTA right — collapsible hamburger on mobile
- Landing hero section: headline, sub-headline, textarea input, "Check novelty" button
- `apiService.js`: axios instance with base URL from `VITE_API_URL` env var + global error interceptor
- Confirm `GET /health` from TM 3's running backend succeeds from the frontend

**TM 2**
- Base component library: Button, Input, TextArea, Card, Badge, Spinner, Divider
- Pricing section for landing page: 3 plan cards (Free active, Startup + Enterprise as "Coming soon")
- Features section: 4 feature cards with icon, name, one-line description each
- "How it works" section: 5-step numbered horizontal flow

**TM 3**
- `main.py`: app init, CORS allowing localhost:5173 + future Vercel URL, include all routers
- `services/uspto.py`: `search_patents(keywords)` → list of `{title, abstract, patent_number, date, link}`
- `services/gemini.py`: `analyze_novelty(invention, patents)` → `{similarity_scores, risk_score, analysis}`
- `POST /api/novelty` — fully working end-to-end, tested with curl using a real invention description
- `GET /health` → `{status: "ok"}`

**TM 4**
- `services/groq_client.py`: `generate_patent_claims(description)` → `{independent: [], dependent: []}`
  - Prompt must output strict JSON — no markdown fences around it
- `POST /api/draft` — complete and tested with 3 different invention descriptions
- `services/brave.py`: `search_web(query, count=5)` → `[{url, title, snippet}]`
- Test both working endpoints, share sample outputs with TM 1 and TM 2 so they can build result components accurately

---

### Day 2 — Core pages

**TM 1**
- Dashboard page: 4 active tool cards + 4 locked "Coming soon" cards in a grid
- Patent novelty checker page: textarea + "Check novelty" button + results area
- Wire novelty page → `POST /api/novelty` → log raw response first, then render
- Loading state: spinner + "Searching 10M+ patents…" text. Error toast on API failure
- Connect patent drafter page → `POST /api/draft` → render output via TM 2's ClaimDisplay component

**TM 2**
- `RiskScoreGauge` component: SVG semi-circle arc, 0–100, animates on load, color changes by risk level
- `PatentCard` component: patent number, title, date, similarity %, abstract excerpt, link to Google Patents
- Patent drafter page: textarea + "Generate claims" button + tips sidebar
- `ClaimDisplay` component: numbered independent claims, indented dependent claims, copy-all button

**TM 3**
- `POST /api/copyright`:
  - Extract key phrases from the input
  - Brave Search each phrase
  - Score similarity with Python `difflib.SequenceMatcher`
  - Return: `{matches: [{url, title, snippet, similarity_pct}], overall_risk, risk_label}`
- Input validation on all 4 routes: reject empty, under 20 chars, over 5000 chars
- Pydantic request/response models for every endpoint

**TM 4**
- `POST /api/trademark`:
  - Generate phonetic variants with `jellyfish.soundex()` + `double_metaphone()` + Levenshtein distance
  - Brave Search each variant
  - Gemini classifies risk: Low / Medium / High / Critical with one-sentence reason
  - Return: `{matches: [{name, match_type, similarity_pct, source_url}], risk_level, explanation}`
- Test with misspelled famous brands (Googl, Amzon) — phonetic matching must catch them

---

### Day 3 — Full integration

**TM 1**
- Trademark scanner page: brand name input + connect to `POST /api/trademark`
- Copyright monitor page: content textarea + connect to `POST /api/copyright`
- Global toast notification system: success, error, warning — via React context, no external lib
- Handle 429 rate-limit response: show "Free tier limit reached" banner with "View plans" link

**TM 2**
- `TrademarkResultCard`: brand name, similarity %, match type badge, risk indicator
- `CopyrightMatchCard`: source URL, text excerpt, similarity bar, "View source" link
- 4 coming soon pages (Competitor Watch, FTO, Trade Secret Monitor, Weekly Digest) with lock overlay and "View plans" CTA
- `UpgradeModal`: compact Startup vs Enterprise comparison, links to `/plans/startup` and `/plans/enterprise`, dismissable

**TM 3**
- Session-based rate limit middleware: max 5 checks per session ID cookie
  - Returns 429 with `{error: "Free tier limit reached", upgrade_url: "/pricing"}`
- Standardize all error responses: `{error: string, detail: string, status: number}`
- Deploy to Render.com: create account → new Python web service → connect GitHub → start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Verify `GET /health` on the Render URL responds. Add Render URL to CORS allowed origins

**TM 4**
- Connect frontend repo to Vercel → deploy main branch → set `VITE_API_URL` to the Render backend URL
- Set all 3 env vars on Render: `GEMINI_API_KEY` · `GROQ_API_KEY` · `BRAVE_API_KEY`
- Full E2E test: use all 4 tools from the Vercel URL hitting the Render backend
- Log all bugs found with priority: Critical (blocks demo) vs Nice-to-fix

---

### Day 4 — Polish

**TM 1**
- Confirm `VITE_API_URL` points to Render in Vercel environment settings
- Footer: "Team Amigos · Vishwakarma Institute of Technology · Ideathon 2026" + GitHub link
- Fix all Critical bugs from Day 3 log
- Walk the full demo flow end-to-end 3 times

**TM 2**
- Pricing page `/pricing`: full three-plan comparison table, feature checklists, FAQ section, waitlist modal
- Startup plan preview `/plans/startup`: hero, one section per agent with description, waitlist CTA
- Enterprise plan preview `/plans/enterprise`: hero, one section per premium feature, "Contact us" CTA
- Mobile responsive pass: every page works at 375px width (test in Chrome DevTools)
- "5 checks remaining" counter in dashboard header reading from rate limit response

**TM 3**
- Fix production bugs on Render: cold start timeouts, missing env vars, misconfigured CORS
- Add 2–3 few-shot examples to Gemini novelty prompt for more accurate risk scores
- Make USPTO patent search + Gemini analysis run as async parallel coroutines to cut response time
- Sanity check: a novel idea should score below 30, an obvious copy should score above 80

**TM 4**
- Smoke test all 4 tools in production — each must return a valid result in under 15 seconds
- Create `demo_data.json`: 4 pre-tested invention descriptions paired with their expected outputs (offline fallback)
- Record a 3-minute screen-capture backup demo video of the complete working flow
- Fix Nice-to-fix bugs if all above are done

---

### Day 5 — Demo

**TM 1 — Demo driver**
- Drive the live demo during the pitch — knows every click, every expected wait time
- Add the live Vercel app URL to slide 3 (solution slide) of the presentation
- Critical bug fixes only — nothing cosmetic

**TM 2 — Presentation support**
- Prepare 4 demo invention descriptions that produce impressive-looking results (pre-tested on Day 4)
- Take screenshots of the best result screens for slide backups
- Rehearse and own the UI walkthrough portion of the pitch

**TM 3 — Infrastructure monitor**
- Warm up all 4 API endpoints 10 minutes before the pitch — Render's free tier has cold starts
- Monitor Render dashboard during the demo — ready to restart if it goes down
- Own the technical architecture explanation to judges: agent split, Groq/Gemini privacy model, free API stack

**TM 4 — Backup**
- Keep `demo_data.json` open — ready to paste results into the UI if the live API hangs
- Keep backup video file ready to play in under 10 seconds if internet fails
- Field judge questions on AI model choices, free API tiers, and the privacy architecture

---

## Pages to build

### 1. Landing page `/`

Navbar → Hero → Trust strip → Features → How it works → Pricing preview → Footer

- **Navbar:** logo, "Features" "Pricing" "Dashboard" links, "Try free" CTA — sticky with blur backdrop
- **Hero:** headline "Is your invention already taken?" + live patent input textarea + mock risk gauge animating to 23 on the right. Clicking "Check novelty" navigates to `/novelty?q={input}` with text pre-filled
- **Trust strip:** "10M+ patents scanned · Free to start · No legal jargon"
- **Features:** 4 cards — Patent Novelty Checker, Patent Drafter, Trademark Scanner, Copyright Monitor
- **How it works:** 5 numbered steps — User input → Smart retrieval → AI analysis → Risk score → Action
- **Pricing preview:** 3 plan cards (Free working, Startup + Enterprise as "Coming soon") with "View all plans →" link to `/pricing`
- **Footer:** team name, college, event badge, GitHub link

---

### 2. Dashboard `/dashboard`

- Greeting header + "5 checks remaining" progress bar (top-right)
- 4 active tool cards — Patent Novelty, Patent Drafter, Trademark Scanner, Copyright Monitor — each fully clickable
- 4 locked "Coming soon" cards — Competitor Watch, FTO, Trade Secret Monitor, Weekly Digest — clicking opens UpgradeModal

---

### 3. Patent Novelty Checker `/novelty`

- Back link → Dashboard, page title, one-line description
- **Input panel:** textarea "Describe your invention", "Check novelty" button (pre-filled from `?q=` URL param)
- **Results panel** (fades in after API responds):
  - Risk score gauge animated from 0 to result
  - Plain-language analysis paragraph
  - Up to 5 PatentCards: patent number, title, date, similarity %, abstract excerpt, Google Patents link

---

### 4. Patent Drafter `/draft`

- **Input panel:** textarea, tip about being specific, "Generate claims" button
- **Results panel:**
  - Independent claims section: numbered
  - Dependent claims section: indented
  - "Copy all" button → shows "Copied ✓" for 2 seconds
  - Disclaimer about consulting a patent agent before filing

---

### 5. Trademark Scanner `/trademark`

- **Input panel:** single-line brand name input, "Also check similar-sounding names" checkbox (checked by default), "Scan trademarks" button
- **Results panel:**
  - Risk score gauge
  - Risk summary paragraph
  - TrademarkResultCards: mark name, match type (exact / phonetic / similar spelling), similarity %, category, registry, link

---

### 6. Copyright Monitor `/copyright`

- **Input panel:** large textarea for pasting text or code, character counter (max 5000), "Check for copies" button
- **Results panel:**
  - Risk score gauge
  - CopyrightMatchCards: source URL, similarity %, text excerpt, "View source" link

---

### 7. Coming soon pages

Four routes: `/competitor-watch` `/fto` `/trade-secret` `/digest`

All use one `ComingSoon` component with props: `{title, description, plan}`. Shows lock icon, feature name, which plan unlocks it, "View plans" → `/pricing`, back link.

---

### 8. Pricing page `/pricing`

- **Header:** "Simple pricing. Serious protection." + sub-headline
- **Three plan cards:**

  **Free — ₹0/month**
  - 5 IP checks per month
  - Patent novelty checker
  - Patent drafter
  - Trademark scanner with phonetic matching
  - Copyright monitor
  - Community support
  - CTA: "Get started free" → `/dashboard`

  **Startup — ₹3,000/month (Coming soon)**
  - Everything in Free, plus:
  - Unlimited IP checks
  - Competitor watch agent (weekly, up to 5 competitors)
  - Freedom to operate (FTO) checker
  - Deadline and renewal alert agent
  - Weekly IP digest email
  - 24/7 active IP monitoring
  - Automated conflict alerts
  - CTA: "Join waitlist" → opens waitlist modal

  **Enterprise — ₹25,000/month (Coming soon)**
  - Everything in Startup, plus:
  - Trade secret leak monitor
  - IP landscape mapper
  - Open source license conflict checker
  - IP valuation estimator
  - Full API access and integrations
  - Portfolio management suite
  - Law firm multi-client portal
  - Unlimited competitor tracking
  - CTA: "Contact us" → mailto

- **Comparison table:** feature-by-feature across all 3 plans, grouped: "Core tools" / "Monitoring and alerts" / "Advanced analysis" / "Access and integrations"
- **FAQ:** 4 questions (no credit card to start, when available, pre-filing use, data privacy)
- **Interactive:** "Join waitlist" opens a waitlist modal (email input + "Notify me" button → shows thank-you message, no backend needed)

---

### 9. Startup plan preview `/plans/startup`

- Hero: plan badge + headline "We watch your IP space so you don't have to." + waitlist CTA
- One section per agent with name, 2-sentence description, illustrative placeholder:
  1. Competitor watch agent
  2. Freedom to operate checker
  3. Deadline and renewal alerts
  4. Weekly IP digest
- Waitlist modal CTA at bottom

---

### 10. Enterprise plan preview `/plans/enterprise`

- Hero: plan badge + headline "Your IP team, at a fraction of the cost." + "Contact us" CTA
- One section per premium feature:
  1. Trade secret leak monitor
  2. IP landscape mapper
  3. Open source license conflict checker
  4. IP valuation estimator
  5. Full API access and white-label
- Three audience cards: funded startups / law firms / R&D teams
- "Contact sales" footer CTA

---

## Backend architecture

### Agent split — privacy model

The user's raw invention description is sensitive (it's the IP they're protecting). It must never go to a third-party model that trains on prompts (Google). The split:

**Groq + Llama 3.3 70B — private zone**
Receives raw user input. Handles:
- Orchestrator (keyword extraction, routing)
- Patent drafter (generates claims directly from invention description)
- Risk aggregator (combines results into final score and report)

**Gemini 2.5 Flash — public data zone**
Only receives already-public data retrieved from external databases. Handles:
- Novelty analyzer (compares retrieved public patent texts for semantic similarity)
- Trademark analyzer (assesses risk from retrieved public trademark records)
- Copyright analyzer (assesses similarity of retrieved public web content)

The key rule: **Groq extracts search keywords from the invention, sends those keywords to the databases, gets back public documents, then passes only those public documents to Gemini.** Gemini never sees the raw invention description.

### The 4 endpoints

#### `POST /api/novelty`

```
Request:  { description: string }

Flow:
1. Groq extracts 3–5 search keywords from the description
2. USPTO PatentsView API called with those keywords → returns up to 20 patents
3. Patent titles + abstracts (public data) sent to Gemini → semantic similarity scores
4. Groq aggregates scores → generates 0–100 risk score + plain-language analysis
5. Return top 5 most similar patents with their scores

Response: {
  patents: [{ title, patent_number, date, similarity_pct, abstract_excerpt, link }],
  risk_score: number,       // 0–100
  risk_label: string,       // "Low" | "Caution" | "High" | "Critical"
  analysis: string          // 2–3 sentence plain-English explanation
}
```

#### `POST /api/draft`

```
Request:  { description: string }

Flow:
1. Groq generates structured patent claims directly from the description
2. Prompt instructs Groq to output strict JSON only (no markdown fences)
3. Parse and return

Response: {
  independent_claims: string[],
  dependent_claims: string[]
}
```

#### `POST /api/trademark`

```
Request:  { brand_name: string }

Flow:
1. jellyfish generates phonetic variants: soundex, double metaphone, levenshtein neighbours
2. Brave Search called for each variant (e.g. "Googl trademark", "Gogle brand registration")
3. Search results (public trademark data) sent to Gemini → risk classification
4. Return matches + risk level

Response: {
  matches: [{ name, match_type, similarity_pct, source_url }],
  risk_level: string,       // "Low" | "Medium" | "High" | "Critical"
  explanation: string
}
```

#### `POST /api/copyright`

```
Request:  { content: string }

Flow:
1. Extract 3–4 distinctive phrases from the content
2. Brave Search each phrase
3. Retrieve page text from top results, run difflib.SequenceMatcher against input
4. Score and rank results

Response: {
  matches: [{ url, title, excerpt, similarity_pct }],
  overall_risk: string,
  risk_label: string
}
```

#### `GET /health`

```
Response: { status: "ok" }
```

---

### Input validation (all routes)

- Empty string → 400: "Please enter a description."
- Under 20 characters → 400: "Describe your invention in at least 20 characters — more detail means better results."
- Over 5000 characters → 400: "Input too long. Please keep it under 5000 characters."

### Rate limiting

- 5 checks per session (tracked by session ID cookie)
- On limit: 429 `{error: "Free tier limit reached", upgrade_url: "/pricing"}`

---

## Repo structure

```
ipsentinel/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NoveltyChecker.jsx
│   │   │   ├── PatentDrafter.jsx
│   │   │   ├── TrademarkScanner.jsx
│   │   │   ├── CopyrightMonitor.jsx
│   │   │   ├── ComingSoon.jsx         ← receives {title, description, plan} as props
│   │   │   ├── Pricing.jsx
│   │   │   ├── StartupPlan.jsx
│   │   │   └── EnterprisePlan.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RiskScoreGauge.jsx
│   │   │   ├── PatentCard.jsx
│   │   │   ├── ClaimDisplay.jsx
│   │   │   ├── TrademarkResultCard.jsx
│   │   │   ├── CopyrightMatchCard.jsx
│   │   │   ├── UpgradeModal.jsx
│   │   │   ├── WaitlistModal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── ToastContext.jsx
│   │   │   └── SkeletonCard.jsx
│   │   ├── services/
│   │   │   └── apiService.js
│   │   ├── hooks/
│   │   │   ├── useChecksRemaining.js
│   │   │   └── useToast.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── main.py                    ← app + CORS + routers
    ├── routers/
    │   ├── novelty.py             ← POST /api/novelty
    │   ├── draft.py               ← POST /api/draft
    │   ├── trademark.py           ← POST /api/trademark
    │   └── copyright.py           ← POST /api/copyright
    ├── services/
    │   ├── uspto.py               ← PatentsView API calls
    │   ├── gemini.py              ← Gemini client
    │   ├── groq_client.py         ← Groq client
    │   └── brave.py               ← Brave Search calls
    ├── models/
    │   └── schemas.py             ← Pydantic request/response models
    ├── middleware/
    │   └── rate_limit.py          ← 5 checks/session
    ├── requirements.txt
    ├── .env
    └── .env.example
```

---

## Environment variables

```
# backend/.env
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
BRAVE_API_KEY=your_brave_key_here

# frontend/.env
# Day 0–2: local backend
VITE_API_URL=http://localhost:8000

# Day 3 onward: Render backend
VITE_API_URL=https://your-app.onrender.com
```

---

## Deployment

### Backend — Render.com (Day 3)

1. Create account at render.com
2. New → Web Service → Connect GitHub repo → Select `/backend` folder
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `GEMINI_API_KEY`, `GROQ_API_KEY`, `BRAVE_API_KEY`
6. Deploy and confirm `GET /health` responds on the Render URL
7. Copy the Render URL and add it to CORS origins in `main.py`

### Frontend — Vercel (Day 3)

1. Connect GitHub repo to Vercel
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL` = the Render backend URL
6. Deploy and confirm the app loads

### Warming up on demo day

Render's free tier spins down after 15 minutes of inactivity. Before the pitch:
- Hit all 4 endpoints 10 minutes before the demo starts
- Keep the Render dashboard open on a separate device to restart if needed

---

## Shared component behaviour

**RiskScoreGauge**
- SVG semi-circle arc that animates from 0 to the result score on mount
- Color: green for 0–30, amber for 31–65, red for 66–100
- Score number counts up simultaneously with the arc animation

**UpgradeModal**
- Triggered by any locked card on the dashboard
- Shows compact Startup vs Enterprise comparison
- Links to `/plans/startup` and `/plans/enterprise` for full detail
- Dismissable with close button or clicking outside

**WaitlistModal**
- Triggered by "Join waitlist" on pricing and plan pages
- Single email input field + "Notify me" button
- On submit: show "You're on the list." — no backend needed, just a state change

**Toast notifications**
- Fixed bottom-right, stacked with 8px gap
- Success / warning / error types
- Auto-dismiss after 4 seconds

**SkeletonCard**
- Shimmer placeholder shown in results panels while API responds
- Matches the shape of the result cards so the layout doesn't jump

---

## Demo prep checklist

- [ ] 4 invention descriptions ready with confirmed good results (tested on Day 4)
- [ ] Backup screenshots of best results saved
- [ ] `demo_data.json` open on a spare laptop
- [ ] Backup screen-recording video ready to play
- [ ] Render warmed up 10 minutes before pitch
- [ ] Live Vercel URL added to presentation slide 3
- [ ] Every team member knows their role during the demo (TM1 drives, TM2 presents UI, TM3 monitors backend, TM4 handles judges)
- [ ] Answers prepared for expected judge questions:
  - Why Groq for some agents and Gemini for others? → Privacy: invention description stays on Groq, Gemini only sees public patent data
  - What APIs are you using? → USPTO PatentsView (free), Brave Search (free), Gemini (free), Groq (free) — total cost ₹0
  - How does semantic search differ from keyword search? → Gemini compares meaning, not words — "wireless energy transfer" and "contactless power transmission" are understood as the same concept
  - What does the risk score mean? → 0–100 conflict probability — 0 is completely novel, 100 is an exact match with existing patents

---

## Key decisions made

| Decision | Choice | Reason |
|----------|--------|--------|
| AI split | Groq for private, Gemini for public | User invention data never goes to Google — competitive IP must stay private |
| LLM choice | Groq + Llama 3.3 70B / Gemini 2.5 Flash | Both free tier, no credit card, enough throughput for a demo |
| Patent database | USPTO PatentsView | Free, no key, returns full abstracts, covers 10M+ patents |
| Web search | Brave Search | Free tier, privacy-respecting, returns clean results |
| Phonetic matching | jellyfish Python library | Industry-standard soundex + double metaphone, runs locally, no API needed |
| Text similarity | Python difflib | Built-in, no external dependency, sufficient for copyright checking |
| Frontend framework | Vite + React + Tailwind | Team's existing skill, fast build, Tailwind handles responsive design cleanly |
| Paid features | Shown but not built | Maximum pitch impact with minimum build time — judges see the full vision, not just the MVP |
| Authentication | None for MVP | Reduces scope by 2 days — use session cookies for rate limiting only |
| Database | None for MVP | All results are stateless — no storage needed for the demo |
