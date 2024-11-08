import React from "react";
import { Button } from "@/components/ui/button";

export const NavbarSignUpButton = ({
  backgroundColor,
  textColor,
}: {
  backgroundColor: string;
  textColor?: string;
}) => {
  return (
    <Button className={`rounded-3xl w-[6rem] ${backgroundColor} ${textColor} cursor-auto`}>
      Join Now
    </Button>
  );
};

export const NavbarSignInButton = ({
    borderColor,
    backgroundColor,
  }: {
    borderColor: string;
    backgroundColor: string;
  }) => {
    return (
        <Button className={`rounded-3xl w-[6rem] border-2 ${borderColor} bg-transparent ${backgroundColor} text-transparent bg-clip-text cursor-auto`}>
        Sign In
      </Button>
    );
  };
