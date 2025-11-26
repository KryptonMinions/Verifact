'use client';

import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Report } from '@/types';
import { Shield, XCircle, AlertCircle, Calendar, FileText } from 'lucide-react';

interface ReportCardProps {
    report: Report;
    onCardClick?: (report: Report) => void;
}

// Helper function to get simple verdict label
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

export default function ReportCard({ report, onCardClick }: ReportCardProps) {
    // Extract first claim for preview
    const firstClaim = report.analyzed_claims?.[0];
    const claimText = firstClaim?.claim_text || 'No claim text available';
    const conclusion = firstClaim?.conclusion || 'N/A';
    const simpleVerdict = getSimpleVerdict(conclusion);

    // Determine verdict styling based on conclusion
    const conc = conclusion.toLowerCase();
    const isFalse = conc.includes('false') || conc.includes('misleading') || conc.includes('incorrect') || conc.includes('debunked');
    const isTrue = conc.includes('true') || conc.includes('accurate') || conc.includes('supported');

    // Premium Balance styling
    const borderColor = isFalse ? 'border-neon-pink' : isTrue ? 'border-neon-blue' : 'border-neon-yellow';
    const glowColor = isFalse
        ? 'shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_25px_rgba(255,0,255,0.5)]'
        : isTrue
            ? 'shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]'
            : 'shadow-[0_0_15px_rgba(255,230,0,0.3)] hover:shadow-[0_0_25px_rgba(255,230,0,0.5)]';

    const badgeClass = isFalse
        ? 'bg-neon-pink/20 text-neon-pink border-neon-pink hover:bg-neon-pink/30'
        : isTrue
            ? 'bg-neon-blue/20 text-neon-blue border-neon-blue hover:bg-neon-blue/30'
            : 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow hover:bg-neon-yellow/30';

    const accentColor = isFalse ? 'text-neon-pink' : isTrue ? 'text-neon-blue' : 'text-neon-yellow';
    const iconColor = isFalse ? 'text-neon-pink/70' : isTrue ? 'text-neon-blue/70' : 'text-neon-yellow/70';
    const lineColor = isFalse
        ? 'bg-gradient-to-r from-transparent via-neon-pink to-transparent'
        : isTrue
            ? 'bg-gradient-to-r from-transparent via-neon-blue to-transparent'
            : 'bg-gradient-to-r from-transparent via-neon-yellow to-transparent';

    // Get verdict icon
    const VerdictIcon = isFalse ? XCircle : isTrue ? Shield : AlertCircle;

    // Format date
    const formattedDate = report.timestamp
        ? new Date(report.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : 'No date';

    return (
        <Card
            className={cn(
                'flex flex-col h-full backdrop-blur-md border-white/10 transition-all duration-300 cursor-pointer overflow-hidden',
                'border-l-[6px]', borderColor, glowColor,
                'hover:-translate-y-2 hover:scale-[1.02]',
                'bg-gradient-to-br from-[#1a1d2d] via-[#1f2235] to-[#23273a]'
            )}
            onClick={() => onCardClick?.(report)}
        >
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3 pt-5 px-5'>
                <Badge
                    variant='outline'
                    className={cn(
                        'uppercase tracking-widest font-mono text-xs px-3 py-1.5 flex items-center gap-2 rounded-full',
                        badgeClass
                    )}
                >
                    <VerdictIcon className='w-3.5 h-3.5' />
                    {simpleVerdict}
                </Badge>
            </CardHeader>

            <CardContent className='flex-grow flex flex-col justify-between px-5 pb-5 pt-0'>
                {/* Main claim text */}
                <h3 className='font-bold leading-snug tracking-tight mb-4 text-gray-50 text-lg drop-shadow-md line-clamp-3'>
                    {claimText}
                </h3>

                {/* Accent line separator */}
                <div className={cn('h-[2px] mb-4 opacity-60', lineColor)} />

                {/* Metadata row with icons */}
                <div className='flex items-center justify-between text-xs font-mono mt-auto'>
                    <div className={cn('flex items-center gap-1.5', iconColor)}>
                        <Calendar className='w-3.5 h-3.5' />
                        <span className='text-gray-400'>{formattedDate}</span>
                    </div>
                    <div className={cn('flex items-center gap-1.5', iconColor)}>
                        <FileText className='w-3.5 h-3.5' />
                        <span className='text-gray-400'>
                            {report.analyzed_claims.length} claim{report.analyzed_claims.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
