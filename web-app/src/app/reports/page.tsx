'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, limit, getFirestore } from 'firebase/firestore';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import ReportCard from '@/components/reports/report-card';
import { ReportModal } from '@/components/reports/report-modal';
import { Report } from '@/types';
import { Search } from 'lucide-react';

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDrsPtoPLHmRDfPQZ3xlmrwBFzXP9DXr5M',
    authDomain: 'agent-builder-472216.firebaseapp.com',
    projectId: 'agent-builder-472216',
    storageBucket: 'agent-builder-472216.firebasestorage.app',
    messagingSenderId: '737726244243',
    appId: '1:737726244243:web:61570da297404124113466',
    measurementId: 'G-8HHL64ZF8H',
};

export default function ReportsPage() {
    const [allReports, setAllReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'connecting' | 'online' | 'error'>('connecting');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedReport, setExpandedReport] = useState<Report | null>(null);

    // Connect to Firestore and fetch reports
    useEffect(() => {
        let unsubscribe: () => void;

        const initFirebase = async () => {
            try {
                // Initialize Firebase if not already initialized
                const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
                const auth = getAuth(app);
                const misinfoDb = getFirestore(app, 'misinfo-reports');

                // Authenticate anonymously
                try {
                    await signInAnonymously(auth);
                } catch (authError) {
                    console.warn('Anonymous sign-in failed:', authError);
                }

                // Set up Firestore listener
                const q = query(collection(misinfoDb, 'misinfo_reports'), limit(200));

                unsubscribe = onSnapshot(
                    q,
                    (snapshot) => {
                        const reportsData: Report[] = [];
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.analyzed_claims && Array.isArray(data.analyzed_claims)) {
                                reportsData.push({
                                    id: doc.id,
                                    timestamp: data.timestamp || null,
                                    analyzed_claims: data.analyzed_claims,
                                });
                            }
                        });
                        setAllReports(reportsData);
                        setFilteredReports(reportsData);
                        setLoading(false);
                        setStatus('online');
                    },
                    (error) => {
                        console.error('Error fetching reports:', error);
                        setStatus('error');
                        setLoading(false);
                    }
                );
            } catch (e) {
                console.error('Error initializing Firebase:', e);
                setStatus('error');
                setLoading(false);
            }
        };

        initFirebase();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // Handle search filtering
    useEffect(() => {
        if (!searchTerm) {
            setFilteredReports(allReports);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = allReports.filter((report) =>
            report.analyzed_claims.some(
                (claim) =>
                    claim.claim_text?.toLowerCase().includes(term) ||
                    claim.conclusion?.toLowerCase().includes(term)
            )
        );
        setFilteredReports(filtered);
    }, [searchTerm, allReports]);

    return (
        <div className='min-h-screen bg-[#0f111a] text-gray-300 p-6 font-sans'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='flex justify-between items-end border-b border-gray-800 pb-4'>
                    <div className='mb-8'>
                        <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-neon-blue via-purple-400 to-neon-pink bg-clip-text text-transparent'>
                            VeriFact Report Vault
                        </h1>
                        <p className='text-gray-400'>Browse and search through analyzed misinformation reports</p>
                    </div>
                    <div className='text-xs text-gray-600 flex items-center gap-2'>
                        <span
                            className={`w-2 h-2 rounded-full ${status === 'online'
                                ? 'bg-green-500 animate-pulse'
                                : status === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                                }`}
                        />
                        <span
                            className={
                                status === 'online'
                                    ? 'text-green-400'
                                    : status === 'error'
                                        ? 'text-red-400'
                                        : 'text-gray-400'
                            }
                        >
                            {status === 'online' ? 'Live' : status === 'error' ? 'Error' : 'Connecting...'}
                        </span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className='neon-border rounded-lg bg-[#1a1d2d] flex items-center p-3 transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.4)] focus-within:border-[rgba(59,130,246,0.6)]'>
                    <Search className='w-6 h-6 text-gray-500 ml-2' />
                    <input
                        type='text'
                        placeholder='Search claims, fact checks, or keywords...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full bg-transparent border-none text-white focus:ring-0 ml-3 placeholder-gray-600 text-lg outline-none'
                    />
                </div>

                {/* Result Count */}
                <div className='flex justify-between text-sm text-gray-500'>
                    <span>{filteredReports.length} reports found</span>
                    <span>Live Data from Firestore</span>
                </div>

                {/* Reports Grid */}
                {loading ? (
                    <div className='text-center py-20 text-gray-600 animate-pulse'>
                        Loading reports...
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className='text-center py-10 text-gray-600'>
                        {searchTerm ? 'No reports match your search.' : 'No reports available.'}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredReports.map((report) => (
                            <ReportCard
                                key={report.id}
                                report={report}
                                onCardClick={(report) => setExpandedReport(report)}
                            />
                        ))}
                    </div>
                )}

                {/* Report Modal */}
                {expandedReport && (
                    <ReportModal
                        report={expandedReport}
                        onClose={() => setExpandedReport(null)}
                    />
                )}
            </div>

            <style jsx>{`
        .neon-border {
          box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
      `}</style>
        </div>
    );
}
