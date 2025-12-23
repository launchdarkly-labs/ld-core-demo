# LaunchDarkly Core Demo

A multi-industry demonstration application built on Next.js showcasing LaunchDarkly's feature management capabilities including feature flags, experimentation, AI integrations, and progressive delivery.

## Industry Verticals

| Vertical | Description | Route |
|----------|-------------|-------|
| **Toggle Bank** | Banking - account management, credit cards, mortgages | `/bank` |
| **Frontier Capital** | Investment - portfolio management, stock trading | `/investment` |
| **Launch Airways** | Airlines - flight booking, check-in, travel | `/airways` |
| **Galaxy Marketplace** | E-commerce - product catalog, shopping cart | `/marketplace` |
| **Risk Management Bureau** | Government - regulatory services | `/government` |

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: TailwindCSS with Radix UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Feature Management**: LaunchDarkly SDK (client + server)
- **AI Integration**: AWS Bedrock, OpenAI
- **Observability**: LaunchDarkly Telemetry & Session Replay

## Local Development

### Prerequisites

- Node.js 22+
- npm

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local  # or create .env.local manually

# Run development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_LD_CLIENT_KEY` | LaunchDarkly client-side SDK key |
| `LD_SDK_KEY` | LaunchDarkly server-side SDK key |
| `LD_API_KEY` | LaunchDarkly API key |
| `PROJECT_KEY` | LaunchDarkly project key |
| `OPENAI_API_KEY` | OpenAI API key (for AI chatbot) |
| `BEDROCK_GUARDRAIL_ID` | AWS Bedrock guardrail ID |
| `BEDROCK_KNOWLEDGE_ID` | AWS Bedrock knowledge base ID |

## Demo Environment Provisioning

Demo environments are provisioned via GitHub Actions workflows that automate the entire setup process.

### Available Workflows

| Workflow | Purpose |
|----------|---------|
| `cloud_demo_environment_create.yaml` | Creates a new demo environment |
| `cloud_demo_environment_recreate.yaml` | Rebuilds an existing environment |
| `cloud_demo_environment_deprovisioning.yaml` | Deletes a demo environment |

### Provisioning Process

1. **LaunchDarkly Setup**: Creates a new LD project with pre-configured feature flags
2. **Docker Build**: Builds and pushes container image to Amazon ECR
3. **Kubernetes Deployment**: Deploys to EKS cluster with dedicated namespace
4. **DNS Configuration**: Creates Route53 CNAME record at `{username}.launchdarklydemos.com`

### Triggering a New Environment

1. Navigate to **Actions** → **Core Demo Project Provisioning**
2. Click **Run workflow**
3. Enter your username
4. The environment will be available at `https://{username}.launchdarklydemos.com`

## Project Structure

```
├── components/          # React components
│   ├── ui/             # Reusable UI components (Radix-based)
│   ├── chatbot/        # AI chatbot component
│   └── generators/     # Automation generators
├── pages/              # Next.js pages and API routes
│   ├── api/            # Backend API endpoints
│   └── *.tsx           # Page components
├── lib/                # Data and utilities
├── utils/              # Helper functions and contexts
├── public/             # Static assets
├── styles/             # Global CSS
└── .github/workflows/  # CI/CD pipelines
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run linter
```

## Additional Documentation

For detailed architecture and system design, see [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md).
