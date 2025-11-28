
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  ShieldAlert,
  Upload,
  Info,
  BookCheck,
  LinkIcon,
  ShieldQuestion,
  ThumbsUp,
  ThumbsDown,
  History,
  ShieldCheck,
} from 'lucide-react';
import type { AnalysisResult, AnalyzedClaim, FactCheckResult, Evidence } from '@/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { ReverseImageTimeline } from './reverse-image-timeline';
import { ShareButton } from './share-button';
import { generatePDFFromAnalysisResult } from '@/utils/pdf-generator-generic';
import { Download } from 'lucide-react';

type AnalysisReportProps = {
  analysis: any;
};

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  const { analysis_details, text_input, url_input, created_at } = analysis;
  const { analyzed_claims, tag, overall_summary, reverse_image_search_data, source_credibility_summary, source }: AnalysisResult =
    analysis_details;

  const getTitle = () => {
    if (text_input) {
      return text_input.length > 50
        ? `${text_input.substring(0, 50)}...`
        : text_input;
    }
    if (url_input) {
      return url_input;
    }
    // For image analysis, use first claim text or tag
    if (analyzed_claims && analyzed_claims.length > 0) {
      const firstClaim = analyzed_claims[0].claim_text;
      return firstClaim.length > 60
        ? `${firstClaim.substring(0, 60)}...`
        : firstClaim;
    }
    // Fallback to tag if no claims available
    return tag || 'Analysis Report';
  };

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
    let icon = <ShieldQuestion className="text-yellow-600" />;
    let variant: 'default' | 'destructive' | 'secondary' = 'secondary';
    let className = 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';

    if (lowerCaseTag.includes('false')) {
      variant = 'destructive';
      className = 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      icon = <ShieldAlert className="text-destructive" />;
    } else if (lowerCaseTag.includes('true') || lowerCaseTag.includes('correct')) {
      variant = 'default';
      className = 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      icon = <CheckCircle2 className="text-green-600" />;
    } else if (lowerCaseTag.includes('misleading') || lowerCaseTag.includes('needs context')) {
      icon = <Info className="text-yellow-600" />;
    }

    return { variant, className, icon };
  };

  const tagInfo = getTagInfo(tag);

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const handleDownload = () => {
    let reportContent = `
Analysis Report
===============
Title: ${getTitle()}
Date: ${new Date(created_at).toLocaleDateString()}
Overall Tag: ${tag}

Overall Summary
---------------
${overall_summary}

Analyzed Claims
---------------
`;

    analyzed_claims.forEach((claim, index) => {
      reportContent += `
Claim ${index + 1}: ${claim.claim_text}
Conclusion: ${claim.conclusion}
`;

      if (claim.supporting_evidence?.length > 0) {
        reportContent += '\nSupporting Evidence:\n';
        claim.supporting_evidence.forEach(e => {
          reportContent += `- ${e.summary} (Source: ${e.source})\n`;
        });
      }

      if (claim.opposing_evidence?.length > 0) {
        reportContent += '\nOpposing Evidence:\n';
        claim.opposing_evidence.forEach(e => {
          reportContent += `- ${e.summary} (Source: ${e.source})\n`;
        });
      }

      if (claim.fact_checking_results?.length > 0) {
        reportContent += '\nFact-Checking Results:\n';
        claim.fact_checking_results.forEach(fc => {
          reportContent += `- ${fc.source}: ${fc.summary} (${fc.url})\n`;
        });
      }
      reportContent += '---\n';
    });

    // Add source credibility data if present
    if (source_credibility_summary && source_credibility_summary.length > 0) {
      reportContent += `

Source Credibility Assessment
------------------------------
`;
      source_credibility_summary.forEach((source, index) => {
        reportContent += `
Source ${index + 1}: ${source.url}
Credibility Score: ${source.credibility_score}/100
Category: ${source.category}

Trust Indicators:
${source.flags.map(flag => `- ${flag}`).join('\n')}

Reasoning:
${source.reasoning}

---\n`;
      });
    }

    // Add RIS timeline data if present
    if (reverse_image_search_data) {
      reportContent += `
Reverse Image Search Timeline
-----------------------------
Summary: ${reverse_image_search_data.summary}

Timeline of Appearances (oldest first):
`;
      const oldestLinks = [...reverse_image_search_data.matched_links]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

      oldestLinks.forEach(link => {
        reportContent += `- [${link.date}] ${link.domain}: ${link.url}\n`;
      });
      reportContent += '---\n';
    }

    const blob = new Blob([reportContent.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-report-${analysis.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {tagInfo.icon}
          Analysis Report
        </CardTitle>
        <Button variant="outline" onClick={handleDownload}>
          <Upload />
          Download Report
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
            <Info />
            Overall Summary
          </h3>
          <Card className={cn('transition-colors', tagInfo.className)}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">{getTitle()}</h4>
                  <Badge variant={tagInfo.variant}>{tag}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton result={analysis_details} variant="outline" size="sm" className="border-gray-700 bg-[#252837] hover:bg-blue-600/20" />
                  <button
                    onClick={() => generatePDFFromAnalysisResult(analysis_details, analysis.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-[#252837] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-blue-600/20"
                    title="Download PDF Report"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Date: {new Date(created_at).toLocaleDateString()}
                {source && (
                  <>
                    <span className="mx-2">•</span>
                    Source: {source}
                  </>
                )}
              </p>
              <Separator className="my-4" />
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
            {analyzed_claims?.map((claim: AnalyzedClaim, index: number) => (
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
                          <div key={evIndex} className="rounded-md border bg-muted/30 p-4 space-y-3">
                            <p className="text-sm text-muted-foreground">{evidence.summary}</p>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <a
                                href={evidence.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-start gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                              >
                                <LinkIcon className="size-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="break-all underline underline-offset-4">
                                  {evidence.source}
                                </span>
                              </a>
                            </div>
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
                          <div key={evIndex} className="rounded-md border bg-muted/30 p-4 space-y-3">
                            <p className="text-sm text-muted-foreground">{evidence.summary}</p>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <a
                                href={evidence.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-start gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                              >
                                <LinkIcon className="size-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="break-all underline underline-offset-4">
                                  {evidence.source}
                                </span>
                              </a>
                            </div>
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
                                className="rounded-md border bg-muted/30 p-4 space-y-3"
                              >
                                <p className="font-semibold">{fc.source}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {fc.summary}
                                </p>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                  <a
                                    href={fc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-start gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                                  >
                                    <LinkIcon className="size-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                    <span className="break-all underline underline-offset-4">
                                      {fc.url}
                                    </span>
                                  </a>
                                </div>
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

        {/* Reverse Image Search Timeline Section */}
        {reverse_image_search_data && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <History />
              Image Timeline
            </h3>
            <ReverseImageTimeline
              data={reverse_image_search_data}
              onCollapse={undefined}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
