import React from "react";

const HomePageCardWrapper = ({ children }: { children: any }) => {
  return (
    <section className="flex flex-col gap-y-8 sm:gap-y-8 sm:flex-row sm:gap-x-6 lg:gap-x-14 mx-auto py-12 justify-center px-4 lg:px-8">
      {children}
    </section>
  );
};

export default HomePageCardWrapper;
