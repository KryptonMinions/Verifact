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
                "flex h-14 items-center justify-end border-b px-6 transition-colors duration-300",
                isTrendsPage
                    ? "bg-glass-gradient backdrop-blur-xl border-white/10 text-gray-100"
                    : "bg-background border-border"
            )}
        >
            {user ? (
                <UserNav user={user} />
            ) : (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={isTrendsPage ? "ghost" : "ghost"}
                            className={cn(
                                isTrendsPage && "text-gray-300 hover:text-white hover:bg-white/10"
                            )}
                        >
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
    );
}
