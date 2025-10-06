import { useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import BankHomePage from "@/components/ui/bankcomponents/bankHomePage";
import Chatbot from "@/components/chatbot/ChatBot";
import BankUserDashboard from "@/components/ui/bankcomponents/bankUserDashboard";
import bankHomePageBackgroundRight from "@/public/banking/backgrounds/bank-homepage-background-right.svg";
import bankHomePageBackgroundLeft from "@/public/banking/backgrounds/bank-homepage-background-left.svg";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Bank() {
  const { isLoggedIn } = useContext(LoginContext);
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={` w-full min-h-screen  bg-cover bg-center bg-no-repeat pb-10`}
      >
        {!isLoggedIn ? (
          <>
            <Image
              src={bankHomePageBackgroundRight}
              className="fixed right-0 bottom-0 min-h-screen"
              alt="Bank Home Page Background"
            />
            <Image
              src={bankHomePageBackgroundLeft}
              className="fixed left-0 bottom-0 min-h-screen"
              alt="Bank Home Page Background"
            />
            <BankHomePage />
          </>
        ) : (
          <>
            <BankUserDashboard />
          </>
        )}
        <Chatbot vertical="banking" />
      </motion.main>
    </>
  );
}
