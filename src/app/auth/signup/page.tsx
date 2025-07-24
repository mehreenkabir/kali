'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/beach-background.mp4"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />

        <Header theme="dark" />

        <main className="relative z-20 flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
              <h1 className="font-serif text-3xl text-white mb-4 text-glow">
                Welcome to the Sanctuary!
              </h1>
              <p className="font-dreamy text-xl text-white/80 mb-4">
                Your account has been created successfully.
              </p>
              <p className="text-white/70">
                Redirecting you to sign in...
              </p>
            </div>
          </div>
        </main>

        <GlobalFooter theme="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/beach-background.mp4"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      <Header theme="dark" />

      <main className="relative z-20 flex items-center justify-center min-h-screen p-4 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36">
        <div className="w-full max-w-md">
          <div className="glass-card p-6 xs:p-8 rounded-2xl">
            <div className="text-center mb-6 xs:mb-8">
              <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl text-white mb-2 text-glow">
                Join the Sanctuary
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-white/80">
                Create your sacred space
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-white/90 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="Your beautiful name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-white/90 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-serif tracking-widest uppercase py-3 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 button-glow"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Already have an account?{' '}
                <Link 
                  href="/auth/signin" 
                  className="text-white hover:text-white/80 underline transition-colors"
                >
                  Sign in here
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

export default SignUpPage;
