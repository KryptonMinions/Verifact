'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { ShareModal } from './share-modal';

type ShareButtonProps = {
    result: AnalysisResult;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
};

export function ShareButton({
    result,
    variant = 'outline',
    size = 'default',
    className = ''
}: ShareButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                variant={variant}
                size={size}
                className={`gap-2 ${className}`}
            >
                <Share2 className="h-4 w-4" />
                Share
            </Button>

            <ShareModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                result={result}
            />
        </>
    );
}
