export type Evidence = {
  summary: string;
  source: string;
};

export type FactCheckResult = {
  source: string;
  url: string;
  summary: string;
};

export type SourceCredibility = {
  url: string;
  credibility_score: number;
  category: string;
  flags: string[];
  reasoning: string;
};

export type AnalyzedClaim = {
  claim_text: string;
  supporting_evidence: Evidence[];
  opposing_evidence: Evidence[];
  fact_checking_results: FactCheckResult[];
  conclusion: string;
};

export type ReverseImageSearchLink = {
  date: string;
  domain: string;
  url: string;
};

export type ReverseImageSearchData = {
  summary: string;
  matched_links: ReverseImageSearchLink[];
};

export type AnalysisResult = {
  analyzed_claims: AnalyzedClaim[];
  tag: string;
  overall_summary: string;
  reverse_image_search_data?: ReverseImageSearchData;
  source_credibility_summary?: SourceCredibility[];
};

export type SharePlatform = 'x' | 'reddit' | 'linkedin' | 'whatsapp' | 'telegram' | 'email' | 'native';

export type ShareOptions = {
  platform: SharePlatform;
  text: string;
  url?: string;
  title?: string;
};

// Report types for the searchable reports database
export type Report = {
  id: string;
  timestamp: string | null;
  analyzed_claims: AnalyzedClaim[];
  source_credibility_summary?: SourceCredibility[];
};
