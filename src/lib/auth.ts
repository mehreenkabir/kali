// FILE: src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { userStore } from '@/lib/simple-store';

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password Authentication (works immediately!)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        console.log('🔍 Authorize attempt:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          const user = userStore.findByEmail(credentials.email);
          
          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          // Compare passwords
          const isValidPassword = await bcryptjs.compare(credentials.password, user.password);
          
          if (isValidPassword) {
            console.log('✅ Login successful:', credentials.email);
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          } else {
            console.log('❌ Invalid password for:', credentials.email);
            return null;
          }
        } catch (error) {
          console.error('❌ Authorize error:', error);
          return null;
        }
      }
    }),

    // Google SSO (optional - only works with proper setup)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET 
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })] 
      : []
    ),

    // GitHub SSO (optional - only works with proper setup)  
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        })]
      : []
    ),
  ],

  pages: {
    signIn: '/contact',
  },

  callbacks: {
    async signIn({ user, account }) {
      console.log('📝 SignIn callback:', { user: user?.email, provider: account?.provider });
      
      if (account?.provider === 'credentials') {
        // Already handled in authorize
        return true;
      }

      // Handle SSO providers
      if (account?.provider && user?.email) {
        try {
          let existingUser = userStore.findByEmail(user.email);
          
          if (!existingUser) {
            // Create new user for SSO
            const newUser = userStore.create({
              name: user.name || '',
              email: user.email,
              password: '', // No password for SSO users
            });
            console.log('✅ New SSO user created:', user.email);
          } else {
            console.log('✅ Existing SSO user found:', user.email);
          }
          
          return true;
        } catch (error) {
          console.error('❌ SSO SignIn error:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
