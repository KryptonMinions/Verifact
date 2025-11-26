'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Report, AnalyzedClaim, Evidence, FactCheckResult, AnalysisResult } from '@/types';
import { ShareButton } from '../dashboard/share-button';
import { generatePDFFromAnalysisResult } from '@/utils/pdf-generator-generic';
import { Download } from 'lucide-react';

interface ReportModalProps {
    report: Report;
    onClose: () => void;
}

// Helper function to extract a simple verdict label from conclusion text
function getSimpleVerdict(conclusion: string): string {
    const conc = conclusion.toLowerCase();

    if (conc.includes('false') || conc.includes('debunked') || conc.includes('incorrect')) {
        return 'False';
    } else if (conc.includes('misleading') || conc.includes('partially')) {
        return 'Misleading';
    } else if (conc.includes('true') || conc.includes('accurate') || conc.includes('correct')) {
        return 'True';
    } else if (conc.includes('supported') || conc.includes('likely')) {
        return 'Supported';
    } else if (conc.includes('unverified') || conc.includes('unclear')) {
        return 'Unverified';
    } else if (conc.includes('mixed')) {
        return 'Mixed';
    }

    return 'Unverified';
}

export function ReportModal({ report, onClose }: ReportModalProps) {
    const [expandedClaims, setExpandedClaims] = useState<Set<number>>(new Set([0])); // First claim expanded by default

    const toggleClaim = (index: number) => {
        const newExpanded = new Set(expandedClaims);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedClaims(newExpanded);
    };

    // Get overall verdict from first claim
    const firstClaim = report.analyzed_claims?.[0];
    const fullConclusion = firstClaim?.conclusion || 'N/A';
    const simpleVerdict = getSimpleVerdict(fullConclusion);
    const firstClaimText = firstClaim?.claim_text || 'No claim available';

    const conc = fullConclusion.toLowerCase();
    const isFalse = conc.includes('false') || conc.includes('misleading') || conc.includes('incorrect') || conc.includes('debunked');
    const isTrue = conc.includes('true') || conc.includes('accurate') || conc.includes('supported');

    const borderColor = isFalse ? 'border-neon-pink' : isTrue ? 'border-neon-blue' : 'border-neon-yellow';
    const glowColor = isFalse ? 'shadow-[0_0_20px_rgba(255,0,255,0.4)]' : isTrue ? 'shadow-[0_0_20px_rgba(0,243,255,0.4)]' : 'shadow-[0_0_20px_rgba(255,230,0,0.4)]';
    const badgeClass = isFalse
        ? 'bg-neon-pink/20 text-neon-pink border-neon-pink hover:bg-neon-pink/30'
        : isTrue
            ? 'bg-neon-blue/20 text-neon-blue border-neon-blue hover:bg-neon-blue/30'
            : 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow hover:bg-neon-yellow/30';

    const formattedDate = report.timestamp
        ? new Date(report.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'No date available';

    const getCredibilityColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    // Convert Report to AnalysisResult format for sharing
    const analysisResult: AnalysisResult = {
        analyzed_claims: report.analyzed_claims,
        tag: simpleVerdict,
        overall_summary: fullConclusion
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    'max-w-5xl max-h-[90vh] overflow-y-auto',
                    'bg-glass-gradient backdrop-blur-xl border-white/20',
                    'border-l-8', borderColor, glowColor,
                    'p-0'
                )}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10'
                >
                    <X className='h-6 w-6 text-gray-300 hover:text-white' />
                    <span className='sr-only'>Close</span>
                </button>

                {/* Action Buttons Container */}
                <div className="absolute right-16 top-4 z-10 flex items-center gap-2">
                    {/* Share Button */}
                    <ShareButton
                        result={analysisResult}
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 text-neon-blue backdrop-blur-sm"
                    />

                    {/* PDF Download Button */}
                    <button
                        onClick={() => generatePDFFromAnalysisResult(analysisResult, report.id)}
                        className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none flex items-center gap-2 px-3 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 text-neon-blue backdrop-blur-sm"
                        title="Download PDF Report"
                    >
                        <Download className="h-4 w-4" />
                        <span className="text-xs font-medium">PDF</span>
                    </button>
                </div>

                <DialogHeader className='p-8 pb-4 space-y-4'>
                    <div className='flex items-start justify-between gap-4 pr-12'>
                        <Badge
                            variant='outline'
                            className={cn(
                                'uppercase tracking-widest font-mono text-sm px-4 py-2',
                                badgeClass
                            )}
                        >
                            {simpleVerdict}
                        </Badge>
                    </div>

                    <DialogTitle className='text-2xl font-bold leading-tight tracking-tight text-gray-100 pr-12'>
                        "{firstClaimText}"
                    </DialogTitle>

                    <div className='text-sm text-gray-400 font-mono'>
                        {report.analyzed_claims.length} Claim{report.analyzed_claims.length !== 1 ? 's' : ''} Analyzed
                    </div>
                </DialogHeader>

                <div className='px-8 pb-8 space-y-6'>
                    {report.analyzed_claims.map((claim, index) => (
                        <ClaimSection
                            key={index}
                            claim={claim}
                            index={index}
                            isExpanded={expandedClaims.has(index)}
                            onToggle={() => toggleClaim(index)}
                        />
                    ))}
                </div>

                {/* Source Credibility Assessment Section */}
                {report.source_credibility_summary && report.source_credibility_summary.length > 0 && (
                    <div className='px-8 pb-8 space-y-6'>
                        <div className="border-t border-white/10 pt-6">
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-neon-blue" />
                                Source Credibility Assessment
                            </h3>
                            <div className="space-y-4">
                                {report.source_credibility_summary.map((source, index) => (
                                    <div key={index} className="bg-[#23273a] rounded-lg p-5 border border-gray-700 hover:border-blue-500/50 transition-all">
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
                                                        {source.flags.map((flag, flagIndex) => (
                                                            <div
                                                                key={flagIndex}
                                                                className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#1a1d2d] px-2 py-1 rounded border border-gray-800"
                                                            >
                                                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                                <span>{flag}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-[#1a1d2d] rounded p-4 border-l-2 border-blue-500/50">
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    {source.reasoning}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

interface ClaimSectionProps {
    claim: AnalyzedClaim;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}

function ClaimSection({ claim, index, isExpanded, onToggle }: ClaimSectionProps) {
    const conc = claim.conclusion.toLowerCase();
    const isFalse = conc.includes('false') || conc.includes('misleading') || conc.includes('incorrect') || conc.includes('debunked');
    const isTrue = conc.includes('true') || conc.includes('accurate') || conc.includes('supported');

    const borderColor = isFalse ? 'border-red-500/30' : isTrue ? 'border-green-500/30' : 'border-yellow-500/30';
    const conclusionColor = isFalse ? 'text-red-400' : isTrue ? 'text-green-400' : 'text-yellow-400';

    return (
        <div className={cn('bg-[#23273a] rounded-lg p-5 border-l-4 transition-all', borderColor)}>
            <button
                onClick={onToggle}
                className='w-full flex items-start justify-between gap-4 text-left group'
            >
                <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                        <span className='text-xs font-mono text-gray-500 uppercase'>Claim #{index + 1}</span>
                    </div>
                    <h3 className='text-lg font-bold text-white leading-snug mb-3'>
                        "{claim.claim_text}"
                    </h3>
                    <div className='bg-[#151824] rounded p-3'>
                        <p className='text-sm text-gray-300'>
                            <span className={cn('font-bold uppercase text-xs tracking-wide mr-2', conclusionColor)}>
                                Conclusion
                            </span>
                            {claim.conclusion}
                        </p>
                    </div>
                </div>
                <div className='flex-shrink-0 pt-1'>
                    {isExpanded ? (
                        <ChevronUp className='w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors' />
                    ) : (
                        <ChevronDown className='w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors' />
                    )}
                </div>
            </button>

            {isExpanded && (
                <div className='mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <EvidenceSection
                        title='Fact Check Results'
                        items={claim.fact_checking_results}
                        colorClass='text-purple-400'
                        type='factcheck'
                    />
                    <EvidenceSection
                        title='Supporting Evidence'
                        items={claim.supporting_evidence}
                        colorClass='text-green-400'
                        type='evidence'
                    />
                    <EvidenceSection
                        title='Opposing Evidence'
                        items={claim.opposing_evidence}
                        colorClass='text-red-400'
                        type='evidence'
                    />
                </div>
            )}
        </div>
    );
}

interface EvidenceSectionProps {
    title: string;
    items: Evidence[] | FactCheckResult[];
    colorClass: string;
    type: 'evidence' | 'factcheck';
}

function EvidenceSection({ title, items, colorClass, type }: EvidenceSectionProps) {
    if (!items || items.length === 0) {
        return (
            <div>
                <h4 className={cn('text-xs font-bold mb-2 opacity-50 uppercase', colorClass)}>
                    {title}
                </h4>
                <p className='text-[10px] text-gray-600 italic border border-dashed border-gray-800 p-2 rounded'>
                    No data found.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h4 className={cn('text-xs font-bold mb-2 uppercase border-b border-gray-700 pb-1', colorClass)}>
                {title} ({items.length})
            </h4>
            <div className='bg-[#1a1d2d] p-3 rounded border border-gray-800 max-h-60 overflow-y-auto space-y-3'>
                {items.map((item, idx) => {
                    const summary = type === 'factcheck' ? (item as FactCheckResult).summary : (item as Evidence).summary;
                    const linkUrl = type === 'factcheck' ? (item as FactCheckResult).url : (item as Evidence).source;

                    return (
                        <div key={idx} className='pb-3 border-b border-gray-800 last:border-0 last:pb-0'>
                            <p className='text-xs text-gray-300 mb-1 leading-relaxed'>{summary}</p>
                            {linkUrl && (
                                <a
                                    href={linkUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-[10px] text-blue-500 hover:text-blue-300 flex items-center gap-1 truncate max-w-full mt-1'
                                >
                                    <ExternalLink className='w-3 h-3 flex-shrink-0' />
                                    <span className='truncate'>Source Link</span>
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
