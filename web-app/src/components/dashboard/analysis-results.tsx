
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
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShareButton } from './share-button';
import { generatePDFFromAnalysisResult } from '@/utils/pdf-generator-generic';
import { Download } from 'lucide-react';

type AnalysisResultsProps = {
  result: AnalysisResult;
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const { analyzed_claims, tag, overall_summary, source_credibility_summary, source } = result;

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
        variant: 'destructive' as const,
        className: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
      };
    }
    if (lowerCaseTag.includes('true')) {
      return {
        variant: 'default' as const,
        className: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
      };
    }
    // For "Misleading", "Needs Context", etc.
    return {
      variant: 'secondary' as const,
      className: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    };
  };

  const tagInfo = getTagInfo(tag);

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getVerdictIcon = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('false') || lowerTag.includes('misinformation')) {
      return <ShieldAlert className="h-6 w-6" />;
    }
    if (lowerTag.includes('true') || lowerTag.includes('verified')) {
      return <CheckCircle2 className="h-6 w-6" />;
    }
    if (lowerTag.includes('misleading') || lowerTag.includes('context')) {
      return <Info className="h-6 w-6" />;
    }
    return <ShieldQuestion className="h-6 w-6" />;
  };

  const getVerdictStyles = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('false') || lowerTag.includes('misinformation')) {
      return {
        gradient: 'from-red-500/20 to-red-600/20',
        border: 'border-red-500/30',
        glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
        badgeBg: 'bg-gradient-to-r from-red-600 to-red-700',
        iconColor: 'text-red-400',
      };
    }
    if (lowerTag.includes('true') || lowerTag.includes('verified')) {
      return {
        gradient: 'from-green-500/20 to-green-600/20',
        border: 'border-green-500/30',
        glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
        badgeBg: 'bg-gradient-to-r from-green-600 to-green-700',
        iconColor: 'text-green-400',
      };
    }
    if (lowerTag.includes('misleading') || lowerTag.includes('context')) {
      return {
        gradient: 'from-yellow-500/20 to-yellow-600/20',
        border: 'border-yellow-500/30',
        glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
        badgeBg: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
        iconColor: 'text-yellow-400',
      };
    }
    return {
      gradient: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      badgeBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
      iconColor: 'text-blue-400',
    };
  };

  const verdictStyles = getVerdictStyles(tag);

  return (
    <div className="grid gap-8">
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Info className="text-blue-400" />
          Overall Summary
        </h3>
        <Card className={cn(
          'group relative overflow-hidden border-2 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]',
          'bg-gradient-to-br',
          verdictStyles.gradient,
          verdictStyles.border,
          verdictStyles.glow,
          'bg-[#1a1d2d]/90'
        )}>
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardContent className="relative p-8">
            {/* Header with verdict badge and share button */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Large verdict icon */}
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-xl border-2',
                  verdictStyles.border,
                  'bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm',
                  verdictStyles.iconColor
                )}>
                  {getVerdictIcon(tag)}
                </div>

                {/* Verdict text and badge */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium uppercase tracking-wide text-gray-400">
                    Verdict
                  </h4>
                  <div className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-lg',
                    verdictStyles.badgeBg
                  )}>
                    <span className="text-lg font-bold">{tag}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Share button */}
                <ShareButton
                  result={result}
                  variant="outline"
                  size="default"
                  className="border-gray-700/50 bg-[#252837]/80 backdrop-blur-sm hover:bg-blue-600/30 hover:border-blue-500/50 transition-all duration-300"
                />

                {/* PDF Download button */}
                <button
                  onClick={() => generatePDFFromAnalysisResult(result)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-700/50 bg-[#252837]/80 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:bg-blue-600/30 hover:border-blue-500/50"
                  title="Download PDF Report"
                >
                  <Download className="h-4 w-4" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className={cn(
              'mb-6 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent',
              'opacity-50'
            )} />

            {/* Summary text */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Analysis Summary
              </h5>
              <p className="text-base leading-relaxed text-gray-100/90">
                {overall_summary}
              </p>
              {source && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <span className="font-medium uppercase tracking-wide">Source:</span>
                  <span className="text-gray-300">{source}</span>
                </div>
              )}
            </div>
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

                {(() => {
                  const validFactChecks = claim.fact_checking_results?.filter(fc => fc.url && fc.url !== 'None') || [];
                  return validFactChecks.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 font-semibold text-muted-foreground">
                        <BookCheck className="size-4" />
                        Fact-Checking Results
                      </h4>
                      <div className="space-y-4">
                        {validFactChecks.map(
                          (fc: FactCheckResult, fcIndex: number) => (
                            <div
                              key={fcIndex}
                              className="rounded-md border bg-muted/30 p-4"
                            >
                              <p className="font-semibold">{fc.source}</p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {fc.summary}
                              </p>
                              <a
                                href={fc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                              >
                                <LinkIcon className="size-3" />
                                View Source
                              </a>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Source Credibility Assessment Section */}
      {source_credibility_summary && source_credibility_summary.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck />
            Source Credibility Assessment
          </h3>
          <div className="space-y-4">
            {source_credibility_summary.map((source, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-3">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow text-base text-primary underline-offset-4 hover:underline break-all"
                    >
                      {source.url}
                    </a>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-lg font-bold px-3 py-1',
                          getCredibilityColor(source.credibility_score)
                        )}
                      >
                        {source.credibility_score}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {source.category}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {source.flags && source.flags.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        Trust Indicators
                      </h4>
                      <ul className="space-y-1">
                        {source.flags.map((flag, flagIndex) => (
                          <li
                            key={flagIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-green-600" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="rounded-md border-l-4 border-primary bg-muted/30 p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {source.reasoning}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Add indicatorClassName to Progress component
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    indicatorClassName?: string;
  }
}
