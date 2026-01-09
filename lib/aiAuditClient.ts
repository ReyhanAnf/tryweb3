import { storage } from './storage';

const AUDIT_SYSTEM_PROMPT = `
You are the Internal Auditor AI. Your ONLY job is to audit the Primary Risk Analyst's output.
Check for "Euphoria", "Bias", or "Negligence".
If the Primary Analyst recommends ENTER but the Risk Score is High (>10), you MUST flag this as a FAILURE.

RULES:
1. If Liquidity or Contract checks failed, but Analyst says ENTER -> FAIL.
2. If Analyst uses emotional words ("moon", "send it", "gem") -> FAIL.
3. Be harsh on the Analyst.

OUTPUT FORMAT (JSON):
{
  "audit_status": "PASS" | "WARNING" | "FAIL",
  "detected_biases": string[],
  "critical_omissions": string[],
  "reasoning_quality_score": 0-100,
  "override_recommendation": "KEEP" | "DOWNGRADE" | "REJECT",
  "audit_notes": string
}
`;

export async function auditAnalysis(
  primaryAnalysis: any,
  riskContext: any,
  identity: any
) {
  const apiKey = storage.getApiKey();
  if (!apiKey) throw new Error("Missing OpenAI API Key");

  const userPrompt = `
    TOKEN IDENTITY:
    ${JSON.stringify(identity, null, 2)}

    Primary Analysis: ${JSON.stringify(primaryAnalysis)}
    Risk Context (Score/Failures): ${JSON.stringify(riskContext)}

    INSTRUCTIONS:
    1. Verify if the Primary Analysis ignored any red flags visible in the Token Identity (e.g. low liquidity, suspicious contract).
    2. Assume user inputs in Identity are accurate.

    Audit this analysis.
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
        { role: "system", content: AUDIT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`Audit Request Failed: ${res.statusText}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}
