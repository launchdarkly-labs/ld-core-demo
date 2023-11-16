//@ts-nocheck
import * as React from "react";
import { useContext } from "react";
import { CSNav } from "./csnav";
import { Search, MessageCircle } from "lucide-react";
import { RegistrationForm } from "./airwayscomponents/stepregistration";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import LoginContext from "@/utils/contexts/login";
import LoginScreen from "@/components/ui/airwayscomponents/login";
import { Button } from "./button";
import BookedFlights from "./airwayscomponents/bookedFlights";
import MarketLoginScreen from "./marketcomponents/login";
import { StoreCart } from "./marketcomponents/stores/storecart";
import LaunchClub from "./airwayscomponents/launchClub";

const NavBar = React.forwardRef<any>(
  ({ className, variant, handleLogout, ...props }, ref) => {
    const { isLoggedIn } = useContext(LoginContext);
    let navBarClass = "";
    switch (variant) {
      case "airlines":
        return (
          <nav className="sticky w-full place-content-between flex top-0 bg-navgray z-40 font-audimat transition-all duration-150 h-12 md:h-20 p-6">
            <div className="items-center flex">
              <CSNav />
            </div>
            <div className="ml-8 flex items-center text-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40"
                width="50"
                className="pr-2"
              >
                <image
                  href="/launch-airways.svg"
                  height="40"
                  width="40"
                  alt="Launch Airways"
                />
              </svg>
              <p className="text-base flex font-sohnelight">
                <strong className="font-semibold font-sohne">Launch</strong>
                {"\u00A0"}
                {"\u00A0"}Airways
              </p>
            </div>
            {isLoggedIn ? (
              <>
                <button
                  href="/airways"
                  className="ml-12 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-white text-sm font-sohnelight font-medium transition-colors hover:text-white focus:text-airlinetext hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom outline-none"
                >
                  Book
                </button>
                <BookedFlights />
                <button
                  href="/airways"
                  className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom"
                >
                  Checkin
                </button>
                <LaunchClub />
              </>
            ) : null}
            <div className="flex space-x-6 ml-auto mr-4 items-center">
              <Search />
              <MessageCircle />
              <LoginScreen />
            </div>
          </nav>
        );
      case "bank":
        return (
          <nav className="sticky w-full place-content-start flex top-0 bg-navgray z-40 font-audimat transition-all duration-150 h-12 md:h-20 p-6">
            <div className="items-center flex">
              <CSNav />
            </div>
            <div className="ml-8 flex items-center text-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28"
                width="174"
                className="pr-2"
              >
                <image
                  href="/toggle-bank.svg"
                  height="28"
                  width="174"
                  alt="Toggle Bank"
                />
              </svg>
            </div>
            {isLoggedIn ? (
            <>    
            <button
              href="/bank"
              className="ml-12 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-white text-sm font-sohnelight font-medium transition-colors hover:text-white focus:text-airlinetext bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom"
            >
              Summary
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom"
            >
              Transfers
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom"
            >
              Deposits
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom"
            >
              External Accounts
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom"
            >
              Statements
            </button>
            </>) : null}
            {!isLoggedIn ? (
                null
            ) : (            
            <div className="flex space-x-6 ml-auto mr-4 items-center">
              <Search color={"white"} />
              <MessageCircle color={"white"} />
              <Popover>
                <PopoverTrigger>
                  <Avatar>
                    <AvatarImage src="woman.png" className="" />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] h-[400px]">
                  <div className="grid space-y-4">
                    <p className="text-center text-xl font-audimat">
                      Welcome to Your Account!
                    </p>
                    <img
                      src="woman.png"
                      className="rounded-full h-32 mx-auto"
                    />
                    <Button onClick={handleLogout}>Logout</Button>
                  </div>
                </PopoverContent>
              </Popover>
              {/* <RegistrationForm />
            <LoginScreen /> */}
            </div>
            )}
          </nav>
        );
      case "market":
        return (
          <nav className="sticky w-full place-content-between flex top-0 bg-navgray z-40 font-audimat transition-all duration-150 h-12 md:h-20 p-6">
            <div className="items-center flex">
              <CSNav />
            </div>
            <div className="ml-8 flex items-center text-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40"
                width="50"
                className="pr-2"
              >
                <image
                  href="/marketplace.svg"
                  height="40"
                  width="40"
                  alt="Marketplace"
                />
              </svg>
              <p className="text-base flex text-white font-sohnelight">
                <strong className="font-sohne">Market</strong>place
              </p>
            </div>
            {isLoggedIn ? (
              <>
                <button
                  href="/marketplace"
                  className="ml-12 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-white text-sm font-sohnelight font-medium transition-colors hover:text-white focus:text-airlinetext bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom"
                >
                  All
                </button>
                <button
                  href="/marketplace"
                  className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom"
                >
                  Account
                </button>
                <button
                  href="/marketplace"
                  className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom"
                >
                  Buy Again
                </button>
                <button
                  href="/marketplace"
                  className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom"
                >
                  Today's Deals
                </button>
                <button
                  href="/marketplace"
                  className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom"
                >
                  Sale
                </button>
              </>
            ) : null}
            <div className="flex space-x-6 ml-auto mr-4 items-center">
              <StoreCart />
              <Search color={"white"} />
              <MessageCircle color={"white"} />
              <MarketLoginScreen />
            </div>
          </nav>
        );
      default:
        return (
          <nav className="absolute w-full place-content-start flex top-0 bg-navgray font-audimat transition-all duration-150 h-12 md:h-20 p-6">
            <div className="items-center flex">
              <CSNav />
            </div>
            <div className="ml-8 flex items-center text-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28"
                width="200"
                className="pr-2"
              >
                <image
                  href="/ld-logo.svg"
                  height="28"
                  width="174"
                  alt="LaunchDarkly"
                />
              </svg>
            </div>
          </nav>
        );
    }

    return <div ref={ref} className={cn(navBarClass)} {...props} />;
  }
);

export default NavBar;
