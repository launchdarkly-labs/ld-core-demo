//@ts-nocheck
import * as React from "react";
import { useContext } from "react";
import { CSNav } from "./csnav";
import { PanelTopOpen } from "lucide-react";
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
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import { useRouter } from "next/router";
import NavWrapper from "./NavComponent/NavWrapper";
import CSNavWrapper from "./NavComponent/CSNavWrapper";
import NavLogo from "./NavComponent/NavLogo";
import NavLinksWrapper from "./NavComponent/NavLinksWrapper";
import NavLinkButton from "./NavComponent/NavLinkButton";
import NavbarRightSideWrapper from "./NavComponent/NavbarRightSideWrapper";
import NavbarLogin from "./NavComponent/NavbarLogin";
import { NavBarProps } from "@/utils/typesInterface";
import NavbarDropdownMenu from "./NavComponent/NavbarDropdownMenu";

const NavBar = React.forwardRef<any, NavBarProps>(
  ({ cart, setCart, className, variant, ...props }, ref) => {
    const { isLoggedIn, userObject, logoutUser } = useContext(LoginContext);

    const homePageLocation = useRouter()?.pathname === "/";

    return (
      <NavWrapper>
        <CSNavWrapper>
          <CSNav />
        </CSNavWrapper>

        <NavLogo
                  srcHref={NAV_ELEMENTS_VARIANT[variant]?.logoImg?.src}
                  altText={variant}
                />

        {homePageLocation ? null : (
          <>
            {isLoggedIn ? (
              <NavbarDropdownMenu>
                <>
                  {NAV_ELEMENTS_VARIANT[variant]?.navLinks.map((navLink, index) => {
                    return (
                      <DropdownMenuItem href={navLink?.href} key={index}>
                        {navLink?.text}
                      </DropdownMenuItem>
                    );
                  })}

                  {userObject.personaEnrolledInLaunchClub && variant?.includes("airlines") && (
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
              </NavbarDropdownMenu>
            ) : null}

            {/* left side navbar template */}
            {(isLoggedIn && !variant?.includes("market")) || variant?.includes("market") ? (
              <NavLinksWrapper>
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
              </NavLinksWrapper>
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
