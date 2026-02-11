import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createLogger } from '@/lib/logger';

const log = createLogger('Auth');

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      crustyCoins: number;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    crustyCoins: number;
    image?: string | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId: string;
    crustyCoins: number;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          log.warn('Login attempt with missing credentials');
          return null;
        }

        log.info('Login attempt', { email });

        const user = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.email, email),
        });

        if (!user) {
          log.warn('Login failed: user not found', { email });
          return null;
        }

        if (!user.passwordHash) {
          log.warn('Login failed: user has no password set (may be agent-only)', { email });
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          log.warn('Login failed: invalid password', { email });
          return null;
        }

        log.info('Login successful', { userId: user.id, email });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          crustyCoins: user.crustyCoins,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id as string;
        token.crustyCoins = (user as any).crustyCoins ?? 0;
      }

      // Refresh crustyCoins from DB on every token refresh
      if (token.userId) {
        try {
          const dbUser = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, token.userId),
          });
          if (dbUser) {
            token.crustyCoins = dbUser.crustyCoins;
          }
        } catch (err) {
          log.error('Failed to refresh crustyCoins in JWT callback', err);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.crustyCoins = token.crustyCoins;
      }
      return session;
    },
  },
};
