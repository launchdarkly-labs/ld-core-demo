import React from "react";

const NavLogo = ({ srcHref, altText }: { srcHref?: string; altText?: string }) => {
  return (
    <div className="ml-2 sm:ml-8 flex" id="navbar-logo">
      {srcHref ? (
        <img src={srcHref} alt={`${altText ? altText : "industry"} logo`} className="h-10 pr-2" />
      ) : (
        <img src="ld-logo.svg" alt="Default logo" className="h-10 pr-2" />
      )}
    </div>
  );
};

export default NavLogo;
