import RetirementChart from "./RetirementChart";
import { Button } from "@/components/ui/button";

const RetirementCard = () => {
  const retireDate = "36";

  return (
    <>
      <h3 className="font-bold text-lg mb-4 text-left">Goals</h3>
      <div className="h-[25rem] w-[100%] mb-4 mt-[-5rem]">
        <RetirementChart />
      </div>
      <div className="mt-[-10rem] flex flex-col items-center">
        <h3 className="font-bold text-xl mb-4 text-center">
          You could retire in {retireDate} years. Are you on target?{" "}
        </h3>
        <Button className="bg-investmentblue rounded-none">
          Get Retirement Score
        </Button>
      </div>
    </>
  );
};

export default RetirementCard;
