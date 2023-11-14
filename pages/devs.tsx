import Image from "next/image";
import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe, ToggleRight } from "lucide-react";
import { useRouter } from "next/router";
import { CSNav } from "@/components/ui/csnav";
import { useFlags } from "launchdarkly-react-client-sdk";

export default function Devs() {
  const { releaseInstantly } = useFlags();
  const router = useRouter();

  const goToBank = () => {
    router.push("/bank");
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
    <AnimatePresence mode="wait">
      <motion.div
        className={`relative flex h-screen flex-col items-center justify-center bg-ldblack`}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="absolute top-0 w-full text-white flex h-20 shadow-2xl ">
          <div className="ml-4 flex items-center text-3xl">
            <CSNav />
            <img src="ld-white-wide.png" className="h-1/2 pl-4" />
          </div>
        </div>
        <div
          onClick={goToBank}
          className="border-2 border-white/20 hover:border-white/60 absolute p-4 right-2 top-1/2 transform -translate-y-1/2"
        >
          <ArrowRight className="text-zinc-500" size={36} />
        </div>
        {!releaseInstantly ? (
          <div className="mx-32">
            <motion.div
              initial={{ scaleX: 0 }} // start with no width
              animate={{ scaleX: 1 }} // animate to full width
              transition={{ duration: 1 }} // duration of the animation
              style={{ overflow: "hidden", transformOrigin: "left" }} // hide the overflowing text and set the origin of transformation to left
            >
              <p className="text-4xl xl:text-6xl font-sohnemono herotext pb-4">
                What if recovering from undiscovered bugs or wide blast radius
                outages...
              </p>
            </motion.div>
            <div className="flex pt-8 px-8 align-items-stretch">
              <div className="flex mx-auto justify-center">
                <div className="flex gap-4 justify-items-center items-center">
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-blue-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>Develop and Push Code</p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-blue-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>Build and Deploy App</p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-blue-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>Test, Monitor, and Wait</p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-red-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>
                      <span className="text-red-500">Discover Issue</span>
                    </p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-red-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>
                      <span className="text-red-500">Rollback Release</span>
                    </p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-red-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>
                      <span className="text-red-500">Wait for Deployment</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-24">
            <motion.div
              initial={{ scaleX: 0 }} // start with no width
              animate={{ scaleX: 1 }} // animate to full width
              transition={{ duration: 1 }} // duration of the animation
              style={{ overflow: "hidden", transformOrigin: "left" }} // hide the overflowing text and set the origin of transformation to left
            >
              <p className="text-4xl xl:text-6xl font-sohnemono herotext pb-4">
                You could release or roll back instantly, and target any
                release, at anything
              </p>
            </motion.div>
            <div className="flex pt-8 px-8 align-items-stretch">
              <div className="flex mx-auto justify-center">
                <div className="flex gap-4 justify-items-center items-center">
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-blue-700 text-white text-sm xl:text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>Develop and Push Code</p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-blue-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>Deploy With Features Disabled</p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-blue-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>Configure Release Targeting</p>
                  </div>
                  <div className="grid text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-green-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>
                      <span className="text-green-500">
                        Enable Feature Instantly
                      </span>
                    </p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-red-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>
                      <span className="text-red-500">
                        Disable Only Problem Features
                      </span>
                    </p>
                  </div>
                  <div className="flex text-center h-24 w-24 xl:h-48 xl:w-48 border-2 border-red-700 text-white text-sm xl:text-xl justify-center items-center font-sohnemono">
                    <p>
                      <span className="text-red-500">Wait</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
