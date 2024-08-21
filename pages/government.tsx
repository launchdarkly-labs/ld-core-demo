import { useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import Chatbot from "@/components/chatbot/ChatBot";

import LoginContext from "@/utils/contexts/login";


export default function Government() {
  const { isLoggedIn, logoutUser } = useContext(LoginContext);

  const ldclient = useLDClient();


  const cardStyle = "rounded-lg shadow-lg p-5 sm:p-5 bg-white";

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        <LoginHomePage variant="government"/>
        <Chatbot variant="government"/>
      </AnimatePresence>
    </>
  );
}
