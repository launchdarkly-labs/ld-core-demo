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
import LDLogoWhite from "@/assets/img/LDLogoWhite.svg";
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

const variantToImageMap = {
  bank: toggleBankHorizontalLogo.src,
  airlines: launchAirwaysHorizontalLogo.src,
  market: galaxyMarketplaceHorizontalLogo.src,
  investment: frontierCapitalHorizontalLogo.src,
  government: bureauOfRiskReductionHorizontalLogo.src,
  undefined: LDLogoWhite.src,
};

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

const NavBar = React.forwardRef<any, NavBarProps>(
  ({ cart, setCart, className, variant, ...props }, ref) => {
    const { isLoggedIn, enrolledInLaunchClub, user, loginUser, setIsLoggedIn, logoutUser } =
      useContext(LoginContext);

    let navChild;
  
    const { personas } = useContext(PersonaContext);
    const chosenPersona = personas.find((persona) => persona.personaname === user);
    const { launchClubStatus } = useContext(LoginContext);
    const imageSrc = variantToImageMap[variant];

    const logoutButtonClassname =
      "bg-loginComponentBlue text-white text-xl font-audimat items-center my-2 w-full rounded-none";

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
      },
      government: {
        navLinks: [
          { text: "Submissions", href: "/government" },
          { text: "About Us", href: "/government" },
          { text: "Contact Us", href: "/government" },
        ],
        navLinkColor: "gradient-bank",
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
      },
      airlines: {
        navLinks: [
          { text: "Book", href: "/airways" },
          { text: "Check-In", href: "/airways" },
        ],
        navLinkColor: "gradient-airline-buttons",
      },
    };

    // TODO: popover should be a modular component
    switch (variant) {
      case "airlines":
        navChild = (
          <>
            {!isLoggedIn ? null : (
              <div className="flex space-x-3 sm:space-x-6 ml-auto mr-0 sm:mr-4 items-center">
                <div className="hidden sm:block ">{!enrolledInLaunchClub && <LaunchClubStatus />}</div>

                <Search className="cursor-default hidden sm:block" />
                <div className="hidden sm:block lg:hidden">
                  <BookedFlights />
                </div>
                <div className="cursor-pointer hidden sm:block">
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

                  <PopoverContent className="w-[300px] h-[440px]">
                    <>
                      <div className="mx-auto flex place-content-center w-full">
                        <img
                          src={chosenPersona?.personaimage || "ToggleAvatar.png"}
                          className="rounded-full h-48"
                        />
                      </div>
                      <div className="mx-auto text-center items-center align-center flex text-black font-sohnelight pt-4  text-xl align-center">
                        <p className="pt-4">
                          Thank you {chosenPersona?.personaname || user} for flying Launch Airways
                          with{"  "}
                          <br></br>
                          <span className="text-2xl">
                            {capitalizeFirstLetter(launchClubStatus)} Tier
                          </span>
                          !
                        </p>
                      </div>
                      <div className="mx-auto text-center">
                        <Button onClick={logoutUser} className={` ${logoutButtonClassname}`}>
                          Logout
                        </Button>
                        <QuickLoginDialog personas={personas} variant={variant} />
                      </div>
                    </>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </>
        );

        break;
      case "bank":
        navChild = (
          <>
            {!isLoggedIn ? null : (
              <div className="flex space-x-6 ml-auto mr-4 items-center">
                <Search color={"white"} className="hidden sm:block" />
                <div className="text-white hidden sm:block">
                  <QRCodeImage />
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
                  <PopoverContent className="w-[300px] h-[440px]">
                    <>
                      <div className="mx-auto flex place-content-center w-full">
                        <img
                          src={chosenPersona?.personaimage || "ToggleAvatar.png"}
                          className="rounded-full h-48"
                        />
                      </div>
                      <div className="mx-auto text-center align-center flex text-black font-sohnelight pt-4  text-xl items-center align-center">
                        <p className="pt-4">
                          Thank you {chosenPersona?.personaname || user} for banking with us as a
                          <br></br>
                          <span className="text-2xl">Platinum Member!</span>
                        </p>
                      </div>
                      <div className="mx-auto text-center">
                        <Button onClick={logoutUser} className={` ${logoutButtonClassname}`}>
                          Logout
                        </Button>
                        <QuickLoginDialog personas={personas} variant={variant} />
                      </div>
                    </>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </>
        );

        break;
      case "market":
        navChild = (
          <div className="flex space-x-3 sm:space-x-6 ml-auto sm:mr-4 items-center">
            <StoreCart cart={cart} setCart={setCart} />
            <Search color={"white"} className="hidden sm:block cursor-pointer" />
            <div className="hidden sm:block cursor-pointer text-white">
              <QRCodeImage />
            </div>

            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage
                    src={
                      personas.find((persona) => persona.personaname === user)?.personaimage ||
                      "ToggleAvatar.png"
                    }
                    className=""
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className={`w-[300px] h-auto ${!isLoggedIn ? "p-0" : ""}`}>
                {isLoggedIn ? (
                  <>
                    <div className="mx-auto flex place-content-center w-full">
                      <img
                        src={
                          personas.find((persona) => persona.personaname === user)?.personaimage ||
                          "ToggleAvatar.png"
                        }
                        className="rounded-full h-48"
                      />
                    </div>
                    <div className="mx-auto text-center">
                      <p className="text-2xl font-normal text-black font-shone mt-4">
                        Hi {chosenPersona?.personaname}
                      </p>
                    </div>
                    <div className="mx-auto text-center">
                      <p className="text-md uppercase font-normal tracking-widest text-[#939598] font-shone mt-0">
                        PLATINUM MEMBER
                      </p>
                    </div>
                    <div className="mx-auto text-center mt-4">
                      <Button onClick={logoutUser} className={` ${logoutButtonClassname}`}>
                        Logout
                      </Button>
                      <QuickLoginDialog personas={personas} variant="market" />
                    </div>
                  </>
                ) : (
                  <LoginComponent
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    loginUser={loginUser}
                    name="Galaxy Marketplace"
                    variant={"market"}
                  />
                )}
              </PopoverContent>
            </Popover>
          </div>
        );

        break;
      case "investment":
        navChild = (
          <>
            {!isLoggedIn ? null : (
              <div className="flex space-x-3 sm:space-x-6 ml-auto items-center text-white">
                <Search className="cursor-default hidden sm:block" />
                <div className="cursor-pointer hidden sm:block">
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

                  <PopoverContent className="w-[300px] h-[440px]">
                    <>
                      <div className="mx-auto flex place-content-center w-full">
                        <img
                          src={chosenPersona?.personaimage || "ToggleAvatar.png"}
                          className="rounded-full h-48"
                        />
                      </div>

                      <p className="pt-4 text-center  text-black font-sohnelight text-xl">
                        Thank you {chosenPersona?.personaname || user} for
                        <br></br>investing with us as a<br></br>
                        <span className="text-2xl">
                          {capitalizeFirstLetter(launchClubStatus)} Tier
                        </span>
                        !
                      </p>

                      <div className="mx-auto text-center">
                        <Button onClick={logoutUser} className={` ${logoutButtonClassname}`}>
                          Logout
                        </Button>
                        <QuickLoginDialog personas={personas} variant={variant} />
                      </div>
                    </>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </>
        );

        break;
      case "government":
        navChild = (
          <>
            {!isLoggedIn ? null : (
              <div className="flex space-x-3 sm:space-x-6 ml-auto items-center text-white">
                <Search className="cursor-default hidden sm:block" />
                <div className="cursor-pointer hidden sm:block">
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

                  <PopoverContent className="w-[300px] h-[440px]">
                    <>
                      <div className="mx-auto flex place-content-center w-full">
                        <img
                          src={chosenPersona?.personaimage || "ToggleAvatar.png"}
                          className="rounded-full h-48"
                        />
                      </div>

                      <p className="pt-4 text-center  text-black font-sohnelight text-xl">
                        Thank you {chosenPersona?.personaname || user} for
                        <br></br>investing with us as a<br></br>
                        <span className="text-2xl">
                          {capitalizeFirstLetter(launchClubStatus)} Tier
                        </span>
                        !
                      </p>

                      <div className="mx-auto text-center">
                        <Button onClick={logoutUser} className={` ${logoutButtonClassname}`}>
                          Logout
                        </Button>
                        <QuickLoginDialog personas={personas} variant={variant} />
                      </div>
                    </>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </>
        );

        break;
      default:
        navChild = (
          <div className="ml-auto cursor-pointer flex self-center">
            <QRCodeImage />
          </div>
        );
        navLinkMobileDropdown = (
          <div className="h-full w-full border-2 border-black rounded-md cursor-pointer">
            <QRCodeImage />
          </div>
        );
    }

    return (
      <nav className="w-full bg-black z-40 font-audimat transition-all duration-150 py-6">
        <div className="mx-4 xl:mx-auto max-w-7xl flex">
          <div className="items-center flex gap-x-6 text-white">
            <CSNav />
          </div>
          <div className="ml-2 sm:ml-8 flex items-center">
            <img src={imageSrc} className="pr-2 h-10 cursor-pointer" />
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

          {navChild}
        </div>
      </nav>
    );
  }
);

export default NavBar;
