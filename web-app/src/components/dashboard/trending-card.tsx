'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Cyberpunk styling logic
  const borderColor = isFalse ? 'border-neon-pink' : isTrue ? 'border-neon-blue' : 'border-neon-yellow';
  const glowColor = isFalse ? 'shadow-[0_0_10px_rgba(255,0,255,0.2)]' : isTrue ? 'shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'shadow-[0_0_10px_rgba(255,230,0,0.2)]';
  const badgeClass = isFalse
    ? 'bg-neon-pink/10 text-neon-pink border-neon-pink/50 hover:bg-neon-pink/20'
    : isTrue
      ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/50 hover:bg-neon-blue/20'
      : 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/50 hover:bg-neon-yellow/20';

  return (
    <Card
      className={cn(
        "flex flex-col h-full bg-glass-gradient backdrop-blur-md border-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer",
        "border-l-4", borderColor, glowColor
      )}
      onClick={() => onCardClick?.(trend)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <Badge variant="outline" className={cn("uppercase tracking-widest font-mono text-[10px]", badgeClass)}>
          {verdict}
        </Badge>
        <span className="text-xs font-mono text-gray-400">
          #{trend.example_hash.substring(0, 6)}
        </span>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="font-semibold leading-tight tracking-tight mb-3 text-gray-100 text-lg drop-shadow-md">
          {firstClaimText}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> {source}
          </span>
          <span className="text-gray-500">{trend.topic_count} reports</span>
        </div>
      </CardContent>
    </Card>
  );
}
