'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { signInDefaultValues } from '@/lib/constants';

export default function CredentialsSigninForm() {
  const [data, action] = useActionState(signInDefaultValues, {
    success: false,
    message: ''
  });
  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            defaultValue={signInDefaultValues.email}
          />
        </div>

        <div>
          <Label htmlFor='password'>password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            autoComplete="password" 
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Button className="w-full" variant="default">Sign In</Button>
        </div>
        
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account ? {' '} 
          <Link href="/sign-up" target="_self" className="link">Sign Up</Link>
        </div>

      </div>
    </form>
  );
}