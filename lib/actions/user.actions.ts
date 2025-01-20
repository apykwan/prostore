'use server';

import { signInFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', { ...user, redirect: false });
    
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}