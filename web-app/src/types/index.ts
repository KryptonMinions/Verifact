export type Evidence = {
  summary: string;
  source: string;
};

export type FactCheckResult = {
  source: string;
  url: string;
  summary: string;
};

export type AnalyzedClaim = {
  claim_text: string;
  supporting_evidence: Evidence[];
  opposing_evidence: Evidence[];
  fact_checking_results: FactCheckResult[];
  conclusion: string;
};

export type AnalysisResult = {
  analyzed_claims: AnalyzedClaim[];
  tag: string;
  overall_summary: string;
};
