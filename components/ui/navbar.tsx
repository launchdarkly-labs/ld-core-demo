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
import { QuickLoginDialog } from "./quicklogindialog";
import { capitalizeFirstLetter } from "@/utils/utils";
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import { LoginComponent } from "./logincomponent";
import { COMPANY_LOGOS } from "@/utils/constants";
import { useRouter } from "next/router";
import NavWrapper from "./NavComponent/NavWrapper";
import CSNavWrapper from "./NavComponent/CSNavWrapper";
import NavLogoWrapper from "./NavComponent/NavLogoWrapper";
import NavLinkWrapper from "./NavComponent/NavLinkWrapper";
import NavLinkButton from "./NavComponent/NavLinkButton";
import NavbarRightSideWrapper from "./NavComponent/NavbarRightSideWrapper";
import NavbarLogin from "./NavComponent/NavbarLogin";
import { NavBarProps, Persona } from "@/utils/typesInterface";

const NavBar = React.forwardRef<any, NavBarProps>(
  ({ cart, setCart, className, variant, ...props }, ref) => {
    const { isLoggedIn, userObject, logoutUser } = useContext(LoginContext);

    const homePageLocation = useRouter()?.pathname === "/";

    return (
      <NavWrapper>
        <CSNavWrapper>
          <CSNav />
        </CSNavWrapper>

        <NavLogoWrapper>
          {NAV_ELEMENTS_VARIANT[variant]?.logoImg?.src ? (
            <img
              src={NAV_ELEMENTS_VARIANT[variant].logoImg.src}
              alt={`${variant} logo`}
              className="h-10 pr-2"
            />
          ) : (
            <img src="ld-logo.svg" alt="Default logo" className="h-10 pr-2" />
          )}
        </NavLogoWrapper>

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
                        {NAV_ELEMENTS_VARIANT[variant]?.navLinks.map((navLink, index) => {
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
              <NavLinkWrapper>
                {
                  <>
                    {NAV_ELEMENTS_VARIANT[variant]?.navLinks.map((navLink, index) => {
                      return (
                        <NavLinkButton
                          text={navLink?.text}
                          href={navLink?.href}
                          navLinkColor={NAV_ELEMENTS_VARIANT[variant]?.navLinkColor}
                          index={index}
                          key={index}
                        />
                      );
                    })}

                    {variant?.includes("airlines") && (
                      <div className="hidden lg:flex">
                        <BookedFlights />
                      </div>
                    )}
                  </>
                }
              </NavLinkWrapper>
            ) : null}

            {!isLoggedIn && !variant?.includes("market") ? null : (
              <NavbarRightSideWrapper>
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

                <Button className="rounded-3xl w-[6rem] bg-gradient-airways cursor-auto">
                  Join Now
                </Button>
                <Button className="rounded-3xl w-[6rem] border-2 border-airlinedarkblue bg-transparent bg-gradient-airways-darker-blue text-transparent bg-clip-text cursor-auto">
                  Sign In
                </Button>

                <NavbarLogin variant={variant} />
              </NavbarRightSideWrapper>
            )}
          </>
        )}
      </NavWrapper>
    );
  }
);

export default NavBar;
