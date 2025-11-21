'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FileAudio, FileVideo, File as FileIcon } from 'lucide-react';

type FilePreviewProps = {
    file: File;
};

export function FilePreview({ file }: FilePreviewProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'audio' | 'video' | 'other'>('other');

    useEffect(() => {
        // Determine file type
        if (file.type.startsWith('image/')) {
            setFileType('image');
        } else if (file.type.startsWith('audio/')) {
            setFileType('audio');
        } else if (file.type.startsWith('video/')) {
            setFileType('video');
        } else {
            setFileType('other');
        }

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Cleanup
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [file]);

    if (!preview) {
        return null;
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="w-full space-y-2">
            {/* Preview Area */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
                {fileType === 'image' && (
                    <Image src={preview} alt="Image preview" fill className="object-contain" />
                )}

                {fileType === 'audio' && (
                    <div className="flex h-full flex-col items-center justify-center p-4">
                        <FileAudio className="h-16 w-16 text-muted-foreground mb-4" />
                        <audio controls className="w-full max-w-md">
                            <source src={preview} type={file.type} />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}

                {fileType === 'video' && (
                    <video controls className="h-full w-full object-contain">
                        <source src={preview} type={file.type} />
                        Your browser does not support the video element.
                    </video>
                )}

                {fileType === 'other' && (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                        <FileIcon className="h-16 w-16" />
                        <p className="mt-2 text-sm">File preview not available</p>
                    </div>
                )}
            </div>

            {/* File Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span className="truncate max-w-[70%]" title={file.name}>
                    {file.name}
                </span>
                <span>{formatFileSize(file.size)}</span>
            </div>
        </div>
    );
}
