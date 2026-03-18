import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import { CSNav } from "@/components/ui/csnav";

import Code from "@/components/ui/code";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function ExamplesPage() {
    return (
        <main className="w-full min-h-screen flex-col items-center justify-center bg-ldblack px-4">
            <div className="w-full text-white flex h-20 shadow-2xl">
            <NavWrapper>
                <>
                <CSNavWrapper>
                    <CSNav />
                </CSNavWrapper>

                <NavLogo />
                </>
            </NavWrapper>
            </div>
            <div className="text-white w-full max-w-7xl mx-auto space-y-2 py-5 px-8 xl:px-0">
                <h1 className="text-4xl font-bold my-3.5 font-['Audimat']">
                    Code Samples
                </h1>
                <Accordion type="single" collapsible className="w-full text-white">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <h2 className="text-2xl">LaunchDarkly Basics</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <h3 className="text-2xl font-bold my-3.5">
                                Import the appropriate SDK
                            </h3>
                            <Code
                                language={"js"}
                                code={`import * as ld from 'launchdarkly-node-server-sdk'`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Initialize the SDK client
                            </h3>
                            <p>
                                This pulls all the flag data from LaunchDarkly's edge-based{" "}
                                <a href="https://launchdarkly.com/blog/flag-delivery-at-edge/">
                                    Flag Delivery Network
                                </a>
                                . Intialization takes less than 200ms to complete.
                            </p>
                            <Code
                                language={"js"}
                                code={`const client = ld.init('sdk-key-123abc');
await client.waitForInitialization()`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">Create the context</h3>
                            <p>
                                Contexts contain any data that you intend to use for targeting.
                            </p>
                            <Code
                                language={"js"}
                                code={`const context = {
  "kind": 'user',
  "key": 'user-key-123abc',
  "name": 'Sandy'
};`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Get the flag variation for this context
                            </h3>
                            <Code
                                language={"js"}
                                code={`const value = await client.variation('flag-key-123abc', context, false);

// let's use the flag - in this case it's a boolean
if (value) {
  // run our new code
}`}
                            />
                            <p>That's the basics!</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            <h2 className="text-2xl">LaunchDarkly in AWS Serverless</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <h2 className="text-2xl font-bold my-3.5">
                                Using LaunchDarkly in Lambda
                            </h2>
                            <p>Choose the appropriate SDK (ex. Node)</p>
                            <Code
                                language={"js"}
                                code={`const LaunchDarkly = require('launchdarkly-node-server-sdk')
const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY)

await client.waitForInitialization();
const flagValue = await client.variation("my-flag", { kind: "user", key: "anonymous" }`}
                            />

                            <h2 className="text-2xl font-bold my-3.5">
                                Caching data in a data store
                            </h2>
                            <p>This example uses the Node runtime.</p>
                            <Code
                                language={"java"}
                                code={`const LaunchDarkly = require("launchdarkly-node-server-sdk");
// The SDK add-on for DynamoDB support
const {
  DynamoDBFeatureStore,
} = require("launchdarkly-node-server-sdk-dynamodb");

const store = DynamoDBFeatureStore(process.env.DYNAMODB_TABLE);
// useLdd launches the client in daemon mode where flag values come
// from the data store (i.e. dynamodb)
const options = {
	featureStore: store,
	useLdd: true,
};
const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, options);`}
                            />
                            <h2 className="text-2xl font-bold my-3.5">
                                Recording LaunchDarkly events
                            </h2>
                            <p>Flush events and close the client on Lambda shutdown.</p>
                            <Code
                                language={"js"}
                                code={`process.on('SIGTERM', async () => {
    console.info('[runtime] SIGTERM received');

    console.info('[runtime] cleaning up');
    // flush is currently required for the Node SDK
    await client.flush()
    client.close();
    console.info('LaunchDarkly connection closed');
    
    console.info('[runtime] exiting');
    process.exit(0)
});`}
                            />
                            <p>Be sure to check out LaunchDarkly's AWS integrations!</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            <h2 className="text-2xl">Migrations</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <h2 className="text-2xl font-bold my-3.5">
                                Read and write from the old systems
                            </h2>
                            <p>This example uses C#</p>
                            <Code
                                language={"csharp"}
                                code={`LDContext context = Context.Builder("context-key-123abc")
    .Build();

// this is the migration stage to use if the flag's migration stage
// is not available from LaunchDarkly
var defaultStage = MigrationStage.Off

var readResult = migration.Read("migration-flag-key-123abc", context, defaultStage, payload);

var writeResult = migration.Write("migration-flag-key-123abc", context, defaultStage, payload);`}
                            />
                            <h2 className="text-2xl font-bold my-3.5">
                                Use the Migration Builder
                            </h2>
                            <p>This configures metrics for tracking latency and errors.</p>
                            <Code
                                language={"csharp"}
                                code={`// define how to compare the two read values
bool Checker(string a, string b) => a.Equals(b);
var migration = new MigrationBuilder<string, string, string, string>(_client)
    .Read(
        (payload) => MigrationMethod.Success("read old"),
        (payload) => MigrationMethod.Success("read new"),
        Checker)
    .Write(
        (payload) => MigrationMethod.Success("write old"),
        (payload) => MigrationMethod.Success("write new"))
    .ReadExecution(MigrationExecution.Parallel()) // or MigrationExecution.Serial(MigrationSerialOrder.Fixed)
    .TrackErrors(true)    // true by default
    .TrackLatency(true)   // true by default
    .Build();`}
                            />
                            <p>Migrations without the worry!</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            <h2 className="text-2xl">Mobile Targeting</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <h2 className="text-2xl font-bold my-3.5">
                                Automatic mobile environment attributes
                            </h2>
                            <table className="border-2">
                                <thead>
                                    <tr className="border-2">
                                        <th className="border-r-2">Context kind</th>
                                        <th className="border-r-2">Context attribute</th>
                                        <th className="border-r-2">Description</th>
                                        <th>Examples</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b-2 h-24">
                                        <td>
                                            <code>ld_application</code>
                                        </td>
                                        <td>
                                            <code>id</code>
                                        </td>
                                        <td>Unique identifier of the application.</td>
                                        <td>
                                            <code>com.launchdarkly.example</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>locale</code>
                                        </td>
                                        <td>
                                            Locale of the device, in
                                            <a
                                                href="https://www.ietf.org/rfc/bcp/bcp47.txt"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                IETF BCP 47 Language Tag
                                            </a>
                                            format.
                                        </td>
                                        <td>
                                            <code>en-US</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>name</code>
                                        </td>
                                        <td>Human-friendly name of the application.</td>
                                        <td>
                                            <code>Example Mobile App</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>version</code>
                                        </td>
                                        <td>
                                            Version of the application used for update comparison.
                                        </td>
                                        <td>
                                            <code>5</code>, <code>1.2.3</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>versionName</code>
                                        </td>
                                        <td>
                                            Human-friendly name of the version. May or may not be a
                                            semantic version.
                                        </td>
                                        <td>
                                            <code>5</code>, <code>1.2</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>envAttributesVersion</code>
                                        </td>
                                        <td>
                                            Version of the environment attributes schema being used.
                                            This may change in later versions of the SDK.
                                        </td>
                                        <td>
                                            <code>1.0</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td>
                                            <code>ld_device</code>
                                        </td>
                                        <td>
                                            <code>key</code>
                                        </td>
                                        <td>
                                            Unique for this context kind. Automatically generated by
                                            the SDK.
                                        </td>
                                        <td>
                                            <em>randomly generated</em>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>manufacturer</code>
                                        </td>
                                        <td>Manufacturer of the device.</td>
                                        <td>
                                            <code>Google</code>, <code>Apple</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>model</code>
                                        </td>
                                        <td>Model of the device.</td>
                                        <td>
                                            <code>Pixel 6 Pro</code>, <code>iPhone</code>
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 h-24">
                                        <td></td>
                                        <td>
                                            <code>os</code>
                                        </td>
                                        <td>
                                            Operating system of the device. Includes properties for
                                            <code>family</code>, <code>name</code>, and{" "}
                                            <code>version</code>.
                                        </td>
                                        <td>
                                            <ul>
                                                <li>
                                                    <code>family</code>: <code>Android</code>,{" "}
                                                    <code>Apple</code>
                                                </li>
                                                <li>
                                                    <code>version</code>: <code>13</code>,{" "}
                                                    <code>16.2</code>
                                                </li>
                                                <li>
                                                    <code>name</code>: <code>Android33</code>,{" "}
                                                    <code>iOS</code>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <h2 className="text-2xl font-bold my-3.5">
                                Enabling automatic mobile environment attributes
                            </h2>
                            <p>This example is for Android.</p>
                            <Code
                                language={"java"}
                                code={`LDConfig ldConfig = new LDConfig.Builder(AutoEnvAttributes.Enabled)
.mobileKey("mobile-key-123abc")
.build();
            `}
                            />
                            <p>Painlessly target device and OS!</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>
                            <h2 className="text-2xl">Experimentation</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <h2 className="text-2xl font-bold my-3.5">
                                Track custom events for experimentation
                            </h2>

                            <Code
                                language={"js"}
                                code={`client.track('something-happened');

client.track('something-happened-with-custom-data', { someData: 2 });`}
                            />

                            <h2 className="text-2xl font-bold my-3.5">
                                Flushing events on the edge
                            </h2>
                            <p>
                                In edge environments, events need to be flushed to prevent loss
                                of data (ex. Cloudflare).
                            </p>
                            <Code
                                language={"js"}
                                code={`executionContext.waitUntil(
  client.flush((err, res) => {
    console.log('flushed events');
  }),
);
;`}
                            />
                            <p>Create experiments around the metrics that matter to you!</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>
                            <h2 className="text-2xl">AI Configs</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <h3 className="text-2xl font-bold my-3.5">
                                Install the AI SDK
                            </h3>
                            <p>
                                The AI SDK works alongside the Node.js server-side SDK. Install
                                both, plus an optional provider package for OpenAI.
                            </p>
                            <Code
                                language={"bash"}
                                code={`npm install @launchdarkly/node-server-sdk @launchdarkly/server-sdk-ai
# Optional: provider-specific package for OpenAI
npm install @launchdarkly/server-sdk-ai-openai`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Import and initialize the AI client
                            </h3>
                            <p>
                                Create the base LaunchDarkly client, then wrap it with{" "}
                                <code>initAi</code> to get an <code>aiClient</code> for
                                interacting with AI Configs.
                            </p>
                            <Code
                                language={"ts"}
                                code={`import { init, LDContext } from '@launchdarkly/node-server-sdk';
import { initAi, LDAIClient, LDAIConfig } from '@launchdarkly/server-sdk-ai';

const ldClient = init('YOUR_SDK_KEY');
await ldClient.waitForInitialization({ timeout: 10 });

const aiClient: LDAIClient = initAi(ldClient);`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Set up the context
                            </h3>
                            <p>
                                Context attributes drive targeting rules and fill in template
                                variables in your AI Config prompts.
                            </p>
                            <Code
                                language={"ts"}
                                code={`const context: LDContext = {
  kind: 'multi',
  user: {
    key: 'user-123',
    name: 'Sandy',
    tier: 'platinum',
  },
  location: {
    key: 'loc-us-east',
    city: 'Portland',
    country: 'US',
  },
};`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Retrieve an AI Config (completion mode)
                            </h3>
                            <p>
                                Use <code>completionConfig()</code> to get the messages and model
                                for a completion-style AI Config. Pass template variables to
                                interpolate values into your prompts.
                            </p>
                            <Code
                                language={"ts"}
                                code={`const aiConfig: LDAIConfig = await aiClient.completionConfig(
  'my-ai-config-key',
  context,
  { enabled: false }, // fallback if LD is unreachable
  { userInput: 'What savings accounts do you offer?' },
);

if (aiConfig.enabled) {
  // aiConfig.messages — prompt messages from the AI Config variation
  // aiConfig.model    — model name and parameters
  // aiConfig.tracker  — tracker instance for recording metrics
}`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Retrieve an AI Config (agent mode)
                            </h3>
                            <p>
                                Agent mode returns instructions instead of messages, enabling
                                multi-step agent workflows.
                            </p>
                            <Code
                                language={"ts"}
                                code={`import { LDAIAgentConfig } from '@launchdarkly/server-sdk-ai';

const agent: LDAIAgentConfig = await aiClient.agentConfig(
  'my-agent-config-key',
  context,
  { enabled: false },
  { userInput: 'Tell me about my account balance' },
);

if (agent.enabled) {
  // agent.instructions — the goal/task from the AI Config variation
  // agent.model        — model name and parameters
  // agent.tracker      — tracker instance for recording metrics
}`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Call the LLM with automatic metric tracking
                            </h3>
                            <p>
                                Wrap your provider call with a convenience method to
                                automatically record duration, token usage, and success/error.
                            </p>
                            <Code
                                language={"ts"}
                                code={`import OpenAI from 'openai';

const openai = new OpenAI();
const { tracker } = aiConfig;

// OpenAI — trackOpenAIMetrics wraps the call and records metrics
const completion = await tracker.trackOpenAIMetrics(async () =>
  openai.chat.completions.create({
    model: aiConfig.model?.name || 'gpt-4',
    messages: aiConfig.messages || [],
    temperature: (aiConfig.model?.parameters?.temperature as number) ?? 0.5,
  }),
);

console.log('Response:', completion.choices[0].message.content);`}
                            />
                            <Code
                                language={"ts"}
                                code={`import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const { tracker } = aiConfig;

// Bedrock — trackBedrockConverseMetrics records the same metrics
const completion = tracker.trackBedrockConverseMetrics(
  await bedrockClient.send(
    new ConverseCommand({
      modelId: aiConfig.model?.name ?? 'anthropic.claude-3',
      messages: mapPromptToConversation(aiConfig.messages ?? []),
      inferenceConfig: {
        temperature: (aiConfig.model?.parameters?.temperature as number) ?? 0.5,
        maxTokens: (aiConfig.model?.parameters?.maxTokens as number) ?? 4096,
      },
    }),
  ),
);`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Manual LLM observability
                            </h3>
                            <p>
                                For streaming responses or custom providers, track metrics
                                individually using the tracker.
                            </p>
                            <Code
                                language={"ts"}
                                code={`import { LDTokenUsage } from '@launchdarkly/server-sdk-ai';

const { tracker } = aiConfig;

// Track how long the generation took (ms)
tracker.trackDuration(1250);

// Track token usage
const tokens: LDTokenUsage = { input: 150, output: 85, total: 235 };
tracker.trackTokens(tokens);

// Track time to first token for streaming responses (ms)
tracker.trackTimeToFirstToken(320);

// Track generation outcome
tracker.trackSuccess();
// or on failure:
// tracker.trackError();

// Retrieve a summary of all recorded metrics
const summary = tracker.getSummary();`}
                            />
                            <h3 className="text-2xl font-bold my-3.5">
                                Send satisfaction events
                            </h3>
                            <p>
                                Record user feedback (thumbs up / thumbs down) on AI-generated
                                content. Use the tracker from the same request lifecycle.
                            </p>
                            <Code
                                language={"ts"}
                                code={`import { LDFeedbackKind } from '@launchdarkly/server-sdk-ai';

// Immediate feedback — within the same request that generated content
tracker.trackFeedback({ kind: LDFeedbackKind.Positive });
// or
tracker.trackFeedback({ kind: LDFeedbackKind.Negative });`}
                            />
                            <p>
                                If feedback arrives later (e.g. the user clicks a button after
                                the response), persist the tracker metadata at generation time
                                and replay it when feedback arrives.
                            </p>
                            <Code
                                language={"ts"}
                                code={`// At generation time — persist the tracker metadata
const trackData = aiConfig.tracker.getTrackData();
// Store trackData alongside the conversation in your database

// Later, when the user provides feedback
ldClient.track(
  '$ld:ai:feedback:user:positive', // or '$ld:ai:feedback:user:negative'
  context,       // the same context from generation time
  trackData,     // the persisted tracker metadata
  1,
);`}
                            />
                            <p>
                                Satisfaction metrics appear on the Monitoring tab of your AI
                                Config in the LaunchDarkly dashboard.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </main>
    );
}