import { useContext } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import LoginContext from "@/utils/contexts/login";
import Chatbot from "@/components/chatbot/ChatBot";
// import IndexPage from "@/components/chatbot/(chat)/page";
import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import NavbarLeftSideWrapper from "@/components/ui/NavComponent/NavbarLeftSideWrapper";
import NavLinkButton from "@/components/ui/NavComponent/NavLinkButton";
import NavbarRightSideWrapper from "@/components/ui/NavComponent/NavbarRightSideWrapper";
import NavbarLogin from "@/components/ui/NavComponent/NavbarLogin";
import NavbarDropdownMenu from "@/components/ui/NavComponent/NavbarDropdownMenu";
import NavbarDropdownMenuItemWrapper from "@/components/ui/NavComponent/NavbarDropdownMenuItemWrapper";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CSNav } from "@/components/ui/csnav";
import NavbarLeftSideLinkWrapper from "@/components/ui/NavComponent/NavbarLeftSideLinkWrapper";
import NavbarRightSideLinkWrapper from "@/components/ui/NavComponent/NavbarRightSideLinkWrapper";
import {
  NavbarSignInButton,
  NavbarSignUpButton,
} from "@/components/ui/NavComponent/NavbarSignUpInButton";
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import LaunchClubStatus from "@/components/ui/airwayscomponents/launchClubStatus";
import BookedFlights from "@/components/ui/airwayscomponents/bookedFlights";
import AirwaysHero from "@/components/ui/airwayscomponents/AirwaysHero";
import LaunchSignUp from "@/components/ui/airwayscomponents/launchSignup";

export default function Airways() {
  const { isLoggedIn, userObject } = useContext(LoginContext);

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`  min-w-screen min-h-screen bg-[url('/airline/airwaysHomePageBG2.svg')] bg-cover bg-center bg-no-repeat pb-10`}
        >
          <NavWrapper>
            <>
              <CSNavWrapper>
                <CSNav />
              </CSNavWrapper>

              <NavLogo
                srcHref={NAV_ELEMENTS_VARIANT["airlines"]?.logoImg?.src}
                altText={"airlines"}
              />

              {isLoggedIn && (
                <NavbarDropdownMenu>
                  <>
                    {NAV_ELEMENTS_VARIANT["airlines"]?.navLinks.map((navLink, index) => {
                      return (
                        <DropdownMenuItem href={navLink?.href} key={index}>
                          {navLink?.text}
                        </DropdownMenuItem>
                      );
                    })}

                    {userObject.personaEnrolledInLaunchClub && (
                      <NavbarDropdownMenuItemWrapper>
                        <LaunchClubStatus />
                      </NavbarDropdownMenuItemWrapper>
                    )}

                    <NavbarDropdownMenuItemWrapper>
                      <BookedFlights />
                    </NavbarDropdownMenuItemWrapper>
                  </>
                </NavbarDropdownMenu>
              )}

              {/* left side navbar template */}
              {isLoggedIn && (
                <NavbarLeftSideWrapper>
                  <>
                    {NAV_ELEMENTS_VARIANT["airlines"]?.navLinks.map((navLink, index) => {
                      return (
                        <NavLinkButton
                          text={navLink?.text}
                          href={navLink?.href}
                          navLinkColor={NAV_ELEMENTS_VARIANT["airlines"]?.navLinkColor}
                          index={index}
                          key={index}
                        />
                      );
                    })}

                    <NavbarLeftSideLinkWrapper>
                      <BookedFlights />
                    </NavbarLeftSideLinkWrapper>
                  </>
                </NavbarLeftSideWrapper>
              )}

              {/* right side navbar template */}
              <NavbarRightSideWrapper>
                <>
                  {isLoggedIn && (
                    <>
                      {userObject.personaEnrolledInLaunchClub && (
                        <NavbarRightSideLinkWrapper>
                          <LaunchClubStatus />
                        </NavbarRightSideLinkWrapper>
                      )}

                      <NavbarRightSideLinkWrapper customCSS="lg:hidden">
                        <BookedFlights />
                      </NavbarRightSideLinkWrapper>
                    </>
                  )}

                  {!isLoggedIn && (
                    <>
                      <NavbarSignUpButton backgroundColor="bg-gradient-airways" />

                      {/* <NavbarSignInButton
                        borderColor="border-airlinedarkblue"
                        backgroundColor="bg-gradient-airways-darker-blue"
                      /> */}
                    </>
                  )}

                  <NavbarLogin variant={"airlines"} />
                </>
              </NavbarRightSideWrapper>
            </>
          </NavWrapper>

          <AirwaysHero />

          {isLoggedIn && !userObject.personaEnrolledInLaunchClub && (
            <motion.section
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 50 }}
              className=" bg-transparent flex items-center mx-auto w-full max-w-7xl rounded-3xl px-4 font-sohnelight"
            >
              <div
                className="py-8 sm:py-[2rem] px-6 sm:px-8 gap-y-4 md:gap-y-0  
        flex flex-col md:flex-row justify-center items-center w-full bg-white rounded-3xl "
              >
                <div
                  className="flex-col md:flex md:flex-col
      text-airlineblack w-full pr-0 md:pr-10 md:mb-0 gap-y-2 "
                >
                  <h2 className="text-airlinedarkblue text-3xl font-audimat">
                    Closer to the sky and perks
                  </h2>
                  <p className="">
                    Join LaunchClub for exclusive access to flights, rewards, and much more. See
                    details within.
                  </p>
                </div>

                <div className="">
                  <LaunchSignUp>
                    <NavbarSignUpButton
                      className={`rounded-3xl w-[6rem] bg-gradient-airways animate-pulse hover:animate-none cursor-pointer`}
                    />
                  </LaunchSignUp>
                </div>
              </div>
            </motion.section>
          )}
        </motion.main>
      </AnimatePresence>

      <Chatbot />
    </>
  );
}
