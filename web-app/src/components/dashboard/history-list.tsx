
'use client';

import { useState, useTransition, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileQuestion,
  History,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  ShieldQuestion,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Status = 'verified' | 'flagged' | 'unverifiable';

const statusIcons: Record<Status, React.ReactNode> = {
    verified: <CheckCircle2 className="text-green-500" />,
    flagged: <ShieldAlert className="text-red-500" />,
    unverifiable: <ShieldQuestion className="text-yellow-500" />,
};

const statusColors: Record<Status, string> = {
    verified: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400',
    flagged: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
    unverifiable: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
};

function getStatus(analysisDetails: any): Status {
    const tag = analysisDetails?.tag?.toLowerCase();
    if (tag === 'true') return 'verified';
    if (tag === 'false') return 'flagged';
    return 'unverifiable';
}

function getTitle(item: any) {
    if (item.text_input && item.text_input.length > 0) {
        return item.text_input.length > 50 ? `${item.text_input.substring(0, 50)}...` : item.text_input;
    }
    if (item.url_input) return item.url_input;
    return 'Image Analysis';
}

function getType(item: any): string {
    if (item.url_input && item.url_input.includes('youtube.com')) return 'Video';
    if (item.url_input) return 'URL';
    if (item.text_input) return 'Text';
    return 'Image';
}


export function HistoryList({ history, selectedId }: { history: any[]; selectedId: number | undefined }) {
  const [filters, setFilters] = useState({
    verified: true,
    flagged: true,
    unverifiable: true,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [query, pathname, router]);

  const filteredHistory = history.filter(item => {
    const status = getStatus(item.analysis_details);
    const passesFilter = filters[status];
    if (!passesFilter) return false;

    const passesSearch = query.length === 0 || 
                         getTitle(item).toLowerCase().includes(query.toLowerCase()) ||
                         (item.text_input && item.text_input.toLowerCase().includes(query.toLowerCase()));

    return passesSearch;
  });

  return (
    <div className="flex flex-col gap-6 md:col-span-1">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="history">
                <History />
                History
              </TabsTrigger>
            </TabsList>
            <div className="relative mt-4 flex items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.verified}
                    onCheckedChange={() => handleFilterChange('verified')}
                  >
                    Verified
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.flagged}
                    onCheckedChange={() => handleFilterChange('flagged')}
                  >
                    Flagged
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.unverifiable}
                    onCheckedChange={() => handleFilterChange('unverifiable')}
                  >
                    Unverifiable
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 overflow-auto">
          {filteredHistory.length > 0 ? (
            filteredHistory.map(item => {
              const status = getStatus(item.analysis_details);
              return (
                <Link
                  key={item.id}
                  href={`/dashboard?id=${item.id}`}
                  className={cn(
                    'flex flex-col gap-2 rounded-lg border p-4 text-left transition-all hover:shadow-md hover:-translate-y-1',
                    selectedId === item.id && 'border-primary bg-muted/50'
                  )}
                  scroll={false}
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn('w-fit capitalize', statusColors[status])}
                      variant="outline"
                    >
                      {statusIcons[status]}
                      {status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold">{getTitle(item)}</h3>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{getType(item)}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
              <FileQuestion className="size-16" />
              <h3 className="mt-4 text-lg font-semibold">No History Found</h3>
              <p className="mt-2 text-sm">
                No analysis history matches your current search or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}