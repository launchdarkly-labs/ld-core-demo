import { useContext, useState } from "react";
import { CheckingAccount } from "@/components/ui/bankcomponents/checkingview";
import { CreditAccount } from "@/components/ui/bankcomponents/creditview";
import { MorgtgageAccount } from "@/components/ui/bankcomponents/mortgageview";
import { useFlags } from "launchdarkly-react-client-sdk";
import { oldCheckingData } from "@/lib/oldCheckingData";
import LoginContext from "@/utils/contexts/login";
import NavBar from "@/components/ui/navbar";
import LoginHomePage from "@/components/LoginHomePage";
import WealthManagementSheet from "@/components/ui/bankcomponents/wealthManagement";
import { AccountTrends } from "@/components/ui/bankcomponents/accounttrends";
import FederatedAccountModule from "@/components/ui/bankcomponents/federatedAccountModule";

export default function Bank() {
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
    <>
      {!isLoggedIn ? (
        <LoginHomePage variant="bank" />
      ) : (
        <div className="mb-8">
          <NavBar variant={"bank"} />

          <main className="w-full px-4 xl:px-0 mx-auto max-w-7xl ">
            <section
              className={`flex flex-col xl:flex-row py-8 ${
                federatedAccounts ? "gap-y-8 sm:gap-x-8" : ""
              }`}
            >
              <section
                className={`w-full h-full ${
                  federatedAccounts ? "xl:w-[60%]" : "xl:w-full"
                } font-sohne shadow-xl rounded-xl border border-zinc-200`}
              >
                <div className="p-6 bg-bglightblue w-full rounded-xl">
                  <div className="justify-center xl:justify-start">
                    <p className="text-black font-sohne mb-6 text-[24px]">
                      Account Summary
                    </p>

                    <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4">
                      <div className="p-4 h-[300px] w-full sm:w-1/3  bg-white ">
                        <CheckingAccount wealthManagement={wealthManagement} />
                      </div>
                      <div className="p-4 h-[300px] w-full sm:w-1/3 bg-white">
                        <CreditAccount />
                      </div>
                      <div className="p-4 h-[300px] w-full sm:w-1/3 bg-white">
                        <MorgtgageAccount />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {federatedAccounts ? 
                <FederatedAccountModule /> : null}
            </section>

            <section className="flex flex-col xl:flex-row w-full gap-y-8 sm:gap-x-8 mb-10 h-full">
              <div
                className={`w-full  ${
                  wealthManagement ? "xl:w-[60%]" : "sm:w-full"
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
                <img src="CC.png" className="shadow-xl" />
              </div>
              <div className="w-full lg:w-1/2 flex justify-end">
                <img src="Loan.png" className="shadow-xl" />
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
