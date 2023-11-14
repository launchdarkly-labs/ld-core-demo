import { CSNav } from "@/components/ui/csnav";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import { useEffect } from "react";

export default function ExamplesPage() {
  useEffect(() => {
    Prism.highlightAll();
  }, [])
  return (
    <main className="h-full flex-col items-center justify-center bg-ldblack">
      <div className="w-full text-white flex h-20 shadow-2xl">
        <div className="ml-4 flex items-center text-3xl">
          <CSNav />

          <img src="ld-white-wide.png" className="h-1/2 pl-4" />
        </div>
      </div>
      <div>
        <pre>
          <code className="language-js">
// Using require()
const LDClient = require('launchdarkly-js-client-sdk');

// Using ES2015 imports
import * as LDClient from 'launchdarkly-js-client-sdk';

// Using TypeScript imports
import * as LDClient from 'launchdarkly-js-client-sdk';
          </code>
        </pre>
      </div>
    </main>
  );
}
