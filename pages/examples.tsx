import NavBar from "@/components/ui/navbar";
import Code from "@/components/ui/code";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function ExamplesPage() {
    return (
        <main className="min-h-screen flex-col items-center justify-center bg-ldblack">
            <div className="w-full text-white flex h-20 shadow-2xl">
                <NavBar />
            </div>
            <div className="text-white w-1/2 mx-auto space-y-2 pb-5">
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
                </Accordion>
            </div>
        </main>
    );
}