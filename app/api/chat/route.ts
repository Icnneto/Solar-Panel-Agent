import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { streamText, tool, stepCountIs, convertToModelMessages } from "ai";
import { getBuildingInsightsService } from "@/lib/services/mcp-modules/solar";
import { calculateROIService } from "@/lib/services/mcp-modules/financial";

export const runtime = 'edge'

export const maxDuration = 30;

const systemPrompt = `You are Alex, a friendly and knowledgeable solar energy consultant at Artemis Solar. You help homeowners understand if solar is right for them.

## Your Personality
- Warm, approachable, and genuinely helpful
- You explain complex things in simple terms
- You're excited about solar but never pushy
- You use conversational language, not corporate jargon

## Conversation Flow
1. **Greet warmly** and ask for their address to analyze their roof's solar potential
2. **Ask about their monthly electricity bill** - this helps you give personalized savings estimates
3. **Once you have both**, use your tools to analyze their property
4. **Present findings conversationally** - highlight what matters most to them (savings, environment, independence)

## When Presenting Results
- Lead with the most exciting number (usually bill coverage or payback period)
- Explain what the numbers mean in practical terms
- Mention environmental impact naturally
- End with a clear next step or offer to answer questions

## Tool Usage - CRITICAL SEQUENCE
1. FIRST call 'getSolarData' with the address and WAIT for the result
2. ONLY AFTER receiving solar data, call 'calculateInvestment' using the values from the solar response:
   - yearlySunHours = solarPotential.maxSunshineHoursPerYear
   - maxPanels = solarPotential.maxArrayPanelsCount
   - monthlyBillUsd = the customer's bill (if they provided it)
3. NEVER call calculateInvestment with zeros or placeholder values
4. If a tool fails, apologize briefly and ask for clarification

## Important Rules
- NEVER make up numbers - only use data from your tools
- If they only give an address without a bill amount, you can still proceed (system uses $150 default)
- Keep responses concise but friendly - aim for 2-3 short paragraphs max
- Use bullet points for financial summaries, but wrap them in conversational context`

export async function POST(req: Request) {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json(
            { success: false, message: 'Invalid request format' },
            { status: 400 }
        )
    };

    const modelMessages = convertToModelMessages(messages);

    if (modelMessages.length === 0) {
        return NextResponse.json(
            { success: false, message: 'No valid messages provided' },
            { status: 400 }
        )
    };

    const result = await streamText({
        model: openai('gpt-5-mini-2025-08-07'),
        messages: modelMessages,
        system: systemPrompt,
        tools: {
            getSolarData: tool({
                description: 'Get solar potential and roof data for a specific address.',
                inputSchema: z.object({
                    address: z.string().describe('The full address to analyze (e.g., "123 Main St, City, State"))')
                }),
                execute: async ({ address }) => {
                    const result = await getBuildingInsightsService(address);

                    if (!result.success) {
                        return `Error: ${result.message}`
                    };

                    return result.data
                },
            }),

            calculateInvestment: tool({
                description: `Calculate personalized financial ROI based on solar potential and the customer's energy bill.`,
                inputSchema: z.object({
                    yearlySunHours: z.number().describe('Max sunshine hours per year from solar data'),
                    maxPanels: z.number().describe('Max panel count from solar data'),
                    monthlyBillUsd: z.number().optional().describe('Customer monthly electricity bill in USD (if not provided, uses $150 default)'),
                }),
                execute: async ({ yearlySunHours, maxPanels, monthlyBillUsd }) => {
                    const result = calculateROIService(yearlySunHours, maxPanels, monthlyBillUsd);

                    if (!result.success) {
                        return `Error: ${result.message}`
                    };

                    return result.data
                },
            }),
        },
        stopWhen: stepCountIs(5)
    });

    return result.toUIMessageStreamResponse();
}
