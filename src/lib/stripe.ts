// FILE: src/lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

// Subscription tier configuration
export const SUBSCRIPTION_TIERS = {
  sanctuary: {
    priceId: process.env.STRIPE_SANCTUARY_PRICE_ID || 'price_sanctuary',
    name: 'The Sanctuary',
    price: 3300, // $33.00 in cents
    currency: 'usd',
    interval: 'month' as const,
  },
  sanctum: {
    priceId: process.env.STRIPE_SANCTUM_PRICE_ID || 'price_sanctum', 
    name: 'The Inner Sanctum',
    price: 5500, // $55.00 in cents
    currency: 'usd',
    interval: 'month' as const,
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
