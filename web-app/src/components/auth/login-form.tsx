'use client';

import { useFormStatus } from 'react-dom';
import { signIn, signInWithGoogle } from '@/app/auth/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useActionState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Sign In
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, { message: '' });

  return (
    <div className="space-y-4">
      <form action={signInWithGoogle}>
        <Button
          variant="outline"
          className="w-full bg-white text-black hover:bg-gray-100 border-none h-11 font-medium"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Continue with Google
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#1a1d2d] px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-[#131520] border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Button variant="link" className="px-0 h-auto text-xs text-blue-400 hover:text-blue-300" type="button">
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-[#131520] border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>
        {state.message && (
          <p className="text-sm text-red-400 bg-red-950/30 p-3 rounded-md border border-red-500/20">{state.message}</p>
        )}
        <SubmitButton />
      </form>
    </div>
  );
}
