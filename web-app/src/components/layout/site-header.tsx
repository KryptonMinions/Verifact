'use client';

import { usePathname } from 'next/navigation';
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
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
    user: any;
}

export function SiteHeader({ user }: SiteHeaderProps) {
    const pathname = usePathname();
    const isTrendsPage = pathname?.startsWith('/trends');

    return (
        <header
            className={cn(
                "flex h-14 items-center justify-end border-b px-6 transition-all duration-300",
                isTrendsPage
                    ? "bg-[#050505] backdrop-blur-xl border-neon-blue/30 text-gray-100 shadow-[0_1px_20px_rgba(0,243,255,0.15)]"
                    : "bg-background border-border"
            )}
        >
            {user ? (
                <UserNav user={user} />
            ) : (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                isTrendsPage && "text-neon-blue hover:text-white hover:bg-neon-blue/10 border border-neon-blue/30 hover:border-neon-blue/60 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all duration-300 font-mono tracking-wider"
                            )}
                        >
                            {isTrendsPage ? "LOGIN" : "Login"}
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
    );
}
