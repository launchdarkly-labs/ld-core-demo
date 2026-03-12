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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

type ApiResponse = {
  response: string;
  modelName: string;
  enabled: boolean;
};

type StreamTiming = {
  timeToFirstToken?: number;
  totalTime?: number;
};

type StreamTokens = {
  input?: number;
  output?: number;
  total?: number;
};

type StreamMetrics = {
  sourceFidelity?: number;
  relevance?: number;
  accuracy?: number;
  judge?: any;
  sourcePassageCount?: number;
};

interface Message {
  role: string;
  content: string;
  id: string;
  judgeScores?: {
    before?: { accuracy?: number; relevance?: number };
    after?: { accuracy?: number; relevance?: number };
  };
}

type ChatTab = "main" | "self-healing";

type SelfHealingMetrics = {
  modelName?: string;
  modelType?: string;
  timing?: StreamTiming;
  tokens?: StreamTokens;
  judgeScores?: {
    before?: { accuracy?: number; relevance?: number };
    after?: { accuracy?: number; relevance?: number };
  };
  didFallback?: boolean;
};

//https://sdk.vercel.ai/providers/legacy-providers/aws-bedrock
export default function Chatbot({ vertical }: { vertical: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const startArray: Message[] = [];

  const getPrePopulatedMessages = (): Message[] => {
    if (vertical === "banking") {
      return [
        {
          role: "assistant",
          content: "Hello! Welcome to ToggleBank! I'm your AI assistant and I'm here to help you with all your banking needs. How can I assist you today?",
          id: "pre-1"
        },
        {
          role: "user", 
          content: "What services does ToggleBank offer?",
          id: "pre-2"
        },
        {
          role: "assistant",
          content: "ToggleBank offers a comprehensive range of financial services! I can help you with:\n\n• Account Management - Checking balances, viewing transaction history, and managing your accounts\n• Loans & Credit - Personal loans, home mortgages, auto loans, and credit card applications\n• Investment Services - Portfolio management, investment advice, and retirement planning\n• Digital Banking - Mobile app support, online transfers, and bill payments\n• Customer Support - Account inquiries, technical assistance, and general banking questions\n\nIs there a specific service you'd like to know more about?",
          id: "pre-3"
        }
      ];
    }
    return startArray;
  };

  const SELF_HEALING_INITIAL_MESSAGE: Message = {
    role: "assistant",
    content: "Hi! I'm ToggleBot with self-healing capabilities. Ask me anything and I'll automatically switch to a better model if my initial response quality is low.",
    id: "self-heal-welcome",
  };

  const [messages, setMessages] = useState<Message[]>(getPrePopulatedMessages());
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'validating'>('idle');
  const [timing, setTiming] = useState<StreamTiming | null>(null);
  const [tokens, setTokens] = useState<StreamTokens | null>(null);
  const [metrics, setMetrics] = useState<StreamMetrics | null>(null);
  const [modelType, setModelType] = useState<'bedrock' | 'openai' | null>(null);

  const [activeTab, setActiveTab] = useState<ChatTab>("main");
  const [selfHealingMessages, setSelfHealingMessages] = useState<Message[]>([SELF_HEALING_INITIAL_MESSAGE]);
  const [selfHealingMetrics, setSelfHealingMetrics] = useState<SelfHealingMetrics | null>(null);
  const [selfHealingLoading, setSelfHealingLoading] = useState(false);
  const [selfHealingStatus, setSelfHealingStatus] = useState("");
  const [enableFallback, setEnableFallback] = useState(true);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const selfHealingEndRef = useRef<HTMLDivElement | null>(null);
  const selfHealingAiConfigKey = "ai-config--togglebot-self-heal-chatbot";
  const hasSelfHealing = vertical === "banking";

  // Function to determine model type from feature flag
  const getModelTypeFromFlag = (): 'bedrock' | 'openai' => {
    if (aiNewModelChatbotFlag?.model?.name) {
      const modelId = aiNewModelChatbotFlag.model.name;
      // Check if it's a Bedrock model based on model name patterns
      const bedrockPatterns = [
        'anthropic.claude',
        'amazon.titan',
        'amazon.nova',
        'meta.llama',
        'cohere.command',
        'ai21.jurassic',
        'stability.stable-diffusion',
        'mistral.mistral',
        'deepseek.deepseek'
      ];
      return bedrockPatterns.some(pattern => modelId.includes(pattern)) ? 'bedrock' : 'openai';
    }
    return 'bedrock'; // Default to bedrock if no model info
  };
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

  const selfHealingFlag = useFlags()[selfHealingAiConfigKey] as any;
  const isSelfHealingEnabled = hasSelfHealing && selfHealingFlag?._ldMeta?.enabled !== false;

  useEffect(() => {
    if (selfHealingEndRef.current && activeTab === "self-healing") {
      selfHealingEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selfHealingMessages, activeTab]);

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
    setTiming(null);
    setTokens(null);
    setMetrics(null);
    setIsLoading(true);
    setStatus('generating');
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
    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
  
    try {
      // Make streaming fetch request with full chat history
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          aiConfigKey,
          userInput,
          chatHistory: updatedMessages.filter(msg => msg.role !== "assistant" || msg.id !== assistantMessageId), // Exclude the placeholder assistant message
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
            else if (!data.done && data.status) {
              // status: 'validating' or future statuses
              setStatus(data.status);
            }
            // Handle final response
            else if (data.done) {
              apiResponse = {
                response: data.response,
                modelName: data.modelName,
                enabled: data.enabled
              };
              if (data?.timing) setTiming(data.timing);
              if (data?.tokens) setTokens(data.tokens);
              if (data?.metrics) setMetrics(data.metrics);
              if (data?.modelType) setModelType(data.modelType);
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
      if (status !== 'idle') setStatus('idle');
    }
  }

  async function submitSelfHealingQuery(promptOverride?: string) {
    const userInput = promptOverride || input;
    if (!userInput.trim() || selfHealingLoading || !isSelfHealingEnabled) return;

    if (!promptOverride) setInput("");
    setSelfHealingLoading(true);
    setSelfHealingStatus("Initializing...");
    setSelfHealingMetrics(null);

    const userMessage: Message = {
      role: "user",
      content: userInput.trim(),
      id: uuidv4().slice(0, 4),
    };
    setSelfHealingMessages((prev) => [...prev, userMessage]);

    const assistantMessageId = uuidv4().slice(0, 4);

    try {
      const chatHistory = [...selfHealingMessages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
        id: m.id,
      }));

      const response = await fetch("/api/chat/self-healing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: userInput.trim(),
          chatHistory,
          aiConfigKey: selfHealingAiConfigKey,
          enableFallback,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to send message";
        try { const d = await response.json(); errorMessage = d.error || errorMessage; } catch {}
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.status) setSelfHealingStatus(data.status);
              if (data.error) throw new Error(data.error);

              if (data.chunk) {
                assistantContent += data.chunk;
                setSelfHealingMessages((prev) => {
                  const exists = prev.some((m) => m.id === assistantMessageId);
                  if (exists) {
                    return prev.map((m) =>
                      m.id === assistantMessageId ? { ...m, content: assistantContent } : m
                    );
                  }
                  return [...prev, { id: assistantMessageId, role: "assistant", content: assistantContent }];
                });
              }

              if (data.done) {
                if (data.modelName || data.timing || data.tokens || data.judgeScores) {
                  setSelfHealingMetrics({
                    modelName: data.modelName,
                    modelType: data.modelType,
                    timing: data.timing,
                    tokens: data.tokens,
                    judgeScores: data.judgeScores,
                    didFallback: data.didFallback,
                  });
                }

                if (data.didFallback && data.judgeScores) {
                  const judgeMessage: Message = {
                    id: uuidv4().slice(0, 6) + "-judge",
                    role: "judge",
                    content: `**AI Judge Evaluation**\n\n**Initial Model Scores (${data.originalModel || "Unknown"}):**\n- Accuracy: ${data.judgeScores.before?.accuracy?.toFixed(1) || "N/A"}%\n- Relevance: ${data.judgeScores.before?.relevance?.toFixed(1) || "N/A"}%\n\n**Original Response (Reverted):**\n> ${data.originalResponse || "No response captured"}\n\n**Fallback Model Scores (Passed):**\n- Accuracy: ${data.judgeScores.after?.accuracy?.toFixed(1) || "N/A"}%\n- Relevance: ${data.judgeScores.after?.relevance?.toFixed(1) || "N/A"}%\n\nSelf-healed to: **${data.modelName}**`,
                    judgeScores: data.judgeScores,
                  };
                  setSelfHealingMessages((prev) => [...prev, judgeMessage]);

                  setTimeout(() => {
                    setSelfHealingMessages((prev) => [
                      ...prev,
                      {
                        id: uuidv4().slice(0, 6) + "-reset",
                        role: "assistant",
                        content: "The self-healing demo is complete. Would you like to reset the context to try again?",
                      },
                    ]);
                  }, 1000);
                }

                if (data.fallbackSkipped && data.judgeScores) {
                  const judgeMessage: Message = {
                    id: uuidv4().slice(0, 6) + "-judge",
                    role: "judge",
                    content: `**AI Judge Evaluation**\n\n**Model Scores (${data.modelName || "Unknown"}):**\n- Accuracy: ${data.judgeScores.before?.accuracy?.toFixed(1) || "N/A"}%\n- Relevance: ${data.judgeScores.before?.relevance?.toFixed(1) || "N/A"}%\n\n**Scores below threshold (90%)** — Self-healing is disabled.\nEnable fallback in Options to see the self-healing behavior.`,
                    judgeScores: data.judgeScores,
                  };
                  setSelfHealingMessages((prev) => [...prev, judgeMessage]);
                }

                setSelfHealingLoading(false);
                return;
              }
            } catch (parseError) {
              if (parseError instanceof Error && !parseError.message.includes("Unexpected token")) {
                throw parseError;
              }
            }
          }
        }
      }

      if (!assistantContent) {
        setSelfHealingMessages((prev) => [
          ...prev,
          { id: assistantMessageId, role: "assistant", content: "I'm sorry, there was an error processing your request." },
        ]);
      }
      setSelfHealingLoading(false);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const isDisabled = errorObj.message.includes("AI config is disabled");
      setSelfHealingMessages((prev) => [
        ...prev,
        {
          id: uuidv4().slice(0, 4),
          role: "assistant",
          content: isDisabled
            ? "The self-healing chatbot is currently disabled. Please try again later."
            : `${errorObj.message}\n\nWould you like to restart and try again?`,
        },
      ]);
      setSelfHealingLoading(false);
    }
  }

  async function resetSelfHealing() {
    try {
      setSelfHealingLoading(true);
      await fetch("/api/chat/reset", { method: "POST" });
      setSelfHealingMessages([SELF_HEALING_INITIAL_MESSAGE]);
      setSelfHealingMetrics(null);
    } catch (e) {
      console.error("Failed to reset self-healing context", e);
    } finally {
      setSelfHealingLoading(false);
    }
  }

  const SUGGESTED_PROMPTS = ["What is ToggleBank?"];

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

  const chatContentRef = useRef<HTMLDivElement | null>(null);

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

        // OpenAI Models
        'gpt-3.5-turbo': 'GPT-3.5 Turbo',
        'gpt-3.5-turbo-16k': 'GPT-3.5 Turbo 16K',
        'gpt-4': 'GPT-4',
        'gpt-4-turbo': 'GPT-4 Turbo',
        'gpt-4-turbo-preview': 'GPT-4 Turbo Preview',
        'gpt-4o': 'GPT-4o',
        'gpt-4o-mini': 'GPT-4o Mini',
        'gpt-5-nano': 'GPT-5 Nano',
        'gpt-5-mini': 'GPT-5 Mini',
        'gpt-5': 'GPT-5',
      };
      
      const mapped = (modelNameMap as Record<string, string>)[modelId as string];
      // Return the friendly name if available, otherwise use the model ID
      return mapped || modelId.split(':')[0].split('.').pop() || modelId;
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
      <div className="fixed bottom-4 right-4 z-20">
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
          className={`fixed z-50 transition-all duration-500 ease-in-out ${
            isExpanded
              ? "inset-4 flex items-stretch"
              : "bottom-16 right-0 flex items-end justify-end p-4 sm:p-6 max-w-full"
          }`}
        >
          <Card className={`transition-all duration-500 ease-in-out ${
            isExpanded
              ? "w-full h-full max-w-none overflow-auto"
              : "w-full max-w-md mx-auto"
          }`}>
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
                    ToggleBot - AI Assistant
                  </p>
                  <p className={"text-sm text-gray-500 dark:text-gray-400"}>
                    Powered by{" "}
                    <span
                      className={`font-bold ${
                        getModelTypeFromFlag() === 'openai' 
                          ? 'text-black dark:text-white' 
                          : 'text-orange-600'
                      }`}
                    >
                      {aiModelName()}
                    </span>{" "}
                    {getModelTypeFromFlag() === 'openai' ? (
                      <span className="text-black dark:text-white font-bold">
                        OpenAI
                      </span>
                    ) : (
                      <>
                        with{" "}
                        <span className="text-amazonColor font-bold">
                          Amazon Bedrock
                        </span>
                      </>
                    )}
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
                  className="rounded-full"
                  title={isExpanded ? "Collapse" : "Expand"}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                  )}
                  <span className="sr-only">{isExpanded ? "Collapse" : "Expand"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-6 w-6" />
                  <span className="sr-only">Close Chatbot</span>
                </Button>
              </div>
            </CardHeader>

            {hasSelfHealing ? (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ChatTab)} className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="w-full bg-transparent p-0 h-auto">
                    <TabsTrigger
                      value="main"
                      className="flex-1 rounded-none border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=inactive]:border-transparent data-[state=active]:shadow-none text-xs font-medium"
                    >
                      AI Chatbot
                    </TabsTrigger>
                    <TabsTrigger
                      value="self-healing"
                      className="flex-1 rounded-none border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=inactive]:border-transparent data-[state=active]:shadow-none text-xs font-medium"
                    >
                      AI Self-Healing
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="main" className="flex-1 flex flex-col overflow-hidden mt-0">
                  <CardContent className={`overflow-y-auto ${isExpanded ? "h-[calc(100vh-240px)]" : "h-[400px]"}`} ref={chatContentRef}>
                    <div className="space-y-4">
                      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                        <Accordion type="single" collapsible defaultValue="metrics">
                          <AccordionItem value="metrics">
                            <AccordionTrigger className="px-2">AI Metrics</AccordionTrigger>
                            <AccordionContent>
                              <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                                <div className="flex flex-wrap gap-3">
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">Accuracy:</span>
                                    <span>{(metrics?.accuracy ?? 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">Source Fidelity:</span>
                                    <span>{(metrics?.sourceFidelity ?? 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">Relevance:</span>
                                    <span>{(metrics?.relevance ?? 0).toFixed(2)}</span>
                                  </div>
                                  {tokens && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-semibold">Tokens:</span>
                                      <span>{tokens.total ?? 0} (in {(tokens.input ?? 0)}, out {(tokens.output ?? 0)})</span>
                                    </div>
                                  )}
                                  {timing && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-semibold">Timing:</span>
                                      <span>TTFT {(timing.timeToFirstToken ?? 0)}ms, Total {(timing.totalTime ?? 0)}ms</span>
                                    </div>
                                  )}
                                </div>
                                {metrics?.judge && (
                                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <div className="font-semibold mb-1">Accurate claims</div>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {(metrics.judge.accurate_claims ?? []).map((c: string, idx: number) => (
                                          <li key={`acc-${idx}`}>{c}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="font-semibold mb-1">Inaccurate/unsupported claims</div>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {(metrics.judge.inaccurate_claims ?? []).map((c: string, idx: number) => (
                                          <li key={`inacc-${idx}`}>{c}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        {isLoading && (
                          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                            <PulseLoader size={6} color="#6b7280" />
                            <span>Generating and Validating Response…</span>
                          </div>
                        )}
                      </div>
                      {messages.map((m) => {
                        if (m?.role === "assistant") {
                          return (
                            <div key={m?.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                              <div className="whitespace-pre-line">{m?.content}</div>
                            </div>
                          );
                        }
                        if (m?.role === "loader" && isLoading) {
                          return (
                            <div key={m?.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                              <PulseLoader />
                            </div>
                          );
                        }
                        return (
                          <div key={m?.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-gradient-airways text-white dark:bg-gray-50 dark:text-gray-900">
                            <div className="whitespace-pre-line">{m?.content}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <form className="flex w-full items-center space-x-2" onSubmit={(e) => e.preventDefault()}>
                      {aiNewModelChatbotFlag?._ldMeta?.enabled === false ? (
                        <p className="text-airlinegray">We are offline for today. Please return next time!</p>
                      ) : (
                        <>
                          <Input id="message" placeholder="Type your message..." className="flex-1" autoComplete="off" value={input} onChange={handleInputChange} />
                          <Button type="submit" size="icon" onClick={() => submitQuery()} className="bg-airlinedarkblue">
                            <SendIcon className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
                        </>
                      )}
                    </form>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="self-healing" className="flex-1 flex flex-col overflow-hidden mt-0">
                  {isSelfHealingEnabled && (
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {(selfHealingMetrics?.modelName || selfHealingFlag?.model?.name) && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Model: <span className="font-semibold text-gray-700 dark:text-gray-200">{selfHealingMetrics?.modelName || selfHealingFlag?.model?.name}</span>
                            </span>
                          )}
                          {selfHealingMetrics?.didFallback && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                              Self-Healed
                            </span>
                          )}
                        </div>
                        {/* Settings dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded border border-gray-300 dark:border-gray-600 hover:border-purple-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                            Options
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showSettingsDropdown ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                          </button>
                          {showSettingsDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demo Mode</span>
                              </div>
                              <div className="p-2">
                                <button
                                  onClick={() => { setEnableFallback(!enableFallback); setShowSettingsDropdown(false); }}
                                  className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                >
                                  <div className="flex flex-col items-start">
                                    <span className="text-xs text-gray-700 dark:text-gray-200">Enable Fallback</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{enableFallback ? "Shows self-healing" : "Bad response only"}</span>
                                  </div>
                                  <div className={`w-8 h-4 rounded-full transition-colors relative ${enableFallback ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${enableFallback ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {selfHealingMetrics && (
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {selfHealingMetrics.timing?.totalTime !== undefined && (
                            <span>Time: <span className="font-semibold text-gray-700 dark:text-gray-200">{selfHealingMetrics.timing.totalTime}ms</span></span>
                          )}
                          {selfHealingMetrics.tokens?.total !== undefined && (
                            <span>Tokens: <span className="font-semibold text-gray-700 dark:text-gray-200">{selfHealingMetrics.tokens.total}</span></span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <CardContent className={`overflow-y-auto ${isExpanded ? "h-[calc(100vh-300px)]" : "h-[350px]"}`}>
                    {!isSelfHealingEnabled && (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          The self-healing chatbot is currently disabled. Please try again later.
                        </p>
                      </div>
                    )}

                    {isSelfHealingEnabled && (
                      <div className="space-y-4">
                        {selfHealingMessages.map((m) => {
                          if (m.role === "judge") {
                            return (
                              <div key={m.id} className="flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-600">
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
                                    li: ({ children }) => <li>{children}</li>,
                                    blockquote: ({ children }) => (
                                      <blockquote className="border-l-2 border-purple-400 pl-3 italic mb-2 text-gray-600 dark:text-gray-300">
                                        {children}
                                      </blockquote>
                                    ),
                                  }}
                                >
                                  {m.content}
                                </ReactMarkdown>
                              </div>
                            );
                          }
                          if (m.role === "assistant") {
                            const isResetPrompt =
                              m.content.includes("Would you like to reset") ||
                              m.content.includes("Would you like to restart");
                            return (
                              <div key={m.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                                <div className="whitespace-pre-line">{m.content}</div>
                                {isResetPrompt && (
                                  <Button
                                    onClick={resetSelfHealing}
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 text-purple-600 dark:text-purple-400 border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                  >
                                    Reset Self-Healing Demo
                                  </Button>
                                )}
                              </div>
                            );
                          }
                          return (
                            <div key={m.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-gradient-bank text-white">
                              <div className="whitespace-pre-line">{m.content}</div>
                            </div>
                          );
                        })}

                        {selfHealingMessages.length === 1 && (
                          <div className="space-y-2 mt-3">
                            {SUGGESTED_PROMPTS.map((prompt, idx) => (
                              <button
                                key={idx}
                                onClick={() => submitSelfHealingQuery(prompt)}
                                className="block w-full text-left px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-purple-400 transition-colors"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        )}

                        {selfHealingLoading && (
                          <div className="flex items-center gap-2 p-2">
                            <PulseLoader size={6} color="#A34FDE" />
                            {selfHealingStatus && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">{selfHealingStatus}</span>
                            )}
                          </div>
                        )}

                        <div ref={selfHealingEndRef} />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <form className="flex w-full items-center space-x-2" onSubmit={(e) => { e.preventDefault(); submitSelfHealingQuery(); }}>
                      {!isSelfHealingEnabled ? (
                        <p className="text-airlinegray text-sm">Self-healing chatbot is disabled.</p>
                      ) : (
                        <>
                          <Input
                            id="self-healing-message"
                            placeholder="Ask me anything (I'll self-heal if needed)..."
                            className="flex-1"
                            autoComplete="off"
                            value={input}
                            onChange={handleInputChange}
                            disabled={selfHealingLoading}
                          />
                          <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || selfHealingLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <SendIcon className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
                        </>
                      )}
                    </form>
                  </CardFooter>
                </TabsContent>
              </Tabs>
            ) : (
              <>
                <CardContent className={`overflow-y-auto ${isExpanded ? "h-[calc(100vh-200px)]" : "h-[400px]"}`} ref={chatContentRef}>
                  <div className="space-y-4">
                    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                      <Accordion type="single" collapsible defaultValue="metrics">
                        <AccordionItem value="metrics">
                          <AccordionTrigger className="px-2">AI Metrics</AccordionTrigger>
                          <AccordionContent>
                            <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                              <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">Accuracy:</span>
                                  <span>{(metrics?.accuracy ?? 0).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">Source Fidelity:</span>
                                  <span>{(metrics?.sourceFidelity ?? 0).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">Relevance:</span>
                                  <span>{(metrics?.relevance ?? 0).toFixed(2)}</span>
                                </div>
                                {tokens && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">Tokens:</span>
                                    <span>{tokens.total ?? 0} (in {(tokens.input ?? 0)}, out {(tokens.output ?? 0)})</span>
                                  </div>
                                )}
                                {timing && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">Timing:</span>
                                    <span>TTFT {(timing.timeToFirstToken ?? 0)}ms, Total {(timing.totalTime ?? 0)}ms</span>
                                  </div>
                                )}
                              </div>
                              {metrics?.judge && (
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <div className="font-semibold mb-1">Accurate claims</div>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {(metrics.judge.accurate_claims ?? []).map((c: string, idx: number) => (
                                        <li key={`acc-${idx}`}>{c}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <div className="font-semibold mb-1">Inaccurate/unsupported claims</div>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {(metrics.judge.inaccurate_claims ?? []).map((c: string, idx: number) => (
                                        <li key={`inacc-${idx}`}>{c}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      {isLoading && (
                        <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                          <PulseLoader size={6} color="#6b7280" />
                          <span>Generating and Validating Response…</span>
                        </div>
                      )}
                    </div>
                    {messages.map((m) => {
                      if (m?.role === "assistant") {
                        return (
                          <div key={m?.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                            <div className="whitespace-pre-line">{m?.content}</div>
                          </div>
                        );
                      }
                      if (m?.role === "loader" && isLoading) {
                        return (
                          <div key={m?.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                            <PulseLoader />
                          </div>
                        );
                      }
                      return (
                        <div key={m?.id} className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-gradient-airways text-white dark:bg-gray-50 dark:text-gray-900">
                          <div className="whitespace-pre-line">{m?.content}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <form className="flex w-full items-center space-x-2" onSubmit={(e) => e.preventDefault()}>
                    {aiNewModelChatbotFlag?._ldMeta?.enabled === false ? (
                      <p className="text-airlinegray">We are offline for today. Please return next time!</p>
                    ) : (
                      <>
                        <Input id="message" placeholder="Type your message..." className="flex-1" autoComplete="off" value={input} onChange={handleInputChange} />
                        <Button type="submit" size="icon" onClick={() => submitQuery()} className="bg-airlinedarkblue">
                          <SendIcon className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </>
                    )}
                  </form>
                </CardFooter>
              </>
            )}
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