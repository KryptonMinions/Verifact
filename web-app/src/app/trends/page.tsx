'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import TrendingCard from '@/components/dashboard/trending-card';
import { TrendsChart } from '@/components/dashboard/trends-chart';
import { CyberpunkMetrics } from '@/components/dashboard/cyberpunk-metrics';
import { TrendingCardModal } from '@/components/dashboard/trending-card-modal';

export default function TrendsPage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<any | null>(null);

  useEffect(() => {
    const appId = "default-app-id";
    const collectionPath = `artifacts/${appId}/public/data/trending_topics`;

    const q = query(
      collection(db, collectionPath),
      orderBy('topic_count', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trendsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrends(trendsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-8 font-sans selection:bg-neon-pink selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              GLOBAL <span className="text-neon-blue">MISINFO</span> TRENDS
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl text-lg">
              Real-time analysis of high-velocity misinformation vectors across the web.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#00ff00]"></div>
            <span className="text-xs font-mono text-green-400 tracking-widest uppercase">System Online</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Chart & Metrics */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <TrendsChart />
            </section>
            <section>
              <CyberpunkMetrics />
            </section>
          </div>

          {/* Right Column: Could add a sidebar here later */}
        </div>

        {/* Trending Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <span className="w-1 h-8 bg-neon-pink shadow-[0_0_10px_#ff00ff]"></span>
              DETECTED ANOMALIES
            </h2>
            <span className="text-sm font-mono text-gray-500">
              {trends.length} ACTIVE VECTORS
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map((trend) => (
                <TrendingCard
                  key={trend.id}
                  trend={trend}
                  onCardClick={(trend) => setExpandedCard(trend)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Expanded Card Modal */}
        {expandedCard && (
          <TrendingCardModal
            trend={expandedCard}
            onClose={() => setExpandedCard(null)}
          />
        )}

      </div>
    </div>
  );
}
