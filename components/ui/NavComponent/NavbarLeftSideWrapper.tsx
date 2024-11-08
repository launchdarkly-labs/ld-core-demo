import React, { ReactElement } from "react";

const NavbarLeftSideWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div className="hidden lg:block relative ml-8 w-[55%] mt-2" id="navbar-left-side-wrapper">
      <div className="flex sm:gap-x-2 lg:gap-x-8 h-full absolute ">{children}</div>
    </div>
  );
};

export default NavbarLeftSideWrapper;
