import React, { ReactElement } from "react";

const NavbarRightSideWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div
      className="flex space-x-3 sm:space-x-6 ml-auto mr-0 sm:mr-4 items-center"
      id="navbar-right-side-wrapper"
    >
      {children}
    </div>
  );
};

export default NavbarRightSideWrapper;
