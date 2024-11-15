//@ts-nocheck
import * as React from "react";
import { useContext } from "react";
import { CSNav } from "./csnav";
import { Search, PanelTopOpen } from "lucide-react";
import { AvatarImage, Avatar } from "../avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import LoginContext from "@/utils/contexts/login";
import { Button } from "@/components/ui/button";
import BookedFlights from "@/components/ui/airwayscomponents/bookedFlights";
import { StoreCart } from "@/components/ui/marketcomponents/stores/storecart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "../dropdown-menu";
import LaunchClubStatus from "@/components/ui/airwayscomponents/launchClubStatus";
import QRCodeImage from "@/components/ui";
import { QuickLoginDialog } from "@/components/ui/quicklogindialog";
import { capitalizeFirstLetter } from "@/utils/utils";
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import { LoginComponent } from "@/components/ui/logincomponent";
import { COMPANY_LOGOS } from "@/utils/constants";
import { useRouter } from "next/router";

const NavbarLogin = ({ variant }) => {
  const { isLoggedIn, userObject, logoutUser } = useContext(LoginContext);
  return (
    <Popover id="navbar-login">
      <PopoverTrigger>
        <Avatar className="shadow-xl">
          <AvatarImage src={userObject?.personaimage || "ToggleAvatar.png"} className="" />
        </Avatar>
      </PopoverTrigger>

      <PopoverContent className={`  ${!isLoggedIn ? "p-0" : ""}`}>
        {isLoggedIn && (
          <>
            <div className="mx-auto flex place-content-center w-full">
              <img
                src={userObject?.personaimage || "ToggleAvatar.png"}
                className="rounded-full h-48"
              />
            </div>
            <div className="mx-auto text-center items-center align-center flex text-black font-sohnelight pt-4  text-xl align-center">
              <p className="pt-4">
                {NAV_ELEMENTS_VARIANT[variant]?.popoverMessage}
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
        )}

        {!isLoggedIn && <LoginComponent variant={variant} />}
      </PopoverContent>
    </Popover>
  );
};

export default NavbarLogin;
