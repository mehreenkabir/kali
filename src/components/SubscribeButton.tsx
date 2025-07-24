// FILE: src/components/SubscribeButton.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirectToCheckout } from '@/lib/stripe-client';

interface SubscribeButtonProps {
  tier: 'sanctuary' | 'sanctum';
  children: React.ReactNode;
  className?: string;
  priceId?: string;
  directCheckout?: boolean; // New prop to determine behavior
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ 
  tier, 
  children, 
  className = '',
  priceId,
  directCheckout = false
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // If directCheckout is true, go straight to Stripe
    if (directCheckout) {
      setIsLoading(true);
      
      try {
        // Use Stripe.js to redirect to checkout
        if (priceId) {
          await redirectToCheckout(tier, priceId);
        } else {
          await redirectToCheckout(tier);
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Otherwise, redirect to subscription page for authenticated users
      router.push('/subscribe');
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={`Subscribe to ${tier === 'sanctuary' ? 'The Sanctuary' : 'The Inner Sanctum'}`}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default SubscribeButton;
