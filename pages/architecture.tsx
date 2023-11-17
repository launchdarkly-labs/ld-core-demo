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
        <h1 className="text-3xl font-bold my-3.5">Architecture</h1>
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
              <img src="/img/speed.png" className="my-4 w-full" />
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
                Delivering 20 Trillion Feature Flags Daily
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
              <h3 className="text-2xl font-bold my-3.5">High Performance</h3>
              <p>
                Evaluate and transmit only the minimally required data for a
                secure and safe customer experience.
              </p>
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
              <p>That's the basics!</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <h2 className="text-2xl">Redundancy</h2>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="text-2xl font-bold my-3.5">High Performance</h3>
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
              <p>That's the basics!</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <h2 className="text-2xl">Scalability</h2>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="text-2xl font-bold my-3.5">High Performance</h3>
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
              <p>That's the basics!</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
