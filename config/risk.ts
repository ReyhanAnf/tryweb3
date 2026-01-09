export const RISK_CONFIG = {
  // Thresholds for Risk Score
  // Score is calculated as Sum(Weight * SeverityMultiplier)
  // Multipliers: SAFE=0, WARNING=1, CRITICAL=3
  thresholds: {
    medium: 10,  // Score >= 10 is RISK
    high: 25,    // Score >= 25 is FAIL
  },

  // Severity Multipliers
  multipliers: {
    SAFE: 0,
    WARNING: 1,
    CRITICAL: 3,
  }
};

export type Severity = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface VerificationTool {
  name: string;
  urlTemplate: string;
}

export interface VerificationInfo {
  howToCheck: string;
  tools: VerificationTool[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  severity: Severity;
  weight: number;
  killSwitch?: boolean;
  verification?: VerificationInfo;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}
