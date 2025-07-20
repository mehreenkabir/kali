// FILE: src/app/account/page.tsx

'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// --- The Protected Account Page ---
export default function AccountPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Member'); // Default name

  // This is the core of the protection logic
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token is found, redirect to the login page
      router.push('/contact');
    } else {
      // In a real app, you would use the token to fetch the user's
      // actual name from a protected backend route, like '/api/me'.
      // For now, we'll just confirm they are logged in.
      console.log("Access granted. Welcome to your sanctuary.");
      // You could decode the JWT here to get the user's name if you add a library like jwt-decode
    }
  }, [router]);

  const handleLogout = () => {
    // Clear the token from storage and redirect to the home page
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="pastel-dream-gradient text-slate-800 min-h-screen relative">
      <Header />

      <main className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-24 md:py-32 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36">
        <div className="w-full max-w-2xl mx-auto text-center bg-white/40 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-lg border border-white/30 fade-in-up">
          
          <h1 className="font-serif text-4xl md:text-5xl text-slate-700 mb-4 text-glow">
            Welcome to Your Sanctuary, {userName}.
          </h1>
          <p className="font-dreamy text-2xl md:text-3xl text-slate-600 mb-12 leading-loose">
            This is your private space to manage your journey and access your exclusive content.
          </p>

          {/* Placeholder for future content */}
          <div className="text-left space-y-4 mb-12">
            <div className="bg-white/50 p-4 rounded-lg">
              <h2 className="font-serif text-xl text-slate-700">My Subscriptions</h2>
              <p className="font-sans text-sm text-slate-600">Your membership details will appear here.</p>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h2 className="font-serif text-xl text-slate-700">My Content</h2>
              <p className="font-sans text-sm text-slate-600">A direct link to the Archives and your personalized meditations will be here.</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-block bg-white/80 backdrop-blur-md text-slate-800 font-serif tracking-widest uppercase px-10 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-2xl focus:outline-none"
          >
            Log Out
          </button>

        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}