

import { useState } from 'react';
// import { Message, continueConversation } from '@components/chatbot/actions';

import { generateText } from 'ai';
import { openai,createOpenAI } from '@ai-sdk/openai';


const openaiR = createOpenAI({
  // custom settings
  apiKey:process.env.OPENAI_API_KEY
});

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
console.log(process.env.OPENAI_API_KEY)
export async function continueConversation(history: Message[]) {

  const { text } = await generateText({
    model: openaiR('gpt-3.5-turbo',),
    system: 'You are a friendly assistant!',
    messages: history,
    
  });

  return {
    messages: [
      ...history,
      {
        role: 'assistant' as const,
        content: text,
      },
    ],
  };
}

export default function Homer() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  return (
    <div>
      <div>
        {conversation.map((message, index) => (
          <div key={index}>
            {message.role}: {message.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
          className='h-10'
        />
        <button
          onClick={async () => {
            const { messages } = await continueConversation([
              ...conversation,
              { role: 'user', content: input },
            ]);

            setConversation(messages);
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}