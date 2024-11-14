import React, { ReactElement } from "react";

const NavbarLeftSideLinkWrapper = ({ children }: { children: ReactElement }) => {
  return <div className="hidden lg:flex">{children}</div>;
};

export default NavbarLeftSideLinkWrapper;
