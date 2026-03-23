import { createOpenAI } from '@ai-sdk/openai';

export function isAIConfigured(): boolean {
  return !!process.env.AI_API_KEY;
}

export function getAIModel() {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  const baseURL = process.env.AI_BASE_URL; // optional: https://openrouter.ai/api/v1
  const modelId = process.env.AI_MODEL || 'gpt-4o-mini';

  const provider = createOpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });

  return provider(modelId);
}
