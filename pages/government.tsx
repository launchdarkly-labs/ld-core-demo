import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import Chatbot from "@/components/chatbot/ChatBot";


export default function Government() {

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        <LoginHomePage variant="government"/>
      </AnimatePresence>
      <Chatbot vertical="government"/>
    </>
  );
}
