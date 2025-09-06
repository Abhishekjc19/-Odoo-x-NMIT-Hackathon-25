'use server';
/**
 * @fileOverview An AI agent that enhances product images for better lighting and clarity.
 *
 * - enhanceProductImage - A function that enhances the product image.
 * - EnhanceProductImageInput - The input type for the enhanceProductImage function.
 * - EnhanceProductImageOutput - The return type for the enhanceProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const EnhanceProductImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceProductImageInput = z.infer<typeof EnhanceProductImageInputSchema>;

const EnhanceProductImageOutputSchema = z.object({
  enhancedPhotoDataUri: z.string().describe('The enhanced photo of the product as a data URI.'),
});
export type EnhanceProductImageOutput = z.infer<typeof EnhanceProductImageOutputSchema>;

export async function enhanceProductImage(input: EnhanceProductImageInput): Promise<EnhanceProductImageOutput> {
  return enhanceProductImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceProductImagePrompt',
  input: {schema: EnhanceProductImageInputSchema},
  output: {schema: EnhanceProductImageOutputSchema},
  prompt: [
    {
      media: {url: '{{photoDataUri}}'},
    },
    {
      text: 'Generate an enhanced version of this product photo with better lighting and clarity.',
    },
  ],
  model: 'googleai/gemini-2.5-flash-image-preview',
  config: {
    responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
  },
});

const enhanceProductImageFlow = ai.defineFlow(
  {
    name: 'enhanceProductImageFlow',
    inputSchema: EnhanceProductImageInputSchema,
    outputSchema: EnhanceProductImageOutputSchema,
  },
  async input => {
    const {media} = await prompt(input);
    return {enhancedPhotoDataUri: media.url!};
  }
);
