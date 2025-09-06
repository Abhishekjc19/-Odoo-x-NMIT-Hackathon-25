'use server';

/**
 * @fileOverview A chatbot flow for EcoSwap.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {getProducts} from '@/lib/data';

const ProductSearchInputSchema = z.object({
  query: z
    .string()
    .describe('The name or category of the product to search for.'),
});

const getProductInfo = ai.defineTool(
  {
    name: 'getProductInfo',
    description: 'Get information about products available on EcoSwap.',
    inputSchema: ProductSearchInputSchema,
    outputSchema: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.string(),
        price: z.number(),
      })
    ),
  },
  async ({query}) => {
    const products = getProducts({search: query});
    return products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
    }));
  }
);

const ChatInputSchema = z.object({
  history: z
    .array(z.object({role: z.enum(['user', 'model']), content: z.string()}))
    .describe('The conversation history.'),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = string;

const chatPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatInputSchema},
  output: {format: 'text'},
  tools: [getProductInfo],
  prompt: `You are a friendly and helpful customer support chatbot for an online marketplace called EcoSwap.
Your goal is to assist users with their questions about products and the platform.
Keep your answers concise and conversational.

Here is the conversation history:
{{#each history}}
{{role}}: {{content}}
{{/each}}

And here is the latest message from the user:
user: {{{message}}}

Based on this, please provide a helpful response. If you need to find product information, use the getProductInfo tool.`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    const {output} = await chatPrompt(input);
    return output!;
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}
