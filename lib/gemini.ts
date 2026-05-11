import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";

type GenerateOptions<T> = {
  systemPrompt: string;
  payload: unknown;
  schema: z.ZodType<T>;
  fallback: T;
  imageDataUrl?: string;
};

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";
const DEFAULT_FALLBACK_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function getModelCandidates() {
  const configured = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const envFallbacks =
    process.env.GEMINI_FALLBACK_MODELS?.split(",")
      .map((model) => model.trim())
      .filter(Boolean) ?? [];

  return Array.from(new Set([configured, ...envFallbacks, ...DEFAULT_FALLBACK_MODELS]));
}

async function generateWithModelFallback<T>(request: (model: string) => Promise<T>) {
  let lastError: unknown;

  for (const model of getModelCandidates()) {
    try {
      return await request(model);
    } catch (error) {
      lastError = error;
      console.warn(`Gemini model ${model} failed; trying fallback if available.`, error);
    }
  }

  throw lastError;
}

function dataUrlToInlineData(dataUrl?: string) {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return {
    inlineData: {
      mimeType: match[1],
      data: match[2]
    }
  };
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return trimmed.slice(first, last + 1);
  }

  return trimmed;
}

async function repairJson<T>(raw: string, schema: z.ZodType<T>, fallback: T) {
  const client = getClient();
  if (!client) return fallback;

  try {
    const response = await generateWithModelFallback((model) => client.models.generateContent({
      model,
      contents: [
        {
          text: `Repair this model output into valid JSON matching the requested schema. Return only JSON.\n\nSchema:\n${JSON.stringify(
            zodToJsonSchema(schema),
            null,
            2
          )}\n\nOutput:\n${raw}`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(schema)
      }
    }));
    return schema.parse(JSON.parse(extractJson(response.text || "")));
  } catch (error) {
    console.warn("Gemini JSON repair failed; using safe fallback.", error);
    return fallback;
  }
}

export async function generateStructuredJson<T>({
  systemPrompt,
  payload,
  schema,
  fallback,
  imageDataUrl
}: GenerateOptions<T>) {
  const client = getClient();
  if (!client) {
    return {
      data: fallback,
      source: "demo_fallback" as const
    };
  }

  const inlineData = dataUrlToInlineData(imageDataUrl);
  const userPrompt = `${systemPrompt}

Input:
${JSON.stringify(payload, null, 2)}

Important constraints:
- Return only valid JSON.
- Keep Olympic and Paralympic representation at parity.
- Avoid medical, eligibility, identity-based, or performance-prediction claims.
- Prefer official or verified support pathways.`;

  const contents = inlineData ? [inlineData, { text: userPrompt }] : [{ text: userPrompt }];

  try {
    const response = await generateWithModelFallback((model) => client.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(schema)
      }
    }));

    const parsed = schema.safeParse(JSON.parse(extractJson(response.text || "")));
    if (parsed.success) {
      return {
        data: parsed.data,
        source: "gemini" as const
      };
    }

    return {
      data: await repairJson(response.text || "", schema, fallback),
      source: "gemini_repaired" as const
    };
  } catch (error) {
    console.warn("Gemini request failed; using safe fallback.", error);
    return {
      data: fallback,
      source: "safe_fallback" as const
    };
  }
}
