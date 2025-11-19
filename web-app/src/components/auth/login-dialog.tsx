'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';

export function LoginDialog() {
  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-none">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-4 pt-6">
            <LoginForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-4 pt-6">
            <SignupForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
