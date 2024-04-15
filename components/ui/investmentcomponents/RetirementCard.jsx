import RetirementChart from "./RetirementChart";
import Button from "Components/Button";

const RetirementCard = () => {
  const retireDate = "36";

  return (
    <>
      <h3 className="font-bold text-lg mb-5 text-left">Goals</h3>
      <div className="h-[25rem] w-[100%] mb-5 mt-[-5rem]">
        <RetirementChart />
      </div>
      <div className="mt-[-10rem]">
        <h3 className="font-bold text-xl mb-5 text-center">
          You could retire in {retireDate} years. Are you on target?{" "}
        </h3>
        <Button classButtonOverride="!mx-auto !bg-button !text-button-text !flex !align-center">
          Get Retirement Score
        </Button>
      </div>
    </>
  );
};

export default RetirementCard;
