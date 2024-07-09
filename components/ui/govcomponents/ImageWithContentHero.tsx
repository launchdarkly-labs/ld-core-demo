import React, { useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { Button } from "../button";
import { useFlags } from "launchdarkly-react-client-sdk";
function ImageWithContentHero({ variant, homePageContent }: { variant: string, homePageContent:any }) {
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } = useContext(LoginContext);
  const showCardsSectionComponentFlag = variant?.includes("government")
    ? useFlags()["show-cards-section-component"]
    : true;
  const patchShowCardsSectionComponentFlag = useFlags()["patch-show-cards-section-component"];
  const showHeroRedesignFlag = useFlags()["show-hero-redesign"].includes("text-left");
  const showDifferentHeroImageFlag = variant?.includes("government")
    ? useFlags()["show-different-hero-image-string"]
    : "imageA";

  return (
    <section
      className="bg-slate-100 salient-hero-image"
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
                    showHeroRedesignFlag ? "lg:items-end lg:pl-16 " : "lg:pr-16 "
                  }`}
                >
                  <h1
                    className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl ${
                      showHeroRedesignFlag ? "lg:text-right" : ""
                    }`}
                    data-testid={"salient-hero-title-test-id"}
                  >
                         {homePageContent?.title}
                  </h1>
                  <p
                    className={`mt-4 text-xl text-gray-600 `}
                    data-testid={"salient-hero-subtitle-test-id"}
                  >
                    {homePageContent?.industryMessages}
                  </p>
                  <div className="mt-6">
                    <Button
                      // href={customizedStyleState["CUSTOM__salient-hero"]?.button?.href}

 
                      // handleClick={() => {
                      //   if (showHeroInvestmentPromoLDFlag && !showHeroInvestmentPlanSignUpLDFlag) {
                      //     amplitude.track(
                      //       "Sign Up for Early Access to Investment Platform Button Clicked"
                      //     );
                      //     ldClient?.track("sign-up-started-early-access-investment-platform");
                      //     handleAlert({
                      //       alert: alert,
                      //       type: ALERT_TYPES.SUCCESS,
                      //       message:
                      //         "Congratulations! You are enrolled in early access to the investment platform!",
                      //       timeout: 5000,
                      //     });
                      //   }

                      //   if (!showHeroInvestmentPromoLDFlag && showHeroInvestmentPlanSignUpLDFlag) {
                      //     amplitude.track(
                      //       "Sign Up to Access new Investment Platform Button Clicked"
                      //     );
                      //     ldClient?.track("sign-up-started-new-access-investment-platform");
                      //   }
                      // }}
                    >
                      afawefawefawfafa
                    </Button>
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
    </section>
  );
}

export default ImageWithContentHero;
