//@ts-nocheck
import Image from "next/image";
import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { useRouter } from "next/router";
import NavBar from "@/components/ui/navbar";
import Script from "next/script";
import HomePageImage from "@/public/homepage/homepage-title.svg";
import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import { CSNav } from "@/components/ui/csnav";

import { HOMEPAGE_CARDS } from "@/utils/constants";

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

  function goToVertical(link: string) {
    router.push(link);
  }

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
      <AnimatePresence>
        <main className="min-h-screen flex-col items-center justify-center bg-ldblack ">
          <div className="w-full text-white flex h-20 shadow-2xl">
          <NavWrapper>
            <>
              <CSNavWrapper>
                  <CSNav />
              </CSNavWrapper>

              <NavLogo />
            </>
          </NavWrapper>
          </div>

          <header className="relative banner mx-auto w-full sm:w-1/3 h-[24rem] flex items-center bg-ldblack justify-center z-0">
            <div className="">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={HomePageImage}
                  alt="Homepage Image"
                  layout="fixed"
                  objectFit="fill"
                  width={700}
                  height={800}
                  className="rounded-3xl"
                />
              </motion.div>
            </div>
           
          </header>


          <section className="flex flex-row mx-8 my-auto pt-6 gap-3 ">
            {Object.entries(HOMEPAGE_CARDS).map(([key, card], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl w-1/4 h-96  overflow-hidden transition-transform duration-300 hover:-translate-y-16"
              >
                <Image
                  src={card.desktopNoHoveringImage}
                  alt={`${card.name} Card`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300 hover:opacity-0 rounded-3xl"
                />
                <div className="absolute inset-0 mx-10 mt-10 justify-center transition-opacity duration-300 hover:opacity-0 z-10">
                  <span className="text-white md:text-3xl sm:text-sm font-sohne">{card.name}</span>
                </div>

                <div onClick={() => goToVertical(card.link)} className="absolute cursor-pointer inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 z-30 group-hover:opacity-100">
                  <Image
                    src={card.desktopHoveringImage}
                    alt={`${card.name} Card Hover`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-3xl"
                  />
                  <div className="absolute inset-0 flex flex-col overflow-auto z-40">
                    <span className="text-white md:text-3xl sm:text-sm mx-10 mt-10 font-sohne">{card.name}</span>
                    <span className="text-white md:text-lg sm:text-sm mx-10 mt-4">{card.description}</span>
                    <span className="text-white text-2xl absolute bottom-10 right-10">&#8594;</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </section>
        </main>
      </AnimatePresence>
    </>
  );
}
