'use client';

import { signUp } from '@/app/auth/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Create Account
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signUp, { message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-signup" className="text-gray-300">Email</Label>
        <Input
          id="email-signup"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
          className="bg-[#131520] border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup" className="text-gray-300">Password</Label>
        <div className="relative">
          <Input
            id="password-signup"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            className="bg-[#131520] border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password-signup" className="text-gray-300">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password-signup"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            className="bg-[#131520] border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </div>
      {state.message && (
        <p className="text-sm text-red-400 bg-red-950/30 p-3 rounded-md border border-red-500/20">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}
