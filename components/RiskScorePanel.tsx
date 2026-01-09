import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { ScoreResult } from "@/lib/scoringEngine";
import { cn } from "@/lib/utils";

interface RiskScorePanelProps {
  result: ScoreResult;
}

export function RiskScorePanel({ result }: RiskScorePanelProps) {
  const getScoreColor = (score: number) => {
    if (score < 10) return "text-green-500";
    if (score < 25) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle>Risk Scorecard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-4xl font-extrabold tracking-tighter">
            <span className={getScoreColor(result.totalScore)}>{result.totalScore}</span>
            <span className="text-muted-foreground text-sm ml-2">RISK POINTS</span>
          </div>
          <div className="text-right">
             <div className={cn("text-2xl font-black px-4 py-1 rounded", {
               "bg-green-100 text-green-800": result.riskLevel === 'PASS',
               "bg-yellow-100 text-yellow-800": result.riskLevel === 'RISK',
               "bg-red-100 text-red-800": result.riskLevel === 'FAIL',
             })}>
               {result.riskLevel}
             </div>
          </div>
        </div>

        {result.triggeredKillSwitch && (
          <div className="bg-destructive/20 p-3 rounded text-destructive font-bold text-center border border-destructive">
            KILL SWITCH TRIGGERED
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-2 max-h-40 overflow-y-auto">
          {result.notes.map((note, i) => (
             <div key={i} className="mb-1">{note}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
