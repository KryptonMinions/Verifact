'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit, getFirestore, doc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { db as defaultDb } from '@/lib/firebase/client';
import TrendingCard from '@/components/dashboard/trending-card';
import { TrendsChart } from '@/components/dashboard/trends-chart';
import { MetricsRow } from '@/components/dashboard/metrics-row';
import { TrendingCardModal } from '@/components/dashboard/trending-card-modal';

export default function TrendsPage() {
  // State for the top dashboard section (from 'misinfo-reports' DB)
  const [dashboardData, setDashboardData] = useState<any>({});
  const [status, setStatus] = useState<'connecting' | 'online' | 'error'>('connecting');

  // State for the bottom grid (from default DB)
  const [trends, setTrends] = useState<any[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [expandedCard, setExpandedCard] = useState<any | null>(null);

  // 1. Connect to 'misinfo-reports' database for Dashboard Stats
  useEffect(() => {
    let unsubscribe: () => void;

    try {
      const app = getApp();
      const misinfoDb = getFirestore(app, "misinfo-reports");
      const docRef = doc(misinfoDb, "app_metadata", "dashboard_stats");

      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setDashboardData(docSnap.data());
          setStatus('online');
        } else {
          console.log("Waiting for dashboard stats...");
          setStatus('connecting');
        }
      }, (error) => {
        console.error("Dashboard Stats Error:", error);
        setStatus('error');
      });
    } catch (e) {
      console.error("Error connecting to misinfo-reports DB:", e);
      setStatus('error');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 2. Connect to default database for Trending Topics Grid
  useEffect(() => {
    const appId = "default-app-id";
    const collectionPath = `artifacts/${appId}/public/data/trending_topics`;

    const q = query(
      collection(defaultDb, collectionPath),
      orderBy('topic_count', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trendsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrends(trendsData);
      setLoadingTrends(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-300 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Topic Trends</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time frequency of reported misinformation topics</p>
          </div>
          <div className="text-xs text-gray-600 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
            <span className={status === 'online' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-gray-400'}>
              {status === 'online' ? 'Live' : status === 'error' ? 'Error' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Metrics Row */}
        <MetricsRow data={dashboardData} status={status} />

        {/* Chart Section */}
        <TrendsChart chartData={dashboardData.chart_data} />

        {/* Trending Grid Section (Kept from original) */}
        <section className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              Detected Anomalies
            </h2>
            <span className="text-sm font-mono text-gray-500">
              {trends.length} ACTIVE VECTORS
            </span>
          </div>

          {loadingTrends ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-[#1a1d2d] animate-pulse border border-gray-800"></div>
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
