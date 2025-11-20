'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisDataView } from './analysis-data-view';

interface TrendingCardModalProps {
    trend: any;
    onClose: () => void;
}

export function TrendingCardModal({ trend, onClose }: TrendingCardModalProps) {
    let summary;
    let firstClaimText = "Could not parse report";
    let verdict = "N/A";
    let source = "Unknown Source";

    try {
        if (typeof trend.report_summary !== 'string' || !trend.report_summary.trim()) {
            throw new Error("report_summary is not a string or is empty");
        }
        summary = JSON.parse(trend.report_summary);

        firstClaimText = summary.analyzed_claims?.[0]?.claim_text || "No claim text found";
        verdict = summary.verdict?.final_verdict || summary.tag || "N/A";

        const firstEvidence = summary.analyzed_claims?.[0]?.web_evidence?.supporting?.[0] ||
            summary.analyzed_claims?.[0]?.web_evidence?.opposing?.[0];
        if (firstEvidence?.source) {
            try {
                source = new URL(firstEvidence.source).hostname;
            } catch {
                source = firstEvidence.source;
            }
        }
    } catch (e) {
        console.error("Failed to parse report_summary JSON:", e, "Data:", trend.report_summary);
        firstClaimText = "Error: Malformed report data.";
        summary = { error: "Could not parse summary", raw: trend.report_summary };
    }

    const isFalse = verdict.toLowerCase().includes("false") || verdict.toLowerCase().includes("misleading");
    const isTrue = verdict.toLowerCase().includes("true") || verdict.toLowerCase().includes("accurate");

    const borderColor = isFalse ? 'border-neon-pink' : isTrue ? 'border-neon-blue' : 'border-neon-yellow';
    const glowColor = isFalse ? 'shadow-[0_0_20px_rgba(255,0,255,0.4)]' : isTrue ? 'shadow-[0_0_20px_rgba(0,243,255,0.4)]' : 'shadow-[0_0_20px_rgba(255,230,0,0.4)]';
    const badgeClass = isFalse
        ? 'bg-neon-pink/20 text-neon-pink border-neon-pink hover:bg-neon-pink/30'
        : isTrue
            ? 'bg-neon-blue/20 text-neon-blue border-neon-blue hover:bg-neon-blue/30'
            : 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow hover:bg-neon-yellow/30';

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "max-w-4xl max-h-[90vh] overflow-y-auto",
                    "bg-glass-gradient backdrop-blur-xl border-white/20",
                    "border-l-8", borderColor, glowColor,
                    "p-0"
                )}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
                >
                    <X className="h-6 w-6 text-gray-300 hover:text-white" />
                    <span className="sr-only">Close</span>
                </button>

                <DialogHeader className="p-8 pb-4 space-y-4">
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <Badge
                            variant="outline"
                            className={cn(
                                "uppercase tracking-widest font-mono text-sm px-4 py-2",
                                badgeClass
                            )}
                        >
                            {verdict}
                        </Badge>
                        <div className="text-right">
                            <span className="text-xs font-mono text-gray-400">
                                #{trend.example_hash.substring(0, 8)}
                            </span>
                            <div className="text-sm text-gray-400 mt-1">
                                {trend.topic_count} reports
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-100 pr-8">
                        {firstClaimText}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                        <ExternalLink className="w-4 h-4" />
                        <span>Source: {source}</span>
                    </div>
                </DialogHeader>

                <div className="px-8 pb-8">
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-neon-blue"></span>
                            FULL ANALYSIS DATA
                        </h3>
                        <AnalysisDataView summary={summary} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
