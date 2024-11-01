import { BarChart2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion

const TradingTrainingCard = () => {
  const [buttonStyle, setButtonStyle] = useState("bg-investmentblue");
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false); // State to control shaking

  const initialTradeCardContent = {
    title: "Start Trading Here",
    subtitle: "Start your investment journey with us through our advance trading platform.",
    buttonText: "Trade Now",
    icon: <BarChart2Icon className="rounded-md bg-gradient-investment p-3 h-14 w-14 text-white" />,
  };

  function goToTrading() {
      setButtonStyle("bg-red-500 hover:bg-red-500");
      setShake(true); 
      setTimeout(() => {
        setButtonStyle("bg-investmentblue");
        setShake(false); 
      }, 2000);
      throw new Error("Trading Platform is not available at the moment");
      // try {
      //   throw new Error("Trading Platform is not available at the moment");
      // } catch (error) {
      //   console.log((error as Error).message);
      // }
  }

  return (
    <div className="flex flex-col items-center gap-y-4">
      {initialTradeCardContent.icon}
      <h3 className="text-2xl text-center" data-testid="trading-training-card-header-test-id">
        {initialTradeCardContent.title}
      </h3>
      <p className="text-center">{initialTradeCardContent.subtitle}</p>
      <motion.div
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3, repeat: 1 }}
      >
        <Button
          className={`${buttonStyle} rounded-none cursor-default`}
          onClick={goToTrading}     
        >
          {shake ? "Error" : initialTradeCardContent.buttonText}
        </Button>
      </motion.div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default TradingTrainingCard;