import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { wait } from "@/utils/utils";
import { useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";
// Force the page to be dynamic and allow streaming responses up to 30 seconds
// export const dynamic = "force-dynamic";
// export const maxDuration = 30;

//https://sdk.vercel.ai/providers/legacy-providers/aws-bedrock
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input2, setInput2] = useState("");
  const startArray: object[] = [];
  const [messages2, setMessages2] = useState(startArray);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange2 = (e: any) => {
    setInput2(e.target.value);
  };
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   api: "/api/bedrock",
  //   initialInput: "Where is a good vacation place for under $1000? Limit to 100 characters.",
  // });

  async function submitQuery() {
    const userInput = input2;
    setInput2("");
    const userMessage = {
      role: "user",
      content: userInput,
      id: uuidv4().slice(0, 4),
    };

    setMessages2([...messages2, userMessage]);
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(`${userInput}. Limit response to 100 characters.`),
    });
    const data = await response.json();

    const assistantMessage = {
      role: "assistant",
      content: data?.completion,
      id: uuidv4().slice(0, 4),
    };
    setMessages2([...messages2, userMessage, assistantMessage]);

    return data;
  }

  useEffect(() => {
    console.log(messages2);
  }, [messages2]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <MessageCircleIcon className="h-6 w-6" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed top-[calc(50%-150px)] left-[calc(90%-100px)] transform -translate-x-1/2 z-50">
          <Card className="max-w-md w-[500px]">
            <CardHeader className="flex flex-row items-center">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <img src="ToggleAvatar.png" alt="Chatbot Avatar" />
                  <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">Chatbot Assistant</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Here to help!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close Chatbot</span>
              </Button>
            </CardHeader>
            <CardContent className="h-[400px] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                  Hello! How can I assist you today?
                </div>
                {messages2.map((m) => {
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

                  return (
                    <div
                      key={m?.id}
                      className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900"
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
                <Input
                  id="message"
                  placeholder="Type your message..."
                  className="flex-1"
                  autoComplete="off"
                  value={input2}
                  onChange={handleInputChange2}
                />
                <Button type="submit" size="icon" onClick={() => submitQuery()}>
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
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
