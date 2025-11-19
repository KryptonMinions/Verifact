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
import { LayoutDashboard, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { UserNav } from '@/components/auth/user-nav';
import { LoginDialog } from '@/components/auth/login-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const metadata: Metadata = {
    title: 'VeriFact',
    description: 'AI-powered misinformation detection and content analysis.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            <header className="flex h-14 items-center justify-end border-b bg-background px-6">
            {user ? (
                <UserNav user={user} />
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 max-w-md">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle>Account Access</DialogTitle>
                      <DialogDescription>
                        Sign in or create an account to access your dashboard and save analysis history.
                      </DialogDescription>
                    </DialogHeader>
                    <LoginDialog />
                  </DialogContent>
                </Dialog>
              )}
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
