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
  const { isLoggedIn, logoutUser } = useContext(LoginContext);
  const router = useRouter();

  if (!isLoggedIn) return null;

  const handleLogout = async () => {
    await logoutUser();
    router.push("/bank");
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-loginComponentBlue text-white font-audimat rounded-none px-4"
    >
      Logout
    </Button>
  );
};

export default NavbarLogin;
