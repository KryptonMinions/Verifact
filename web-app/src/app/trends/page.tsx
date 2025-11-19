'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import TrendingCard from '@/components/dashboard/trending-card';

// Define the Trend type based on the expected data structure
type Trend = {
  id: string;
  topic_count: number;
  example_hash: string;
  report_summary: string; // This is a JSON string
};

// This page component is designed to replicate the layout and logic of trends.html
export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- THIS IS FIX #1 from trends.html ---
    // This variable MUST match the one used in the backend function.
    const appId = "default-app-id";
    
    // --- THIS IS FIX #2 from trends.html ---
    // The path is now hardcoded to use the correct appId.
    const collectionPath = `artifacts/${appId}/public/data/trending_topics`;
    console.log(`Listening for data at: ${collectionPath}`);

    const trendsQuery = query(
      collection(db, collectionPath),
      orderBy('topic_count', 'desc')
    );

    const unsubscribe = onSnapshot(
      trendsQuery,
      (snapshot) => {
        setLoading(false);
        if (snapshot.empty) {
          setError(`No trending topics found at path: ${collectionPath}. Check Firestore configuration and ensure the Genkit agent is running.`);
        } else {
          const trendsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trend));
          setTrends(trendsData);
          setError(null); // Clear error on successful fetch
        }
      },
      (err) => {
        console.error('Error listening to trends:', err);
        setError(`Error loading trends: ${err.message}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // This JSX structure mimics the body of trends.html
  return (
    <div className="container mx-auto max-w-3xl p-6 bg-gray-900 rounded-lg">
      <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Trending Topics</h1>
          <p className="text-lg text-gray-400">Real-time clusters of misinformation reports.</p>
      </header>

      <main id="trends-container">
        {loading ? (
          // Loading state from trends.html
          <div id="loading-spinner" className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-300">Loading trending topics from Firestore...</p>
          </div>
        ) : error ? (
          // Error state from trends.html
          <p className="text-red-400">{error}</p>
        ) : (
          // Display cards in a grid for a responsive layout
          <div className="grid grid-cols-1 gap-4">
            {trends.map(trend => <TrendingCard key={trend.id} trend={trend} />)}
          </div>
        )}
      </main>
    </div>
  );
}
