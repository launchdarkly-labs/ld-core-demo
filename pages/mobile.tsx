import { CSNav } from "@/components/ui/csnav";
import NavBar from "@/components/ui/navbar";
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
        className="flex flex-col items-center justify-center h-screen bg-ldblack"
      >
        <div className="absolute top-0 w-full">
        <NavBar />
        </div>
        <video
          src="https://utfs.io/f/b0429b52-31a7-41c2-8eba-a940e74b0273-w5y19k.mp4"
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
