import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { getBuildingInsightsService } from "@/lib/services/mcp-modules/solar";
import { calculateROIService } from "@/lib/services/mcp-modules/financial";

export const maxDuration = 30;

const systemPrompt = `You are SolarAdvisor, an expert sales engineer for Artemis.

    Protocol:
    1. If the user gives an address, YOU MUST first call 'getSolarData'.
    2. Once you have the solar potential, YOU MUST call 'calculateInvestment' to get the financial numbers.
    3. Use the financial data to write a persuasive, professional summary.
    4. Never make up data. If a tool fails, ask the user for clarification.

    Tone: Professional, concise, and focused on value (ROI).`

export async function POST(req: Request) {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json(
            { success: false, message: 'Invalid request format'},
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
        model: openai('gpt-4o'),
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
                description: `Calculate financial ROI based on solar potential.`,
                inputSchema: z.object({
                    yearlySunHours: z.number().describe('Max sunshine hours per year from solar data'),
                    maxPanels: z.number().describe('Max panel count from solar data'),
                }),
                execute: async ({ yearlySunHours, maxPanels }) => {
                    const result = calculateROIService(yearlySunHours, maxPanels);

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
