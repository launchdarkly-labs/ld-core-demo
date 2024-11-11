import { useContext, useState } from "react";
import { motion } from "framer-motion";
import TripsContext from "@/utils/contexts/TripContext";
import { useToast } from "@/components/ui/use-toast";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import { FlightCalendar } from "@/components/ui/airwayscomponents/flightCalendar";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import { Toaster } from "@/components/ui/toaster";
import HomePageInfoCard from "@/components/ui/HomePageInfoCard";
import HomePageCardWrapper from "@/components/ui/HomePageCardWrapper";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AirlineHero from "@/components/ui/airwayscomponents/airlineHero";
import AirlineDestination from "@/components/ui/airwayscomponents/airlineDestination";
import LoginContext from "@/utils/contexts/login";
import { addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
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
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import LaunchClubStatus from "@/components/ui/airwayscomponents/launchClubStatus";
import BookedFlights from "@/components/ui/airwayscomponents/bookedFlights";
import { CSNav } from "@/components/ui/csnav";
import NavbarLeftSideLinkWrapper from "@/components/ui/NavComponent/NavbarLeftSideLinkWrapper";
import NavbarRightSideLinkWrapper from "@/components/ui/NavComponent/NavbarRightSideLinkWrapper";
import {
  NavbarSignInButton,
  NavbarSignUpButton,
} from "@/components/ui/NavComponent/NavbarSignUpInButton";

import AirwaysHero from "@/components/ui/airwayscomponents/AirwaysHero";

export default function Airways() {
  const { toast } = useToast();
  const [fromLocation, setFromLocation] = useState("From");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [toLocation, setToLocation] = useState("To");
  const [showSearch, setShowSearch] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const { bookedTrips, setBookedTrips } = useContext(TripsContext);
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { isLoggedIn, userObject, logoutUser } = useContext(LoginContext);

  // function bookTrip() {
  //   const startDate = `${
  //     date!.from.getMonth() + 1
  //   }/${date!.from.getDate()}/${date!.from.getFullYear()}`;
  //   const returnDate = `${date!.to.getMonth() + 1}/${date!.to.getDate()}/${date!.to.getFullYear()}`;
  //   const tripIdOutbound = Math.floor(Math.random() * 900) + 100; // Generate a random 3 digit number for outbound trip
  //   const tripIdReturn = Math.floor(Math.random() * 900) + 100; // Generate a random 3 digit number for return trip

  //   const outboundTrip = {
  //     id: tripIdOutbound,
  //     fromCity: fromCity,
  //     from: fromLocation,
  //     to: toLocation,
  //     toCity: toCity,
  //     depart: startDate,
  //     airplane: "a380",
  //     type: "Outbound",
  //   };
  //   const returnTrip = {
  //     id: tripIdReturn,
  //     from: toLocation,
  //     fromCity: toCity,
  //     to: fromLocation,
  //     toCity: fromCity,
  //     depart: returnDate,
  //     airplane: "a330",
  //     type: "Return",
  //   };

  //   setBookedTrips([...bookedTrips, outboundTrip, returnTrip]);

  //   toast({
  //     title: "Flight booked",
  //     description: `Your round trip from ${fromLocation} to ${toLocation} and back has been booked.`,
  //   });
  // }

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`  min-w-screen min-h-screen bg-[url('/airline/airwaysHomePageBG2.svg')] bg-cover bg-center bg-no-repeat`}
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

                      <NavbarSignInButton
                        borderColor="border-airlinedarkblue"
                        backgroundColor="bg-gradient-airways-darker-blue"
                      />
                    </>
                  )}

                  <NavbarLogin variant={"airlines"} />
                </>
              </NavbarRightSideWrapper>
            </>
          </NavWrapper>
          <AirwaysHero />
          
       

          {/* <AirlineHero showSearch={showSearch} /> */}

          {/* <HomePageCardWrapper>
            <HomePageInfoCard
              imgSrc={airplaneImg.src}
              headerTitleText="Wheels up"
              subtitleText="You deserve to arrive refreshed, stretch out in one of our luxurious cabins."
              key={1}
            />
            <HomePageInfoCard
              imgSrc={hotAirBalloonImg.src}
              headerTitleText="Ready for an adventure"
              subtitleText="The world is open for travel. Plan your next adventure."
              key={2}
            />
            <HomePageInfoCard
              imgSrc={airplaneDining.src}
              headerTitleText="Experience luxury"
              subtitleText="Choose Launch Platinum. Select on longer flights."
              key={3}
            />
          </HomePageCardWrapper> */}
        </motion.main>
      </AnimatePresence>

      <Chatbot />
    </>
  );
}
