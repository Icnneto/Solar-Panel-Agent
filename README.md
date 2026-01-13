# Icarus - Solar Energy Advisor

AI-powered chat agent that helps homeowners evaluate solar panel investments. Analyzes your roof's solar potential and calculates personalized ROI based on your location and electricity usage.

## Features

- Real-time roof analysis via Google Solar API
- Personalized investment calculations (payback period, savings, CO2 offset)
- Streaming chat interface with dark/light themes

## How It Works

1. User provides their residential address
2. Agent calls `getSolarData` tool → fetches roof analysis from Google Solar API
3. User shares their monthly electricity bill
4. Agent calls `calculateInvestment` tool → computes ROI, payback period, and savings
5. Results are presented conversationally with actionable insights

The agent uses OpenAI function calling to orchestrate tools sequentially, ensuring accurate data flows between each step.

## Tech Stack

Next.js 16 | React 19 | Vercel AI SDK | OpenAI | TypeScript | Tailwind CSS 4

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

```
OPENAI_API_KEY=
GOOGLE_GEOCODING_API_KEY=
GOOGLE_SOLAR_API_KEY=
BASE_URL_MAPS=https://maps.googleapis.com/maps/api/geocode/json
BASE_URL_SOLAR=https://solar.googleapis.com/v1
```
