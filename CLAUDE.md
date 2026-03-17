# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LaunchDarkly Core Demo — a Next.js multi-industry demo app showcasing LaunchDarkly feature flags, AI configs, experimentation, and observability across five verticals: Toggle Bank (`/bank`), Launch Airways (`/airways`), Frontier Capital (`/investment`), Galaxy Marketplace (`/marketplace`), and Risk Management Bureau (`/government`).

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

Playwright is configured for E2E tests (`playwright.config.ts`). No unit test framework is set up.

## Architecture

**Framework**: Next.js 16 (Pages Router) with React 19, TypeScript, TailwindCSS.

**Provider nesting** (`pages/_app.tsx`): App → LaunchDarkly (`ContextProvider`) → Login → Signup → Trips → LiveLogs. All state flows through React Context.

**LaunchDarkly integration**:
- Client-side: React SDK via `components/ContextProvider.tsx` with multi-context (user, device, location, experience, audience)
- Server-side: Node SDK via `utils/ld-server/serverClient.ts`
- AI Configs: accessed via `aiClient.agentConfig()` with config keys like `ai-config--togglebot-*`
- Telemetry: browser-telemetry plugin, session replay, observability SDK

**Multi-agent AI pipeline** (`lib/multi-agent.ts`): Three-stage chain — Triage → Specialist (routed by banking category) → Brand Voice. Each agent pulls its own AI config from LaunchDarkly. Supports both AWS Bedrock and OpenAI as LLM providers, selected dynamically based on model name patterns.

**API routes** (`pages/api/`): `chat.ts` is the main AI endpoint using Vercel AI SDK streaming. Other routes handle notifications, flag resets, guardrails, and live log streaming.

**Database**: PostgreSQL with Drizzle ORM. Schema in `schema/schema.ts`, migrations in `drizzle/`.

**Deployment**: Docker multi-stage build → EKS via GitHub Actions. Provisioning scripts in `.github/workflows/demo_provisioning_scripts/`.

## Key Patterns

- Each industry vertical has its own page file, CSS file, and component directory under `components/ui/`
- AI config keys follow the convention `ai-config--togglebot-{agent-name}`
- Client-only components use `next/dynamic` with `ssr: false`
- Live logs stream via `lib/log-stream.ts` using `pushLog()` for real-time UI feedback
- The `aiClient.tracker` on each config tracks success, duration, and token usage for LD metrics

## Environment Variables

See `.env.example`. Key groups:
- **LaunchDarkly**: `LD_SDK_KEY`, `NEXT_PUBLIC_LD_CLIENT_KEY`, `NEXT_PUBLIC_PROJECT_KEY`, `LD_API_KEY`
- **AWS/Bedrock**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`
- **OpenAI**: `OPENAI_API_KEY`
