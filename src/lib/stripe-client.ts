// FILE: src/lib/stripe-client.ts
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export { stripePromise };

// Client-side function to initiate checkout using Stripe.js redirect
export async function redirectToCheckout(tier: 'sanctuary' | 'sanctum', priceId?: string) {
  try {
    // Create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tier, priceId }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.sessionId) {
      // Load Stripe and redirect to checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Redirect to Stripe checkout using the official method
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } else if (data.checkoutUrl) {
      // Fallback: direct redirect to checkout URL
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error('No session ID or checkout URL returned');
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

// Alternative function using Price ID directly (for more flexible pricing)
export async function redirectToCheckoutWithPriceId(priceId: string) {
  try {
    // Create checkout session with specific price ID
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.sessionId) {
      // Load Stripe and redirect to checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } else {
      throw new Error('No session ID returned');
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}
