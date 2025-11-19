'use client';

import { Suspense } from 'react';
import { AnalysisReport } from './analysis-report';
import { Skeleton } from '../ui/skeleton';

export function AnalysisReportWrapper({ analysis }: { analysis: any }) {
    return (
        <Suspense fallback={<AnalysisReportSkeleton />}>
            <AnalysisReport analysis={analysis} />
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
