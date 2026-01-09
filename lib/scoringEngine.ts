import { ChecklistItem, RISK_CONFIG } from '../config/risk';

export interface AssessmentMap {
  [itemId: string]: boolean; // true = PASS, false = FAIL
}

export interface ScoreResult {
  totalScore: number;
  maxPossibleScore: number; // Not heavily used in formula but good for context
  riskLevel: 'PASS' | 'RISK' | 'FAIL';
  triggeredKillSwitch: boolean;
  notes: string[];
}

export function calculateRiskScore(
  assessment: AssessmentMap,
  allChecklists: ChecklistItem[]
): ScoreResult {
  let score = 0;
  let triggeredKillSwitch = false;
  const notes: string[] = [];

  allChecklists.forEach(item => {
    // defaults: if not in assessment map, assume unticked?
    // Usually "Checklist" implies you tick what is TRUE (PASSED).
    // So if it is NOT in assessment (false), it FAILED.
    // Or does the user tick "It has a problem"?
    // Standard pilot checklist: You tick the items you verify.
    // "Is Liquidity Locked?" -> Tick = Yes (Safe). Untick = No (Danger).

    const isPassed = !!assessment[item.id];

    if (!isPassed) {
      // It failed. Add penalty.
      const multiplier = RISK_CONFIG.multipliers[item.severity] || 0;
      score += (item.weight * multiplier);

      notes.push(`[${item.severity}] ${item.title} - FAILED`);

      if (item.killSwitch) {
        triggeredKillSwitch = true;
        notes.push(`KILL SWITCH TRIGGERED by ${item.title}`);
      }
    }
  });

  let riskLevel: 'PASS' | 'RISK' | 'FAIL' = 'PASS';

  if (triggeredKillSwitch) {
    riskLevel = 'FAIL';
  } else if (score >= RISK_CONFIG.thresholds.high) {
    riskLevel = 'FAIL';
  } else if (score >= RISK_CONFIG.thresholds.medium) {
    riskLevel = 'RISK';
  }

  return {
    totalScore: score,
    maxPossibleScore: 0,
    riskLevel,
    triggeredKillSwitch,
    notes
  };
}
