import { useEffect, useState, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import LoginContext from "@/utils/contexts/login";
import { v4 as uuidv4 } from "uuid";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { PulseLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
import { BatteryCharging } from "lucide-react";
import {
  PERSONA_ROLE_DEVELOPER,
  COHERE,
  ANTHROPIC,
  META,
  DEFAULT_AI_MODEL,
} from "@/utils/constants";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";

type ApiResponse = {
  response: string;
  modelName: string;
  enabled: boolean;
};

interface Message {
  role: string;
  content: string;
  id: string;
}

//https://sdk.vercel.ai/providers/legacy-providers/aws-bedrock
export default function Chatbot({ vertical }: { vertical: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const startArray: Message[] = [];
  const [messages, setMessages] = useState<Message[]>(startArray);
  const [isLoading, setIsLoading] = useState(false);
  const client = useLDClient();
  const { toast } = useToast();
  let aiConfigKey = "";
  let aiNewModelChatbotFlag: any = "";
  const cardRef = useRef<HTMLDivElement>(null);


  async function sendChatbotFeedback(feedback: string) {
    const response = await fetch("/api/chatbotfeedback", {
      method: "POST",
      body: JSON.stringify({
        feedback,
        aiConfigKey,
      }),
    });
    const data = await response.json();
  }


  if (vertical === "airways") {
    aiConfigKey = "ai-config--ai-new-model-chatbot";
    aiNewModelChatbotFlag =
      useFlags()["ai-config--ai-new-model-chatbot"] == undefined
        ? DEFAULT_AI_MODEL
        : useFlags()["ai-config--ai-new-model-chatbot"];
  }
  if (vertical === "banking") {
    aiConfigKey = "ai-config--togglebot";
    aiNewModelChatbotFlag =
      useFlags()["ai-config--togglebot"] == undefined
        ? DEFAULT_AI_MODEL
        : useFlags()["ai-config--togglebot"];
  }
  if (vertical === "government") {
    aiConfigKey = "ai-config--publicbot";
    aiNewModelChatbotFlag =
      useFlags()["ai-config--publicbot"] == undefined
        ? DEFAULT_AI_MODEL
        : useFlags()["ai-config--publicbot"];
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const { userObject } = useContext(LoginContext);
  const { logLDMetricSent } = useContext(LiveLogsContext);
  let apiResponse: ApiResponse = {
    response: "",
    modelName: "",
    enabled: false,
  };

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
  
    // Create a message placeholder that will be updated incrementally
    const assistantMessageId = uuidv4().slice(0, 4);
    const assistantMessage = {
      role: "assistant",
      content: "",
      id: assistantMessageId,
    };
  
    // Add user message and assistant placeholder to the UI
    setMessages([...messages, userMessage, assistantMessage]);
  
    try {
      // Make streaming fetch request
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          aiConfigKey,
          userInput,
        }),
      });
  
      // Initialize a new ReadableStream reader
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body reader is null");
      }
  
      // Process the stream
      let accumulatedResponse = "";
      let streamedContent = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        // Convert the chunk to text
        const text = new TextDecoder().decode(value);
        
        // Split the text by event stream format (data: {...}\n\n)
        const events = text.split('\n\n');
        
        for (let event of events) {
          // Skip empty events
          if (!event.trim() || !event.startsWith('data:')) continue;
          
          // Extract the JSON part
          const jsonStr = event.replace(/^data:\s/, '');
          
          try {
            const data = JSON.parse(jsonStr);
            
            // Handle intermediate chunks
            if (!data.done && data.chunk) {
              streamedContent += data.chunk;
              accumulatedResponse += data.chunk;
              
              // Update the assistant message in real-time
              setMessages(prevMessages => {
                return prevMessages.map(msg => {
                  if (msg.id === assistantMessageId) {
                    return { ...msg, content: streamedContent };
                  }
                  return msg;
                });
              });
            }
            // Handle final response
            else if (data.done) {
              apiResponse = {
                response: data.response,
                modelName: data.modelName,
                enabled: data.enabled
              };
            }
          } catch (err) {
            console.error('Error parsing SSE data:', err, jsonStr);
          }
        }
      }
      
    } catch (error) {
      console.error("Error in chat request:", error);
      // Update the assistant message with an error
      setMessages(prevMessages => {
        return prevMessages.map(msg => {
          if (msg.id === assistantMessageId) {
            return { ...msg, content: "I'm sorry, there was an error processing your request." };
          }
          return msg;
        });
      });
    } finally {
      setIsLoading(false);
    }
  }

  const surveyResponseNotification = (surveyResponse: string) => {
    client?.track(surveyResponse, client.getContext());

    sendChatbotFeedback(surveyResponse);
    logLDMetricSent(surveyResponse);
    client?.flush();
    toast({
      title: `Thank you for your response!`,
      wrapperStyle: "bg-green-600 text-white font-sohne text-base border-none",
    });
  };

  const chatContentRef = useRef(null);

  const aiModelName = () => {
    // Extract model name from the full model ID
    if (aiNewModelChatbotFlag?.model?.name) {
      const modelId = aiNewModelChatbotFlag.model.name;
      
      // Map of model IDs to friendly names
      // Model name mapping, recognizes both with and without 'us.' prefix
      const modelNameMap = {
        // Amazon Bedrock Models
        'amazon.nova-pro-v1:0': 'Amazon Nova Pro',
        'us.amazon.nova-pro-v1:0': 'Amazon Nova Pro',
        'amazon.titan-text-express-v1': 'Titan Text Express',
        'us.amazon.titan-text-express-v1': 'Titan Text Express',
        'amazon.titan-text-lite-v1': 'Titan Text Lite',
        'us.amazon.titan-text-lite-v1': 'Titan Text Lite',
        'amazon.titan-text-g1-lite-v1': 'Titan Text G1 Lite',
        'us.amazon.titan-text-g1-lite-v1': 'Titan Text G1 Lite',
        'amazon.titan-text-g1-express-v1': 'Titan Text G1 Express',
        'us.amazon.titan-text-g1-express-v1': 'Titan Text G1 Express',
        'amazon.titan-embed-text-v1': 'Titan Embed Text',
        'us.amazon.titan-embed-text-v1': 'Titan Embed Text',
        'amazon.titan-image-generator-v1': 'Titan Image Generator',
        'us.amazon.titan-image-generator-v1': 'Titan Image Generator',
        'amazon.titan-text-davinci:001': 'Titan Text Davinci',
        'us.amazon.titan-text-davinci:001': 'Titan Text Davinci',
        'amazon.titan-code-davinci:001': 'Titan Code Davinci',
        'us.amazon.titan-code-davinci:001': 'Titan Code Davinci',

        // Anthropic Claude Models
        'anthropic.claude-instant-v1': 'Claude Instant',
        'us.anthropic.claude-instant-v1': 'Claude Instant',
        'anthropic.claude-v2': 'Claude 2',
        'us.anthropic.claude-v2': 'Claude 2',
        'anthropic.claude-v2:1': 'Claude 2.1',
        'us.anthropic.claude-v2:1': 'Claude 2.1',
        'anthropic.claude-3-sonnet-20240229-v1:0': 'Claude 3 Sonnet',
        'us.anthropic.claude-3-sonnet-20240229-v1:0': 'Claude 3 Sonnet',
        'anthropic.claude-3-haiku-20240307-v1:0': 'Claude 3 Haiku',
        'us.anthropic.claude-3-haiku-20240307-v1:0': 'Claude 3 Haiku',
        'anthropic.claude-3-opus-20240229-v1:0': 'Claude 3 Opus',
        'us.anthropic.claude-3-opus-20240229-v1:0': 'Claude 3 Opus',
        'anthropic.claude-3-7-sonnet-20250219-v1:0': 'Claude 3.7 Sonnet',
        'us.anthropic.claude-3-7-sonnet-20250219-v1:0': 'Claude 3.7 Sonnet',

        // Meta Llama Models
        'meta.llama2-7b-chat-v1': 'Llama 2 7B',
        'us.meta.llama2-7b-chat-v1': 'Llama 2 7B',
        'meta.llama2-13b-chat-v1': 'Llama 2 13B',
        'us.meta.llama2-13b-chat-v1': 'Llama 2 13B',
        'meta.llama2-70b-chat-v1': 'Llama 2 70B',
        'us.meta.llama2-70b-chat-v1': 'Llama 2 70B',
        'meta.llama3-8b-instruct-v1:0': 'Llama 3 8B Instruct',
        'us.meta.llama3-8b-instruct-v1:0': 'Llama 3 8B Instruct',
        'meta.llama3-70b-instruct-v1:0': 'Llama 3 70B Instruct',
        'us.meta.llama3-70b-instruct-v1:0': 'Llama 3 70B Instruct',

        // Cohere Models
        'cohere.command-text-v14': 'Cohere Command',
        'us.cohere.command-text-v14': 'Cohere Command',
        'cohere.command-r-v1:0': 'Cohere Command R',
        'us.cohere.command-r-v1:0': 'Cohere Command R',
        'cohere.command-r-plus-v1:0': 'Cohere Command R+',
        'us.cohere.command-r-plus-v1:0': 'Cohere Command R+',
        'cohere.embed-english-v3': 'Cohere Embed English v3',
        'us.cohere.embed-english-v3': 'Cohere Embed English v3',
        'cohere.embed-multilingual-v3': 'Cohere Embed Multilingual v3',
        'us.cohere.embed-multilingual-v3': 'Cohere Embed Multilingual v3',

        // AI21 Labs Jurassic Models
        'ai21.jurassic-2': 'Jurassic 2',
        'us.ai21.jurassic-2': 'Jurassic 2',
        'ai21.j2-ultra-v1': 'Jurassic-2 Ultra',
        'us.ai21.j2-ultra-v1': 'Jurassic-2 Ultra',
        'ai21.j2-mid-v1': 'Jurassic-2 Mid',
        'us.ai21.j2-mid-v1': 'Jurassic-2 Mid',

        // Stability AI
        'stability.stable-diffusion-xl-v1': 'Stable Diffusion XL',
        'us.stability.stable-diffusion-xl-v1': 'Stable Diffusion XL',
        'stability.stable-diffusion-xl-v0': 'Stable Diffusion XL v0',
        'us.stability.stable-diffusion-xl-v0': 'Stable Diffusion XL v0',

        // Mistral AI
        'mistral.mistral-7b-instruct-v0:2': 'Mistral 7B Instruct',
        'us.mistral.mistral-7b-instruct-v0:2': 'Mistral 7B Instruct',
        'mistral.mistral-large-2402-v1:0': 'Mistral Large',
        'us.mistral.mistral-large-2402-v1:0': 'Mistral Large',
        'mistral.mixtral-8x7b-instruct-v0:1': 'Mixtral 8x7B Instruct',
        'us.mistral.mixtral-8x7b-instruct-v0:1': 'Mixtral 8x7B Instruct',

        // DeepSeek
        'deepseek.deepseek-coder-v1.5': 'DeepSeek Coder v1.5',
        'us.deepseek.deepseek-coder-v1.5': 'DeepSeek Coder v1.5',
        'deepseek.deepseek-llm-v1.3b-chat': 'DeepSeek LLM 1.3B Chat',
        'us.deepseek.deepseek-llm-v1.3b-chat': 'DeepSeek LLM 1.3B Chat',
        'deepseek.deepseek-llm-v1.3b-base': 'DeepSeek LLM 1.3B Base',
        'us.deepseek.deepseek-llm-v1.3b-base': 'DeepSeek LLM 1.3B Base',
        'deepseek.deepseek-llm-v1.7b-chat': 'DeepSeek LLM 1.7B Chat',
        'us.deepseek.deepseek-llm-v1.7b-chat': 'DeepSeek LLM 1.7B Chat',
        'deepseek.deepseek-llm-v1.7b-base': 'DeepSeek LLM 1.7B Base',
        'us.deepseek.deepseek-llm-v1.7b-base': 'DeepSeek LLM 1.7B Base',
        'deepseek.deepseek-llm-v1.67b-chat': 'DeepSeek LLM 67B Chat',
        'us.deepseek.deepseek-llm-v1.67b-chat': 'DeepSeek LLM 67B Chat',
        'deepseek.deepseek-llm-v1.67b-base': 'DeepSeek LLM 67B Base',
        'us.deepseek.deepseek-llm-v1.67b-base': 'DeepSeek LLM 67B Base',
      };
      
      // Return the friendly name if available, otherwise use the model ID
      return modelNameMap[modelId] || modelId.split(':')[0].split('.').pop() || modelId;
    }
    
    return 'AI Assistant';
    
  };

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-airlinedarkblue text-gray-50 hover:bg-airlinedarkblue/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 shadow-lg !h-12 !w-12 animate-pulse hover:animate-none"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          {isOpen && <XIcon className="h-8 w-8" />}
          {!isOpen && aiNewModelChatbotFlag?._ldMeta?.enabled !== false && (
            <MessageCircleIcon className="h-8 w-8" />
          )}
          {!isOpen && aiNewModelChatbotFlag?._ldMeta?.enabled === false && (
            <BatteryCharging className="h-8 w-8" />
          )}
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </div>

      {isOpen && (
         <div
          ref={cardRef}
          className="fixed bottom-16 right-0 z-50 flex items-end justify-end p-4 sm:p-6 max-w-full"
        >
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <img
                    src={
                      vertical === "airways"
                        ? "/airline/launch-airways.svg"
                        : vertical === "banking"
                        ? "/banking/bankLogo.svg"
                        : "/government/Bureau_of_Risk_Reduction_Logo_Black_Vertical.svg"
                    }
                    alt="Chatbot Avatar"
                  />{" "}
                  <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    Chatbot Assistant
                  </p>
                  <p className={"text-sm text-gray-500 dark:text-gray-400"}>
                    Powered by{" "}
                    <span
                      className={`font-bold text-orange-600
                      `}
                    >
                      {aiModelName()}
                    </span>{" "}
                    with{" "}
                    <span className="text-amazonColor font-bold">
                      {" "}
                      Amazon Bedrock{" "}
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
                    surveyResponseNotification("ai-chatbot-positive-feedback");
                  }}
                >
                  <SmileIcon className="h-6 w-6" />
                  <span className="sr-only">Good</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="How was our service today?"
                  className="rounded-full bg-[#ff7675] text-gray-50 hover:bg-[#d63031] dark:bg-[#ff7675] dark:text-gray-50 dark:hover:bg-[#d63031]"
                  onClick={() => {
                    surveyResponseNotification("ai-chatbot-negative-feedback");
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
            <CardContent
              className="h-[400px] overflow-y-auto"
              ref={chatContentRef}
            >
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
                {aiNewModelChatbotFlag?._ldMeta?.enabled === false ? (
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

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
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

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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

function SmileIcon(props: React.SVGProps<SVGSVGElement>) {
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

function FrownIcon(props: React.SVGProps<SVGSVGElement>) {
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