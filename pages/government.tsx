import { useContext } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useLDClient } from "launchdarkly-react-client-sdk";
import NavBar from "@/components/ui/navbar";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import { setCookie } from "cookies-next";
import LoginContext from "@/utils/contexts/login";
import InvestmentAccountHeader from "@/components/ui/investmentcomponents/InvestmentAccountHeader";

import NewsCard from "@/components/ui/investmentcomponents/NewsCard";
import StockMoversCard from "@/components/ui/investmentcomponents/StockMoversCard";
import BalanceCard from "@/components/ui/investmentcomponents/BalanceCard";
import RetirementCard from "@/components/ui/investmentcomponents/RetirementCard";
import TradingTrainingCard from "@/components/ui/investmentcomponents/TradingTrainingCard";
import MarketCard from "@/components/ui/investmentcomponents/MarketCard";
import StockRecommendationCard from "@/components/ui/investmentcomponents/StockRecommendationCard";
import RecentTradesCard from "@/components/ui/investmentcomponents/RecentTradesCard";

export default function Government() {
  const { isLoggedIn, logoutUser } = useContext(LoginContext);

  const ldclient = useLDClient();

  //TODO: either use this or the one in login.js
  //TODO: move this into navbar
  function handleLogout() {
    logoutUser();
    const context: any = ldclient?.getContext();
    context.user.tier = null;
    ldclient?.identify(context);
    setCookie("ldcontext", context);
  }

  const cardStyle = "rounded-lg shadow-lg p-5 sm:p-5 bg-white";

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        <LoginHomePage variant="government" name="The Bureau of Risk Reduction" />
      </AnimatePresence>
    </>
  );
}
