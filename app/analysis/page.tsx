"use client";

import { AiAnalysisPanel } from "@/components/AiAnalysisPanel";
import { AiAuditPanel } from "@/components/AiAuditPanel";
import { ChecklistTable } from "@/components/ChecklistTable";
import { DecisionSummary } from "@/components/DecisionSummary";
import { RiskScorePanel } from "@/components/RiskScorePanel";
import { TokenIdentityPanel } from "@/components/TokenIdentityPanel";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { ChecklistItem } from "@/config/risk";
import * as checklists from "@/data/checklists";
import { auditAnalysis } from "@/lib/aiAuditClient";
import { analyzeToken } from "@/lib/aiClient";
import { calculateRiskScore, ScoreResult } from "@/lib/scoringEngine";
import { storage } from "@/lib/storage";
import { DEFAULT_IDENTITY, TokenIdentity } from "@/types/tokenIdentity";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use 'new' as fallback if id is missing, though logic prefers ID
  const id = searchParams.get('id') || 'new';

  // State
  const [identity, setIdentity] = useState<TokenIdentity>(DEFAULT_IDENTITY);
  const [userNotes, setUserNotes] = useState("");
  const [assessments, setAssessments] = useState<{[id: string]: boolean}>({});
  const [riskResult, setRiskResult] = useState<ScoreResult | null>(null);

  // AI State
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [auditAnalysisResult, setAuditAnalysisResult] = useState<any>(null);

  // Load existing data if any
  useEffect(() => {
    if (id && id !== 'new') {
      storage.getAnalysis(id).then(record => {
        if (record) {
          setIdentity(record.identity || { ...DEFAULT_IDENTITY, ticker: record.ticker });
          setAssessments(record.data.assessments || {});
          setUserNotes(record.data.userNotes || "");
          setAiAnalysis(record.data.aiAnalysis);
          setAuditAnalysisResult(record.data.auditAnalysis);
        }
      });
    }
  }, [id]);

  // Recalculate score whenever assessments change
  useEffect(() => {
    // Flatten all checklists
    const allItems = [
     ...((checklists.quickFilter as any) as ChecklistItem[] || []),
     ...((checklists.liquidity as any) as ChecklistItem[] || []),
     ...((checklists.contract as any) as ChecklistItem[] || []),
     ...((checklists.holders as any) as ChecklistItem[] || []),
     ...((checklists.execution as any) as ChecklistItem[] || []),
     ...((checklists.psychology as any) as ChecklistItem[] || []),
    ];

    if (allItems.length > 0) {
      const result = calculateRiskScore(assessments, allItems);
      setRiskResult(result);
    }
  }, [assessments]);

  const handleToggle = (itemId: string, val: boolean) => {
    setAssessments(prev => ({ ...prev, [itemId]: val }));
  };

  const runAi = async () => {
    if (!riskResult) return;
    setIsAiRunning(true);
    try {
      const failedItems = riskResult.notes;

      const analysis = await analyzeToken(identity, failedItems, riskResult.totalScore, userNotes);
      setAiAnalysis(analysis);

      const audit = await auditAnalysis(analysis, { score: riskResult.totalScore, failures: failedItems }, identity);
      setAuditAnalysisResult(audit);

    } catch (e) {
      alert("AI Error: " + e);
    } finally {
      setIsAiRunning(false);
    }
  };

  const handleSave = async () => {
    if (!riskResult) return;

    // If it's new, we generate an ID (timestamp) and replace URL
    const saveId = id === 'new' ? Date.now().toString() : id;

    await storage.saveAnalysis({
      id: saveId,
      ticker: identity.ticker || "UNKNOWN",
      timestamp: Number(saveId), // simplified assumption
      score: riskResult.totalScore,
      result: riskResult.riskLevel,
      identity: identity,
      data: {
        assessments,
        userNotes,
        aiAnalysis,
        auditAnalysis: auditAnalysisResult
      }
    });

    if (id === 'new') {
      router.replace(`/analysis?id=${saveId}`);
    }

    alert("Saved!");
  };

  if (!riskResult) return <div>Loading Engine...</div>;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
         <Button variant="ghost" onClick={() => router.push('/')} className="pl-0">
           <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
         </Button>
         <div className="flex items-center space-x-2">
            <div className="font-mono font-bold text-lg md:text-xl uppercase">
              {identity.ticker ? `$${identity.ticker}` : 'NEW ANALYSIS'}
            </div>
            <Button onClick={handleSave} variant="outline" size="icon"><Save className="h-4 w-4"/></Button>
         </div>
      </div>

      <TokenIdentityPanel identity={identity} onChange={setIdentity} />

      <DecisionSummary
        scoreLevel={riskResult.riskLevel}
        triggeredKillSwitch={riskResult.triggeredKillSwitch}
        aiRecommendation={aiAnalysis?.recommended_action}
        auditRecommendation={auditAnalysisResult?.override_recommendation}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <ChecklistTable title="Quick Filters (Kill Switch)" items={(checklists.quickFilter as any) as ChecklistItem[] || []} assessments={assessments} onToggle={handleToggle} identity={identity} />
               <ChecklistTable title="Liquidity" items={(checklists.liquidity as any) as ChecklistItem[] || []} assessments={assessments} onToggle={handleToggle} identity={identity} />
               <ChecklistTable title="Contract Security" items={(checklists.contract as any) as ChecklistItem[] || []} assessments={assessments} onToggle={handleToggle} identity={identity} />
             </div>
             <div>
                <ChecklistTable title="Holders & Distribution" items={(checklists.holders as any) as ChecklistItem[] || []} assessments={assessments} onToggle={handleToggle} identity={identity} />
                <ChecklistTable title="Execution & Socials" items={(checklists.execution as any) as ChecklistItem[] || []} assessments={assessments} onToggle={handleToggle} identity={identity} />
                <ChecklistTable title="Psychology Check" items={(checklists.psychology as any) as ChecklistItem[] || []} assessments={assessments} onToggle={handleToggle} identity={identity} />
             </div>
           </div>

           <Card>
             <CardHeader><CardTitle>Analyst Notes</CardTitle></CardHeader>
             <CardContent>
               <textarea
                  className="w-full h-32 p-2 border rounded bg-slate-50 text-sm font-mono"
                  placeholder="Paste additional notes, contract anomalies, or thoughts..."
                  value={userNotes}
                  onChange={e => setUserNotes(e.target.value)}
               />
             </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <RiskScorePanel result={riskResult} />
           <AiAnalysisPanel
             analysis={aiAnalysis}
             loading={isAiRunning}
             onRunAnalysis={runAi}
           />
           <AiAuditPanel
             audit={auditAnalysisResult}
             loading={isAiRunning}
           />
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div>Loading Workspace...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
