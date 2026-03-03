# Policy Agent Node

 ToggleHealth UI and a multi-agent chat flow: **triage** → **specialist** (policy / provider / schedule) → **brand_agent** → **toxicity judge** → final response.

## System architecture

**Where triage picks the next agent (policy vs provider vs scheduler):**

- **Triage router** — [`server/triage.js`](server/triage.js): Uses LaunchDarkly AI Config `triage_agent` to call Bedrock; the model returns JSON with `query_type` (`policy_question`, `provider_lookup`, or `scheduler_agent`). Low confidence (&lt; 0.7) can set `escalationNeeded`; the chosen type is passed to the specialist step.
- **Specialist** — [`server/specialists.js`](server/specialists.js): One of three agents runs (Policy Specialist, Provider Specialist, or Schedule Agent), each with a simple Bedrock prompt. No RAG in this app; specialists answer from instructions only.
- **Brand Voice** (`brand_agent`) — [`server/brand.js`](server/brand.js): Takes the specialist’s raw reply and the original query, and returns the final customer-facing response in ToggleHealth’s voice (friendly, clear, helpful). **LLM Judge:** Judges are attached to the completion config in LaunchDarkly; when present, they run and results are shown in the judge panel.

```
                        ┌─────────────────┐
                        │   USER QUERY    │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │ TRIAGE ROUTER   │
                        │(triage_agent via│
                        │ LaunchDarkly)   │
                        └────────┬────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
    ┌───────▼────────┐   ┌───────▼─────────┐  ┌───────▼─────────┐
    │ POLICY         │   │ PROVIDER        │  │ SCHEDULE        │
    │ SPECIALIST     │   │ SPECIALIST      │  │ AGENT           │
    │                │   │                 │  │                 │
    │ policy_question│   │ provider_lookup │  │ scheduler_agent │
    └───────┬────────┘   └───────┬─────────┘  └───────┬─────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │ BRAND COMPLETION│
                        │ getCompletionConfig
                        │ + Bedrock converse
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ FINAL RESPONSE  │
                        │ to customer     │
                        └─────────────────┘
```

## Quick start (local)

```bash
cp .env.example .env.local
# Edit .env.local: set LD_SDK_KEY (optional if you set a session key in the UI); set AWS_PROFILE=aiconfigdemo and run: aws sso login --profile aiconfigdemo
npm install
npm run dev
```

Open http://localhost:3000.

## Project key and connections

The app uses a **project key** to connect to LaunchDarkly. You can run without setting `LD_SDK_KEY` in the environment.

**In the UI (top-left):**

1. Click the **settings (gear)** icon.
2. Enter your **LaunchDarkly project key** (e.g. `nteixeira-ld-demo`).
3. Click **Connect**. The server uses the LaunchDarkly API (`LD_API_KEY`) to:
   - Check the project exists (error if not).
   - Set the **project key** and **SDK key** for your session (SDK key is taken from the project’s **production** environment, or the first environment if production is missing).
4. The purple badge shows **Connected &lt;projectKey&gt;** and chat uses the resolved SDK key. The backend caches LD clients by SDK key (30‑minute TTL; cleanup every 5 minutes).

**Fallback:** If you do not connect in the UI, the server uses **`LD_SDK_KEY`** from the environment. If neither is set, chat returns an error.

**Terminal logs** are scoped to the current session (one per browser tab).

## Quick start (Docker)

```bash
docker build -t policy-agent-node .
```

**Docker (local)** — use your host AWS profile (e.g. SSO). Mount `~/.aws` and set `AWS_PROFILE`:

```bash
docker run -p 3000:3000 \
  -e LD_SDK_KEY=your-key \
  -e AWS_DEFAULT_REGION=us-east-1 \
  -e AWS_PROFILE=aiconfigdemo \
  -e HOME=/app \
  -v "$HOME/.aws:/app/.aws:ro" \
  policy-agent-node
```

Run `aws sso login --profile aiconfigdemo` on the host first. Alternatively use `--env-file .env` (do not commit `.env`).

**Docker (EKS / deployed)** — omit `AWS_PROFILE` and do not mount `~/.aws`; the SDK uses the pod IAM role (IRSA).


## Environment

| Variable | Description |
|----------|-------------|
| `LD_SDK_KEY` | Optional. Server-side SDK key used when no session is set via the UI. See [Project key and connections](#project-key-and-connections). |
| `LD_CLIENT_ID` | Optional. Client-side ID for browser Observability + Session Replay (from Project → Environments → SDK key). Passed from server to client. |
| `AWS_DEFAULT_REGION` | e.g. `us-east-1` |
| `AWS_PROFILE` | Local only: SSO profile (e.g. `aiconfigdemo`). Omit in Docker/EKS. |
| `PORT` | Server port (default 3000) |
| `LD_API_KEY` | Optional. LaunchDarkly API token for **Create AI configs** (see [Auto-generate AI configs](#auto-generate-ai-configs)). |

**Frontend observability**

When `LD_CLIENT_ID` is set, the app initializes the LaunchDarkly JavaScript SDK in the browser with the **Observability** plugin (errors, logs, traces, network) and **Session Replay** (privacy: `strict`). The same `LD_OBSERVABILITY_SERVICE_NAME` used on the server is passed to the frontend for consistent service naming. Data is sent to LaunchDarkly so you can inspect frontend metrics and replays in the Observability UI. If the client ID is unset, the app runs without the client SDK and only server-side observability applies.

**AWS credentials**

- **Local**: Set `AWS_PROFILE=yourprofile` in `.env.local` and run `aws sso login --profile yourprofile`..
- **EKS**: Do *not* set `AWS_PROFILE`. The SDK uses the default chain; in EKS this is the pod’s IAM role (IRSA)

## API

- `POST /api/chat`  
  Body: `{ "userInput": "…", "sdkKey": "sdk-…", "sessionId": "…" }`.  
  **`sdkKey`** (optional): set by Connect from the project’s production environment; if omitted, `LD_SDK_KEY` from the environment is used.  
  **`sessionId`** (optional): scopes backend terminal logs to this session.  
  Returns: `{ response, requestId, agentFlow, metrics }`. `response` is the brand-voiced final reply; `agentFlow` lists triage, specialist, and brand_agent.
- `GET /api/health`  
  Returns `{ status: "ok" }`.

## Auto-generate AI configs

You can seed a LaunchDarkly project with AI configs (agents, judges, completion configs) from a JSON file using the **Create AI configs** action in the settings dropdown.

**Setup**

1. **Seed file** — The repo includes **`ai-configs-seed.json`** in the project root (with an **`ai_configs`** array; format matches a LaunchDarkly export). Use it as-is or replace it with your own export.
2. **API token** — Set **`LD_API_KEY`** in `.env.local` (LaunchDarkly API token). Required for Connect and for Create AI configs.
3. **Target project** — Connect in the UI with a **project key** first. **Create AI configs** uses the session’s project key (no separate project key input). The button is disabled until you are connected.

**Deployed (Docker)** — The Dockerfile copies `ai-configs-seed.json` into the image at `/app/ai-configs-seed.json`. Keep the file in the build context (do not add it to `.dockerignore`). If the app still reports the seed file not found (e.g. different cwd), set **`AI_CONFIGS_SEED_PATH`** to the full path (e.g. `/app/ai-configs-seed.json`).

**Usage**

1. Open the **settings (gear)** menu and enter a **project key**.
2. Click **Connect** to validate the project and set the session (project key + SDK key for production env).
3. Click **Create AI configs** to seed the connected project from `ai-configs-seed.json`.

The response reports how many configs and variations were created and lists any failures (e.g. duplicate key or missing model).

## Project layout

```
policy-agent-node/
├── app/
│   ├── layout.js          # Root layout + globals.css
│   ├── page.js            # Home + Coverage Concierge chat (client)
│   └── api/
│       ├── chat/route.js  # POST /api/chat → server/triage
│       └── health/route.js
├── server/
│   ├── ai-config-defaults.js  # Default prompts/model per agent
│   ├── ld.js                  # LaunchDarkly client cache (by SDK key) + getAIConfig, runWithSdkKey
│   ├── triage.js              # Triage: LD config → Bedrock → queryType
│   ├── specialists.js         # Policy / Provider / Schedule specialists 
│   ├── brand.js               # Brand completion: specialist reply → final response
│   └── bedrock.js             # Bedrock Converse streaming
├── public/                 # Static assets (unchanged)
├── Dockerfile              # Multi-stage: deps → builder → runner
├── next.config.mjs
├── ai-configs-seed.json    # Seed file for Create AI configs (ai_configs array)
├── .env.example
├── .env.local             # copy from .env.example; not committed
└── package.json
```

### Addendum: Bedrock Converse — conversation must start with a user message

**Bedrock Converse API** requires the conversation to **start with a user message**. If the first message is a system message, you may see:

```text
ValidationException: A conversation must start with a user message. Try again with a conversation that starts with a user message.
```

**Fix in this repo (brand completion):** [`server/brand.js`](server/brand.js) calls `ensureUserFirst(messages)` before every Bedrock `converse()` for `brand_agent`. If the first message is not a user message (e.g. system), we prepend a user message (`"Begin."`) so the request is valid. You do not need to change your LaunchDarkly AI Config; the app handles it.

**Alternative:** In LaunchDarkly, you can instead configure the completion so the first message in the prompt is already a user message (e.g. put instructions in a later system turn or in the user content).

### Addendum: Judges and Bedrock

The app runs judges by calling Bedrock directly with **user-first messages** (we prepend “Begin the evaluation.” when the judge’s first message is system), so no SDK patch is needed. If you run judges in the **Python notebook** with Bedrock and see `ValidationException: A conversation must start with a user message`, use the same approach there or configure the judge in the LaunchDarkly UI so the first message is a user message.

### Bedrock: "On-demand throughput isn't supported"

If you see:

```text
ValidationException: Invocation of model ID ... with on-demand throughput isn't supported. Retry your request with the ID or ARN of an inference profile that contains this model.
```

**Meaning:** That model is only available via **provisioned throughput** in Bedrock, not on-demand. You're calling it by model ID (on-demand); Bedrock wants an **inference profile** ID/ARN instead.

**Fix:** In LaunchDarkly, set the model to the **inference profile** ID/ARN for that model (from the Bedrock console), or switch to a model that supports on-demand (e.g. `anthropic.claude-3-5-sonnet-20241022-v2:0`).

---

**TODO**
- Finalize KBs and implement in configs for RAG
- Judge metrics sent to LD (scores/traces)
