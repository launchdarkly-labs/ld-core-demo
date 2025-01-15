import React, { ReactElement } from "react";
import { PanelTopOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";


const NavbarDropdownMenu = ({children}:{children:ReactElement}) => {

  return (
    <DropdownMenu id="nav-link-dropdown-mobile">
      <DropdownMenuTrigger asChild>
        <button className="ml-2 cursor-pointer block lg:hidden text-black mr-4 animate-pulse hover:animate-none">
          <PanelTopOpen size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          {children}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default NavbarDropdownMenu;
