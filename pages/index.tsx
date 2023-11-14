import Image from "next/image";
import { Inter } from "next/font/google";
import {  AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { useRouter } from 'next/router'
import { CSNav } from "@/components/ui/csnav";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter()

  const goToBank = () => {
    router.push('/bank')
  }

  const goToNext = () => {
    router.push('/devs')
  }

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
    <motion.main
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
      
      <div onClick={goToNext} className="border-2 border-white/20 hover:border-white/60 absolute p-4 right-2 top-1/2 transform -translate-y-1/2">
      <ArrowRight className="text-zinc-500" size={36} />
      </div>
      <div className="mx-32">
      <motion.div
        initial={{ scaleX: 0 }} // start with no width
        animate={{ scaleX: 1 }} // animate to full width
        transition={{ duration: 1 }} // duration of the animation
        style={{ overflow: "hidden", transformOrigin: "left" }} // hide the overflowing text and set the origin of transformation to left
      >
        <p className="text-6xl font-sohnemono herotext">
          How fast could you innovate if you didn't have to worry about risk?
        </p>
      </motion.div>
      <motion.div
        className="flex flex-row gap-4 items-center justify-center pt-10"
        variants={variants}
        initial="hidden"
        animate="show"
      >
        {["Card-1-New.png", "Card-2-New.png", "Card-3-New.png", "Card-4-New.png"].map((card, index) => (
          <motion.img
            key={card}
            src={card}
            alt={`Card ${index + 1}`}
            className="w-1/4"
            variants={childVariants}
          />
        ))}
      </motion.div>
      </div>
    </motion.main>
    </AnimatePresence>
  );
}
