//@ts-nocheck
import Image from "next/image";
import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import NavBar from "@/components/ui/navbar";
import Script from "next/script";
import HomePageImage from "@/public/homepage/homepage-title.svg";
import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import NavbarRightSideWrapper from "@/components/ui/NavComponent/NavbarRightSideWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import { CSNav } from "@/components/ui/csnav";
import { useFlags } from "launchdarkly-react-client-sdk";
import { HOMEPAGE_CARDS } from "@/utils/constants";
import { useState, useEffect, use } from "react";
import { CSNAV_ITEMS } from "@/utils/constants";
import arrow from "@/public/sidenav/arrow.svg";
import LaunchDarklyLogo from "@/public/ld-logo.svg";
import { CSCard } from "@/components/ui/ldcscard";
import QRCodeImage from "@/components/ui/QRCodeImage";

import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { demoMode } = useFlags();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);

  const goToBank = () => {
    router.push("/bank");
  };
  
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    if(demoMode){
      router.push('/');
    }
    else{
      router.push('/marketplace');
    }
  }, []);

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
      <Head>
        <link
          rel="preload"
          href={"@/public/banking/backgrounds/bank-homepage-background-right.svg"}
          as="image"
        />
        <link
          rel="preload"
          href={"@/public/banking/backgrounds/bank-homepage-background-left.svg"}
          as="image"
        />
      </Head>

      
      {/* This is hidden for now, remove useEffect router.push('/bank') to see */}
      <AnimatePresence>
        <motion.main className="min-h-screen w-full flex-col items-center justify-center bg-ldblack ">
          <div className="w-full text-white flex h-20 shadow-2xl">
            <NavWrapper>
              <>
                <CSNavWrapper>
                  <CSNav />
                </CSNavWrapper>

                <NavLogo />
              </>

              {/* right side navbar template */}
              <NavbarRightSideWrapper>
                <QRCodeImage textColor="text-white" />
              </NavbarRightSideWrapper>
            </NavWrapper>
          </div>

          <header className="relative banner mx-auto w-full sm:w-1/3 sm:h-[24rem] flex items-center bg-ldblack justify-center z-0">
            <div className="">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={LaunchDarklyLogo}
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
          {isLargeScreen ? (
            <section className="flex flex-col lg:flex-row mx-8 pt-6 gap-3 ">
              {Object.entries(HOMEPAGE_CARDS).map(([key, card], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-3xl w-full lg:w-1/4 h-32 lg:h-96 overflow-hidden transition-transform duration-300 hover:-translate-y-16"
                >
                  <Image
                    src={card.desktopNoHoveringImage}
                    alt={`${card.name} Card`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300 hover:opacity-0 rounded-3xl"
                  />
                  <div className="absolute inset-0 mx-10 mt-10 justify-center transition-opacity duration-300 hover:opacity-0 z-10">
                    <span className="text-white lg:text-3xl sm:text-sm font-sohne">
                      {card.name}
                    </span>
                  </div>

                  <div
                    onClick={() => goToVertical(card.link)}
                    className="absolute cursor-pointer inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 z-30 group-hover:opacity-100"
                  >
                    <Image
                      src={card.desktopHoveringImage}
                      alt={`${card.name} Card Hover`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-3xl"
                    />
                    <div className="absolute inset-0 flex flex-col overflow-auto z-40">
                      <span className="text-white lg:text-3xl sm:text-sm mx-10 mt-10 font-sohne">
                        {card.name}
                      </span>
                      <span className="text-white lg:text-lg sm:text-sm mx-10 mt-4">
                        {card.description}
                      </span>
                      <span className="text-white text-2xl absolute bottom-10 right-10">
                        &#8594;
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>
          ) : (
            <div className="grid gap-4 py-4 mx-10">
              <div className="grid items-center gap-4">
                {Object.entries(CSNAV_ITEMS).map(([key, item]) => {
                  if (item.type === "usecase") {
                    return (
                      <motion.div
                        key={key}
                        initial={{ x: -100, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05, duration: 0.2 }}
                        className="cursor-pointer"
                      >
                        <div
                          onClick={() => router.push(item.link)}
                          className={`bg-gradient-to-r from-${key}-start to-${key}-end rounded-3xl`}
                        >
                          <CSCard
                            className="cursor-pointer"
                            cardTitle={item.title}
                            icon={item.icon}
                            iconHover={item.iconHover}
                            hoverBackground={item.hoverBackground}
                            noHoverBackground={item.noHoverBackground}
                          />
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>
      
    </>
  );
}
