import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compareSync } from 'bcrypt-ts-edge';
import { type NextAuthConfig } from 'next-auth';

import { prisma } from '@/db/prisma';

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  session: {
    strategy: 'jwt',
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
          const isMatch = compareSync(credentials.password as string, user.password);

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
    async session({ session, user, trigger, token }) {
      // Set the user ID rom the token
      session.user.id = token.sub as string;

      // If there is an update, set the user name
      if (trigger === 'update') session.user.name = user.name;
      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);