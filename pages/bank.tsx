import { useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import BankHomePage from "@/components/ui/bankcomponents/bankHomePage";
import BankUserDashboard from "@/components/ui/bankcomponents/bankUserDashboard";
import bankHomePageBackgroundRight from "@/public/banking/backgrounds/bank-homepage-background-right.svg";
import bankHomePageBackgroundLeft from "@/public/banking/backgrounds/bank-homepage-background-left.svg";
import Image from "next/image";

export default function Bank() {
  const { isLoggedIn } = useContext(LoginContext);
  return (
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
      <div className=" min-h-screen  ">

        {!isLoggedIn ? (
          <BankHomePage />
        ) : (
          <BankUserDashboard />
        )}
      </div>
    </>
  );
}