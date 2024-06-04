import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { wait } from "@/utils/utils";
import { generateText } from "ai";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { BounceLoader } from "react-spinners";
import { useChat } from "ai/react";





const openaiR = createOpenAI({
  // custom settings
  apiKey: process.env.OPENAI_API_KEY,
});

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(history: Message[]) {
  const { text } = await generateText({
    model: openaiR("gpt-3.5-turbo"),
    system: "You are a friendly assistant!",
    messages: history,
  });

  return {
    messages: [
      ...history,
      {
        role: "assistant" as const,
        content: text,
      },
    ],
  };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [aiResponse, setAIResponse] = useState("");
  const [loadingBedrock, setLoadingBedrock] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({ api: "/api/chat" });

  async function fetchBedrockAIResponse(prompt: string) {
    try {
      //const prompt: string = `As an investment advisor, advise whether to buy, hold, or sell ${stockName}. Limit your responses to an estimated 150 characters. Answer in a professional tone.`;

      setLoadingBedrock(true);
      const response = await fetch("/api/bedrock", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
      }

      const data = await response.json();
      setAIResponse(data.completion);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      wait(1);
      setLoadingBedrock(false);
    }
  }

  return (
    // <>
    //   <div className="fixed bottom-4 right-4 z-50">
    //     <Button
    //       variant="ghost"
    //       size="icon"
    //       className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
    //       onClick={() => setIsOpen((prevState) => !prevState)}
    //     >
    //       <MessageCircleIcon className="h-6 w-6" />
    //       <span className="sr-only">Open Chatbot</span>
    //     </Button>
    //   </div>

    //   {isOpen && (
    //     <div className="fixed top-[calc(50%-150px)] left-[calc(90%-100px)] transform -translate-x-1/2 z-50">
    //       <Card className="max-w-md w-[500px]">
    //         <CardHeader className="flex flex-row items-center">
    //           <div className="flex items-center space-x-4">
    //             <Avatar>
    //               <img src="ToggleAvatar.png" alt="Chatbot Avatar" />
    //               <AvatarFallback>CB</AvatarFallback>
    //             </Avatar>
    //             <div>
    //               <p className="text-sm font-medium leading-none">Chatbot Assistant</p>
    //               <p className="text-sm text-gray-500 dark:text-gray-400">Here to help!</p>
    //             </div>
    //           </div>
    //           <Button
    //             variant="ghost"
    //             size="icon"
    //             className="ml-auto rounded-full"
    //             onClick={() => setIsOpen(false)}
    //           >
    //             <XIcon className="h-4 w-4" />
    //             <span className="sr-only">Close Chatbot</span>
    //           </Button>
    //         </CardHeader>
    //         <CardContent className="h-[400px] overflow-y-auto">
    //           <div className="space-y-4">
    //             {conversation.map((message, index) => {
    //               if (message.role === "assistant") {
    //                 return (
    //                   <div
    //                     key={index}
    //                     className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800"
    //                   >
    //                     {loadingBedrock ? (
    //                       <BounceLoader color="#FF386B" />
    //                     ) : (
    //                       `${message.role}: ${message.content}`
    //                     )}
    //                   </div>
    //                 );
    //               }

    //               return (
    //                 <div
    //                   key={index}
    //                   className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900"
    //                 >
    //                   {message.role}: {message.content}
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         </CardContent>
    //         <CardFooter>
    //           <Input
    //             id="message"
    //             placeholder="Type your message..."
    //             className="flex-1"
    //             autoComplete="off"
    //             value={chatInput}
    //             onChange={(event) => {
    //               setChatInput(event.target.value);
    //             }}
    //           />
    //           <Button
    //             type="submit"
    //             size="icon"
    //             onClick={async () => {
    //               const { messages } = await continueConversation([
    //                 ...conversation,
    //                 { role: "user", content: chatInput },
    //               ]);
    //               fetchBedrockAIResponse(chatInput)
    //               setConversation(messages);
    //             }}
    //           >
    //             <SendIcon className="h-4 w-4" />
    //             <span className="sr-only">Send</span>
    //           </Button>
    //         </CardFooter>
    //       </Card>
    //     </div>
    //   )}
    // </>

    <div className=" h-[20rem] mx-auto w-full max-w-md py-24 flex flex-col stretch z-[100] bg-red-200">
      {messages.map((m) => {
        console.log(messages);
        return (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <label>
          Say something...
          <input
            className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
            value={input}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
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
