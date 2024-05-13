import { BarChart2Icon,  } from "lucide-react";
import { Button } from "@/components/ui/button";

const TradingTrainingCard = () => {
  const initialTradeCardContent = {
    title: "Start Trading Here",
    subtitle: "Start your investment journey with us through our advance trading platform.",
    buttonText: "Trade Now",
    icon: <BarChart2Icon className="rounded-md bg-gradient-investment p-3 h-14 w-14 text-white" />,
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      {initialTradeCardContent.icon}
      <h3 className="text-2xl text-center" data-testid="trading-training-card-header-test-id">
        {initialTradeCardContent.title}
      </h3>
      <p className="text-center">{initialTradeCardContent.subtitle}</p>
      <Button
        className="bg-investmentblue rounded-none cursor-default"
        onClick={() => {
          null;
        }}
      >
        {initialTradeCardContent.buttonText}
      </Button>
    </div>
  );
};

export default TradingTrainingCard;
