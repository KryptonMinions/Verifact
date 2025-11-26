'use client';

import { Badge } from '@/components/ui/badge';
import { ExternalLink, ThumbsUp, ThumbsDown, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AnalysisDataViewProps {
    summary: any;
}

export function AnalysisDataView({ summary }: AnalysisDataViewProps) {
    const [showData, setShowData] = useState(true);

    if (summary.error) {
        return (
            <div className="text-red-400 text-sm">
                <p className="font-semibold mb-2">Error loading analysis data</p>
                <p className="text-xs text-gray-400">{summary.error}</p>
            </div>
        );
    }

    const { analyzed_claims, verdict, source_credibility_summary } = summary;

    const getCredibilityColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="space-y-4">
            {/* Toggle Button */}
            <button
                onClick={() => setShowData(!showData)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
                <span>{showData ? 'HIDE DATA' : 'VIEW DATA'}</span>
                <svg
                    className={cn(
                        "w-5 h-5 transition-transform",
                        showData ? "rotate-180" : ""
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {showData && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Claims Analysis */}
                    {analyzed_claims && analyzed_claims.length > 0 && (
                        <div className="space-y-6">
                            {analyzed_claims.map((claim: any, index: number) => (
                                <ClaimCard key={index} claim={claim} index={index} />
                            ))}
                        </div>
                    )}

                    {/* Source Credibility Assessment Section */}
                    {source_credibility_summary && source_credibility_summary.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-neon-blue" />
                                Source Credibility Assessment
                            </h3>
                            <div className="space-y-4">
                                {source_credibility_summary.map((source: any, index: number) => (
                                    <div key={index} className="bg-[#1a1d2d] rounded-lg p-5 border border-gray-700 hover:border-blue-500/50 transition-all">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline break-all font-medium"
                                            >
                                                {source.url}
                                            </a>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-sm font-bold px-3 py-1',
                                                        getCredibilityColor(source.credibility_score)
                                                    )}
                                                >
                                                    {source.credibility_score}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300 border-gray-700">
                                                    {source.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {source.flags && source.flags.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                                                        Trust Indicators
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {source.flags.map((flag: string, flagIndex: number) => (
                                                            <div
                                                                key={flagIndex}
                                                                className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#151824] px-2 py-1 rounded border border-gray-800"
                                                            >
                                                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                                <span>{flag}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-[#151824] rounded p-4 border-l-2 border-blue-500/50">
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    {source.reasoning}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface ClaimCardProps {
    claim: any;
    index: number;
}

function ClaimCard({ claim, index }: ClaimCardProps) {
    return (
        <div className="space-y-4">
            {/* Claim Header */}
            <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">Claim {index + 1}</h4>
                <p className="text-base text-gray-300 leading-relaxed">
                    {claim.claim_text}
                </p>
            </div>

            {/* Supporting Evidence */}
            {claim.supporting_evidence && claim.supporting_evidence.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium text-sm">Supporting Evidence</span>
                    </div>
                    <div className="space-y-3">
                        {claim.supporting_evidence.map((evidence: any, i: number) => (
                            <div
                                key={i}
                                className="border border-blue-500/30 rounded-lg p-4 bg-blue-950/20 space-y-3"
                            >
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    "{evidence.summary}"
                                </p>
                                {evidence.source && (
                                    <a
                                        href={evidence.source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Source
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Opposing Evidence */}
            {claim.opposing_evidence && claim.opposing_evidence.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 font-medium text-sm">Opposing Evidence</span>
                    </div>
                    <div className="space-y-3">
                        {claim.opposing_evidence.map((evidence: any, i: number) => (
                            <div
                                key={i}
                                className="border border-blue-500/30 rounded-lg p-4 bg-blue-950/20 space-y-3"
                            >
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    "{evidence.summary}"
                                </p>
                                {evidence.source && (
                                    <a
                                        href={evidence.source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Source
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Fact Check Results */}
            {claim.fact_check_results && claim.fact_check_results.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium text-sm">Fact-Check Results</span>
                    </div>
                    <div className="space-y-3">
                        {claim.fact_check_results.map((result: any, i: number) => (
                            <div
                                key={i}
                                className="border border-blue-500/30 rounded-lg p-4 bg-blue-950/20 space-y-3"
                            >
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    "{result.summary || result.text_snippet}"
                                </p>
                                {result.url && (
                                    <a
                                        href={result.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Source
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
