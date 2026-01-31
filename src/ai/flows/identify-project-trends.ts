'use server';

/**
 * @fileOverview An AI agent that identifies trends in project data.
 *
 * - identifyProjectTrends - A function that identifies trends in project data.
 * - IdentifyProjectTrendsInput - The input type for the identifyProjectTrends function.
 * - IdentifyProjectTrendsOutput - The return type for the identifyProjectTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyProjectTrendsInputSchema = z.object({
  newProjectSubmissions: z.string().describe('JSON string of New Project Submissions data'),
  versionUpgradeSubmissions: z.string().describe('JSON string of Version Upgrade Submissions data'),
  projectEstimationSubmissions: z.string().describe('JSON string of Project Estimation Submissions data'),
  projectApprovalSubmissions: z.string().describe('JSON string of Project Approval Submissions data'),
  projectDeliverySubmissions: z.string().describe('JSON string of Project Delivery Submissions data'),
  projectFeedbackSubmissions: z.string().describe('JSON string of Project Feedback Submissions data'),
});
export type IdentifyProjectTrendsInput = z.infer<typeof IdentifyProjectTrendsInputSchema>;

const IdentifyProjectTrendsOutputSchema = z.object({
  trends: z.string().describe('A summary of the identified trends in the project data.'),
});
export type IdentifyProjectTrendsOutput = z.infer<typeof IdentifyProjectTrendsOutputSchema>;

export async function identifyProjectTrends(input: IdentifyProjectTrendsInput): Promise<IdentifyProjectTrendsOutput> {
  return identifyProjectTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyProjectTrendsPrompt',
  input: {schema: IdentifyProjectTrendsInputSchema},
  output: {schema: IdentifyProjectTrendsOutputSchema},
  prompt: `You are an AI project management assistant that analyzes project data to identify trends and patterns.

  Analyze the following project data from various submissions to google sheets, and identify any trends or potential issues. Be as detailed as possible, and call out areas of improvement.

  New Project Submissions: {{{newProjectSubmissions}}}
  Version Upgrade Submissions: {{{versionUpgradeSubmissions}}}
  Project Estimation Submissions: {{{projectEstimationSubmissions}}}
  Project Approval Submissions: {{{projectApprovalSubmissions}}}
  Project Delivery Submissions: {{{projectDeliverySubmissions}}}
  Project Feedback Submissions: {{{projectFeedbackSubmissions}}}

  Based on this data, identify trends such as increasing delays in specific project stages or recurring client feedback themes.
  Summarize your findings in the trends output field.
`,
});

const identifyProjectTrendsFlow = ai.defineFlow(
  {
    name: 'identifyProjectTrendsFlow',
    inputSchema: IdentifyProjectTrendsInputSchema,
    outputSchema: IdentifyProjectTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
