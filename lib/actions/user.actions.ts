'use server';

import { cookies } from 'next/headers';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { z } from 'zod';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { shippingAddressSchema } from '@/lib/validators';
import { signInFormSchema, signUpFormSchema, paymentMethodSchema } from '../validators';
import { formatError } from '../utils';
import { signIn, signOut } from '@/auth';
import { ShippingAddress } from '@/types';

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
    if (isRedirectError(error)) throw error;
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign user out
export async function signOutUser() {
  // const cookiesObject = await cookies();
  // const sessionCartId = cookiesObject.get('sessionCartId')?.value;

  // if (sessionCartId) {
  //   await prisma.cart.deleteMany({
  //     where: { sessionCartId },
  //   });

  //   cookiesObject.delete('sessionCartId');
  // }
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
      redirect: false
    });

    return { success: true, message: 'User registered successfully.' };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId }
  });

  if (!user) throw new Error('User not found');
  return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id }
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address }
    });

    return {
      success: true,
      message: 'User address updated successful'
    };
  } catch (error) {
    return { success: false, message:formatError(error) || 'Sever error!' }
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id }
    });
    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'User updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}