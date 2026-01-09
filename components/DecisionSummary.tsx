import { Card, CardContent } from "@/components/ui/primitives";

interface DecisionSummaryProps {
  scoreLevel: 'PASS' | 'RISK' | 'FAIL';
  aiRecommendation?: string;
  auditRecommendation?: string;
  triggeredKillSwitch: boolean;
}

export function DecisionSummary({
  scoreLevel,
  aiRecommendation,
  auditRecommendation,
  triggeredKillSwitch
}: DecisionSummaryProps) {

  // Logic: The most pessimistic view wins.
  // Unless logic suggests otherwise, but core principle is "Deterministic Logic > AI Opinion".
  // BUT "AI Audit" can override Primary AI to be more conservative.
  // The "Final Decision" logic in UI:
  // If KillSwitch -> FAIL
  // If Score FAIL -> FAIL
  // If Score RISK -> RISK
  // IF Score PASS but AI says AVOID -> RISK (or WAIT)
  // IF Score PASS and AI says ENTER and Audit says REJECT -> WAIT/RISK.

  let finalState: 'GO' | 'WAIT' | 'NO GO' = 'WAIT';

  if (scoreLevel === 'FAIL' || triggeredKillSwitch) {
    finalState = 'NO GO';
  } else if (scoreLevel === 'RISK') {
    finalState = 'WAIT'; // Risk means careful.
  } else if (scoreLevel === 'PASS') {
    // Score says PASS.
    if (aiRecommendation === 'AVOID' || auditRecommendation === 'REJECT') {
      finalState = 'WAIT'; // AI found something logic missed
    } else if (aiRecommendation === 'ENTER') {
      finalState = 'GO';
    } else {
      finalState = 'WAIT';
    }
  }

  const colorMap = {
    'GO': 'bg-green-600 text-white',
    'WAIT': 'bg-amber-500 text-black',
    'NO GO': 'bg-red-700 text-white'
  };

  return (
    <Card className={`${colorMap[finalState]} mb-6`}>
      <CardContent className="h-40 flex items-center justify-center flex-col">
         <h2 className="text-6xl font-black tracking-tighter">{finalState}</h2>
         <p className="text-sm uppercase tracking-widest opacity-80 mt-2 font-mono">
           System Consensus
         </p>
         {triggeredKillSwitch && <div className="mt-2 bg-black/20 px-2 py-1 text-xs rounded">KILL SWITCH ACTIVE</div>}
      </CardContent>
    </Card>
  );
}
