import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CSNav } from "@/components/ui/csnav";
import { LoginComponent } from "@/components/ui/bankcomponents/logincomponent";
import { AnimatePresence, motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import {
  AreaChartIcon,
  ArrowRight,
  Banknote,
  CandlestickChart,
  CreditCard,
  Globe,
  Home,
  PiggyBank,
  Sparkle,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useContext, useState } from "react";
import { CheckingAccount } from "@/components/ui/bankcomponents/checkingview";
import { CreditAccount } from "@/components/ui/bankcomponents/creditview";
import { MorgtgageAccount } from "@/components/ui/bankcomponents/mortgageview";
import ScrollingTestimonials from "@/components/ui/testimonials";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { checkData } from "@/lib/checkingdata";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoginContext from "@/utils/contexts/login";
import { FederatedCheckingAccount } from "@/components/ui/bankcomponents/federatedChecking";
import { FederatedCreditAccount } from "@/components/ui/bankcomponents/federatedCredit";
import { FederatedMortgage } from "@/components/ui/bankcomponents/federatedMortgage";
import NavBar from "@/components/ui/navbar";

export default function Bank() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAIResponse] = useState<string>("");
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } =
    useContext(LoginContext);

  function goAirways() {
    router.push("/airways");
  }

  const { wealthManagement, aiFinancial, federatedAccounts } = useFlags();

  const money = JSON.stringify(checkData);

  const prompt: string = `Playing the role of a financial analyst, using the data contained within this information set: ${money}, write me 50 word of an analysis of the data and highlight the item I spend most on. Skip any unnecessary explanations. Summarize the mostly costly area im spending at. Your response should be tuned to talking directly to the requestor.`;

  async function submitQuery(query: any) {
    try {
      console.log(prompt);
      setLoading(true);
      const response = await fetch("/api/bedrock", {
        method: "POST",
        body: JSON.stringify({ prompt: query }),
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

  const ldclient = useLDClient();

  function handleLogout() {
    logoutUser();
    const context: any = ldclient?.getContext();
    context.user.tier = null;
    ldclient?.identify(context);
    setCookie("ldcontext", context);
  }

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.main
          className={`relative w-full font-audimat h-full`}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {/* <div
            onClick={goAirways}
            className="border-2 border-white/20 hover:border-white/60 p-4 absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <ArrowRight className="text-zinc-500" size={36} />
          </div> */}
          <NavBar variant={'bank'}/>
          <div className="h-1/3 w-full bg-white ">
            <div className="w-full bg-gradient-releases py-8 px-12 xl:px-36 flex justify-between">
              <div className=" grid text-white w-1/3 items-center">
                <p className="text-6xl font-audimat">Global Scale Financial</p>
                <p className="text-2xl font-audimat">
                  Your one stop for connecting a global network of consumers and
                  businesses. Transacting billions of dollars every day.
                </p>
              </div>
              <div className="flex justify-end pr-10">
                <LoginComponent
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loginUser={loginUser}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <p className="text-4xl mx-auto text-center font-semibold font-audimat py-8">
              Globally available for services you need
            </p>
          </div>
          <div className="w-3/4 flex font-audimat text-center justify-center mx-auto space-x-12">
            <div className="grid items-center justify-items-center">
              <Banknote size={96} strokeWidth={1} className="pb-2" />
              <p className="text-2xl text-blue-700">Checking</p>
            </div>
            <div className="grid items-center justify-items-center">
              <PiggyBank size={96} strokeWidth={1} className="pb-2" />
              <p className="text-2xl text-blue-700">Savings</p>
            </div>
            <div className="grid items-center justify-items-center">
              <CreditCard size={96} strokeWidth={1} className="pb-2" />
              <p className="text-2xl text-blue-700">Credit Cards</p>
            </div>
            <div className="grid items-center justify-items-center">
              <Home size={96} strokeWidth={1} className="pb-2" />
              <p className="text-2xl text-blue-700">Mortgage</p>
            </div>
            <div className="grid items-center justify-items-center">
              <CandlestickChart size={96} strokeWidth={1} className="pb-2" />
              <p className="text-2xl text-blue-700">Stock Trading</p>
            </div>
          </div>
          <div className="">
            <ScrollingTestimonials />
          </div>
        </motion.main>
      ) : (
        <motion.main
          className={`relative w-full font-roboto pb-20`}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="flex h-20 justify-between bg-ldgrey">
            <div className="ml-4 flex items-center text-3xl">
              <CSNav />
              <img src="ToggleBank.png" className="pl-4" />

              <div className="pl-24 summary-border">
                <p className="text-white text-[16px] font-sohne">Summary</p>
              </div>
              <div className="pl-16">
                <p className="text-gray-500 text-[16px] font-sohne">Transfers</p>
              </div>
              <div className="pl-16">
                <p className="text-gray-500 text-[16px] font-sohne">Deposits</p>
              </div>
              <div className="pl-16">
                <p className="text-gray-500 text-[16px] font-sohne">External Accounts</p>
              </div>
            </div>
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger>
                  <Avatar className="h-16 w-16 mr-8">
                    <AvatarImage src="woman.png" className="" />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] h-[400px]">
                  <div className="grid space-y-4">
                    <p className="text-center text-xl font-audimat">
                      Welcome to Your Account!
                    </p>
                    <img
                      src="woman.png"
                      className="rounded-full h-32 mx-auto"
                    />
                    <Button onClick={handleLogout}>Logout</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="relative w-full grid h-screen-20 ">
              <div className="flex flex-col xl:flex-row py-8">

                <div className="flex gap-x-4 w-full xl:w-3/4 font-sohne px-8">
                  <div className="px-6 shadow-xl w-full bg-gradient-blue">
                    <div>
                      <p className="text-white font-sohne py-6 text-[24px]">
                        Account Summary
                      </p>
                    </div>
                    <div className="flex flex-row gap-4 justify-center">
                      <div className="p-4 h-[300px] w-[300px]  bg-white ">
                        <CheckingAccount wealthManagement={wealthManagement} />
                      </div>
                      <div className="p-4 h-[300px] w-[300px]  bg-white">
                        <CreditAccount />
                      </div>
                      <div className="p-4 h-[300px] w-[300px] bg-white">
                        <MorgtgageAccount />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-grow font-sohne px-8">
                  {!federatedAccounts ? (
                    <Card className="rounded-none gap-4 h-[400px]">
                      <CardHeader className="text-xl mx-auto">
                        Special Offers
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col justify-center items-center text-center">
                          <img
                            src="credit.jpg"
                            className="rounded-xl mx-auto h-[275px] items-center justify-center"
                          />
                          <p className="mx-auto text-xl">
                            Register for a new line of credit
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (                    
                    <div className="flex gap-x-4 font-sohne">
                     <div className="px-6 gap-4 shadow-xl bg-ldcardgrey"> 
                      <div>
                        <p className="text-black font-sohne py-6 text-[24px]">
                          Federated Account Access
                        </p>
                      </div>
                      <div className="flex flex-row gap-4 px-8">
                        <div className="h-[300px] w-[300px] bg-white ">
                          <FederatedCheckingAccount />
                        </div>
                        <div className="h-[300px] w-[300px] bg-white">
                          <FederatedCreditAccount />
                        </div>
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {wealthManagement ? (
                <div className="mx-6 px-6 gap-4 h-[400px] bg-gray-200">
                  <div>
                    <p className="text-black font-sohne py-6 text-[24px]">
                      Wealth Management
                    </p>
                  </div>
                  <div className="flex w-full space-x-4">
                    <div className="flex p-4 w-5/12 rounded-none bg-white justify-center">
                      <AreaChart
                        width={500}
                        height={250}
                        data={data}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
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
                    </div>
                    <div className="p-4 bg-white w-3/12 rounded-none">
                      <div className="bg-blue-300/30 rounded-full flex items-center justify-center p-1 w-10 h-10 mt-4 ml-4">
                        <AreaChartIcon className="text-blue-700" />
                      </div>

                      <div className="flex flex-grow px-4 pt-3">
                        <p className="accounttext">
                          Brokerage Account{" "}
                          <span className="accountsecondary">(***6552)</span>
                        </p>
                      </div>

                      <div className="grid pl-4 pt-8 space-y-1">
                        <p className="cardaccounttext">
                          Total investment balance
                        </p>
                        <p className="moneytext">$184,278</p>
                        <p className="accountsecondary">
                          Over Lifetime of Account
                        </p>
                      </div>
                    </div>
                    {aiFinancial && (
                      <div className="relative p-4 w-4/12 rounded-none bg-white ">
                        <div>
                          <div className="flex">
                            <div className="pb-2">
                              <p className="aiinsightstext">
                                AI Insights from{" "}
                                <span className="text-awsorange">
                                  AWS Bedrock
                                </span>
                              </p>
                            </div>
                            <div className="absolute bottom-5 right-5">
                              <Button
                                onClick={() => {
                                  submitQuery(prompt);
                                }}
                                className=" rounded-none text-xl bg-blue-700 font-audimat items-center"
                              >
                                Generate
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="overflow-auto max-h-[150px]">
                          <p className="my-4">{aiResponse}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Card className="mx-auto text-center text-4xl items-center h-[325px] gap-x-4 py-2 flex justify-center font-audimat rounded-none">
                  <Card className="w-1/2 h-full mx-4 rounded-none shadow-2xl">
                    <CardHeader>
                      <CardTitle>
                        Earn Shared Rewards on Launch Airways
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src="airways.png"
                        className="max-h-[200px] mx-auto"
                      />
                    </CardContent>
                  </Card>
                  <Card className="w-1/2 h-full mx-4 rounded-none shadow-2xl">
                    <CardHeader>
                      <CardTitle>
                        Exclusive Store Access at Galaxy Marketplace
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src="marketplace.png"
                        className="max-h-[200px] mx-auto"
                      />
                    </CardContent>
                  </Card>
                </Card>
              )}
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
