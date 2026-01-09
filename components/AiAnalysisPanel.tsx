import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { Alert, AlertDescription, AlertTitle, Badge } from "@/components/ui/secondary-primitives";

interface AiAnalysisResult {
  summary: string;
  key_risks: string[];
  missed_red_flags: string[];
  psychology_bias_detected: string[];
  checklist_disagreement: { item_id: string; reason: string }[];
  recommended_action: "ENTER" | "WAIT" | "AVOID";
  confidence_level: number;
}

interface AiAnalysisPanelProps {
  analysis?: AiAnalysisResult;
  loading: boolean;
  onRunAnalysis: () => void;
}

export function AiAnalysisPanel({ analysis, loading, onRunAnalysis }: AiAnalysisPanelProps) {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Risk Analyst</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={onRunAnalysis}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Running Deep Scan..." : "Run AI Analysis"}
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">AI Analyst Report</CardTitle>
        <Badge variant={analysis.recommended_action === 'ENTER' ? 'success' : analysis.recommended_action === 'WAIT' ? 'warning' : 'danger'}>
          {analysis.recommended_action} ({analysis.confidence_level}%)
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-auto">
        <p className="text-sm font-medium">{analysis.summary}</p>

        {analysis.psychology_bias_detected.length > 0 && (
          <Alert variant="destructive">
            <AlertTitle>Psychological Bias Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {analysis.psychology_bias_detected.map((bias, i) => <li key={i}>{bias}</li>)}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-2">
          <div className="bg-red-50 p-3 rounded">
            <h4 className="font-bold text-red-800 text-xs uppercase mb-2">Key Risks</h4>
            <ul className="list-disc pl-4 text-xs text-red-700 space-y-1">
              {analysis.key_risks.map((risk, i) => <li key={i}>{risk}</li>)}
            </ul>
          </div>

          {analysis.missed_red_flags.length > 0 && (
            <div className="bg-orange-50 p-3 rounded">
               <h4 className="font-bold text-orange-800 text-xs uppercase mb-2">Missed Red Flags</h4>
               <ul className="list-disc pl-4 text-xs text-orange-700 space-y-1">
                 {analysis.missed_red_flags.map((flag, i) => <li key={i}>{flag}</li>)}
               </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
