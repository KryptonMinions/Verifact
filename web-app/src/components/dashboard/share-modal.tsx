'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    generateShareText,
    generateShareTitle,
    shareToX,
    shareToReddit,
    shareToLinkedIn,
    shareToWhatsApp,
    shareToTelegram,
    shareViaEmail,
    shareViaWebAPI,
    canUseWebShare,
    copyToClipboard,
} from '@/lib/share-utils';
import {
    Share2,
    Copy,
    Check,
    MessageCircle,
    Send,
    Mail,
    Linkedin,
    AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ShareModalProps = {
    isOpen: boolean;
    onClose: () => void;
    result: AnalysisResult;
};

export function ShareModal({ isOpen, onClose, result }: ShareModalProps) {
    const [shareText, setShareText] = useState(() => generateShareText(result));
    const [copied, setCopied] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    const handleCopy = async () => {
        const success = await copyToClipboard(shareText);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = (platform: string) => {
        const title = generateShareTitle(result);
        const url = process.env.NEXT_PUBLIC_SITE_URL;

        switch (platform) {
            case 'native':
                shareViaWebAPI(title, shareText, url).catch(console.error);
                break;
            case 'x':
                shareToX(shareText, url);
                break;
            case 'reddit':
                shareToReddit(title, shareText, url);
                break;
            case 'linkedin':
                if (url) shareToLinkedIn(url);
                break;
            case 'whatsapp':
                shareToWhatsApp(shareText);
                break;
            case 'telegram':
                shareToTelegram(shareText, url);
                break;
            case 'email':
                shareViaEmail(title, shareText);
                break;
        }
    };

    const platforms = [
        {
            id: 'x',
            name: 'X (Twitter)',
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            color: 'hover:bg-black/80 hover:text-white',
        },
        {
            id: 'reddit',
            name: 'Reddit',
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
            ),
            color: 'hover:bg-[#FF4500] hover:text-white',
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: <Linkedin className="h-5 w-5" />,
            color: 'hover:bg-[#0077B5] hover:text-white',
        },
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: <MessageCircle className="h-5 w-5" />,
            color: 'hover:bg-[#25D366] hover:text-white',
        },
        {
            id: 'telegram',
            name: 'Telegram',
            icon: <Send className="h-5 w-5" />,
            color: 'hover:bg-[#0088cc] hover:text-white',
        },
        {
            id: 'email',
            name: 'Email',
            icon: <Mail className="h-5 w-5" />,
            color: 'hover:bg-gray-600 hover:text-white',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-[#1a1d2d] border-blue-500/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Share2 className="h-5 w-5 text-blue-400" />
                        Share Fact-Check Report
                    </DialogTitle>
                    <DialogDescription>
                        Share this fact-check with your network to help combat misinformation
                    </DialogDescription>
                </DialogHeader>

                {showDisclaimer && (
                    <Alert className="border-yellow-500/30 bg-yellow-500/10">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <AlertDescription className="text-sm text-yellow-200/90">
                            <strong>Important:</strong> Please ensure the context is clear when sharing.
                            Include the full fact-check result to avoid spreading misinformation.
                            All shared content includes &quot;Fact-checked by Verifact&quot; branding.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Preview & Edit Share Text
                        </label>
                        <Textarea
                            value={shareText}
                            onChange={(e) => setShareText(e.target.value)}
                            className="min-h-32 text-sm"
                            placeholder="Edit the share text..."
                        />
                    </div>

                    {canUseWebShare() && (
                        <Button
                            onClick={() => handleShare('native')}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share via...
                        </Button>
                    )}

                    <div>
                        <p className="mb-3 text-sm font-medium">Or share to:</p>
                        <div className="grid grid-cols-2 gap-3">
                            {platforms.map((platform) => (
                                <Button
                                    key={platform.id}
                                    onClick={() => handleShare(platform.id)}
                                    variant="outline"
                                    className={cn(
                                        'justify-start gap-2 border-gray-700 bg-[#252837] transition-all',
                                        platform.color
                                    )}
                                >
                                    {platform.icon}
                                    {platform.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-row justify-between">
                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="gap-2 border-gray-700 bg-[#252837]"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-green-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copy Text
                            </>
                        )}
                    </Button>
                    <Button onClick={onClose} variant="ghost">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
