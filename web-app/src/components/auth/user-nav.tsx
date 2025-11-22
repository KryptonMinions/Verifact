'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { signOut } from '@/app/auth/actions';

type UserNavProps = {
  user: User;
};

export function UserNav({ user }: UserNavProps) {
  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata.avatar_url} alt="User avatar" />
            <AvatarFallback className="bg-[#1a1d2d] text-blue-400 border border-blue-500/30">
              {getInitials(user.email ?? '??')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1a1d2d]/95 backdrop-blur-xl border-white/10 text-gray-200 shadow-[0_0_30px_rgba(0,0,0,0.5)]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.user_metadata.full_name ?? 'User'}
            </p>
            <p className="text-xs leading-none text-gray-400">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-blue-500/10 focus:text-blue-400 cursor-pointer transition-colors">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="focus:bg-red-500/10 focus:text-red-400 cursor-pointer transition-colors text-red-400/80"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
