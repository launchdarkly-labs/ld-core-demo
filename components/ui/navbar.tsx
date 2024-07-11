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
import { PersonaContext } from "../personacontext";
import { QuickLoginDialog } from "../quicklogindialog";
import { capitalizeFirstLetter } from "@/utils/utils";

import toggleBankHorizontalLogo from "@/public/banking/toggleBank_logo_horizontal.svg";
import frontierCapitalHorizontalLogo from "@/public/investment/frontier_capital_logo_horitzonal.svg";
import launchAirwaysHorizontalLogo from "@/public/airline/launch_airways_logo_horizontal.svg";
import galaxyMarketplaceHorizontalLogo from "@/public/marketplace/galaxy_marketplace_logo_horizontal.svg";
import bureauOfRiskReductionHorizontalLogo from "@/public/government/Bureau_of_Risk_Reduction_Logo_White_Horizontal.svg";
import { LoginComponent } from "./logincomponent";

interface NavBarProps {
  cart: InventoryItem[];
  setCart: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  variant: string;
}
interface Persona {
  id: string | number;
  personaname: string;
  personatype: string;
  personaimage: string;
  personaemail: string;
}

//TODO: change user to christine, create a plat user already for targeting,
const NavBar = React.forwardRef<any, NavBarProps>(
  ({ cart, setCart, className, variant = "bank", ...props }, ref) => {
    const { isLoggedIn, enrolledInLaunchClub, user, loginUser, setIsLoggedIn, logoutUser } =
      useContext(LoginContext);

    const { personas } = useContext(PersonaContext);
    const chosenPersona = personas.find((persona) => persona.personaname === user);
    const { launchClubStatus } = useContext(LoginContext);

    return (
      <nav className="w-full bg-navbardarkgrey z-40 font-audimat transition-all duration-150 py-6">
        <div className="mx-4 xl:mx-auto max-w-7xl flex">
          <div className="items-center flex gap-x-6 text-white">
            <CSNav />
          </div>
          <div className="ml-2 sm:ml-8 flex items-center">
            <img src={navElementsVariant[variant]?.logoImg} className="pr-2 h-10 cursor-pointer" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-2 cursor-pointer block lg:hidden text-white mr-4">
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

                      {enrolledInLaunchClub && variant?.includes("airlines") && (
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

          {(isLoggedIn && !variant?.includes("market")) || variant?.includes("market") ? (
            <div className="hidden lg:block relative ml-8 w-[55%]   mt-2">
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

          {!isLoggedIn && !variant.includes("market") && !variant.includes("government") ? null : (
            <div className="flex space-x-3 sm:space-x-6 ml-auto mr-0 sm:mr-4 items-center" id="nav-login-group">
              {variant?.includes("market") && <StoreCart cart={cart} setCart={setCart} />}

              {variant?.includes("airlines") && (
                <div className="hidden sm:block ">
                  {enrolledInLaunchClub && <LaunchClubStatus />}
                </div>
              )}

              <Search className="cursor-default hidden sm:block text-white" />
              {variant?.includes("airlines") && (
                <div className="hidden sm:block lg:hidden">
                  <BookedFlights />
                </div>
              )}
              <div className="cursor-pointer hidden sm:block text-white">
                <QRCodeImage className="" />
              </div>

              <Popover>
                <PopoverTrigger>
                  <Avatar>
                    <AvatarImage
                      src={chosenPersona?.personaimage || "ToggleAvatar.png"}
                      className=""
                    />
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className={`w-[300px] h-[440px] ${!isLoggedIn ? "p-0" : ""}`}>
                  {isLoggedIn ? (
                    <>
                      <div className="mx-auto flex place-content-center w-full">
                        <img
                          src={
                            personas.find((persona) => persona.personaname === user)
                              ?.personaimage || "ToggleAvatar.png"
                          }
                          className="rounded-full h-48"
                        />
                      </div>
                      <div className="mx-auto text-center items-center align-center flex text-black font-sohnelight pt-4  text-xl align-center">
                        <p className="pt-4">
                          {navElementsVariant[variant]?.popoverMessage}
                          {chosenPersona?.personaname || user}, as a<br></br>
                          <span className="text-2xl">
                            {capitalizeFirstLetter(launchClubStatus)} Tier
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
                        <QuickLoginDialog personas={personas} variant={variant} />
                      </div>
                    </>
                  ) : (
                    <LoginComponent
                      isLoggedIn={isLoggedIn}
                      setIsLoggedIn={setIsLoggedIn}
                      loginUser={loginUser}
                      name={navElementsVariant[variant]?.name}
                      variant={variant}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>
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
    logoImg: toggleBankHorizontalLogo.src,
  },
  government: {
    navLinks: [
      { text: "Submissions", href: "/government" },
      { text: "About Us", href: "/government" },
      { text: "Contact Us", href: "/government" },
    ],
    navLinkColor: "gradient-bank",
    popoverMessage: "Thank you for your service, ",
    logoImg: bureauOfRiskReductionHorizontalLogo.src,
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
    logoImg: frontierCapitalHorizontalLogo.src,
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
    logoImg: galaxyMarketplaceHorizontalLogo.src,
  },
  airlines: {
    navLinks: [
      { text: "Book", href: "/airways" },
      { text: "Check-In", href: "/airways" },
    ],
    navLinkColor: "gradient-airline-buttons",
    popoverMessage: "Thank you for flying with us, ",
    logoImg: launchAirwaysHorizontalLogo.src,
  },
};

export default NavBar;
