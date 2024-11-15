import { useEffect, useState, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import LoginContext from "@/utils/contexts/login";
import { v4 as uuidv4 } from "uuid";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { PulseLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
import { BatteryCharging } from "lucide-react";
import { PERSONA_ROLE_DEVELOPER, COHERE, CLAUDE, META } from "@/utils/constants";

//https://sdk.vercel.ai/providers/legacy-providers/aws-bedrock
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const startArray: object[] = [];
  const [messages, setMessages] = useState(startArray);
  const [isLoading, setIsLoading] = useState(false);
  const client = useLDClient();
  const { toast } = useToast();
  const aiNewModelChatbotFlag = useFlags()["ai-new-model-chatbot"];
  const { userObject } = useContext(LoginContext);
  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  async function submitQuery() {
    const userInput = input;
    setInput("");
    setIsLoading(true);
    const userMessage = {
      role: "user",
      content: userInput,
      id: uuidv4().slice(0, 4),
    };

    const loadingMessage = {
      role: "loader",
      content: "loading",
      id: uuidv4().slice(0, 4),
    };

    setMessages([...messages, userMessage, loadingMessage]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(`
      As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. 
      Act as customer representative. 
      Only answer queries related to traveling and airlines.
      Remove quotation in response.  
      Limit response to 100 characters. 
      Here is the user prompt: ${userInput}.`),
    });

    const data = await response.json();

    let aiAnswer: string;

    if (data?.generation) {
      aiAnswer = data?.generation; //llama
    } else if (data?.generations?.length > 0) {
      aiAnswer = data?.generations[0]?.text; //cohere
    } else {
      aiAnswer = data?.completion; //claude
    }

    let assistantMessage = {
      role: "assistant",
      content: aiAnswer,
      id: uuidv4().slice(0, 4),
    };

    if (aiAnswer === undefined && !userObject.personarole?.includes(PERSONA_ROLE_DEVELOPER)) {
      assistantMessage.content = "I'm sorry. Please try again.";
      setMessages([...messages, userMessage, assistantMessage]);
    } else if (aiAnswer === undefined && userObject.personarole?.includes(PERSONA_ROLE_DEVELOPER)) {
      assistantMessage.content = data; //error message
      setMessages([...messages, userMessage, assistantMessage]);
    } else {
      setMessages([...messages, userMessage, assistantMessage]);
    }
    setIsLoading(false);
  }

  const surveyResponseNotification = (surveyResponse: string) => {
    client?.track(surveyResponse, client.getContext());
    client?.flush();
    toast({
      title: `Thank you for your response!`,
      wrapperStyle: "bg-green-600 text-white font-sohne text-base border-none",
    });
  };

  const chatContentRef = useRef(null);

  const aiModelName = () => {
    if (aiNewModelChatbotFlag?.model?.modelId?.includes("cohere")) {
      return "Cohere Coral";
    } else if (aiNewModelChatbotFlag?.model?.modelId?.includes("meta")) {
      return "Meta Llama";
    } else {
      return "Anthropic Claude";
    }
  };

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const aiModelColors = (aiModelFlag?: string): string => {
    if (aiModelFlag?.includes("cohere") || aiNewModelChatbotFlag?.model.modelId.includes(COHERE)) {
      return "#39594D";
    } else if (
      aiModelFlag?.includes("meta") ||
      aiNewModelChatbotFlag?.model.modelId.includes(META)
    ) {
      return "#0668E1";
    } else if (
      aiModelFlag?.includes("claude") ||
      aiNewModelChatbotFlag?.model.modelId.includes(CLAUDE)
    ) {
      return "#da7756";
    } else {
      return "white";
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="bg-airlinedarkblue text-gray-50 hover:bg-airlinedarkblue/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 shadow-lg !h-12 !w-12 animate-pulse hover:animate-none"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          {isOpen && <XIcon className="h-8 w-8" />}
          {!isOpen && aiNewModelChatbotFlag.enabled !== false && (
            <MessageCircleIcon className="h-8 w-8" />
          )}
          {!isOpen && aiNewModelChatbotFlag.enabled === false && (
            <BatteryCharging className="h-8 w-8" />
          )}
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 bottom-[50px]">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <img src="/airline/launch-airways.svg" alt="Chatbot Avatar" />
                  <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">Chatbot Assistant</p>
                  <p className={"text-sm text-gray-500 dark:text-gray-400"}>
                    Powered by{" "}
                    <span
                      style={{ color: aiModelColors(aiNewModelChatbotFlag?.model.modelId) }}
                      className="font-bold"
                    >
                      {aiModelName()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  title="How was our service today?"
                  className="rounded-full bg-[#55efc4] text-gray-900 hover:bg-[#00b894] dark:bg-[#55efc4] dark:text-gray-900 dark:hover:bg-[#00b894]"
                  onClick={() => {
                    surveyResponseNotification("AI chatbot good service");
                  }}
                >
                  <SmileIcon className="h-6 w-6" />
                  <span className="sr-only">Good</span>
                </Button>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  title="How was our service today?"
                  className="rounded-full bg-[#ffeaa7] text-gray-900 hover:bg-[#fdcb6e] dark:bg-[#ffeaa7] dark:text-gray-900 dark:hover:bg-[#fdcb6e]"
                  onClick={(e) => {
                    surveyResponseNotification("AI Chatbot Netural Service");
                    // client?.track("ai-chatbot-neutral-service", client.getContext());
                  }}
                >
                  <MehIcon className="h-6 w-6" />
                  <span className="sr-only">Neutral</span>
                </Button> */}
                <Button
                  variant="ghost"
                  size="icon"
                  title="How was our service today?"
                  className="rounded-full bg-[#ff7675] text-gray-50 hover:bg-[#d63031] dark:bg-[#ff7675] dark:text-gray-50 dark:hover:bg-[#d63031]"
                  onClick={() => {
                    surveyResponseNotification("AI Chatbot Bad Service");
                  }}
                >
                  <FrownIcon className="h-6 w-6" />
                  <span className="sr-only">Bad</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-6 w-6" />
                  <span className="sr-only">Close Chatbot</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] overflow-y-auto" ref={chatContentRef}>
              <div className="space-y-4">
                <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                  Hello! How can I assist you today?
                </div>
                {messages.map((m) => {
                  if (m?.role === "assistant") {
                    return (
                      <div
                        key={m?.id}
                        className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800"
                      >
                        {m?.content}
                      </div>
                    );
                  }

                  if (m?.role === "loader" && isLoading) {
                    return (
                      <div
                        key={m?.id}
                        className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800"
                      >
                        <PulseLoader className="" />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m?.id}
                      className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-gradient-airways text-white dark:bg-gray-50 dark:text-gray-900"
                    >
                      {m?.content}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <form
                className="flex w-full items-center space-x-2"
                onSubmit={(e) => e.preventDefault()}
              >
                {aiNewModelChatbotFlag.enabled === false ? (
                  <p className="text-airlinegray">
                    We are offline for today. Please return next time!
                  </p>
                ) : (
                  <>
                    <Input
                      id="message"
                      placeholder="Type your message..."
                      className="flex-1"
                      autoComplete="off"
                      value={input}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      onClick={() => submitQuery()}
                      className="bg-airlinedarkblue"
                    >
                      <SendIcon className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </>
                )}
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SmileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

function FrownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

// function MehIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="12" cy="12" r="10" />
//       <line x1="8" x2="16" y1="15" y2="15" />
//       <line x1="9" x2="9.01" y1="9" y2="9" />
//       <line x1="15" x2="15.01" y1="9" y2="9" />
//     </svg>
//   );
// }
