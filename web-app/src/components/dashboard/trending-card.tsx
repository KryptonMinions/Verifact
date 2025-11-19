'use client';

import { cn } from '@/lib/utils';
import RawJsonView from './raw-json-view'; // Import the new component

// This component is designed to replicate the card from the trends.html example.
export default function TrendingCard({ trend }: { trend: any }) {

  let summary;
  let firstClaimText = "Could not parse report";
  let verdict = "N/A";

  try {
    if (typeof trend.report_summary !== 'string' || !trend.report_summary.trim()) {
        throw new Error("report_summary is not a string or is empty");
    }
    summary = JSON.parse(trend.report_summary);
    
    firstClaimText = summary.analyzed_claims?.[0]?.claim_text || "No claim text found";
    verdict = summary.verdict?.final_verdict || "N/A";
  } catch (e) {
    console.error("Failed to parse report_summary JSON:", e, "Data:", trend.report_summary);
    // Render a minimal card or an error state if parsing fails
    firstClaimText = "Error: Malformed report data.";
    summary = { error: "Could not parse summary", raw: trend.report_summary };
  }

  const getVerdictColor = (verdictStr: string) => {
    const lowerVerdict = verdictStr.toLowerCase();
    if (lowerVerdict.includes("false") || lowerVerdict.includes("misleading")) {
      return "text-red-400";
    }
    if (lowerVerdict.includes("true") || lowerVerdict.includes("accurate")) {
      return "text-green-400";
    }
    return "text-gray-400";
  };
  
  const verdictColor = getVerdictColor(verdict);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col h-full">
        <div class="flex justify-between items-start mb-3">
            <span className={cn("text-sm font-medium uppercase tracking-wider", verdictColor)}>
                {verdict}
            </span>
            <div className="text-right flex-shrink-0">
                <span className="text-xl font-bold text-blue-400">{trend.topic_count}</span>
                <span className="text-sm text-gray-400"> reports</span>
            </div>
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-4 flex-grow">{firstClaimText}</h2>
        
        <code className="text-xs text-gray-500">Example Hash: {trend.example_hash}</code>
        
        <details className="mt-4 group">
            <summary className="text-sm text-blue-400 cursor-pointer group-open:mb-2">
                Show Detailed Analysis
            </summary>
            {/* Replace the pre/code block with the new component */}
            <RawJsonView summary={summary} />
        </details>
    </div>
  );
}
