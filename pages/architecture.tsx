import React from "react";
import NavBar from "@/components/ui/navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen flex-col items-center justify-center bg-ldblack">
      <div className="w-full text-white flex h-20 shadow-2xl">
        <NavBar />
      </div>
      <div className="text-white w-4/6 mx-auto space-y-2 pb-5">
        <h1 className="text-4xl font-bold my-3.5 font-['Audimat']">
          Architecture
        </h1>
        <Accordion type="single" collapsible className="w-full text-white">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h2 className="text-2xl">Speed</h2>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="text-2xl font-bold my-3.5">
                LaunchDarkly SDK Initialization
              </h3>
              <p>
                Flag values initialize and store in memory in 25ms, update
                within 200ms
              </p>
              <img src="/img/architecture.png" className="my-4 w-full" />
              <h3 className="text-2xl font-bold my-3.5">
                Lifecycle of the SDK
              </h3>
              <p>
                Evaluate stored flag values from memory instantly, with no
                performance penalty
              </p>
              <img src="/img/lifecycle.png" className="my-4 w-full" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h2 className="text-2xl">Consistency</h2>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="text-2xl font-bold my-3.5">
                Initialize, Evaluate, Update
              </h3>
              <p>
                A global <strong>Flag Delivery Network</strong> ensures
                consistent performance from anywhere.
              </p>
              <img src="/img/FDN.avif" className="my-4 w-full" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <h2 className="text-2xl">Security</h2>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="text-2xl font-bold my-3.5">
                Secure Flag Evaluation
              </h3>
              <p>Protect your user, feature, and business logic.</p>
              <ul className="mt-2 space-y-1 list-inside">
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  Application code can’t be inspected to discover hidden
                  LaunchDarkly feature flags.
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  Unable to unpack or inspect alternative flag variations.
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  User data and underlying targeting logic is protected from
                  discovery.
                </li>
              </ul>
              <img src="/img/security.png" className="my-4 w-full" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <h2 className="text-2xl">Redundancy</h2>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="text-2xl font-bold my-3.5">
                Resilient Architecture
              </h3>
              <p>Multi-zone, Relay Proxy, local fallback</p>
              <img src="/img/resiliency.png" className="my-4 w-full" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <h2 className="text-2xl">Scalability</h2>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="text-2xl font-bold my-3.5">
                20 Trillion Feature Flags Daily
              </h3>
              <p>
                Architect and build platforms that operate globally. Build at
                internet scale.
              </p>
              <img src="/img/speed.png" className="my-4 w-full" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
