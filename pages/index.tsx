//@ts-nocheck
import Image from "next/image";
import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { useRouter } from "next/router";
import { CSNav } from "@/components/ui/csnav";
import NavBar from "@/components/ui/navbar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const goToBank = () => {
    router.push("/bank");
  };

  const goToNext = () => {
    router.push("/devs");
  };

  const variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5, // This will create the staggered effect
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const pageVariants = {
    initial: { x: 0 },
    in: { x: 0 },
    out: { x: "-100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        strategy="lazyOnload"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-2ZW2MJ75NL"
      ></Script>
      <Script strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-2ZW2MJ75NL');`}
      </Script>
      <main className="min-h-screen flex-col items-center justify-center bg-ldblack ">
        <div className="w-full text-white flex h-20 shadow-2xl">
          <NavBar />
        </div>

        <header className="relative banner mx-auto w-full sm:w-1/3 h-[30rem] flex items-center justify-center z-0">
          <div className="absolute z-50">
            <h1 className="sm:w-2/3 mx-8 sm:mx-auto">Ship faster, safer, and smarter</h1>
            <p className="w-3/5 text-center mx-auto">
            LaunchDarkly enables high velocity teams to release, monitor, and optimize software in production.
            </p>
          </div>
          <div className="hidden sm:block absolute top-16 left-40 z-10">
            <img src="/hero/Vector 965.png" />
          </div>
          <div className="hidden sm:block absolute top-0 right-24 z-10">
            <img src="/hero/Group 481368.png" />
          </div>
          <div className="blur-sm sm:blur-none absolute top-20 right-0 z-10">
            <img src="/hero/Group 481352.png" />
          </div>
          <div className="blur-sm sm:blur-none absolute bottom-0 left-0 z-10">
            <img src="/hero/graphs.png" className="bottom-0 left-0 z-20" />
          </div>
          <div className="blur-sm sm:blur-none absolute bottom-[-40px] left-0 z-10">
            <img src="/hero/Group 481364.png" className="bottom-0 left-0" />
          </div>
          <div className="hidden xl:block absolute bottom-[160px] right-56 z-10">
            <img src="/hero/Rectangle 3467774.png" />
          </div>
          <div className="hidden xl:block absolute bottom-[165px] right-[68px] z-10">
            <img src="/hero/Rectangle 3467775.png" />
          </div>
          <div className="blur-sm sm:blur-none absolute bottom-20 right-10 z-10">
            <img src="/hero/Group 481309.png" />
          </div>
          <div className="blur-sm lg:blur-none absolute bottom-28 left-64 z-30">
            <img src="/hero/Group 481366.png" />
          </div>
          <div className="hidden lg:block absolute bottom-62 left-32 z-10">
            <img src="/hero/Group 481365.png" />
          </div>
          <div className="hidden lg:block absolute bottom-62 left-32 z-10">
            <img src="/hero/Group 481365.png" />
          </div>
        </header>
        <section className="py-8 bg-ldblack h-full">
          <div className="flex flex-col mx-8 xl:mx-[25%]">
            <div className="flex flex-col sm:flex-row gap-x-0 gap-y-8 sm:gap-x-8 sm:gap-y-0 mb-8">
              <div className="w-full sm:w-1/2 home-card">
                <a href="/bank">
                  <img width="54" height="54" src="Release-Icon.png" className="mt-3" />

                  <h2>Automate Releases</h2>
                    <p>Release Best Practice Workflows, Sophisticated User Targeting, Real-Time Feature Changes</p>
                </a>
              </div>

              <div className="w-full sm:w-1/2 home-card">
                <a href="investment">
                  <img width="34" height="44" src="remediate.png" />

                  <h2>Monitor Features</h2>
                  <p>Runtime Event Monitoring, Regression Auto-Remediation, Metric Driven Progressive Delivery</p>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-x-0 gap-y-8 sm:gap-x-8 sm:gap-y-0">
              <div className="w-full sm:w-1/2 home-card">
                <a href="/airways">
                  <img width="44" height="24" src="AI.png" />
                  <h2>Accelerate AI</h2>
                  <p>
                    Runtime Configurations Controls, Targeted AI Experiences, Optimize Performance & Cost
                  </p>
                </a>
              </div>

              <div className="w-full sm:w-1/2 home-card">
                <a href="/marketplace">
                  <img width="24" height="24" src="Experimentation.png" />

                  <h2>Experiment Everywhere</h2>
                  <p>Experimentation For Everyone, Advanced Statistics, Measure Any Metric
                  </p>
                </a>
              </div>

            </div>

          </div>
        </section>
      </main>
    </>
  );
}
