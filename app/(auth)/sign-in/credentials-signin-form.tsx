'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';

function SignInButton({ pending }: { pending: boolean }) {
  return (
    <Button className="w-full" disabled={pending} variant="default">
      { pending ? 'Signing In' : 'Sign In' }
    </Button>
  );
}

export default function CredentialsSigninForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: ''
  });
  const router = useRouter();
  const { pending } = useFormStatus();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  useEffect(() => {
    if (data.success) router.push(callbackUrl || '/');
  }, [data.success, callbackUrl, router]); 
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

        <SignInButton pending={pending} />

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account ? {' '} 
          <Link href="/sign-up" target="_self" className="link">Sign Up</Link>
        </div>

      </div>
    </form>
  );
}