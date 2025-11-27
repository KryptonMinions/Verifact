'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Shield, XCircle, AlertCircle, ExternalLink, BarChart3, Globe } from 'lucide-react';

interface TrendingCardProps {
  trend: any;
  onCardClick?: (trend: any) => void;
}

export default function TrendingCard({ trend, onCardClick }: TrendingCardProps) {
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

    // Prioritize explicit source field, then fallback to evidence URL hostname
    if (summary.source) {
      source = summary.source;
    } else if (firstEvidence?.source) {
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

  // Premium Balance styling (matching report-card.tsx)
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

  const iconColor = isFalse ? 'text-neon-pink/70' : isTrue ? 'text-neon-blue/70' : 'text-neon-yellow/70';
  const lineColor = isFalse
    ? 'bg-gradient-to-r from-transparent via-neon-pink to-transparent'
    : isTrue
      ? 'bg-gradient-to-r from-transparent via-neon-blue to-transparent'
      : 'bg-gradient-to-r from-transparent via-neon-yellow to-transparent';

  // Get verdict icon
  const VerdictIcon = isFalse ? XCircle : isTrue ? Shield : AlertCircle;

  return (
    <Card
      className={cn(
        'flex flex-col h-full backdrop-blur-md border-white/10 transition-all duration-300 cursor-pointer overflow-hidden',
        'border-l-[6px]', borderColor, glowColor,
        'hover:-translate-y-2 hover:scale-[1.02]',
        'bg-gradient-to-br from-[#1a1d2d] via-[#1f2235] to-[#23273a]'
      )}
      onClick={() => onCardClick?.(trend)}
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
          {verdict}
        </Badge>
      </CardHeader>

      <CardContent className='flex-grow flex flex-col justify-between px-5 pb-5 pt-0'>
        {/* Main claim text */}
        <h3 className='font-bold leading-snug tracking-tight mb-4 text-gray-50 text-lg drop-shadow-md line-clamp-3'>
          {firstClaimText}
        </h3>

        {/* Accent line separator */}
        <div className={cn('h-[2px] mb-4 opacity-60', lineColor)} />

        {/* Metadata row with icons */}
        <div className='flex items-center justify-between gap-3 text-xs font-mono mt-auto'>
          <div className={cn('flex items-center gap-1.5 min-w-0 flex-1', iconColor)}>
            {summary?.source ? <Globe className='w-3.5 h-3.5 flex-shrink-0' /> : <ExternalLink className='w-3.5 h-3.5 flex-shrink-0' />}
            <span className='text-gray-400 truncate' title={source}>{source}</span>
          </div>
          <div className={cn('flex items-center gap-1.5', iconColor)}>
            <BarChart3 className='w-3.5 h-3.5' />
            <span className='text-gray-400'>
              {trend.topic_count} report{trend.topic_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
