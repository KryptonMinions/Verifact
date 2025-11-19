'use client';

import { useActionState, useFormStatus } from 'react-dom';
import { signIn } from '@/app/auth/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useActionState as useReactActionState } from 'react';

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
  const [state, formAction] = useReactActionState(signIn, { message: '' });

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}
