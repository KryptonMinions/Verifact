import { ImageSearchView } from '@/components/dashboard/image-search-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Search | VeriFact',
    description: 'Reverse image search timeline analysis',
};

export default function ImageSearchPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Image Search</h2>
            </div>
            <ImageSearchView />
        </div>
    );
}
