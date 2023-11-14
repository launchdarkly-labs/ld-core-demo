import Image from "next/image";
import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { useRouter } from "next/router";
import { CSNav } from "@/components/ui/csnav";

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
    <main className="h-full flex-col items-center justify-center bg-ldblack">
      <div className="w-full text-white flex h-20 shadow-2xl">
        <div className="ml-4 flex items-center text-3xl">
          <CSNav />

          <img src="ld-white-wide.png" className="h-1/2 pl-4" />
        </div>
      </div>

      <div className="banner">
        <div>
          <h1>Connecting code to customers</h1>
          <p>
            Maximize the value of every software feature through safer releases,
            targeted experiences, experimentation, and more.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center pt-10 mx-auto w-1/2 gap-8">
        <div className="flex flex-row gap-8">
          <div className="w-1/2">
            <img src="Card-1-New.png" alt="" />
          </div>
          <div className="w-1/2">
            <img src="Card-2-New.png" alt="" />
          </div>
        </div>
        <div className="flex flex-row gap-8">
          <div className="w-1/2">
            <img src="Card-3-New.png" alt="" />
          </div>
          <div className="w-1/2">
            <img src="Card-4-New.png" alt="" />
          </div>
        </div>
      </div>
    </main>
  );
}
