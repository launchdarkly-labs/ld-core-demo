import React, { ReactElement } from "react";

const NavbarRightSideLinkWrapper = ({ children }: { children: ReactElement }) => {
  return <div className="hidden sm:block lg:hidden">{children}</div>;
};

export default NavbarRightSideLinkWrapper;
