import React, { ReactElement } from "react";

const NavWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <nav className="w-full bg-transparent font-audimat transition-all duration-150 py-6">
      <div className="mx-4 xl:mx-auto max-w-7xl px-4 flex">{children}</div>
    </nav>
  );
};

export default NavWrapper;
