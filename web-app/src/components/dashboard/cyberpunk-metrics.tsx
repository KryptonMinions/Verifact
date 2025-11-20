import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Activity, FileText, TrendingUp } from 'lucide-react';

export function CyberpunkMetrics() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Active Threats - Neon Pink/Red */}
            <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-glass-gradient backdrop-blur-md shadow-[0_0_15px_rgba(255,0,255,0.15)] hover:shadow-[0_0_25px_rgba(255,0,255,0.3)] transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-pink shadow-[0_0_10px_#ff00ff]"></div>
                <div className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-300 tracking-wider uppercase">
                            Active Threats
                        </h3>
                        <Activity className="h-4 w-4 text-neon-pink drop-shadow-[0_0_5px_#ff00ff]" />
                    </div>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">12</div>
                        <p className="text-xs text-gray-400 mt-1">
                            <span className="text-neon-pink">+2</span> from last hour
                        </p>
                    </div>
                </div>
            </div>

            {/* Reports Today - Neon Blue */}
            <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-glass-gradient backdrop-blur-md shadow-[0_0_15px_rgba(0,243,255,0.15)] hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue shadow-[0_0_10px_#00f3ff]"></div>
                <div className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-300 tracking-wider uppercase">
                            Reports Today
                        </h3>
                        <FileText className="h-4 w-4 text-neon-blue drop-shadow-[0_0_5px_#00f3ff]" />
                    </div>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">1,240</div>
                        <p className="text-xs text-gray-400 mt-1">
                            <span className="text-neon-blue">+18%</span> from yesterday
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Category - Neon Yellow */}
            <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-glass-gradient backdrop-blur-md shadow-[0_0_15px_rgba(255,230,0,0.15)] hover:shadow-[0_0_25px_rgba(255,230,0,0.3)] transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-yellow shadow-[0_0_10px_#ffe600]"></div>
                <div className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-300 tracking-wider uppercase">
                            Top Category
                        </h3>
                        <TrendingUp className="h-4 w-4 text-neon-yellow drop-shadow-[0_0_5px_#ffe600]" />
                    </div>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Politics</div>
                        <p className="text-xs text-gray-400 mt-1">
                            45% of all reports
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

