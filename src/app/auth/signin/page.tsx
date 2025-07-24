'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Get the updated session
        const session = await getSession();
        if (session) {
          router.push('/portal');
        }
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/beach-background.mp4"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      <Header theme="dark" />

      <main className="relative z-20 flex items-center justify-center min-h-screen p-4 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="glass-card p-6 xs:p-8 rounded-2xl">
            <div className="text-center mb-6 xs:mb-8">
              <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl text-white mb-2 text-glow">
                Welcome Back
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-white/80">
                Sign in to your sanctuary
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-serif tracking-widest uppercase py-3 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 button-glow"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-white hover:text-white/80 underline transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter theme="dark" />
    </div>
  );
};

export default SignInPage;
