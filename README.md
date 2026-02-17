# Policy Agent Node

 ToggleHealth UI and a multi-agent chat flow: **triage** → **specialist** (policy / provider / schedule) → **brand agent** → final response.

## System architecture

**Where triage picks the next agent (policy vs provider vs scheduler):**

- **Triage router** — [`server/triage.js`](server/triage.js): Uses LaunchDarkly AI Config `triage_agent` to call Bedrock; the model returns JSON with `query_type` (`policy_question`, `provider_lookup`, or `scheduler_agent`). Low confidence (&lt; 0.7) can set `escalationNeeded`; the chosen type is passed to the specialist step.
- **Specialist** — [`server/specialists.js`](server/specialists.js): One of three agents runs (Policy Specialist, Provider Specialist, or Schedule Agent), each with a simple Bedrock prompt. No RAG in this app; specialists answer from instructions only.
- **Brand agent** — [`server/brand.js`](server/brand.js): Takes the specialist’s raw reply and the original query, and returns the final customer-facing response in ToggleHealth’s voice (friendly, clear, helpful).

-- **TODO** Implement Judge flow for metrics and obserability

```
                        ┌─────────────────┐
                        │   USER QUERY    │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │ TRIAGE ROUTER   │
                        │ (triage_agent   │
                        │  via LaunchDarkly)
                        └────────┬────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
    ┌───────▼────────┐   ┌───────▼─────────┐  ┌───────▼─────────┐
    │ POLICY         │   │ PROVIDER        │  │ SCHEDULE        │
    │ SPECIALIST     │   │ SPECIALIST      │  │ AGENT           │
    │                │   │                 │  │                 │
    │ policy_question│   │ provider_lookup │  │ scheduler_agent  │
    └───────┬────────┘   └───────┬─────────┘  └───────┬─────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │  BRAND AGENT    │
                        │  (final voice)  │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │ FINAL RESPONSE  │
                        │ to customer     │
                        └─────────────────┘
```

## Quick start (local)

```bash
cp .env.example .env.local
# Edit .env.local: set LD_SDK_KEY; set AWS_PROFILE=aiconfigdemo and run: aws sso login --profile aiconfigdemo
npm install
npm run dev
```

Open http://localhost:3000.

## Quick start (Docker)

```bash
docker build -t policy-agent-node .
```

**Docker (local)** — use your host AWS profile (e.g. SSO). Mount `~/.aws` and set `AWS_PROFILE`:

```bash
docker run -p 3000:3000 \
  -e LD_SDK_KEY=your-key \
  -e AWS_REGION=us-east-1 \
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
| `LD_SDK_KEY` | Server-side SDK key |
| `LD_CLIENT_ID` | Optional. Client-side ID for browser Observability + Session Replay (from Project → Environments → SDK key). Passed from server to client. |
| `AWS_REGION` | e.g. `us-east-1` |
| `AWS_PROFILE` | Local only: SSO profile (e.g. `aiconfigdemo`). Omit in Docker/EKS. |
| `PORT` | Server port (default 3000) |

**Frontend observability**

When `LD_CLIENT_ID` is set, the app initializes the LaunchDarkly JavaScript SDK in the browser with the **Observability** plugin (errors, logs, traces, network) and **Session Replay** (privacy: `strict`). The same `LD_OBSERVABILITY_SERVICE_NAME` used on the server is passed to the frontend for consistent service naming. Data is sent to LaunchDarkly so you can inspect frontend metrics and replays in the Observability UI. If the client ID is unset, the app runs without the client SDK and only server-side observability applies.

**AWS credentials**

- **Local**: Set `AWS_PROFILE=yourprofile` in `.env.local` and run `aws sso login --profile yourprofile`..
- **EKS**: Do *not* set `AWS_PROFILE`. The SDK uses the default chain; in EKS this is the pod’s IAM role (IRSA)

## API

- `POST /api/chat`  
  Body: `{ "userInput": "What's my copay for a specialist?" }`  
  Returns: `{ response, requestId, agentFlow, metrics }`. `response` is the brand-voiced final reply; `agentFlow` lists triage, specialist, and brand_agent.
- `GET /api/health`  
  Returns `{ status: "ok" }`.

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
│   ├── ld.js                  # LaunchDarkly client + getAIConfig
│   ├── triage.js              # Triage: LD config → Bedrock → queryType
│   ├── specialists.js         # Policy / Provider / Schedule specialists 
│   ├── brand.js               # Brand agent: specialist reply → final response
│   └── bedrock.js             # Bedrock Converse streaming
├── public/                 # Static assets (unchanged)
├── Dockerfile              # Multi-stage: deps → builder → runner
├── next.config.mjs
├── .env.example
├── .env.local             # copy from .env.example; not committed
└── package.json
```

**TODO**
- Finalize KBs and implement in configs for RAG
- Implement Judge w/ metrics sent to LD
- Auto upload LLM configs & tools to project
- Auto create experiment and realistic dummy data
