//@ts-nocheck
import * as React from "react";
import { useContext } from "react";
import { CSNav } from "./csnav";
import { Search, MessageCircle, Menu, Navigation } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu";

const NavBar = React.forwardRef<any>(
  ({ launchClubLoyalty, cart, setCart, className, variant, handleLogout, ...props }, ref) => {
    const { isLoggedIn } = useContext(LoginContext);
    let navChild, navLogo, navLinkMobileDropdown, navLinksGroup;
    const navLinkStyling =
      "hidden sm:block pb-12 pt-1.5 bg-transparent mr-4 flex items-start text-sm font-sohnelight font-medium transition-colors bg-no-repeat bg-bottom";

    switch (variant) {
      case "airlines":
        navChild = (
          <>
            <div className="flex space-x-6 ml-auto mr-0 sm:mr-4 items-center">
              <Search className="cursor-pointer hidden sm:block" />
              <MessageCircle className=" cursor-pointer hidden sm:block" />
              <LoginScreen />
            </div>
          </>
        );

        navLogo = (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" height="40" width="50" className="pr-2">
              <image href="/launch-airways.svg" height="40" width="40" alt="Launch Airways" />
            </svg>
            <p className="text-base flex font-sohnelight">
              <strong className="font-semibold font-sohne">Launch</strong>
              {"\u00A0"}
              {"\u00A0"}Airways
            </p>
          </>
        );

        navLinkMobileDropdown = (
          <>
            <DropdownMenuItem href="/airways">Book</DropdownMenuItem>
            <DropdownMenuItem>
              <BookedFlights />
            </DropdownMenuItem>
            <DropdownMenuItem href="/airways">Check-In</DropdownMenuItem>
            <div className="flex justify-between">
              <DropdownMenuItem>
                <Search className="cursor-pointer" />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className=" cursor-pointer " />
              </DropdownMenuItem>
            </div>
          </>
        );

        navLinksGroup = (
          <>
            {" "}
            <button
              href="/airways"
              className={`${navLinkStyling} ml-12 text-white  hover:text-white focus:text-airlinetext hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] outline-none`}
            >
              Book
            </button>
            <BookedFlights />
            <button
              href="/airways"
              className={`"${navLinkStyling} mx-6  text-airlineinactive focus:text-airlinetext  hover:text-white hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px]`}
            >
              Check-In
            </button>
            {launchClubLoyalty && <LaunchClub />}
          </>
        );
        break;
      case "bank":
        navChild = (
          <>
            {!isLoggedIn ? null : (
              <div className="flex space-x-6 ml-auto mr-4 items-center">
                <Search color={"white"} className="hidden sm:block" />
                <MessageCircle color={"white"} className="hidden sm:block" />
                <Popover>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage src="woman.png" className="" />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] h-[400px]">
                    <>
                      <div className="mx-auto flex place-content-center w-full">
                        <img src="woman.png" className="rounded-full h-48" />
                      </div>
                      <div className="mx-auto text-center items-center align-center flex text-black font-sohnelight pt-4 font-robotobold text-xl items-center align-center">
                        <p className="pt-4">
                          Thank you banking with us{"  "}
                          <span className="text-2xl">Platinum Member</span>!
                        </p>
                      </div>
                      <div className="mx-auto text-center">
                        <Button
                          onClick={handleLogout}
                          className="text-xl bg-red-700 text-white items-center my-6 w-full bg-gradient-to-tr from-banklightblue to-bankdarkblue text-lg rounded-none"
                        >
                          Logout
                        </Button>
                      </div>
                    </>
                  </PopoverContent>
                </Popover>
                {/* <RegistrationForm />
            <LoginScreen /> */}
              </div>
            )}
          </>
        );

        navLogo = (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" height="28" width="174" className="pr-2">
              <image href="/toggle-bank.svg" height="28" width="174" alt="Toggle Bank" />
            </svg>
          </>
        );

        navLinkMobileDropdown = (
          <>
            <DropdownMenuItem href="/bank">Book</DropdownMenuItem>
            <DropdownMenuItem href="/bank">Transfers</DropdownMenuItem>
            <DropdownMenuItem href="/bank">Deposits</DropdownMenuItem>
            <DropdownMenuItem href="/bank">External Accounts</DropdownMenuItem>
            <DropdownMenuItem href="/bank">Statements</DropdownMenuItem>
            <div className="flex justify-between">
              <DropdownMenuItem>
                <Search className="cursor-pointer" />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className=" cursor-pointer " />
              </DropdownMenuItem>
            </div>
          </>
        );

        navLinksGroup = (
          <>
            <button
              href="/bank"
              className={`${navLinkStyling} ml-12 text-white hover:text-white focus:text-airlinetext bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px]`}
            >
              Summary
            </button>
            <button
              href="/bank"
              className={`${navLinkStyling} text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px]`}
            >
              Transfers
            </button>
            <button
              href="/bank"
              className={`${navLinkStyling} text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px]`}
            >
              Deposits
            </button>
            <button
              href="/bank"
              className={`${navLinkStyling} text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px]`}
            >
              External Accounts
            </button>
            <button
              href="/bank"
              className={`${navLinkStyling} text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-banklightblue to-bankdarkblue bg-[length:100%_3px]`}
            >
              Statements
            </button>
          </>
        );

        break;
      case "market":
        navChild = (
          <>
            <div className="flex space-x-6 ml-auto mr-4 items-center">
              <StoreCart cart={cart} setCart={setCart} />
              <Search color={"white"} className="hidden sm:block" />
              <MessageCircle color={"white"} className="hidden sm:block" />
              <MarketLoginScreen />
            </div>
          </>
        );

        navLogo = (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" height="40" width="50" className="pr-2">
              <image href="/marketplace.svg" height="40" width="40" alt="Marketplace" />
            </svg>
            <p className="text-base flex text-white font-sohnelight">
              <strong className="font-sohne">Market</strong>place
            </p>
          </>
        );

        navLinkMobileDropdown = (
          <>
            <DropdownMenuItem href="/marketplace">All</DropdownMenuItem>
            <DropdownMenuItem href="/bank">Account</DropdownMenuItem>
            <DropdownMenuItem href="/bank">Buy Again</DropdownMenuItem>
            <DropdownMenuItem href="/bank">Today's Deals</DropdownMenuItem>
            <DropdownMenuItem href="/bank">Sale</DropdownMenuItem>
            <div className="flex justify-between">
              <DropdownMenuItem>
                <Search className="cursor-pointer" />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className=" cursor-pointer " />
              </DropdownMenuItem>
            </div>
          </>
        );

        navLinksGroup = (
          <>
            <button
              href="/marketplace"
              className={`${navLinkStyling} ml-12 flex items-start text-white hover:text-white focus:text-airlinetext bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px]`}
            >
              All
            </button>
            <button
              href="/marketplace"
              className={`${navLinkStyling} text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px]`}
            >
              Account
            </button>
            <button
              href="/marketplace"
              className={`${navLinkStyling}  text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px]`}
            >
              Buy Again
            </button>
            <button
              href="/marketplace"
              className={`${navLinkStyling} text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px]`}
            >
              Today's Deals
            </button>
            <button
              href="/marketplace"
              className={`${navLinkStyling} text-airlineinactive focus:text-airlinetext hover:text-white hover:bg-gradient-to-r from-marketblue to-marketgreen bg-[length:100%_3px]`}
            >
              Sale
            </button>
          </>
        );

        break;
      default:
        // navLogo = (
        //   <>
        //     <svg xmlns="http://www.w3.org/2000/svg" height="40" width="50" className="pr-2">
        //       <image href="/marketplace.svg" height="40" width="40" alt="Marketplace" />
        //     </svg>
        //     <p className="text-base flex text-white font-sohnelight">
        //       <strong className="font-sohne">Market</strong>place
        //     </p>
        //   </>
        // );
        navChild = null;

        navLinkMobileDropdown = null;
    }

    return (
      <nav className="sticky w-full flex top-0 bg-navgray z-40 font-audimat transition-all duration-150 h-full sm:h-20 p-4 sm:p-6">
        <div className="items-center flex">
          <CSNav />
        </div>
        <div className="ml-4 sm:ml-8 flex items-center">{navLogo}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-4 cursor-pointer block sm:hidden text-white">
              <Menu size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>{navLinkMobileDropdown}</DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
        {isLoggedIn ? (
          <div className="hidden sm:flex sm:gap-x-2 lg:gap-x-6">{navLinksGroup}</div>
        ) : null}
        {navChild}
      </nav>
    );
  }
);

export default NavBar;
