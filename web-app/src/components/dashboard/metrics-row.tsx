'use client';

import { useEffect, useState } from 'react';

interface MetricsData {
    total_reports?: number;
    top_category?: string;
    last_updated?: string;
}

interface MetricsRowProps {
    data: MetricsData;
    status: 'connecting' | 'online' | 'error';
}

export function MetricsRow({ data, status }: MetricsRowProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Total Reports */}
            <div className="bg-[#1a1d2d] rounded-xl p-6 border border-gray-800 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-500/30">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Reports</h3>
                <div className="flex items-baseline mt-2">
                    <span className="text-4xl font-bold text-white">
                        {data.total_reports?.toLocaleString() || '--'}
                    </span>
                    <span className="ml-2 text-sm text-green-400 flex items-center">
                        <span className={`w-2 h-2 bg-green-500 rounded-full mr-1 ${status === 'online' ? 'animate-pulse' : ''}`}></span>
                        {status === 'online' ? 'Live' : status === 'connecting' ? 'Connecting...' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Card 2: Top Category */}
            <div className="bg-[#1a1d2d] rounded-xl p-6 border border-gray-800 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-500/30">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-16 h-16 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Top Category</h3>
                <div className="mt-2">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                        {data.top_category || '--'}
                    </span>
                </div>
            </div>

            {/* Card 3: System Status */}
            <div className="bg-[#1a1d2d] rounded-xl p-6 border border-gray-800 flex flex-col justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-500/30">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Last Sync</h3>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-sm font-medium text-gray-400">
                        {data.last_updated ? new Date(data.last_updated).toLocaleTimeString() : 'Waiting for update...'}
                    </span>
                </div>
            </div>
        </div>
    );
}
