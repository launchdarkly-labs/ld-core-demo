#!/usr/bin/env node
/**
 * Audience noise generator.
 *
 * WHY THIS EXISTS
 * ---------------
 * The Python `results_generator.py` uses the LaunchDarkly SERVER-SIDE SDK, which
 * ships `summary` events (rolled-up counts). Those populate the flag evaluations
 * chart but NOT the Audience tab — per LD docs, "flag audiences include only
 * evaluations sent from supported client-side SDK versions."
 *
 * This script uses the Node CLIENT-SIDE SDK (`@launchdarkly/node-client-sdk`)
 * so its evaluations show up on the Audience tab with per-context detail.
 *
 * REALISM
 * -------
 * Contexts are engineered to pass the "does this look like real traffic"
 * smell test:
 *   - Realistic first/last names, email addresses (no "Test User xyz")
 *   - Weighted attribute distributions (Chrome-heavy, en-US-heavy, etc.)
 *   - Correlated attributes (iOS → Safari, NY → America/New_York, etc.)
 *   - Repeat users (30% of evals reuse a returning-user pool by default)
 *   - Optional time-spread mode with sine-wave pacing for peak/off-peak traffic
 *
 * HOW TO RUN
 * ----------
 *   # Uses your current .env.local
 *   node --env-file=.env.local scripts/generate-audience-noise.mjs
 *
 *   # Or via npm
 *   npm run noise
 *
 *   # Configure via env vars
 *   NUM_CONTEXTS=10000 npm run noise
 *   FLAGS=wealthManagement,paymentEngineHealthyRollout npm run noise
 *   DURATION_MINUTES=120 npm run noise   # spread over 2 hours w/ sine pacing
 *   REPEAT_RATE=0.4 npm run noise        # 40% returning users
 *
 * REQUIRED ENV VARS
 * -----------------
 *   NEXT_PUBLIC_LD_CLIENT_KEY   The client-side ID for the target LD environment
 *
 * OPTIONAL ENV VARS
 * -----------------
 *   NUM_CONTEXTS       How many total evaluations to run (default 5000)
 *   FLAGS              Comma-separated flag keys (default: bank flags)
 *   REPEAT_RATE        0.0-1.0, fraction of evals that reuse a prior context
 *                      (default 0.3). Set to 0 for all-unique.
 *   DURATION_MINUTES   Spread the run over this many minutes with a sine-wave
 *                      traffic curve. 0 = as fast as possible (default 0).
 *   FLUSH_EVERY        Flush events every N iterations (default 25)
 *   LOG_EVERY          Log progress every N iterations (default 500)
 *   EVENTS_CAPACITY    SDK event queue capacity (default 10000)
 */

import { createClient } from '@launchdarkly/node-client-sdk';
import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------

const CLIENT_SIDE_ID = process.env.NEXT_PUBLIC_LD_CLIENT_KEY;
if (!CLIENT_SIDE_ID) {
  console.error(
    'ERROR: NEXT_PUBLIC_LD_CLIENT_KEY not set. Load it from .env.local first:\n' +
      '  node --env-file=.env.local scripts/generate-audience-noise.mjs',
  );
  process.exit(1);
}

const NUM_CONTEXTS = parseInt(process.env.NUM_CONTEXTS ?? '5000', 10);
const REPEAT_RATE = clampFloat(process.env.REPEAT_RATE ?? '0.3', 0, 1);
const DURATION_MINUTES = Math.max(0, parseFloat(process.env.DURATION_MINUTES ?? '0'));
const FLUSH_EVERY = parseInt(process.env.FLUSH_EVERY ?? '25', 10);
const LOG_EVERY = parseInt(process.env.LOG_EVERY ?? '500', 10);
const EVENTS_CAPACITY = parseInt(process.env.EVENTS_CAPACITY ?? '10000', 10);

const DEFAULT_FLAGS = [
  // If a flag doesn't exist in the target LD env yet, the SDK logs an
  // "Unknown feature flag" warning and skips it — safe to leave listed.
  'wealthManagement',
  'wealthManagementLearnMoreOverlay',
  'federatedAccounts',
  'paymentEngineHealthyRollout',
  'paymentProcessingV2FailedRollout',
  'paymentProcessingInteractiveDemo',
  'showDifferentSpecialOfferString',
  'releaseNewSignupPromo',
  'swapWidgetPositions',
  'transactionMonitoring',
  'paymentKillSwitch',
  'enhancedFraudMonitoring',
];

const FLAGS = (process.env.FLAGS?.split(',').map((s) => s.trim()).filter(Boolean)) ?? DEFAULT_FLAGS;

// -----------------------------------------------------------------------------
// Realistic name pool — common US first names + surnames.
// 60 × 60 = 3600 unique combos, more than enough for the returning-user pool.
// -----------------------------------------------------------------------------

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph',
  'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy',
  'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Sandra', 'Mark', 'Ashley',
  'Donald', 'Kimberly', 'Steven', 'Emily', 'Paul', 'Donna', 'Andrew', 'Michelle',
  'Joshua', 'Carol', 'Kenneth', 'Amanda', 'Kevin', 'Melissa', 'Brian', 'Deborah',
  'George', 'Stephanie', 'Timothy', 'Rebecca', 'Ronald', 'Laura', 'Jason',
  'Sharon', 'Edward', 'Cynthia', 'Jeffrey', 'Kathleen', 'Ryan', 'Amy',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes',
];

const EMAIL_DOMAINS = [
  { value: 'gmail.com', weight: 0.55 },
  { value: 'yahoo.com', weight: 0.15 },
  { value: 'outlook.com', weight: 0.10 },
  { value: 'hotmail.com', weight: 0.08 },
  { value: 'icloud.com', weight: 0.07 },
  { value: 'aol.com', weight: 0.03 },
  { value: 'protonmail.com', weight: 0.02 },
];

// -----------------------------------------------------------------------------
// Weighted attribute distributions — biased toward real-world traffic
// -----------------------------------------------------------------------------

// City → timezone + population weight. Population weights are rough US metro
// approximations so the noise leans toward larger markets.
const LOCATIONS = [
  { city: 'New York', timezone: 'America/New_York', weight: 20 },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', weight: 13 },
  { city: 'Chicago', timezone: 'America/Chicago', weight: 9 },
  { city: 'Houston', timezone: 'America/Chicago', weight: 7 },
  { city: 'Phoenix', timezone: 'America/Phoenix', weight: 5 },
  { city: 'Philadelphia', timezone: 'America/New_York', weight: 6 },
  { city: 'San Antonio', timezone: 'America/Chicago', weight: 4 },
  { city: 'San Diego', timezone: 'America/Los_Angeles', weight: 4 },
  { city: 'Dallas', timezone: 'America/Chicago', weight: 6 },
  { city: 'Miami', timezone: 'America/New_York', weight: 5 },
  { city: 'Seattle', timezone: 'America/Los_Angeles', weight: 4 },
  { city: 'Boston', timezone: 'America/New_York', weight: 5 },
  { city: 'Denver', timezone: 'America/Denver', weight: 3 },
  { city: 'Atlanta', timezone: 'America/New_York', weight: 5 },
  { city: 'Detroit', timezone: 'America/New_York', weight: 3 },
  { city: 'Minneapolis', timezone: 'America/Chicago', weight: 3 },
];

const LANGUAGES = [
  { value: 'en-US', weight: 0.72 },
  { value: 'en-GB', weight: 0.08 },
  { value: 'es-ES', weight: 0.07 },
  { value: 'es-MX', weight: 0.06 },
  { value: 'fr-FR', weight: 0.03 },
  { value: 'de-DE', weight: 0.02 },
  { value: 'pt-BR', weight: 0.02 },
];

const TIERS = [
  { value: 'Standard', weight: 0.85 },
  { value: 'Platinum', weight: 0.15 },
];

const ACCOUNT_TYPES = [
  { value: 'personal', weight: 0.78 },
  { value: 'business', weight: 0.22 },
];

const REFERRERS = [
  { value: 'direct', weight: 0.35 },
  { value: 'google', weight: 0.30 },
  { value: 'social', weight: 0.15 },
  { value: 'email', weight: 0.12 },
  { value: 'partner', weight: 0.08 },
];

const UTM_SOURCES = [
  { value: 'google', weight: 0.35 },
  { value: 'facebook', weight: 0.25 },
  { value: 'linkedin', weight: 0.12 },
  { value: 'twitter', weight: 0.08 },
  { value: 'email', weight: 0.15 },
  { value: 'reddit', weight: 0.05 },
];

const UTM_MEDIUMS = [
  { value: 'cpc', weight: 0.35 },
  { value: 'organic', weight: 0.30 },
  { value: 'social', weight: 0.18 },
  { value: 'email', weight: 0.12 },
  { value: 'display', weight: 0.05 },
];

const UTM_CAMPAIGNS = [
  { value: 'spring_sale', weight: 0.20 },
  { value: 'summer_promo', weight: 0.20 },
  { value: 'winter_deals', weight: 0.15 },
  { value: 'holiday_special', weight: 0.20 },
  { value: 'q4_push', weight: 0.15 },
  { value: 'brand_awareness', weight: 0.10 },
];

// -----------------------------------------------------------------------------
// Correlated attribute logic
// -----------------------------------------------------------------------------

// Device type → probability of picking each OS.
const OS_BY_DEVICE = {
  mobile: [
    { value: 'ios', weight: 0.55 },
    { value: 'android', weight: 0.45 },
  ],
  tablet: [
    { value: 'ios', weight: 0.75 }, // iPads dominate
    { value: 'android', weight: 0.25 },
  ],
  desktop: [
    { value: 'windows', weight: 0.65 },
    { value: 'macos', weight: 0.32 },
    { value: 'linux', weight: 0.03 },
  ],
};

// OS → probability of picking each browser.
const BROWSER_BY_OS = {
  ios: [
    { value: 'safari', weight: 0.78 },
    { value: 'chrome', weight: 0.18 },
    { value: 'firefox', weight: 0.04 },
  ],
  android: [
    { value: 'chrome', weight: 0.82 },
    { value: 'firefox', weight: 0.08 },
    { value: 'samsung_internet', weight: 0.10 },
  ],
  macos: [
    { value: 'safari', weight: 0.50 },
    { value: 'chrome', weight: 0.40 },
    { value: 'firefox', weight: 0.08 },
    { value: 'edge', weight: 0.02 },
  ],
  windows: [
    { value: 'chrome', weight: 0.68 },
    { value: 'edge', weight: 0.22 },
    { value: 'firefox', weight: 0.09 },
    { value: 'opera', weight: 0.01 },
  ],
  linux: [
    { value: 'firefox', weight: 0.50 },
    { value: 'chrome', weight: 0.45 },
    { value: 'edge', weight: 0.05 },
  ],
};

// Device type distribution overall — mobile-heavy like most modern apps.
const DEVICE_TYPES = [
  { value: 'mobile', weight: 0.55 },
  { value: 'desktop', weight: 0.35 },
  { value: 'tablet', weight: 0.10 },
];

// -----------------------------------------------------------------------------
// Random helpers
// -----------------------------------------------------------------------------

function clampFloat(str, min, max) {
  const n = parseFloat(str);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * totalWeight;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value ?? item;
  }
  return items[items.length - 1].value ?? items[items.length - 1];
}

function pickLocation() {
  const totalWeight = LOCATIONS.reduce((sum, l) => sum + l.weight, 0);
  let r = Math.random() * totalWeight;
  for (const loc of LOCATIONS) {
    r -= loc.weight;
    if (r <= 0) return loc;
  }
  return LOCATIONS[0];
}

function makeName() {
  const first = FIRST_NAMES[randInt(0, FIRST_NAMES.length - 1)];
  const last = LAST_NAMES[randInt(0, LAST_NAMES.length - 1)];
  return { first, last, full: `${first} ${last}` };
}

function makeEmail(first, last) {
  const domain = pickWeighted(EMAIL_DOMAINS);
  const styleRoll = Math.random();
  let local;
  if (styleRoll < 0.4) {
    // sarah.chen
    local = `${first.toLowerCase()}.${last.toLowerCase()}`;
  } else if (styleRoll < 0.7) {
    // schen or sarahc
    local = `${first[0].toLowerCase()}${last.toLowerCase()}`;
  } else if (styleRoll < 0.9) {
    // sarah.chen42
    local = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1, 99)}`;
  } else {
    // sarahchen1988
    local = `${first.toLowerCase()}${last.toLowerCase()}${randInt(1970, 2005)}`;
  }
  return `${local}@${domain}`;
}

function makeFreshContext() {
  const { first, last, full } = makeName();
  const email = makeEmail(first, last);

  // Coupled: device → os → browser
  const deviceType = pickWeighted(DEVICE_TYPES);
  const os = pickWeighted(OS_BY_DEVICE[deviceType]);
  const browser = pickWeighted(BROWSER_BY_OS[os]);

  // Coupled: location → timezone
  const location = pickLocation();

  // Account age correlated with device: mobile users skew newer
  let accountAge;
  if (deviceType === 'mobile') {
    accountAge = randInt(1, 24); // 1-24 months
  } else if (deviceType === 'tablet') {
    accountAge = randInt(3, 48);
  } else {
    accountAge = randInt(6, 84); // 6 mo - 7 years
  }

  const lastLoginDaysAgo = randInt(0, 30);
  const lastLogin = new Date(Date.now() - lastLoginDaysAgo * 86_400_000).toISOString();

  // Stable per-user attributes; keep the UUID for uniqueness of the key
  const key = `user-${randomUUID()}`;

  return {
    kind: 'user',
    key,
    name: full,
    firstName: first,
    lastName: last,
    email,
    tier: pickWeighted(TIERS),
    accountType: pickWeighted(ACCOUNT_TYPES),
    accountAge,
    lastLogin,
    location: location.city,
    timezone: location.timezone,
    deviceType,
    browser,
    os,
    language: pickWeighted(LANGUAGES),
    referrer: pickWeighted(REFERRERS),
    utm_source: pickWeighted(UTM_SOURCES),
    utm_medium: pickWeighted(UTM_MEDIUMS),
    utm_campaign: pickWeighted(UTM_CAMPAIGNS),
  };
}

// -----------------------------------------------------------------------------
// Returning-user pool
// -----------------------------------------------------------------------------

/** Pool of previously-seen contexts, used to simulate repeat visitors. */
const returningPool = [];
const MAX_POOL_SIZE = 800; // cap so memory stays bounded on long runs

function pickReturningOrFresh() {
  // Guarantee we have a warm-up before we consider returns
  if (returningPool.length < 25 || Math.random() > REPEAT_RATE) {
    const fresh = makeFreshContext();
    if (returningPool.length < MAX_POOL_SIZE) {
      returningPool.push(fresh);
    } else if (Math.random() < 0.1) {
      // Occasionally rotate the pool so it's not stuck with only the first N
      returningPool[randInt(0, returningPool.length - 1)] = fresh;
    }
    return { ctx: fresh, isReturning: false };
  }
  const ctx = returningPool[randInt(0, returningPool.length - 1)];
  return { ctx, isReturning: true };
}

// -----------------------------------------------------------------------------
// Telemetry injection (errors, logs, traces)
// -----------------------------------------------------------------------------
//
// For flags in TELEMETRY_CONFIG we emit `$ld:telemetry:*` events after each
// evaluation. This is the same event convention used elsewhere in the app
// (see components/generators/guarded-release-generator/paymentErrorGenerator.tsx),
// which LD Observability ingests into the Errors / Logs / Traces views under
// a flag's Monitoring tab.

const ERROR_TYPES = [
  { kind: 'PaymentGatewayTimeout',
    message: 'Payment gateway timed out after 30000ms — no response from upstream',
    severity: 'high', service: 'payment-processor', httpStatus: 504 },
  { kind: 'TransactionValidationError',
    message: 'Card validation failed: card_number must be 15-19 digits',
    severity: 'medium', service: 'validation-service', httpStatus: 422 },
  { kind: 'DatabaseConnectionError',
    message: 'Database connection pool exhausted (max_connections=100)',
    severity: 'high', service: 'transaction-db', httpStatus: 503 },
  { kind: 'PaymentProcessorException',
    message: 'Payment processor returned 500 Internal Server Error',
    severity: 'high', service: 'payment-processor', httpStatus: 500 },
  { kind: 'InsufficientFundsError',
    message: 'Insufficient funds: available_balance < requested_amount',
    severity: 'low', service: 'account-service', httpStatus: 402 },
  { kind: 'NetworkError',
    message: 'ECONNRESET reading from upstream payment provider',
    severity: 'medium', service: 'payment-processor', httpStatus: 502 },
  { kind: 'AuthenticationFailure',
    message: 'Invalid or expired auth token when calling payment gateway',
    severity: 'high', service: 'auth-service', httpStatus: 401 },
  { kind: 'RateLimitExceeded',
    message: 'Rate limit exceeded: 429 from payment processor (1000/min)',
    severity: 'medium', service: 'payment-processor', httpStatus: 429 },
  { kind: 'CircuitBreakerOpen',
    message: 'Circuit breaker is OPEN for payment-gateway; failing fast',
    severity: 'high', service: 'payment-processor', httpStatus: 503 },
  { kind: 'IdempotencyKeyConflict',
    message: 'Duplicate idempotency key detected; possible retry storm',
    severity: 'low', service: 'payment-processor', httpStatus: 409 },
];

const LOG_TEMPLATES = {
  info: [
    'Payment request received',
    'Validating card details for user',
    'Contacting payment gateway',
    'Payment gateway responded successfully',
    'Recording transaction in ledger',
    'Notifying user of successful payment',
    'Payment completed',
  ],
  warn: [
    'Payment gateway latency elevated (p95 > 800ms)',
    'Retrying failed payment webhook (attempt 2/3)',
    'Slow database query on transactions table (>500ms)',
    'Circuit breaker half-open; probing upstream',
    'High memory usage on payment-processor pod',
  ],
  error: [
    'Payment gateway request failed',
    'Failed to record transaction; rolling back',
    'Uncaught exception in payment handler',
    'Webhook delivery failed after 3 retries',
  ],
  debug: [
    'Loaded payment routing rules from cache',
    'Emitted metric payment.duration',
    'Flushed event queue',
  ],
};

// Which flags emit telemetry, at what rate, and on which variation values.
// - `unhealthyRate` fires when the flag returns the "bad" variation (e.g. the
//   failed rollout scenario). High rates make the Errors tab visibly worse.
// - `baselineRate` fires regardless, at a low rate, so healthy flags don't
//   have empty Monitoring tabs. Real apps always have some baseline errors.
const TELEMETRY_CONFIG = {
  paymentProcessingV2FailedRollout: {
    service: 'payment-processor-v2',
    unhealthyOnValue: true,
    unhealthyRate: { errors: 10, logs: 8, traces: 2 },
    baselineRate: { errors: 0.2, logs: 2, traces: 0.5 },
  },
  paymentKillSwitch: {
    service: 'payment-processor',
    unhealthyOnValue: false, // "kill switched" state
    unhealthyRate: { errors: 6, logs: 6, traces: 1.5 },
    baselineRate: { errors: 0.3, logs: 2, traces: 0.5 },
  },
  paymentEngineHealthyRollout: {
    service: 'payment-engine',
    unhealthyOnValue: null, // no failure story; baseline only
    unhealthyRate: null,
    baselineRate: { errors: 0.15, logs: 2, traces: 0.5 },
  },
};

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function newTraceId() {
  return randomUUID().replace(/-/g, '');
}

function newSpanId() {
  return randomUUID().replace(/-/g, '').slice(0, 16);
}

// Poisson-ish sampler: given an average rate (may be fractional), return an
// integer count for this iteration. e.g. rate=0.5 → 50% chance of 1, else 0.
function drawCount(rate) {
  if (rate <= 0) return 0;
  const whole = Math.floor(rate);
  const frac = rate - whole;
  return whole + (Math.random() < frac ? 1 : 0);
}

function fakeStack(errorKind, service) {
  return [
    `${errorKind}: at ${service}.processPayment (/app/src/${service}/index.js:142:19)`,
    `    at handleRequest (/app/src/server/router.js:87:13)`,
    `    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)`,
    `    at next (/app/node_modules/express/lib/router/route.js:144:13)`,
    `    at Route.dispatch (/app/node_modules/express/lib/router/route.js:114:3)`,
  ].join('\n');
}

function emitTelemetry(client, flagKey, flagValue, ctx) {
  const config = TELEMETRY_CONFIG[flagKey];
  if (!config) return;

  const isUnhealthy =
    config.unhealthyOnValue !== null && flagValue === config.unhealthyOnValue;
  const rates = isUnhealthy ? config.unhealthyRate : config.baselineRate;
  if (!rates) return;

  const traceId = newTraceId();
  const parentSpanId = newSpanId();

  const errorCount = drawCount(rates.errors);
  const logCount = drawCount(rates.logs);
  const traceCount = drawCount(rates.traces);

  for (let i = 0; i < errorCount; i++) {
    const err = pick(ERROR_TYPES);
    client.track(
      '$ld:telemetry:error',
      {
        'error.kind': err.kind,
        'error.message': err.message,
        'error.stack': fakeStack(err.kind, err.service),
        'service.name': err.service,
        'http.status_code': err.httpStatus,
        'severity': err.severity,
        'component': 'payment-processing',
        'flag.key': flagKey,
        'flag.value': String(flagValue),
        'user.id': ctx.key,
        'user.tier': ctx.tier,
        'trace.id': traceId,
        'span.id': newSpanId(),
        'transaction.id': `txn-${randInt(100000, 999999)}`,
        'region': 'us-east-1',
        'timestamp': new Date().toISOString(),
      },
      1,
    );
  }

  for (let i = 0; i < logCount; i++) {
    const level = pickWeighted([
      { value: 'info', weight: isUnhealthy ? 0.4 : 0.6 },
      { value: 'warn', weight: isUnhealthy ? 0.3 : 0.25 },
      { value: 'error', weight: isUnhealthy ? 0.25 : 0.1 },
      { value: 'debug', weight: 0.05 },
    ]);
    client.track(
      '$ld:telemetry:log',
      {
        'log.level': level,
        'log.message': pick(LOG_TEMPLATES[level]),
        'service.name': config.service,
        'component': 'payment-processing',
        'flag.key': flagKey,
        'flag.value': String(flagValue),
        'user.id': ctx.key,
        'trace.id': traceId,
        'span.id': newSpanId(),
        'timestamp': new Date().toISOString(),
      },
      1,
    );
  }

  for (let i = 0; i < traceCount; i++) {
    const rootDuration = randInt(15, 350);
    const childSpans = [
      { name: 'payment.validate', duration: randInt(2, 25) },
      { name: 'payment.charge', duration: randInt(20, 250) },
      { name: 'payment.record', duration: randInt(3, 40) },
      { name: 'payment.notify', duration: randInt(5, 30) },
    ];
    client.track(
      '$ld:telemetry:trace',
      {
        'trace.id': traceId,
        'span.id': parentSpanId,
        'span.name': 'payment.process',
        'span.duration_ms': rootDuration,
        'span.status': isUnhealthy && Math.random() < 0.6 ? 'ERROR' : 'OK',
        'service.name': config.service,
        'child.spans': JSON.stringify(childSpans),
        'flag.key': flagKey,
        'flag.value': String(flagValue),
        'user.id': ctx.key,
        'http.method': 'POST',
        'http.route': '/api/payments',
        'timestamp': new Date().toISOString(),
      },
      1,
    );
  }
}

// -----------------------------------------------------------------------------
// Time-spread pacing
// -----------------------------------------------------------------------------

/**
 * Given the current iteration and total, return the target elapsed time (ms)
 * from the start of the run. Uses a sine-wave-modulated distribution so the
 * middle of the window is a peak and the edges are calmer — mimics a business-
 * hours traffic curve.
 */
function targetElapsedMs(iteration, total, durationMs) {
  if (durationMs <= 0) return 0;
  // Flat progress: iteration / total
  const flat = iteration / total;
  // Sine-modulated CDF: F(x) = x - (sin(2πx) / (2π)) * amplitude
  // amplitude controls how much the peak differs from flat.
  const amplitude = 0.35;
  const modulated = flat - (Math.sin(2 * Math.PI * flat) / (2 * Math.PI)) * amplitude;
  return modulated * durationMs;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// -----------------------------------------------------------------------------
// Main loop
// -----------------------------------------------------------------------------

async function main() {
  console.log(`\n🎯 Audience noise generator`);
  console.log(`   Client-side ID:  ${CLIENT_SIDE_ID.slice(0, 8)}…`);
  console.log(`   Iterations:      ${NUM_CONTEXTS.toLocaleString()}`);
  console.log(`   Repeat rate:     ${(REPEAT_RATE * 100).toFixed(0)}%`);
  console.log(`   Duration:        ${DURATION_MINUTES > 0 ? `${DURATION_MINUTES} min (sine-wave paced)` : 'as fast as possible'}`);
  console.log(`   Flags:           ${FLAGS.length} (${FLAGS.join(', ')})`);
  console.log(`   Flush every:     ${FLUSH_EVERY}`);
  console.log('');

  const initialContext = makeFreshContext();
  returningPool.push(initialContext);

  const client = createClient(CLIENT_SIDE_ID, initialContext, {
    capacity: EVENTS_CAPACITY,
    logger: {
      debug: () => {},
      info: () => {},
      warn: (msg) => console.warn(`[LD warn] ${msg}`),
      error: (msg) => console.error(`[LD error] ${msg}`),
    },
  });

  const initResult = await client.start({ timeout: 15 });
  if (initResult.status !== 'complete') {
    console.error(`SDK failed to initialize: ${JSON.stringify(initResult)}`);
    process.exit(1);
  }
  console.log('✓ SDK initialized. Beginning noise generation...\n');

  // Evaluate flags for the initial context and emit any configured telemetry.
  for (const flag of FLAGS) {
    const value = client.variation(flag, null);
    emitTelemetry(client, flag, value, initialContext);
  }

  const durationMs = DURATION_MINUTES * 60_000;
  const startTime = Date.now();
  let failures = 0;
  let returningCount = 0;

  for (let i = 1; i < NUM_CONTEXTS; i++) {
    // Pacing (only if a duration was requested)
    if (durationMs > 0) {
      const target = targetElapsedMs(i, NUM_CONTEXTS, durationMs);
      const actual = Date.now() - startTime;
      const wait = target - actual;
      if (wait > 0) await sleep(wait);
    }

    const { ctx, isReturning } = pickReturningOrFresh();
    if (isReturning) returningCount += 1;

    try {
      await client.identify(ctx);
      for (const flag of FLAGS) {
        const value = client.variation(flag, null);
        emitTelemetry(client, flag, value, ctx);
      }
    } catch (err) {
      failures += 1;
      if (failures <= 5) {
        console.error(`  ! identify failed for ${ctx.key}: ${err?.message ?? err}`);
      }
    }

    if ((i + 1) % FLUSH_EVERY === 0) {
      await client.flush();
    }
    if ((i + 1) % LOG_EVERY === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = (i + 1) / elapsed;
      const eta = (NUM_CONTEXTS - (i + 1)) / rate;
      const uniquePool = returningPool.length;
      console.log(
        `  ${(i + 1).toLocaleString()}/${NUM_CONTEXTS.toLocaleString()} ` +
          `(${rate.toFixed(1)}/s, eta ${eta.toFixed(0)}s, ` +
          `${uniquePool} unique users, ${returningCount} repeat hits)`,
      );
    }
  }

  console.log('\n⏳ Flushing final events...');
  await client.flush();
  await client.close();

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalEvals = NUM_CONTEXTS * FLAGS.length;
  const uniqueUsers = returningPool.length;
  console.log(`\n✓ Done in ${totalElapsed}s`);
  console.log(`  Iterations:        ${NUM_CONTEXTS.toLocaleString()}`);
  console.log(`  Unique users:      ${uniqueUsers.toLocaleString()}`);
  console.log(`  Returning-user hits: ${returningCount.toLocaleString()} (${((returningCount / NUM_CONTEXTS) * 100).toFixed(1)}%)`);
  console.log(`  Total evaluations: ${totalEvals.toLocaleString()} (${NUM_CONTEXTS} × ${FLAGS.length} flags)`);
  if (failures > 0) console.log(`  Failures:          ${failures}`);
  console.log(`\n  Give the Audience tab a minute or two to populate.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
