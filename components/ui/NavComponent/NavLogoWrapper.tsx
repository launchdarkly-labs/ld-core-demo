import React, { ReactElement } from "react";

const NavLogoWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div className="ml-2 sm:ml-8 flex" id="navbar-logo">
      {children}
    </div>
  );
};

export default NavLogoWrapper;
