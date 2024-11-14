import React from "react";
import { Button } from "@/components/ui/button";

export const NavbarSignUpButton = ({
  backgroundColor,
  textColor,
  ...props
}: {
  backgroundColor?: string;
  textColor?: string;
  className?: string
}) => {
  return (
    <Button className={`rounded-3xl w-[6rem] ${backgroundColor} ${textColor} cursor-auto`} style={{ boxShadow: '0 14px 16px rgba(0, 0, 0, 0.1)' }} {...props}>
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
    <Button
      className={`rounded-3xl w-[6rem] border-2 hidden sm:block ${borderColor} bg-transparent ${backgroundColor} text-transparent bg-clip-text cursor-auto`} style={{ boxShadow: '0 14px 16px rgba(0, 0, 0, 0.1)' }}
    >
      Sign In
    </Button>
  );
};
