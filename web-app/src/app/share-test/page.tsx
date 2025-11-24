import type { AnalysisResult } from '@/types';
import { ShareButton } from '@/components/dashboard/share-button';

// Mock analysis result for testing
const mockResult: AnalysisResult = {
    tag: 'Mostly False',
    overall_summary: 'The claim that chocolate cures all illnesses is not supported by scientific evidence. While dark chocolate has some health benefits, it cannot reverse aging or eliminate diseases.',
    analyzed_claims: [
        {
            claim_text: 'Daily consumption of dark chocolate can reverse aging',
            conclusion: 'False - No scientific evidence supports this claim',
            supporting_evidence: [],
            opposing_evidence: [
                {
                    summary: 'Multiple studies show that while dark chocolate contains antioxidants, there is no evidence it reverses aging.',
                    source: 'https://example.com/study1'
                }
            ],
            fact_checking_results: []
        }
    ]
};

export default function ShareTestPage() {
    return (
        <div className="min-h-screen bg-[#0f1117] p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <h1 className="text-3xl font-bold text-white">Share Feature Test</h1>

                <div className="rounded-lg border border-blue-500/20 bg-[#1a1d2d] p-6 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <h2 className="mb-4 text-xl font-semibold text-white">Mock Analysis Result</h2>

                    <div className="mb-4 space-y-2 text-gray-300">
                        <p><strong>Tag:</strong> {mockResult.tag}</p>
                        <p><strong>Summary:</strong> {mockResult.overall_summary}</p>
                    </div>

                    <div className="flex justify-center">
                        <ShareButton result={mockResult} size="lg" />
                    </div>
                </div>

                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                    <h3 className="mb-2 font-semibold text-yellow-200">Testing Instructions:</h3>
                    <ol className="list-decimal space-y-2 pl-5 text-sm text-yellow-200/90">
                        <li>Click the &quot;Share&quot; button above</li>
                        <li>Verify the share modal opens with all platform options</li>
                        <li>Check that the disclaimer/warning is visible</li>
                        <li>Test the editable text preview</li>
                        <li>Try clicking each platform icon (opens in new window)</li>
                        <li>Test the &quot;Copy Text&quot; button</li>
                        <li>If on mobile/modern browser, test the &quot;Share via...&quot; native option</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
