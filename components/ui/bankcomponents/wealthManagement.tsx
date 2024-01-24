import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
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
} from "@/components/ui/sheet"
import { getVariantClassName } from '@/utils/getVariantClassName';
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
    aiResponse
}: WealthManagementSheetProps) => {
    const variants = {
        hidden: { scaleY: 0, originY: 1 },
        visible: { scaleY: 1, originY: 1 },
        exit: { x: "100%" },
    };

    const bgBankBlue = getVariantClassName('bank');


    return (
        <motion.section
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="p-6 bg-gradient-blue sm:w-full shadow-2xl mb-6 overflow-auto"
        >
            <div className="text-white font-sohne mb-6 text-[24px]">
                Wealth Management
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <div className="flex justify-end">
                        <Button variant="outline" className="w-full rounded-none"> Open App &rarr; </Button>
                    </div>
                </SheetTrigger>
                <SheetContent className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Welcome to Wealth Management App</SheetTitle>
                        <SheetDescription>
                            Access to all new Wealth Management features available at your fingertips
                        </SheetDescription>
                    </SheetHeader>
                    <div>
                        <h3 className=" font-sohne py-6 text-[24px] text-white">
                            Wealth Management
                        </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-8 w-full ">
                        <div className={`relative p-4 flex-1 sm:flex-none sm:basis-1/3 lg:basis-2/5 w-full h-full  text-white bg-gradient-to-r from-indigo-700 to-blue-500 overflow-auto shadow-lg`}>
                            <div>
                                <div className="flex justify-between pb-2">
                                    <div>
                                        <p className=" text-white  font-sohne font-bold text-lg">
                                            Wealth Insights AI{" "}
                                            <p></p>
                                            <span className=" text-white  font-sohne">
                                                Powered By Amazon Bedrock
                                            </span>

                                        </p>

                                    </div>

                                    <div>
                                        <img src="aws.png" />
                                    </div>
                                </div>
                                <div className="relative p-4 sm:col-span-1 lg:col-span-2 w-full  text-white overflow-y-auto ">
                                    <div className="h-40 overflow-auto flex flex-col justify-start items-center border  border-white p-4">
                                        {loading ? (
                                            <BounceLoader color="#1D4ED8" size={100} />
                                        ) : (
                                            <div className="font-sohnelight">
                                                {aiResponse || 'No response generated yet.'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-2 mt-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="bg-white text-blue-500 rounded-none font-sohne w-full">
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
                                            className="flex bg-white text-blue-500 rounded-none font-sohne items-center w-full"
                                        >
                                            Generate <ArrowRight className="text-blue-700 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-r from-blue-500 to-bankdarkblue flex-1 sm:flex-none sm:basis-1/3 lg:basis-1/5 h-100 overflow-auto min-w-fit shadow-lg">
                            <div className="space-y-2">
                                <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
                                    <AiOutlineAreaChart className="text-blue-700 h-8 w-8" />
                                </div>
                                <div className="">
                                    <p className="text-white font-bold font-sohne text-lg">
                                        Brokerage Account
                                    </p>
                                    <p className="text-white font-bold font-sohne text-lg">(***6552)</p>
                                </div>
                            </div>
                            

                            <div className="">
                                <div className="pt-40">
                                    <div className="cardaccounttext font-sohne text-white">
                                        Total Investment Balance:{" "}
                                    </div>
                                    <div className="moneytext text-base sm:text-3xl font-audimat">
                                        $184,278
                                    </div>
                                    <div className=" text-white text-sm font-sohnelight">
                                        Over Lifetime of Account
                                    </div>
                                </div>
                            </div>
                        </div>
                        <StocksComponent>

                        </StocksComponent>
                        <div className={`flex flex-col p-4 w-full h-full xl:h-[300px] bg-white justify-center sm:col-span-1 lg:col-span-2 `}>
                            <p className="aiinsightstext pt-4">
                                6-Month Account Trend
                            </p>
                            <ResponsiveContainer className={"h-full"}>
                                <AreaChart
                                    data={data}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#8884d8"
                                        fill="url(#colorUv)"
                                    />

                                    <defs>
                                        <linearGradient
                                            id="colorUv"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#00c0e7"
                                                stopOpacity={1}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#a34fde"
                                                stopOpacity={1}
                                            />
                                        </linearGradient>
                                    </defs>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            {/* Add a close button here */}
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </motion.section>
    );
};

export default WealthManagementSheet;