import { motion } from "framer-motion";
import { AiOutlineAreaChart } from "react-icons/ai";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BounceLoader } from "react-spinners";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getVariantClassName } from "@/utils/getVariantClassName";
import { StocksComponent } from "@/components/ui/bankcomponents/stocksCard";

interface WealthManagementSheetProps {
  data: any;
  aiPrompt: string;
  submitQuery: (prompt: string) => void;
  prompt: string;
  loading: boolean;
  aiResponse: string;
}

const WealthManagementSheet = ({
  data,
  aiPrompt,
  submitQuery,
  prompt,
  loading,
  aiResponse,
}: WealthManagementSheetProps) => {
  const variants = {
    hidden: { scaleY: 0, originY: 1 },
    visible: { scaleY: 1, originY: 1 },
    exit: { x: "100%" },
  };

  //   const bgBankBlue = getVariantClassName("bank");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className="p-24 bg-gradient-blue shadow-xl overflow-auto h-full flex flex-col content-center justify-center flex-wrap"
    >
      <p className="text-white font-sohne mb-6 text-[36px]">Wealth Management</p>
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex justify-end">
            <Button variant="outline" className="w-full rounded-none text-[20px] py-8">
              {" "}
              Open App &rarr;{" "}
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent className="overflow-auto w-full sm:w-[80%] xl:w-[80%]">
          <SheetHeader>
            <SheetTitle>Welcome to Wealth Management App</SheetTitle>
            <SheetDescription>
              Access to all new Wealth Management features available at your fingertips
            </SheetDescription>
          </SheetHeader>

          <h3 className=" font-sohne py-6 text-[24px] ">Wealth Management</h3>

          <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-4 ">
            <div className={`p-4 w-full bg-gradient-blue overflow-auto shadow-lg`}>
              <div className="p-4 bg-white accounttext h-full">
                <div className="flex justify-between pb-2">
                  <p className="  font-sohne font-bold text-lg">
                    Wealth Insights AI <br />
                    <span className="font-sohne">Powered By Amazon Bedrock</span>
                  </p>

                  <div>
                    <img src="aws.png" />
                  </div>
                </div>
                <div className="relative p-4 sm:col-span-1 lg:col-span-2 w-full   overflow-y-auto ">
                  <div className="h-40 overflow-auto flex flex-col justify-start items-center border-2   border-black p-4">
                    {loading ? (
                      <BounceLoader color="rgb(59 130 246)" size={50} className="mt-10" />
                    ) : (
                      <div className="font-sohnelight">
                        {aiResponse || "No response generated yet."}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-white border-2 border-black text-blue-500 rounded-none font-sohne w-full">
                          View Prompt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="">
                        <div className="m-4 fontsohnelight">
                          <p className="aiinsightstext text-xl pb-4">
                            Current AWS Bedrock Configured Prompt -
                          </p>
                          {aiPrompt}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => {
                        submitQuery(prompt);
                      }}
                      className="flex bg-white border-2 border-black text-blue-500 rounded-none font-sohne items-center w-full "
                    >
                      Generate <ArrowRight className="text-blue-700 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4  bg-gradient-blue w-full accounttext overflow-auto min-w-fit shadow-lg">
              <div className="p-4 bg-white  h-full">
                <div className="space-y-2">
                  <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
                    <AiOutlineAreaChart className="text-blue-700 h-8 w-8" />
                  </div>
                  <div className="">
                    <p className=" font-bold font-sohne text-lg">Brokerage Account</p>
                    <p className=" font-bold font-sohne text-lg">(***6552)</p>
                  </div>
                </div>

                <div className="pt-40">
                  <div className="balancetext font-sohne">Total Investment Balance: </div>
                  <div className="moneytext text-base sm:text-3xl font-audimat">$184,278</div>
                  <div className=" text-sm font-sohnelight">Over Lifetime of Account</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-blue  w-full overflow-auto min-w-max shadow-lg">
              <div className="p-4 bg-white accounttext h-full">
                <StocksComponent></StocksComponent>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>{/* Add a close button here */}</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default WealthManagementSheet;
