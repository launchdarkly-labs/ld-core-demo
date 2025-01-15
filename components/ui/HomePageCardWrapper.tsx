import React from "react";

const HomePageCardWrapper = ({ children }: { children: any }) => {
  return (
    <section className="flex flex-col gap-y-8 sm:gap-y-8 sm:flex-row sm:gap-x-6 
    lg:gap-x-14 mx-auto w-full max-w-7xl py-12 justify-between px-4 xl:px-4 my-[4rem] ">
      {children}
    </section>
  );
};

export default HomePageCardWrapper;
