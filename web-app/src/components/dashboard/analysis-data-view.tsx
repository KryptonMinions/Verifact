'use client';

import { Badge } from '@/components/ui/badge';
import { ExternalLink, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
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

    const { analyzed_claims, verdict } = summary;

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
