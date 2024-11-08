import { useContext, useState } from "react";
import { CheckingAccount } from "@/components/ui/bankcomponents/checkingview";
import { CreditAccount } from "@/components/ui/bankcomponents/creditview";
import { MorgtgageAccount } from "@/components/ui/bankcomponents/mortgageview";
import { useFlags } from "launchdarkly-react-client-sdk";
import { oldCheckingData } from "@/lib/oldCheckingData";
import LoginContext from "@/utils/contexts/login";
import WealthManagementSheet from "@/components/ui/bankcomponents/wealthManagement";
import { AccountTrends } from "@/components/ui/bankcomponents/accounttrends";
import FederatedAccountModule from "@/components/ui/bankcomponents/federatedAccountModule";
import Image from "next/image";
import bankDashboardBackgroundLeft from "@/public/banking/backgrounds/bank-dashboard-background-left.svg";
import bankDashboardBackgroundRight from "@/public/banking/backgrounds/bank-dashboard-background-right.svg";
import { motion } from "framer-motion";

export default function BankUserDashboard() {
    const [loading, setLoading] = useState<boolean>(false);
    const [aiResponse, setAIResponse] = useState<string>("");
    const { isLoggedIn } = useContext(LoginContext);
    const { wealthManagement, federatedAccounts } = useFlags();
    const money = JSON.stringify(oldCheckingData);
    const prompt: string = `Playing the role of a financial analyst, using the data contained within this information set: ${money}, write me 50 word of an analysis of the data and highlight the item I spend most on. Skip any unnecessary explanations. Summarize the mostly costly area im spending at. Your response should be tuned to talking directly to the requestor.`;
    const viewPrompt: string = 'Playing the role of a financial analyst, write me 50 word of an analysis of the data and highlight the item I spend most on. Skip any unnecessary explanations. Summarize the mostly costly area im spending at. Your response should be personalized for the user requesting the information.'

    async function submitQuery(query: any) {
        try {
            setLoading(true);
            const response = await fetch("/api/bedrock", {
                method: "POST",
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
            }

            const data = await response.json();
            setAIResponse(data.completion);

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

    return (
        <div className="mb-8">


            <Image
                src={bankDashboardBackgroundRight}
                className="fixed right-0 top-0 bottom-0 min-h-screen  z-0"
                alt="Bank Home Page Background"
            />
            <Image
                src={bankDashboardBackgroundLeft}
                className="fixed left-0 bottom-0 m-h-screen z-0"
                alt="Bank Home Page Background"
            />

            <main className="w-full px-4 xl:px-0 mx-auto max-w-7xl relative z-10 ">
                <section
                    className={`flex flex-col xl:flex-row py-8 ${federatedAccounts ? "gap-y-8 sm:gap-x-8" : ""
                        }`}
                >
                    <section
                        className={`w-full h-full ${federatedAccounts ? "xl:w-[60%]" : "xl:w-full"
                            } font-sohne  `}
                    >
                        <div className="p-6 w-full rounded-xl">
                            <div className="justify-center xl:justify-start">
                                <p className="text-blue-600 font-sohne mb-6 text-[24px]">
                                    Account Summary
                                </p>

                                <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4">
                                    <motion.div
                                        className="p-4 h-[300px] w-full sm:w-1/3 bg-white shadow-xl rounded-2xl cursor-pointer"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <CheckingAccount wealthManagement={wealthManagement} />
                                    </motion.div>
                                    <motion.div
                                        className="p-4 h-[300px] w-full sm:w-1/3 bg-white shadow-xl rounded-2xl cursor-pointer"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        <CreditAccount />
                                    </motion.div>
                                    <motion.div
                                        className="p-4 h-[300px] w-full sm:w-1/3 bg-white shadow-xl rounded-2xl cursor-pointer"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        <MorgtgageAccount />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {federatedAccounts ?
                        <FederatedAccountModule /> : null}
                </section>

                <p className="text-blue-600 font-sohne mb-6 ml-6 text-[24px]">
                    Wealth Management
                </p>
                <section className="flex flex-col xl:flex-row w-full gap-y-8 sm:gap-x-8 mb-10 h-full">

                    <div
                        className={`w-full  ${wealthManagement ? "xl:w-[60%]" : "sm:w-full"
                            }`}
                    >
                        <AccountTrends data={data} />
                    </div>

                    {wealthManagement ? (
                        <div className="w-full xl:w-[40%]">
                            <WealthManagementSheet
                                data={data}
                                aiPrompt={viewPrompt}
                                submitQuery={submitQuery}
                                prompt={prompt}
                                loading={loading}
                                aiResponse={aiResponse}
                            />
                        </div>
                    ) : null}
                </section>

                <div className="flex flex-col lg:flex-row w-full h-full gap-y-8 sm:gap-x-8 justify-between">
                    <div className="w-full lg:w-1/2">
                        <img src="CC.png" className="shadow-xl rounded-xl" />
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-end ">
                        <img src="Loan.png" className="shadow-xl rounded-xl" />
                    </div>
                </div>
            </main>


        </div>
    );
}
