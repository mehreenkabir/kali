import NextAuth from 'next-auth';

const handler = NextAuth({
  providers: [
    // Minimal configuration - authentication is disabled for now
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/contact',
    error: '/contact',
  },
});

export { handler as GET, handler as POST };
