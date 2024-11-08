import React, { ReactElement } from "react";

const NavbarRightSideLinkWrapper = ({ children, customCSS }: { children: ReactElement, customCSS?:string }) => {
  return <div className={`hidden sm:block ${customCSS}`}>{children}</div>;
};

export default NavbarRightSideLinkWrapper;
