import { CSNav } from "@/components/ui/csnav";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const MobilePage = () => {
  const pageVariants = {
    initial: { x: "100%" },
    in: { x: 0 },
    out: { x: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex items-center justify-center h-screen bg-ldblack"
      >
        <div className="absolute top-0 w-full text-white flex h-20 shadow-2xl ">
          <div className="ml-4 flex items-center text-3xl">
            <CSNav />

            <img src="ld-white-wide.png" className="h-1/2 pl-4" />
          </div>
        </div>
        <video
          src="https://utfs.io/f/16ca2adf-2508-4794-acb5-283e83764b49-nelf4r.mp4"
          controls
          className="h-3/4 w-3/4 rounded-xl shadow-2xl"
        >
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobilePage;
