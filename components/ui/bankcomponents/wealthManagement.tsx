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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className="bg-white border border-zinc-200 rounded-xl shadow-xl h-full flex flex-col p-10 items-center justify-center"
    >
      <img src="/chart.png" height={60} width={60} alt="chart" />
      <p className="flex font-sohne py-2 text-3xl text-center">
        Review your wealth management insights
      </p>
      <p className="flex font-sohnelight pt-2 pb-8 text-large text-center">
        Roadmap for a sophisticated wealth plan
      </p>
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex justify-end">
            <Button
              variant="default"
              className="w-full px-6 py-6 bg-bankdarkblue font-sohnelight rounded-none text-[20px] mx-auto"
            >
              Start now
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent className="overflow-auto w-full sm:w-full xl:w-[80%] ">
          <SheetHeader className="mb-10">
            <SheetTitle className="text-4xl text-black"></SheetTitle>
            <SheetDescription className="text-xl pb-24"></SheetDescription>
          </SheetHeader>

          <div className={`w-full h-full font-sohne`}>
            <div className="p-6 bg-zinc-100 w-full rounded-xl shadow-xl text-black">
              <div className="justify-center xl:justify-start">
                <p className="font-sohne mb-6 text-[24px]">Wealth Management</p>

                <div className="flex flex-col lg:flex-row gap-y-4 sm:gap-x-4 accounttext">
                  <div className="px-6 pt-6 w-full lg:w-1/3  bg-white">
                    <div className="flex justify-between">
                      <p className="  font-sohne font-bold text-lg">
                        Wealth Insights AI <br />
                        <span className="font-sohnelight text-xs text-zinc-400 italic">
                          Powered By Amazon Bedrock
                        </span>
                      </p>

                      <div className="flex items-center">
                        <img src="aws.png" />
                      </div>
                    </div>
                    <div className="relative py-2 sm:col-span-1 lg:col-span-2 w-full overflow-y-auto ">
                      <div className="h-40 overflow-auto flex flex-col justify-center">
                        {loading ? (
                          <BounceLoader
                            color="rgb(59 130 246)"
                            size={50}
                            className="mt-10"
                          />
                        ) : (
                          <div className="font-sohnelight">
                            {aiResponse || (
                              <p className="text-zinc-300">
                                No response generated yet.
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row gap-2 pt-12">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-bankdarkblue text-white rounded-none font-sohnelight w-full">
                              View Prompt
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="">
                            <div className="m-4 fontsohnelight">
                              <p className="aiinsightstext text-xl">
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
                          className="flex bg-white text-bankdarkblue rounded-none font-sohnelight items-center w-full hover:bg-zinc-100"
                        >
                          Generate{" "}
                          <ArrowRight className="text-bankdarkblue ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 w-full lg:w-1/3 bg-white">
                    <div className="space-y-2">
                      <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
                        <AiOutlineAreaChart className="text-blue-700 h-8 w-8" />
                      </div>
                      <div className="">
                        <p className="font-sohnelight text-base">
                          <strong className="font-sohne">
                            {" "}
                            Brokerage Account{" "}
                          </strong>
                          (***6552)
                        </p>
                      </div>
                    </div>

                    <div className="pt-40">
                      <div className="text-base font-sohnelight pb-2 text-zinc-500">
                        Total investment balance:{" "}
                      </div>
                      <div className="moneytext text-6xl sm:text-6xl font-sohne pb-2">
                        $184,278
                      </div>
                      <div className=" text-sm font-sohnelight text-zinc-500">
                        Over lifetime of account
                      </div>
                    </div>
                  </div>
                  <div className="p-4  w-full lg:w-1/3 bg-white">
                    <StocksComponent />
                  </div>
                </div>
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
