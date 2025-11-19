'use client';

import { ExternalLink, ThumbsUp, ThumbsDown, BookCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const EvidenceItem = ({ source, summary }: { source?: string, summary?: string }) => {
    // Defensively check if `source` is a valid string to prevent runtime errors.
    if (typeof source !== 'string' || !source) {
        // If no source is available, just render the summary if it exists.
        return summary ? (
             <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-3">
                    <p className="text-sm text-gray-300">"{summary}"</p>
                </CardContent>
            </Card>
        ) : null;
    }

    const isUrl = source.startsWith('http') || source.startsWith('www');

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-3">
                {summary && <p className="text-sm text-gray-300 mb-2">"{summary}"</p>}
                {isUrl ? (
                    <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:underline underline-offset-4"
                    >
                        <ExternalLink className="size-3" />
                        View Source
                    </a>
                ) : (
                    <p className="text-xs text-gray-500">{source}</p>
                )}
            </CardContent>
        </Card>
    );
};


export default function RawJsonView({ summary }: { summary: any }) {
    if (!summary || !summary.analyzed_claims) {
        if (summary?.error) {
            return <pre className="p-3 bg-gray-900 rounded-md text-xs text-red-400 overflow-auto">{JSON.stringify(summary, null, 2)}</pre>
        }
        return <p className="text-xs text-red-400">Could not display detailed analysis: 'analyzed_claims' field is missing.</p>;
    }

    return (
        <div className="p-3 bg-gray-900 rounded-md text-sm text-gray-300 space-y-6">
            {summary.analyzed_claims.map((claim: any, index: number) => (
                <div key={index} className="space-y-4 border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                    <div>
                        <h4 className="font-bold text-lg text-gray-100 mb-2">Claim {index + 1}</h4>
                        <p className="text-sm text-gray-200">{claim.claim_text}</p>
                    </div>

                    {/* Supporting Evidence */}
                    {claim.supporting_evidence?.length > 0 && (
                        <div className="space-y-3">
                            <h5 className="flex items-center gap-2 font-semibold text-green-400">
                                <ThumbsUp className="size-4" />
                                Supporting Evidence
                            </h5>
                            <div className="space-y-3 pl-6">
                                {claim.supporting_evidence.map((ev: any, i: number) => <EvidenceItem key={`sup-${i}`} {...ev} />)}
                            </div>
                        </div>
                    )}

                    {/* Opposing Evidence */}
                    {claim.opposing_evidence?.length > 0 && (
                        <div className="space-y-3">
                            <h5 className="flex items-center gap-2 font-semibold text-red-400">
                                <ThumbsDown className="size-4" />
                                Opposing Evidence
                            </h5>
                             <div className="space-y-3 pl-6">
                                {claim.opposing_evidence.map((ev: any, i: number) => <EvidenceItem key={`opp-${i}`} {...ev} />)}
                            </div>
                        </div>
                    )}
                    
                    {/* Fact Checking */}
                    {claim.fact_checking_results?.length > 0 && (
                         <div className="space-y-3">
                            <h5 className="flex items-center gap-2 font-semibold text-blue-400">
                                <BookCheck className="size-4" />
                                Fact-Checking Results
                            </h5>
                             <div className="space-y-3 pl-6">
                                {claim.fact_checking_results.map((fc: any, i: number) => <EvidenceItem key={`fc-${i}`} source={fc.url} summary={fc.summary} />)}
                            </div>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
}
