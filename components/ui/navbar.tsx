//@ts-nocheck
import * as React from "react";
import { useContext } from "react";
import { CSNav } from "./csnav";
import { Search, PanelTopOpen } from "lucide-react";
import { Avatar, AvatarImage } from "./avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import LoginContext from "@/utils/contexts/login";
import { Button } from "./button";
import BookedFlights from "./airwayscomponents/bookedFlights";
import { StoreCart } from "./marketcomponents/stores/storecart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "./dropdown-menu";
import LaunchClubStatus from "./airwayscomponents/launchClubStatus";
import QRCodeImage from "./QRCodeImage";
import { QuickLoginDialog } from "../quicklogindialog";
import { capitalizeFirstLetter } from "@/utils/utils";

import { LoginComponent } from "./logincomponent";
import { COMPANY_LOGOS } from "@/utils/constants";
import { useRouter } from "next/router";

interface NavBarProps {
  cart?: InventoryItem[];
  setCart?: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  variant: string;
}
interface Persona {
  id: string | number;
  personaname: string;
  personatier: string;
  personaimage: string;
  personaemail: string;
}

const NavBar = React.forwardRef<any, NavBarProps>(
  ({ cart, setCart, className, variant, ...props }, ref) => {
    const { isLoggedIn, userObject, logoutUser } = useContext(LoginContext);

    const homePageLocation = useRouter()?.pathname === "/";

    return (
      <nav className="w-full bg-transparent z-40 font-audimat transition-all duration-150 py-6">
        <div className="mx-4 xl:mx-auto max-w-7xl flex">
          <div className="items-center flex gap-x-6 text-black" id="navbar-sidebar">
            <CSNav />
          </div>

          <div className="ml-2 sm:ml-8 flex" id="navbar-logo">
            {navElementsVariant[variant]?.logoImg?.src ? (
              <img
                src={navElementsVariant[variant].logoImg.src}
                alt={`${variant} logo`}
                className="h-10 pr-2"
              />
            ) : (
              <img src="ld-logo.svg" alt="Default logo" className="h-10 pr-2" />
            )}
          </div>

          {homePageLocation ? null : (
            <>
              <DropdownMenu id="nav-link-dropdown-mobile">
                <DropdownMenuTrigger asChild>
                  <button className="ml-2 cursor-pointer block lg:hidden text-black mr-4">
                    <PanelTopOpen size={24} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent>
                    <>
                      {isLoggedIn ? (
                        <>
                          {navElementsVariant[variant]?.navLinks.map((navLink, index) => {
                            return (
                              <DropdownMenuItem href={navLink?.href} key={index}>
                                {navLink?.text}
                              </DropdownMenuItem>
                            );
                          })}

                          {userObject.personaEnrolledInLaunchClub &&
                            variant?.includes("airlines") && (
                              <div className="block sm:hidden text-black hover:bg-gray-100 p-[.30rem] rounded-sm">
                                <LaunchClubStatus />
                              </div>
                            )}

                          {variant?.includes("airlines") && (
                            <div className="cursor-pointer block sm:hidden hover:bg-gray-100 p-[.30rem] rounded-sm">
                              <BookedFlights />
                            </div>
                          )}
                        </>
                      ) : null}

                      <div className="flex justify-between">
                        <DropdownMenuItem>
                          <Search className="" />
                        </DropdownMenuItem>

                        <div className="cursor-pointer">
                          <QRCodeImage />
                        </div>
                      </div>
                    </>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
              {/* left side navbar template */}

              {(isLoggedIn && !variant?.includes("market")) || variant?.includes("market") ? (
                <div
                  className="hidden lg:block relative ml-8 w-[55%] mt-2"
                  id="navbar-left-side-wrapper"
                >
                  <div className="flex sm:gap-x-2 lg:gap-x-8 h-full absolute ">
                    {
                      <>
                        {navElementsVariant[variant]?.navLinks.map((navLink, index) => {
                          return (
                            <button
                              href={navLink?.href}
                              className={`hidden sm:block bg-transparent pb-[3rem] items-start text-base font-sohnelight font-medium transition-colors bg-no-repeat bg-bottom bg-[length:100%_3px] cursor-pointer
                  ${
                    index === 0
                      ? `text-white hover:text-white focus:text-navbarlightgrey hover:bg-${navElementsVariant[variant]?.navLinkColor} bg-${navElementsVariant[variant]?.navLinkColor} outline-none`
                      : `text-navbargrey focus:text-navbarlightgrey hover:text-white hover:bg-${navElementsVariant[variant]?.navLinkColor}`
                  }`}
                              key={index}
                            >
                              {navLink?.text}
                            </button>
                          );
                        })}

                        {variant?.includes("airlines") && (
                          <div className="hidden lg:flex">
                            <BookedFlights />
                          </div>
                        )}
                      </>
                    }
                  </div>
                </div>
              ) : null}

              {!isLoggedIn && !variant?.includes("market") ? null : (
                <div
                  className="flex space-x-3 sm:space-x-6 ml-auto mr-0 sm:mr-4 items-center"
                  id="navbar-right-side-wrapper"
                >
                  {variant?.includes("market") && <StoreCart cart={cart} setCart={setCart} />}

                  {variant?.includes("airlines") && (
                    <div className="hidden sm:block ">
                      {userObject.personaEnrolledInLaunchClub && <LaunchClubStatus />}
                    </div>
                  )}

                  {variant?.includes("airlines") && (
                    <div className="hidden sm:block lg:hidden">
                      <BookedFlights />
                    </div>
                  )}

                  <Button className="rounded-3xl w-[6rem] bg-gradient-airways">Join Now</Button>
                  <Button className="rounded-3xl w-[6rem] border-2 border-airlinedarkblue bg-transparent bg-gradient-airways-darker-blue text-transparent bg-clip-text ">
                        Sign In
                      </Button>
                  <div class="rounded-3xl p-px bg-gradient-airways-darker-blue">
                    <div class="bg-white  rounded-[calc(1.5rem-1px)]">
                     
                    </div>
                  </div>
                  <Popover id="navbar-login">
                    <PopoverTrigger>
                      <Avatar>
                        <AvatarImage
                          src={userObject?.personaimage || "ToggleAvatar.png"}
                          className=""
                        />
                      </Avatar>
                    </PopoverTrigger>

                    <PopoverContent className={`w-[300px] h-[440px] ${!isLoggedIn ? "p-0" : ""}`}>
                      {isLoggedIn ? (
                        <>
                          <div className="mx-auto flex place-content-center w-full">
                            <img
                              src={userObject?.personaimage || "ToggleAvatar.png"}
                              className="rounded-full h-48"
                            />
                          </div>
                          <div className="mx-auto text-center items-center align-center flex text-black font-sohnelight pt-4  text-xl align-center">
                            <p className="pt-4">
                              {navElementsVariant[variant]?.popoverMessage}
                              {userObject?.personaname || userObject.personaname}, as a<br></br>
                              <span className="text-2xl">
                                {variant?.includes("airlines")
                                  ? capitalizeFirstLetter(userObject?.personalaunchclubstatus)
                                  : capitalizeFirstLetter(userObject?.personatier)}{" "}
                                Tier
                              </span>
                              !
                            </p>
                          </div>
                          <div className="mx-auto text-center">
                            <Button
                              onClick={logoutUser}
                              className={`bg-loginComponentBlue text-white text-xl font-audimat items-center my-2 w-full rounded-none`}
                            >
                              Logout
                            </Button>
                            <QuickLoginDialog variant={variant} />
                          </div>
                        </>
                      ) : (
                        <LoginComponent variant={variant} />
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    );
  }
);

const navElementsVariant: any = {
  bank: {
    navLinks: [
      {
        text: "Summary",
        href: "/bank",
      },
      { text: "Transfers", href: "/bank" },
      { text: "Deposits", href: "/bank" },
      { text: "External Accounts", href: "/bank" },
      { text: "Statements", href: "/bank" },
    ],
    navLinkColor: "gradient-bank",
    popoverMessage: "Thank you for banking with us, ",
    logoImg: COMPANY_LOGOS["bank"].horizontal,
  },
  investment: {
    navLinks: [
      { text: "Accounts & Trade", href: "/investment" },
      { text: "Planning", href: "/investment" },
      { text: "News", href: "/investment" },
      { text: "Investment Products", href: "/investment" },
      { text: "About Us", href: "/investment" },
    ],
    navLinkColor: "gradient-investment",
    popoverMessage: "Thank you for investing with us, ",
    logoImg: COMPANY_LOGOS["investment"].horizontal,
  },
  market: {
    navLinks: [
      { text: "All", href: "/marketplace" },
      { text: "Account", href: "/marketplace" },
      { text: "Buy Again", href: "/marketplace" },
      { text: "Today's Deals", href: "/marketplace" },
      { text: "Sale", href: "/marketplace" },
    ],
    navLinkColor: "gradient-experimentation",
    popoverMessage: "Thank you for shopping with us, ",
    logoImg: COMPANY_LOGOS["market"].horizontal,
  },
  airlines: {
    navLinks: [
      { text: "Book", href: "/airways" },
      { text: "Check-In", href: "/airways" },
    ],
    navLinkColor: "gradient-airline-buttons",
    popoverMessage: "Thank you for flying with us, ",
    logoImg: COMPANY_LOGOS["airlines"].horizontal,
  },
};

export default NavBar;
