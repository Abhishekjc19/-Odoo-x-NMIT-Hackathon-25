// src/ai/flows/personalized-product-recommendations.ts
'use server';

/**
 * @fileOverview Personalized product recommendations based on user browsing history and preferences.
 *
 * - getPersonalizedRecommendations - A function that takes user ID and returns personalized product recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to get recommendations for.'),
  browsingHistory: z
    .array(z.string())
    .optional()
    .describe('The user browsing history, list of product ids'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  productIds: z
    .array(z.string())
    .describe('The list of recommended product IDs for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert recommendation system designed to suggest products to users based on their past browsing history.

  Given the following user ID: {{{userId}}},
  and their browsing history (product IDs): {{#if browsingHistory}}{{{browsingHistory}}}{{else}}No browsing history available{{/if}}.

  Generate a list of product IDs that the user might be interested in. Be sure to include variety.
  Return the product IDs as a JSON array.`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
