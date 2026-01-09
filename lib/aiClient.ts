import { storage } from './storage';

const SYSTEM_PROMPT = `
You are the Primary Risk Analyst for an Advanced Degen Meme Coin Decision Support System.
Your goal is to PROTECT the user capital at all costs.
You adhere to the "Guilty Until Proven Otherwise" doctrine.

RULES:
1. NEVER be euphoric or optimistic.
2. NEVER promise profit.
3. Be EXTREMELY skeptical of every green flag.
4. Your critique must be deterministically grounded in the provided metadata and checklist failures.
5. If the Risk Score is high, DO NOT recommend entry under any circumstances.
6. Return Strict JSON.

INPUT DATA:
- Token Metadata
- Failed Checklist Items
- Risk Score
- User Notes

OUTPUT FORMAT (JSON):
{
  "summary": string,
  "key_risks": string[],
  "missed_red_flags": string[],
  "psychology_bias_detected": string[],
  "checklist_disagreement": { "item_id": string, "reason": string }[],
  "recommended_action": "ENTER" | "WAIT" | "AVOID",
  "confidence_level": number (0-100)
}
`;

export async function analyzeToken(
  tokenData: any,
  checklistFailures: string[],
  riskScore: number,
  userNotes: string
) {
  const apiKey = storage.getApiKey();
  if (!apiKey) throw new Error("Missing OpenAI API Key");

  const userPrompt = `
    Token Data: ${JSON.stringify(tokenData)}
    Failed Checklists: ${JSON.stringify(checklistFailures)}
    Risk Score: ${riskScore}
    User Notes: ${userNotes}

    Analyze this token.
  `;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`AI Request Failed: ${res.statusText}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}
