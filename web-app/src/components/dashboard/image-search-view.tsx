'use client';

import { useActionState, useState, useEffect } from 'react';
import { handleImageSearch } from '@/app/actions';
import { FileUpload } from '@/components/dashboard/file-upload';
import { ReverseImageTimeline } from '@/components/dashboard/reverse-image-timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ImageSearchView() {
    const [state, formAction, isPending] = useActionState(handleImageSearch, {
        result: null,
        error: null,
    });

    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.error) {
            toast({
                variant: 'destructive',
                title: 'Search Error',
                description: state.error,
            });
        }
    }, [state, toast]);

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="w-full space-y-6">
                <Card className="bg-[#1a1d2d] border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-blue-400" />
                            Reverse Image Search
                        </CardTitle>
                        <CardDescription>
                            Upload an image to find its timeline of appearances across the web.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Upload Image
                                </label>
                                <FileUpload
                                    file={file}
                                    setFile={setFile}
                                    name="media"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Supported formats: JPG, PNG, WEBP. Max size: 10MB.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={!file || isPending}
                                className="w-full"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    'Search Timeline'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>How it works</AlertTitle>
                    <AlertDescription className="text-xs mt-1">
                        This tool searches for previous appearances of your image to help verify its origin and context.
                        Results are sorted chronologically to show the earliest known sources.
                    </AlertDescription>
                </Alert>
            </div>

            <div className="w-full">
                {state.result ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            Search Results
                        </h3>
                        <ReverseImageTimeline data={state.result} />
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-8 text-center animate-in fade-in duration-500">
                        <div className="bg-muted/20 p-4 rounded-full mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No results yet</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-2">
                            Upload an image and start a search to see the timeline of appearances here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
