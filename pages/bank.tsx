import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { ArrowRight, PlusSquare } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { CheckingAccount } from "@/components/ui/bankcomponents/checkingview";
import { CreditAccount } from "@/components/ui/bankcomponents/creditview";
import { MorgtgageAccount } from "@/components/ui/bankcomponents/mortgageview";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { checkData } from "@/lib/checkingdata";
import { setCookie } from "cookies-next";
import { AiOutlineAreaChart } from "react-icons/ai";

import LoginContext from "@/utils/contexts/login";
import { FederatedCheckingAccount } from "@/components/ui/bankcomponents/federatedChecking";
import { FederatedCreditAccount } from "@/components/ui/bankcomponents/federatedCredit";
import NavBar from "@/components/ui/navbar";
import { BounceLoader } from "react-spinners";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginHomePage from "@/components/LoginHomePage";

export default function Bank() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAIResponse] = useState<string>("");
  const [federatedAccountOne, setFederatedAccountOne] = useState(false);
  const [federatedAccountTwo, setFederatedAccountTwo] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");

  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser } =
    useContext(LoginContext);

  const { wealthManagement, federatedAccounts, aiPromptText } = useFlags();

  useEffect(() => {
    setAIPrompt(aiPromptText);
  }, [aiPromptText]);

  const money = JSON.stringify(checkData);

  // const prompt: string = `Playing the role of a financial analyst, using the data contained within this information set: ${money}, write me 50 word of an analysis of the data and highlight the item I spend most on. Skip any unnecessary explanations. Summarize the mostly costly area im spending at. Your response should be tuned to talking directly to the requestor.`;

  async function submitQuery(query: any) {
    try {
      console.log(prompt);
      setLoading(true);
      const response = await fetch("/api/bedrock", {
        method: "POST",
        body: JSON.stringify({ prompt: aiPrompt + query }),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}. Check API Server Logs.`
        );
      }

      const data = await response.json();
      setAIResponse(data.completion);
      console.log(data.completion);
      return data.completion;
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  const data = [
    { month: "05/23", balance: 18427 },
    { month: "06/23", balance: 25345 },
    { month: "07/23", balance: 32647 },
    { month: "08/23", balance: 47954 },
    { month: "09/23", balance: 64234 },
    { month: "10/23", balance: 83758 },
  ];

  const pageVariants = {
    initial: { x: "100%" },
    in: { x: 0 },
    out: { x: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const variants = {
    hidden: { scaleY: 0, originY: 1 }, // start from the base of the div
    visible: { scaleY: 1, originY: 1 }, // grow up to the top of the div
  };

  const accountvariant = {
    hidden: { x: "100%" }, // start from the right side of the container
    visible: { x: 0 }, // animate back to the original position
    exit: { x: "100%" }, // exit to the right side of the container
  };

  const ldclient = useLDClient();

  function handleLogout() {
    logoutUser();
    const context: any = ldclient?.getContext();
    context.user.tier = null;
    ldclient?.identify(context);
    setCookie("ldcontext", context);
  }

  const bankingServicesArr = [
    { imgSrc: "Checking.png", title: "Checking" },
    { imgSrc: "Business.png", title: "Business" },
    { imgSrc: "Credit.png", title: "Credit Card" },
    { imgSrc: "Savings.png", title: "Savings" },
    { imgSrc: "Mortgage.png", title: "Mortgages" },
  ];

  return (
    <>
      {!isLoggedIn ? (
        <LoginHomePage variant="bank" name="ToggleBank" /> ) : (
       <div>
          <NavBar variant={"bank"} handleLogout={handleLogout} />

          <div className=" w-full px-8 ">
            <section
              className={`flex flex-col xl:flex-row py-8 ${federatedAccounts ? "gap-y-8 sm:gap-x-8" : ""
                }`}
            >
              <section className="flex w-full h-full sm:h-[425px] ">
                <div className="p-6 shadow-xl bg-gradient-blue w-full">
                  <div className="justify-center xl:justify-start">
                    <div>
                      <p className="text-white font-sohne mb-6 text-[24px]">
                        Account Summary
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4">
                      <div className="p-4 h-[300px] w-full sm:w-1/3  bg-white ">
                        <CheckingAccount wealthManagement={wealthManagement} />
                      </div>
                      <div className="p-4 h-[300px] w-full sm:w-1/3 bg-white">
                        <CreditAccount />
                      </div>
                      <div className="p-4 h-[300px]w-full sm:w-1/3 bg-white">
                        <MorgtgageAccount />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-grow font-sohne h-full">
                {federatedAccounts && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={accountvariant}
                    className="h-full w-full sm:w-auto"
                  >
                    <div className="p-6 gap-4 w-full bg-gradient-mobile h-full sm:h-[425px]">
                      <div>
                        <p className="text-white font-sohne mb-6 text-[24px]">
                          Federated Account Access
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 justify-start">
                        {!federatedAccountOne ? (
                          <div
                            onClick={() => setFederatedAccountOne(true)}
                            className="flex p-4 h-[300px] w-full sm:w-[250px] bg-white items-center "
                          >
                            <PlusSquare
                              size={96}
                              className="text-gray-400 mx-auto"
                            />
                          </div>
                        ) : (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={variants}
                            transition={{ duration: 0.5 }}
                            className="p-4 h-[300px] w-full sm:w-[250px] bg-white "
                          >
                            <FederatedCheckingAccount />
                          </motion.div>
                        )}

                        {!federatedAccountTwo ? (
                          <div
                            onClick={() => setFederatedAccountTwo(true)}
                            className="flex p-4 h-[300px] w-full sm:w-[250px] bg-white items-center "
                          >
                            <PlusSquare
                              size={96}
                              className="text-gray-400 mx-auto"
                            />
                          </div>
                        ) : (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={variants}
                            transition={{ duration: 0.5 }}
                            className="p-4 h-[300px] w-full sm:w-[250px] bg-white"
                          >
                            <FederatedCreditAccount />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </section>
            </section>

            {wealthManagement ? (
              <motion.section
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="p-6 bg-gradient-blue h-full lg:h-[425px] shadow-2xl mb-6">
                <div>
                  <h3 className=" font-sohne py-6 text-[24px] text-white">
                    Wealth Management
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-y-4 sm:gap-x-4 w-full h-full sm:h-[300px]">
                  <div className="relative p-4 sm:col-span-1 lg:col-span-2 w-full h-full lg:h-[300px] bg-white ">
                    <div className="">
                      <div className="flex justify-between pb-2">
                        <div>
                          <p className="aiinsightstext">
                            Wealth Insights AI{" "}
                            <span className="accountsecondary">
                              Powered By Amazon Bedrock
                            </span>
                          </p>
                        </div>

                        <div>
                          <img src="aws.png" />
                        </div>
                      </div>
                      <div className="absolute flex flex-row justify-between bottom-5 right-5">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-blue-500 rounded-none font-sohne">
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
                          className="flex text-xl bg-transparent font-sohnelight hover:bg-transparent hover:text-blue-700 hover:scale-110 text-blue-700 items-center"
                        >
                          Generate <ArrowRight className="text-blue-700 ml-2" />
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-auto h-[150px] flex justify-center items-center">
                      {loading ? (
                        <BounceLoader color="#1D4ED8" size={100} />
                      ) : (
                        <p className="my-4 font-sohnelight pt-4">
                          {aiResponse}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-white sm:col-span-1 h-full lg:h-[300px]">
                    <div className="space-y-2">
                      <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
                        <AiOutlineAreaChart className="text-blue-700 h-8 w-8" />
                      </div>
                      <div className="">
                        <p className="accounttext">
                          Brokerage Account (***6552)
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="pt-16">
                        <p className="cardaccounttext">
                          Total Investment Balance:{" "}
                        </p>
                        <p className="moneytext text-base sm:text-3xl">
                          $184,278
                        </p>
                        <p className="accountsecondary">
                          Over Lifetime of Account
                        </p>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <div
                    className={`flex flex-col p-4 w-full h-full xl:h-[300px] bg-white justify-center sm:col-span-1 lg:col-span-2`}
                  >
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
              </motion.section>
            ) : null}

            <div className="flex flex-col lg:flex-row w-full h-full gap-y-8 lg:gap-x-8 justify-between">
              <div className="w-full lg:w-1/2">
                <img src="CC.png" className="" />
              </div>
              <div className="w-full lg:w-1/2 flex justify-end">
                <img src="Loan.png" className="" />
              </div>
            </div>
          </div>
          </div>
      )}
      </>
  );
}
