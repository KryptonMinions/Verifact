import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { LayoutDashboard, Search, TrendingUp, History } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/components/layout/site-header';

export const metadata: Metadata = {
  title: 'VeriFact',
  description: 'AI-powered misinformation detection and content analysis.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (error) {
    console.warn('Supabase not configured, running without authentication');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <Logo className="size-7 shrink-0" />
                <div>
                  <span className="text-lg font-semibold">VeriFact</span>
                  <p className="text-xs text-sidebar-foreground/70">
                    AI Detection Platform
                  </p>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Search />
                      Analyze
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/image-search">
                      <History />
                      Image Search
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/trends">
                      <TrendingUp />
                      Trends
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className="text-xs text-sidebar-foreground/70">
                © 2025 VeriFact. All rights reserved.
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <SiteHeader user={user} />
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
