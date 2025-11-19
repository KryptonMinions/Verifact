
'use client';

import type { AnalysisResult, AnalyzedClaim, FactCheckResult, Evidence } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  ShieldAlert,
  Info,
  Globe,
  BookCheck,
  LinkIcon,
  ShieldQuestion,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AnalysisResultsProps = {
  result: AnalysisResult;
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const { analyzed_claims, tag, overall_summary } = result;

  const getClaimIcon = (conclusion: string) => {
    const lowerCaseConclusion = conclusion.toLowerCase();
    if (lowerCaseConclusion.includes('false')) {
      return <ShieldAlert className="text-destructive" />;
    }
    if (lowerCaseConclusion.includes('true') || lowerCaseConclusion.includes('correct')) {
      return <CheckCircle2 className="text-green-600" />;
    }
    if (lowerCaseConclusion.includes('misleading')) {
        return <Info className="text-yellow-600" />;
    }
    return <ShieldQuestion className="text-yellow-600" />;
  };

  const getTagInfo = (tag: string) => {
    const lowerCaseTag = tag.toLowerCase();
    if (lowerCaseTag.includes('false')) {
      return {
        variant: 'destructive',
        className: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
      };
    }
    if (lowerCaseTag.includes('true')) {
      return {
        variant: 'default',
        className: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
      };
    }
    // For "Misleading", "Needs Context", etc.
    return {
      variant: 'secondary',
      className: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    };
  };

  const tagInfo = getTagInfo(tag);

  return (
    <div className="grid gap-8">
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <Info />
          Overall Summary
        </h3>
        <Card className={cn('transition-colors', tagInfo.className)}>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold">Overall Finding</h4>
              <Badge variant={tagInfo.variant}>{tag}</Badge>
            </div>
            <p className="text-base leading-relaxed">{overall_summary}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <BookCheck />
          Detailed Analysis
        </h3>
        <div className="space-y-4">
          {analyzed_claims.map((claim: AnalyzedClaim, index: number) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {getClaimIcon(claim.conclusion)}
                  </div>
                  <div className="flex-grow">
                    <p className="text-lg leading-snug">{claim.claim_text}</p>
                    <CardDescription className="mt-1">
                      Conclusion: {claim.conclusion}
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pl-6">
                {claim.supporting_evidence?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold text-green-600">
                      <ThumbsUp className="size-4" />
                      Supporting Evidence
                    </h4>
                    <div className="space-y-4">
                      {claim.supporting_evidence.map((evidence: Evidence, evIndex: number) => (
                        <div key={evIndex} className="rounded-md border bg-muted/30 p-4">
                          <p className="text-sm text-muted-foreground">{evidence.summary}</p>
                          <a
                            href={evidence.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                          >
                            <LinkIcon className="size-3" />
                            View Source
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {claim.opposing_evidence?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold text-destructive">
                      <ThumbsDown className="size-4" />
                      Opposing Evidence
                    </h4>
                    <div className="space-y-4">
                      {claim.opposing_evidence.map((evidence: Evidence, evIndex: number) => (
                        <div key={evIndex} className="rounded-md border bg-muted/30 p-4">
                          <p className="text-sm text-muted-foreground">{evidence.summary}</p>
                          <a
                            href={evidence.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                          >
                            <LinkIcon className="size-3" />
                            View Source
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {claim.fact_checking_results?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 font-semibold text-muted-foreground">
                      <BookCheck className="size-4" />
                      Fact-Checking Results
                    </h4>
                    <div className="space-y-4">
                      {claim.fact_checking_results.map(
                        (fc: FactCheckResult, fcIndex: number) => (
                          <div
                            key={fcIndex}
                            className="rounded-md border bg-muted/30 p-4"
                          >
                            <p className="font-semibold">{fc.source}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {fc.summary}
                            </p>
                            {fc.url && (
                              <a
                                href={fc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                              >
                                <LinkIcon className="size-3" />
                                View Source
                              </a>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add indicatorClassName to Progress component
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    indicatorClassName?: string;
  }
}
