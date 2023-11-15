import NavBar from "@/components/ui/navbar";
import Code from "@/components/ui/code";

export default function ExamplesPage() {
  return (
    <main className="h-full flex-col items-center justify-center bg-ldblack">
      <div className="w-full text-white flex h-20 shadow-2xl">
        <NavBar />
      </div>
      <div className="text-white w-1/2 mx-auto space-y-2 pb-5">
        <h1 className="text-3xl font-bold my-3.5">Code Samples</h1>
        <p>
          Begin by importing the appropriate SDK. For example, in server-side
          Node.js, we'd use the <code>import</code> statement.
        </p>
        <Code
          language={"js"}
          code={`import * as ld from 'launchdarkly-node-server-sdk'`}
        />
        <p>
          Next, we need to initialize the SDK client. On the server, this will
          pull all the flag data from LaunchDarkly's edge-based{" "}
          <a href="https://launchdarkly.com/blog/flag-delivery-at-edge/">
            Flag Delivery Network
          </a>
          . This data is cached in memory on the server so that flag evaluations
          are extremely fast.
        </p>
        <p>
          We also need to ensure that the SDK client has completed the
          initialization and is ready before we can get flag variations. It
          takes less than 200 milliseconds for the initialization to complete.
        </p>
        <Code
          language={"js"}
          code={`const client = ld.init('sdk-key-123abc');
await client.waitForInitialization()`}
        />
        <p>
          Now that we've initialized, we can get flag variations. These
          evaluations are done against the cache, making them{" "}
          <em>extremely fast</em>. The cache is continuously updated via a
          stream and changes made in LaunchDarkly are received by all connected
          clients within 20ms.
        </p>
        <p>
          Evaluating flags begins by passing a <em>context</em>. This context
          contains any data that you can use for targeting.
        </p>
        <Code
          language={"js"}
          code={`const context = {
  "kind": 'user',
  "key": 'user-key-123abc',
  "name": 'Sandy'
};`}
        />
        <p>Now let's get a flag variation.</p>
        <Code
          language={"js"}
          code={`const value = await client.variation('flag-key-123abc', context, false);

// let's use the flag - in this case it's a boolean
if (value) {
  // run our new code
}`}
        />
        <p>That's the basics!</p>
      </div>
    </main>
  );
}
