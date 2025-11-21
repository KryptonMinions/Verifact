'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, ExternalLink, ChevronLeft } from 'lucide-react';
import type { ReverseImageSearchData } from '@/types';
import { cn } from '@/lib/utils';

type ReverseImageTimelineProps = {
    data: ReverseImageSearchData;
    onCollapse?: () => void;
};

export function ReverseImageTimeline({ data, onCollapse }: ReverseImageTimelineProps) {
    // Get the 5 oldest entries and sort them oldest-first
    const oldestLinks = [...data.matched_links]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Card className="flex h-full flex-col">
            {/* Sticky Header */}
            <CardHeader className="sticky top-0 z-10 bg-background border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <History className="size-5" />
                    Image Timeline
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Tracking where this image appeared online
                </p>
            </CardHeader>

            {/* Scrollable Content */}
            <CardContent className="flex-1 overflow-y-auto p-6">
                {/* Summary Section */}
                {data.summary && (
                    <div className="mb-6 rounded-lg bg-muted/50 p-4">
                        <h4 className="mb-2 font-semibold text-sm">Context Summary</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Timeline */}
                {oldestLinks.length > 0 ? (
                    <div className="space-y-1">
                        <h4 className="mb-4 font-semibold text-sm">
                            Earliest Appearances (oldest first)
                        </h4>
                        <div className="relative space-y-6 pl-6">
                            {/* Vertical timeline line */}
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

                            {oldestLinks.map((link, index) => (
                                <div key={index} className="relative">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-6 top-1 size-4 rounded-full border-2 border-primary bg-background" />

                                    {/* Timeline entry card */}
                                    <div className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
                                        <div className="mb-2 flex items-start justify-between gap-2">
                                            <span className="text-sm font-medium">
                                                {formatDate(link.date)}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                                {link.domain}
                                            </Badge>
                                        </div>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4"
                                        >
                                            <ExternalLink className="size-3 transition-transform group-hover:translate-x-0.5" />
                                            <span className="break-all">View Source</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <History className="mb-2 size-12 opacity-50" />
                        <p className="text-sm">No timeline data available</p>
                    </div>
                )}
            </CardContent>

            {/* Sticky Footer with Collapse Button */}
            {onCollapse && (
                <div className="sticky bottom-0 border-t bg-background p-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onCollapse}
                    >
                        <ChevronLeft className="size-4 mr-2" />
                        Show Analysis Form
                    </Button>
                </div>
            )}
        </Card>
    );
}
