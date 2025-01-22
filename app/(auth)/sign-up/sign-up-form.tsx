'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { signUpUser } from '@/lib/actions/user.actions';
import { signUpDefaultValues } from '@/lib/constants';

function SignUpButton({ pending }: { pending: boolean }) {
  return (
    <Button className="w-full" disabled={pending} variant="default">
      { pending ? 'Submiting...' : 'Sign Up' }
    </Button>
  );
}

export default function SignUpForm() {
  const [data, action] = useActionState(signUpUser, {
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
          <Label htmlFor='name'>Name</Label>
          <Input 
            id="name" 
            name="name" 
            type="name" 
            required 
            autoComplete="name" 
            defaultValue={signUpDefaultValues.name}
          />
        </div>

        <div>
          <Label htmlFor='email'>Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            defaultValue={signUpDefaultValues.email}
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
            defaultValue={signUpDefaultValues.email}
          />
        </div>

        <div>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            required 
            autoComplete="confirmPassword" 
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <SignUpButton pending={pending} />

        { data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        
        <div className="text-sm text-center text-muted-foreground">
          Already have an account ? {' '} 
          <Link href="/sign-in" target="_self" className="link">Sign In</Link>
        </div>
      </div>
    </form>
  );
}