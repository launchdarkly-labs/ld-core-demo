//@ts-nocheck
import * as React from "react";
import { CSNav } from "./csnav";
import { Search, MessageCircle } from "lucide-react";
import { RegistrationForm } from "./airwayscomponents/stepregistration";
import LoginScreen from "@/components/ui/airwayscomponents/login";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const NavBar = React.forwardRef<any>(
  ({ className, variant, ...props }, ref) => {
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
            <button
              href="/airways"
              className="ml-12 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive text-sm font-sohnelight font-medium transition-colors hover:text-white focus:text-airlinetext hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Book
            </button>
            <button
              href="/airways"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              My Bookings
            </button>
            <button
              href="/airways"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Checkin
            </button>
            <button
              href="/airways"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Flight Status
            </button>
            <div className="flex space-x-6 ml-auto mr-4 items-center">
              <Search />
              <MessageCircle />
              <Avatar>
                <AvatarImage src="/woman.png" alt="woman" />
                <AvatarFallback>LD</AvatarFallback>
              </Avatar>
              {/* <RegistrationForm />
            <LoginScreen /> */}
            </div>
          </nav>
        );
      case "bank":
        return (
          <nav className="sticky w-full place-content-between flex top-0 bg-navgray z-40 font-audimat transition-all duration-150 h-12 md:h-20 p-6">
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
            <button
              href="/bank"
              className="ml-12 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive text-sm font-sohnelight font-medium transition-colors hover:text-white focus:text-airlinetext hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Summary
            </button>
            <button
              href="/airways"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              My Bookings
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Transfers
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Deposits
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              External Accounts
            </button>
            <button
              href="/bank"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Statements
            </button>
            <div className="flex space-x-6 ml-auto mr-4 items-center">
              <Search color={"white"} />
              <MessageCircle color={"white"} />
              <Avatar>
                <AvatarImage src="/woman.png" alt="woman" />
                <AvatarFallback>LD</AvatarFallback>
              </Avatar>
              {/* <RegistrationForm />
            <LoginScreen /> */}
            </div>
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
            <button
              href="/marketplace"
              className="ml-12 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive text-sm font-sohnelight font-medium transition-colors hover:text-white focus:text-airlinetext hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              All
            </button>
            <button
              href="/marketplace"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Account
            </button>
            <button
              href="/marketplace"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Buy Again
            </button>
            <button
              href="/marketplace"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Today's Deals
            </button>
            <button
              href="/marketplace"
              className="mx-6 pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive focus:text-airlinetext text-sm font-sohnelight font-medium transition-colors hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px] bg-no-repeat bg-bottom focus:outline-none"
            >
              Sale
            </button>
            <div className="flex space-x-6 ml-auto mr-4 items-center">
              <Search color={"white"} />
              <MessageCircle color={"white"} />
              <Avatar>
                <AvatarImage src="/woman.png" alt="woman" />
                <AvatarFallback>LD</AvatarFallback>
              </Avatar>
              {/* <RegistrationForm />
            <LoginScreen /> */}
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
