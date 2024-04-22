// import RetirementChart from "./RetirementChart";
import { Button } from "@/components/ui/button";
import retirementGraph from '@/public/investment/graphs/retirement_graph.png'

const RetirementCard = () => {
  const retireDate = "36";

  return (
    <>
      <h3 className="font-bold text-lg text-left">Goals</h3>
      {/* <div className="h-[25rem] w-[100%] mb-4 mt-[-5rem]">
        <RetirementChart />
       
      </div> */}
      <img src={retirementGraph.src} alt="retirement-graph" className="w-full sm:w-[50%] lg:w-[80%] investmentXL:w-full "/>
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-xl mb-4 text-center">
          You could retire in {retireDate} years. Are you on target?{" "}
        </h3>
        <Button className="bg-investmentblue rounded-none cursor-default">
          Get Retirement Score
        </Button>
      </div>
    </>
  );
};

export default RetirementCard;
