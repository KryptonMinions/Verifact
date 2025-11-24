import type { AnalysisResult } from '@/types';

/**
 * Generates share text from an analysis result
 * @param result The analysis result to format
 * @param includeLink Whether to include a link back to Verifact
 * @returns Formatted share text
 */
export function generateShareText(result: AnalysisResult, includeLink: boolean = true): string {
    const { tag, overall_summary } = result;

    // Create emoji based on tag
    let emoji = '🔍';
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('false') || lowerTag.includes('misinformation')) {
        emoji = '❌';
    } else if (lowerTag.includes('true') || lowerTag.includes('verified')) {
        emoji = '✅';
    } else if (lowerTag.includes('misleading') || lowerTag.includes('context')) {
        emoji = '⚠️';
    }

    // Truncate summary if too long (keeping room for metadata)
    const maxSummaryLength = 200;
    const truncatedSummary = overall_summary.length > maxSummaryLength
        ? overall_summary.substring(0, maxSummaryLength) + '...'
        : overall_summary;

    let shareText = `${emoji} Fact-Check Result: ${tag}\n\n${truncatedSummary}\n\n`;

    if (includeLink) {
        // TODO: Update with actual deployed URL or make configurable
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verifact.app';
        shareText += `\n📊 Fact-checked by Verifact\n${siteUrl}`;
    } else {
        shareText += '\n📊 Fact-checked by Verifact';
    }

    return shareText;
}

/**
 * Generates a short title for sharing
 */
export function generateShareTitle(result: AnalysisResult): string {
    return `Fact-Check: ${result.tag}`;
}

/**
 * Checks if the Web Share API is supported
 */
export function canUseWebShare(): boolean {
    return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Shares content using the native Web Share API
 */
export async function shareViaWebAPI(title: string, text: string, url?: string): Promise<void> {
    if (!canUseWebShare()) {
        throw new Error('Web Share API is not supported');
    }

    const shareData: ShareData = {
        title,
        text,
    };

    if (url) {
        shareData.url = url;
    }

    try {
        await navigator.share(shareData);
    } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
            console.error('Error sharing:', error);
            throw error;
        }
    }
}

/**
 * Shares to X (Twitter)
 */
export function shareToX(text: string, url?: string): void {
    const tweetText = url ? `${text}\n${url}` : text;
    const encodedText = encodeURIComponent(tweetText);
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
}

/**
 * Shares to Reddit
 */
export function shareToReddit(title: string, text: string, url?: string): void {
    const params = new URLSearchParams();
    params.append('title', title);

    if (url) {
        params.append('url', url);
    } else {
        params.append('text', text);
    }

    const shareUrl = `https://reddit.com/submit?${params.toString()}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=700,height=600');
}

/**
 * Shares to LinkedIn
 */
export function shareToLinkedIn(url: string): void {
    const params = new URLSearchParams();
    params.append('url', url);

    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=550,height=550');
}

/**
 * Shares to WhatsApp
 */
export function shareToWhatsApp(text: string): void {
    const encodedText = encodeURIComponent(text);

    // Use web.whatsapp.com for desktop, whatsapp:// will work on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const shareUrl = isMobile
        ? `whatsapp://send?text=${encodedText}`
        : `https://web.whatsapp.com/send?text=${encodedText}`;

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Shares to Telegram
 */
export function shareToTelegram(text: string, url?: string): void {
    const params = new URLSearchParams();
    params.append('text', text);

    if (url) {
        params.append('url', url);
    }

    const shareUrl = `https://t.me/share/url?${params.toString()}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Shares via Email
 */
export function shareViaEmail(subject: string, body: string): void {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                textArea.remove();
                return true;
            } catch (error) {
                console.error('Fallback: Could not copy text', error);
                textArea.remove();
                return false;
            }
        }
    } catch (error) {
        console.error('Could not copy text: ', error);
        return false;
    }
}
