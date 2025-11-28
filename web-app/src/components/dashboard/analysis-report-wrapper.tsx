'use client';

import { Suspense } from 'react';
import { AnalysisResults } from './analysis-results';
import { ReverseImageTimeline } from './reverse-image-timeline';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AnalysisReportWrapper({ analysis }: { analysis: any }) {
    const { analysis_details } = analysis;
    const { reverse_image_search_data } = analysis_details;

    return (
        <Suspense fallback={<AnalysisReportSkeleton />}>
            <ScrollArea className="h-full pr-4">
                <div className="space-y-8">
                    <AnalysisResults result={analysis_details} reportId={analysis.id} />

                    {reverse_image_search_data && (
                        <div className="rounded-xl border border-white/10 bg-[#1a1d2d]/50 p-6 backdrop-blur-sm">
                            <h3 className="mb-6 text-xl font-semibold text-white">
                                Image Timeline
                            </h3>
                            <ReverseImageTimeline
                                data={reverse_image_search_data}
                                onCollapse={undefined}
                            />
                        </div>
                    )}
                </div>
            </ScrollArea>
        </Suspense>
    )
}

function AnalysisReportSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="border rounded-lg p-4 space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="border rounded-lg p-4 space-y-3">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="mt-2 space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="ml-6 space-y-2">
                                    <Skeleton className="h-5 w-1/3" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
