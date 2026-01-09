import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/secondary-primitives";

interface AiAuditResult {
  audit_status: "PASS" | "WARNING" | "FAIL";
  detected_biases: string[];
  critical_omissions: string[];
  reasoning_quality_score: number;
  override_recommendation: "KEEP" | "DOWNGRADE" | "REJECT";
  audit_notes: string;
}

interface AiAuditPanelProps {
  audit?: AiAuditResult;
  loading: boolean;
}

export function AiAuditPanel({ audit, loading }: AiAuditPanelProps) {
  if (loading) return <div className="text-center p-4 text-xs text-muted-foreground animate-pulse">Auditor is reviewing...</div>;
  if (!audit) return null;

  const isFail = audit.audit_status === 'FAIL';

  return (
    <Card className={`mt-4 border-l-4 ${isFail ? 'border-l-red-600 bg-red-50/10' : 'border-l-green-600'}`}>
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
           <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Internal Audit</CardTitle>
           <Badge variant={isFail ? 'destructive' : 'success'}>{audit.audit_status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
         <div className="text-sm mb-2 font-semibold">
            Status: {audit.override_recommendation} (Quality: {audit.reasoning_quality_score}/100)
         </div>
         <p className="text-xs text-muted-foreground mb-2">{audit.audit_notes}</p>

         {audit.critical_omissions.length > 0 && (
           <div className="text-xs text-red-600 font-bold">
             CRITICAL OMISSIONS: {audit.critical_omissions.join(", ")}
           </div>
         )}
      </CardContent>
    </Card>
  );
}
