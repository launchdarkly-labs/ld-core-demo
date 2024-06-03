import { nanoid } from "@/components/chatbot/lib/utils";
import { Chat } from "@/components/chatbot/chat";
import { AI } from "@/components/chatbot/lib/chat/actions";
// import { auth } from "@/components/chatbot/auth";
// import { Session } from "@/components/chatbot/lib/types";
// import { getMissingKeys } from '@/app/actions'

// export const metadata = {
//   title: "Next.js AI Chatbot",
// };

async function getMissingKeys() {
  const keysRequired = ["OPENAI_API_KEY"];
  // const keysRequired = process.env.OPENAI_API_KEY
  return keysRequired.map((key) => (process.env[key] ? "" : key)).filter((key) => key !== "");
}

export default async function IndexPage() {
  const id = nanoid();
  const session = {
    id: "string",
    email: "string",
  };
  const missingKeys = await getMissingKeys();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  );
}
