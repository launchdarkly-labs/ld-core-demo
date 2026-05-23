# SiriusXM Plans Demo

A static Next.js recreation of the [SiriusXM plans page](https://www.siriusxm.com/plans), built for demo hosting on Kubernetes.

## Local development

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_LD_CLIENT_SIDE_ID from LaunchDarkly → nteixeira-ld-demo → Production
npm install
npm run dev
```

Open http://localhost:3000.

## Subscribe checkout (LaunchDarkly)

Plan CTAs (`Get All Music`, `Get All Access`) route via flag **`subscriber-flow-version`** (string: `v1` or `v2`):

| Variation | URL |
|-----------|-----|
| `v1` (default) | `/subscribe/v1` |
| `v2` | `/subscribe/v2` |

Checkout HTML lives under `public/subscribe/`:

- **v1** — saved SiriusXM car-radio verification flow (`v1.html` + `Subscribe to SiriusXM_v1_files/`)
- **v2** — streamlined email signup (`v2.html`, self-contained)

These URLs work without LaunchDarkly; CTAs still default to v1 when the SDK is absent.

In LaunchDarkly, create **`subscriber-flow-version`** in the **same project** as your `NEXT_PUBLIC_LD_CLIENT_SIDE_ID`, then change fallthrough or add a targeting rule to serve `v2` for testing.

### UTM context attributes

Landing on the plans page with UTM query params (e.g. `/?utm_source=mock&utm_medium=test&utm_campaign=utm_mock`) stores them in `sessionStorage` and sends them on the LaunchDarkly user context (`utm_source`, `utm_medium`, `utm_campaign`, etc.) via `identify()`. Use these attributes in flag targeting rules.

## Docker

```bash
touch .env.production
docker build -t siriusxm-plans-demo .
docker run -p 3000:3000 siriusxm-plans-demo
```

## Deploy

Cloud demo environments are provisioned via GitHub Actions (`.github/workflows/cloud_demo_environment_*.yaml`), which build this image, push to ECR, and apply `.github/workflows/deploy_files/deploy.yaml` to the cluster.

Health check: `GET /api/health` returns `{ "status": "ok" }`.
