'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { UnifiedAuthForm } from './unified-auth-form';

export function LoginDialog() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
        <Card className="relative border border-white/10 bg-[#1a1d2d]/90 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden">
          <CardContent className="space-y-6 pt-8 px-8 pb-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Welcome to VeriFact</h3>
              <p className="text-sm text-gray-400">Sign in or create your account to continue</p>
            </div>
            <UnifiedAuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
