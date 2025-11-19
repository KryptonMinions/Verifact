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
        <Label htmlFor="email-signup">Email</Label>
        <Input
          id="email-signup"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <div className="relative">
          <Input
            id="password-signup"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password-signup">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password-signup"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>
      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}
