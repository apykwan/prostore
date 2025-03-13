
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { cookies } from 'next/headers';

import { prisma } from '@/db/prisma';
import { compare } from '@/lib/encrypt';
import { authConfig } from './auth.config';

declare module 'next-auth' {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string; // Add the role property
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string; // Add the role property
    };
  }
}

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 365 * 24 * 60 * 60
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string
          }
        });

        // check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(credentials.password as string, user.password);
          console.log('isMatch?', isMatch);
          if (isMatch) return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
        return null;
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,

    // eslint-disable-next-line
    async session({ session, user, trigger, token }: any) {
      // Set the user ID rom the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    // eslint-disable-next-line
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);