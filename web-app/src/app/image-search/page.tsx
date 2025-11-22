import { ImageSearchView } from '@/components/dashboard/image-search-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Search | VeriFact',
    description: 'Reverse image search timeline analysis',
};

export default function ImageSearchPage() {
    return (
        <main className="min-h-screen bg-[#0f111a] text-gray-300 p-4 md:p-8 font-sans selection:bg-pink-500 selection:text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#3b82f615,transparent)] pointer-events-none"></div>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 relative z-10">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Image Search</h2>
                </div>
                <ImageSearchView />
            </div>
        </main>
    );
}
