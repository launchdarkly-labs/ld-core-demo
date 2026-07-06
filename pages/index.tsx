//@ts-nocheck
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Script from "next/script";
import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import NavbarRightSideWrapper from "@/components/ui/NavComponent/NavbarRightSideWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import { CSNav } from "@/components/ui/csnav";
import { useFlags } from "launchdarkly-react-client-sdk";
import { HOMEPAGE_CARDS } from "@/utils/constants";
import { useEffect } from "react";
import QRCodeImage from "@/components/ui/QRCodeImage";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const { demoMode } = useFlags();

  useEffect(() => {
    if (!demoMode) {
      router.push("/bank");
    }
  }, []);

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4,
  };

  function goToVertical(link: string) {
    router.push(link);
  }

  return (
    <>
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
        <title>LaunchDarkly Core Demo</title>
      </Head>

      <AnimatePresence>
        <motion.main
          className="min-h-screen w-full flex flex-col relative overflow-hidden"
          style={{
            backgroundImage: "url('/homepage/ld-slide-bg-lime.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#c8e600",
          }}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {/* Grid lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundSize: "120px 120px",
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
            }}
          />

          {/* Navbar */}
          <div className="w-full flex h-20 shadow-2xl">
            <NavWrapper>
              <>
                <CSNavWrapper>
                  <CSNav color="black" />
                </CSNavWrapper>
                <NavLogo srcHref="ldLogo_black.svg" />
              </>
              <NavbarRightSideWrapper>
                <QRCodeImage textColor="text-black" />
              </NavbarRightSideWrapper>
            </NavWrapper>
          </div>

          {/* Hero Text - centered */}
          <div className="px-4 pt-12 sm:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-sora font-extrabold text-black leading-tight mb-3">
                Move at AI speed.
                <br />
                Stay in control.
              </h1>
              <p className="text-base sm:text-lg font-sora font-normal text-gray-700 max-w-2xl mx-auto mt-8">
                The runtime control layer for AI development, de-risking releases
                and enabling systems that heal and optimize themselves.
              </p>
            </motion.div>
          </div>

          {/* AI-Bert Marquee */}
          <div className="w-full overflow-hidden py-3 sm:py-5">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex items-center gap-12 sm:gap-20 px-6 sm:px-10 shrink-0">
                  {[
                    { src: "/homepage/aibert-waving.png", alt: "AI-Bert waving" },
                    { src: "/homepage/aibert-juggling.png", alt: "AI-Bert juggling" },
                    { src: "/homepage/aibert-speeding.png", alt: "AI-Bert speeding" },
                    { src: "/homepage/aibert-hallucinating.png", alt: "AI-Bert hallucinating" },
                    { src: "/homepage/aibert-proud.png", alt: "AI-Bert proud" },
                  ].map((mascot) => (
                    <img
                      key={`${setIndex}-${mascot.alt}`}
                      src={mascot.src}
                      alt={mascot.alt}
                      className="h-28 sm:h-36 w-auto object-contain"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="min-h-[5px] max-h-[10px]" />

          {/* Two Pillar Cards - aligned lower, around the 3rd grid line */}
          <div className="px-4 pb-6 sm:pb-8">
            <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
              {Object.entries(HOMEPAGE_CARDS).map(([key, card], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  className="flex-1"
                >
                  <div
                    onClick={() => goToVertical(card.link)}
                    className={`
                      relative rounded-3xl cursor-pointer
                      border border-white/10
                      transition-all duration-300 ease-out
                      overflow-hidden
                      min-h-[200px] sm:min-h-[260px]
                      bg-cover bg-center
                      hover:-translate-y-2
                      hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.5)]
                    `}
                    style={{ backgroundImage: `url('${card.cardImage}')` }}
                  >
                  {/* Text content - always visible */}
                  <div className="relative z-10 p-8">
                    <h2 className="text-2xl sm:text-3xl font-sohne text-white mb-2">
                      {card.name}
                    </h2>
                    <p className="text-white/70 font-sohnelight text-sm sm:text-base mb-6">
                      {card.tagline}
                    </p>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2">
                      {card.features.map((feature: string) => (
                        <span
                          key={feature}
                          className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Explore button with slide-up fill effect */}
                    <div className="mt-6">
                      <span className="relative inline-flex items-center px-5 py-2.5 border border-white/40 rounded-full text-sm font-sohnelight text-white overflow-hidden group/btn">
                        <span className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 group-hover/btn:text-black transition-colors duration-300">Explore demo</span>
                        <span className="relative z-10 ml-2 group-hover/btn:text-black transition-colors duration-300 group-hover/btn:translate-x-1 transform duration-300">&#8594;</span>
                      </span>
                    </div>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.main>
      </AnimatePresence>
    </>
  );
}
