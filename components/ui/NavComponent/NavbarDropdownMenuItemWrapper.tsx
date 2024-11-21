import React, { ReactElement } from "react";

const NavbarDropdownMenuItemWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div className="cursor-pointer block sm:hidden hover:bg-gray-100 p-[.30rem] rounded-sm text-navbargrey">
      {children}
    </div>
  );
};

export default NavbarDropdownMenuItemWrapper;
