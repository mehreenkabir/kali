// FILE: src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { stripe, SUBSCRIPTION_TIERS, SubscriptionTier } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { priceId, tier } = await request.json();
    
    // Validate tier if provided, or derive from priceId
    let subscriptionTier: string;
    let stripePriceId: string;
    
    if (tier && tier in SUBSCRIPTION_TIERS) {
      subscriptionTier = tier;
      stripePriceId = SUBSCRIPTION_TIERS[tier as SubscriptionTier].priceId;
    } else if (priceId) {
      // Find tier by price ID
      const tierEntry = Object.entries(SUBSCRIPTION_TIERS).find(
        ([, config]) => config.priceId === priceId
      );
      if (!tierEntry) {
        return NextResponse.json(
          { error: 'Invalid price ID' },
          { status: 400 }
        );
      }
      subscriptionTier = tierEntry[0];
      stripePriceId = priceId;
    } else {
      return NextResponse.json(
        { error: 'Either tier or priceId is required' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/portal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscribe?canceled=true`,
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        tier: subscriptionTier,
        userEmail: session.user.email,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          tier: subscriptionTier,
          userEmail: session.user.email,
        },
      },
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
