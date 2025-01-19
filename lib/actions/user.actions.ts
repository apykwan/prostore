'use server';

import { signInFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation'

// Sign in the user with credentials
export async function signInWIhtCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password')
    });

    await signIn('credentials', user);
    return { success: true, message: 'Signed in sccessfully' };
  } catch (error) {
    if (error) throw error;

    redirect('/')
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}