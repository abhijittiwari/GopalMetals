import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@/app/generated/prisma';
import { compare } from 'bcrypt';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Extend the default session type
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    }
  }
}

// Extend the JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

// Initialize Prisma client only when needed
let prisma: PrismaClient;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Create the authentication options
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log(`Attempting database auth for: ${credentials.email}`);
        
        try {
          // Get Prisma client
          const db = getPrismaClient();
          
          // Find the user by email
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            console.log(`User not found: ${credentials.email}`);
            return null;
          }

          // Compare password with hashed password in db
          const passwordMatch = await compare(credentials.password, user.password);

          if (!passwordMatch) {
            console.log(`Password mismatch for: ${credentials.email}`);
            return null;
          }

          console.log(`Successful authentication for: ${credentials.email}, role: ${user.role}`);
          
          // Return the user object for successful auth
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('Database authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret-do-not-use-in-production',
};

// Create and export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 