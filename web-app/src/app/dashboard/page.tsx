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

  export default async function DashboardPage({
    searchParams,
  }: {
    searchParams: { id?: string; q?: string };
  }) {
    const cookieStore = cookies();
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
  
    const selectedId = searchParams.id ? parseInt(searchParams.id, 10) : history[0]?.id;
    const selectedAnalysis = history.find(item => item.id === selectedId);
  
    return (
      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">
            Dashboard
          </h1>
        </div>
  
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{history.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Total analyses performed
                    </p>
                </CardContent>
            </Card>
        </div>
  
  
        <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-3">
          <HistoryList history={history} selectedId={selectedId} />
          <div className="flex flex-col gap-6 md:col-span-2">
            {selectedAnalysis ? (
                <AnalysisReportWrapper analysis={selectedAnalysis} />
            ) : (
                <Card className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
                  <CardContent className="flex flex-col items-center justify-center">
                    <FileQuestion className="size-20" />
                    <h3 className="mt-4 text-xl font-semibold">
                      {user ? 'No Analysis Selected' : 'Please Log In'}
                    </h3>
                    <p className="mt-2 text-sm">
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
      </main>
    );
  }
