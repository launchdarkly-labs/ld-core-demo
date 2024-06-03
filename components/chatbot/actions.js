// // 'use server';

// import { generateText } from 'ai';
// import { openai } from '@ai-sdk/openai';

// export interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// export async function continueConversation(history: Message[]) {
//   'use server';

//   const { text } = await generateText({
//     model: openai('gpt-3.5-turbo'),
//     system: 'You are a friendly assistant!',
//     messages: history,
//   });

//   return {
//     messages: [
//       ...history,
//       {
//         role: 'assistant' as const,
//         content: text,
//       },
//     ],
//   };
// }