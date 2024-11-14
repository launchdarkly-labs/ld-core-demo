import { useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import BankHomePage from "@/components/ui/bankcomponents/bankHomePage";
import BankUserDashboard from "@/components/ui/bankcomponents/bankUserDashboard";
import bankHomePageBackgroundRight from "@/public/banking/backgrounds/bank-homepage-background-right.svg";
import bankHomePageBackgroundLeft from "@/public/banking/backgrounds/bank-homepage-background-left.svg";
import { motion } from "framer-motion";
import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import NavbarLeftSideWrapper from "@/components/ui/NavComponent/NavbarLeftSideWrapper";
import NavLinkButton from "@/components/ui/NavComponent/NavLinkButton";
import NavbarRightSideWrapper from "@/components/ui/NavComponent/NavbarRightSideWrapper";
import NavbarLogin from "@/components/ui/NavComponent/NavbarLogin";
import NavbarDropdownMenu from "@/components/ui/NavComponent/NavbarDropdownMenu";
import NavbarDropdownMenuItemWrapper from "@/components/ui/NavComponent/NavbarDropdownMenuItemWrapper";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CSNav } from "@/components/ui/csnav";
import NavbarLeftSideLinkWrapper from "@/components/ui/NavComponent/NavbarLeftSideLinkWrapper";
import NavbarRightSideLinkWrapper from "@/components/ui/NavComponent/NavbarRightSideLinkWrapper";
import {
  NavbarSignInButton,
  NavbarSignUpButton,
} from "@/components/ui/NavComponent/NavbarSignUpInButton";
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import Image from "next/image";
import { BANK } from "@/utils/constants";

export default function Bank() {
  const { isLoggedIn } = useContext(LoginContext);
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`  min-w-screen min-h-screen  bg-cover bg-center bg-no-repeat pb-10`}
      >
        

        {/* <div className=" min-h-screen  "> */}

        {!isLoggedIn ? (
          <>
            <Image
              src={bankHomePageBackgroundRight}
              className="fixed right-0 bottom-0 m-h-screen"
              alt="Bank Home Page Background"
            />
            <Image
              src={bankHomePageBackgroundLeft}
              className="fixed left-0 bottom-0 m-h-screen"
              alt="Bank Home Page Background"
            />
            <BankHomePage />

          </>
        ) : (
          <>
            <BankUserDashboard />
          </>
        )}
        {/* </div> */}
      </motion.main>
    </>
  );
}