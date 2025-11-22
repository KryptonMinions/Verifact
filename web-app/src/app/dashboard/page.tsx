import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileQuestion,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { HistoryList } from '@/components/dashboard/history-list';
import { AnalysisReportWrapper } from '@/components/dashboard/analysis-report-wrapper';

import { DashboardAnimationWrapper, DashboardItem } from '@/components/dashboard/dashboard-animations';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; q?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  let history = [];
  if (user) {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      history = data;
    }
  }

  const { id } = await searchParams;
  const selectedId = id ? parseInt(id, 10) : history[0]?.id;
  const selectedAnalysis = history.find(item => item.id === selectedId);

  return (
    <main className="min-h-screen bg-[#0f111a] text-gray-300 p-4 md:p-8 font-sans selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#3b82f615,transparent)] pointer-events-none"></div>

      <DashboardAnimationWrapper className="mx-auto w-full max-w-7xl relative z-10 space-y-8">
        <DashboardItem>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h1 className="font-headline text-3xl font-bold md:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Dashboard
            </h1>
          </div>
        </DashboardItem>

        <DashboardItem>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-[#1a1d2d] border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{history.length}</div>
                <p className="text-xs text-gray-500">
                  Total analyses performed
                </p>
              </CardContent>
            </Card>
          </div>
        </DashboardItem>

        <DashboardItem>
          <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-[#1a1d2d]/50 backdrop-blur-sm rounded-xl border border-white/5 p-4">
              <HistoryList history={history} selectedId={selectedId} />
            </div>
            <div className="flex flex-col gap-6 md:col-span-2">
              {selectedAnalysis ? (
                <AnalysisReportWrapper analysis={selectedAnalysis} />
              ) : (
                <Card className="flex flex-1 flex-col items-center justify-center text-center text-gray-500 bg-[#1a1d2d] border-white/5 min-h-[400px]">
                  <CardContent className="flex flex-col items-center justify-center">
                    <FileQuestion className="size-20 opacity-50 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300">
                      {user ? 'No Analysis Selected' : 'Please Log In'}
                    </h3>
                    <p className="mt-2 text-sm max-w-xs mx-auto">
                      {user
                        ? 'Select an item from the history list to view its report.'
                        : 'Log in to view your analysis history and reports.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </DashboardItem>
      </DashboardAnimationWrapper>
    </main>
  );
}
