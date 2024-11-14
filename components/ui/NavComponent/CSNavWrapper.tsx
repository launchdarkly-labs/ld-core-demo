import React, { ReactElement } from "react";

const CSNavWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div className="items-center flex gap-x-6 text-navlink" id="navbar-sidebar">
      {children}
    </div>
  );
};

export default CSNavWrapper;
