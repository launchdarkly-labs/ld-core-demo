import React, { useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { Button } from "../button";
import { useFlags } from "launchdarkly-react-client-sdk";
import { STARTER_PERSONAS } from "@/utils/contexts/StarterUserPersonas";
import { STANDARD } from "@/utils/constants";
import { useLDClient } from "launchdarkly-react-client-sdk";

function ImageWithContentHero({
  variant,
  homePageContent,
}: {
  variant: string;
  homePageContent: any;
}) {
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } = useContext(LoginContext);
  const showHeroRedesignFlag = useFlags()["show-hero-redesign"].includes("text-left");
  const showDifferentHeroImageFlag = variant?.includes("government")
    ? useFlags()["show-different-hero-image-string"]
    : "imageA";
  const client = useLDClient();
  return (
    <header
      className="bg-slate-100 salient-hero-image font-sohnelight"
      data-testid="salient-image-with-content-hero-test-id"
    >
      <div className="flex flex-col border-b border-slate-400/10 lg:border-0">
        <div
          className={`relative  ${showHeroRedesignFlag ? "flex flex-col-reverse lg:block" : ""}`}
        >
          <div aria-hidden="true" className="absolute hidden h-full w-1/2 lg:block" />
          <div className="relative lg:bg-transparent">
            <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8 `}>
              {showHeroRedesignFlag ? <div className="h-full w-full" /> : null}
              <div className="mx-auto max-w-2xl py-12 lg:max-w-none lg:py-32">
                <div
                  className={`flex flex-col ${
                    showHeroRedesignFlag ? "lg:items-start lg:pl-16 " : "lg:pr-16"
                  }`}
                >
                  <h1
                    className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl `}
                    data-testid={"salient-hero-title-test-id"}
                  >
                    Welcome to {homePageContent?.name}{" "}
                  </h1>
                  <p
                    className={`mt-4 text-xl text-gray-600 `}
                    data-testid={"salient-hero-subtitle-test-id"}
                  >
                    {homePageContent?.industryMessages}
                  </p>
                  <div className="mt-6">
                    <button
                      // href={customizedStyleState["CUSTOM__salient-hero"]?.button?.href}
                      className="bg-gradient-airways rounded-none  py-[1.5rem] px-[4rem] text-white text-base"
                      onClick={() => {
                        if (variant?.includes("government")) {
                          client?.track("signup clicked", client.getContext());
                          client?.flush();
                        }
                        loginUser("User", "user@launchmail.io", STANDARD);
                      }}
                    >
                      Get Started Today
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`h-48 w-full sm:h-64 lg:absolute lg:top-0 ${
              showHeroRedesignFlag ? "lg:left-0 " : "lg:right-0 "
            } lg:h-full lg:w-1/2`}
          >
            {/* {((showHeroInvestmentPromoLDFlag && user) || showHeroInvestmentPlanSignUpLDFlag) &&
            industry === INDUSTRY_NAMES.BANK ? (
              <div className="w-full h-[2rem] absolute bg-green-500 text-white text-center font-bold pt-[.2rem]">
                NEW
              </div>
            ) : null} */}
            <img
              src={homePageContent?.heroImg[showDifferentHeroImageFlag]}
              alt={homePageContent?.industryMessages}
              className="h-full w-full object-cover object-center"
              aria-label={`image on the ${
                showHeroRedesignFlag ? "left" : "right"
              } on desktop and the ${showHeroRedesignFlag ? "top" : "bottom"} in mobile`}
              data-testid="salient-hero-image-test-id"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default ImageWithContentHero;
