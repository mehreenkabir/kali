// FILE: src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { 
  updateUserStripeData, 
  getUserByStripeSubscriptionId,
  getUserById 
} from '@/lib/database';

// Disable body parser for raw body access (required for webhook signature verification)
export const runtime = 'nodejs';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.log('❌ Ethereal signature missing from cosmic transmission');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // SECURITY CRITICAL: Verify webhook signature
      // This ensures the request is genuinely from Stripe
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      console.log(`🌟 Ethereal transmission received: ${event.type}`);
    } catch (err) {
      console.error('💫 Cosmic signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event based on type
    switch (event.type) {
      case 'checkout.session.completed': {
        // This event fires upon the first successful payment
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`🏛️ Sacred subscription activated for session: ${session.id}`);
        
        if (session.mode === 'subscription' && session.metadata?.userId) {
          await handleCheckoutSessionCompleted(session);
          console.log(`✨ Soul ${session.metadata.userId} has entered the sanctuary`);
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        // This event fires for all subsequent successful recurring payments
        const invoice = event.data.object as any;
        console.log(`💫 Ethereal payment blessing received: ${invoice.id}`);
        await handlePaymentSucceeded(invoice);
        if (invoice.subscription && typeof invoice.subscription === 'string') {
          console.log(`🌈 Subscription renewal blessed for: ${invoice.subscription}`);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        // This event fires when payment fails
        const invoice = event.data.object as any;
        console.log(`⚠️ Payment energies disrupted for: ${invoice.id}`);
        await handlePaymentFailed(invoice);
        if (invoice.subscription && typeof invoice.subscription === 'string') {
          console.log(`🔮 Sanctuary access temporarily suspended: ${invoice.subscription}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        // This event fires when subscription is modified
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🔄 Subscription energies shifting: ${subscription.id}`);
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        // This event fires when a subscription is canceled
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🌙 Soul's journey in the sanctuary has concluded: ${subscription.id}`);
        await handleSubscriptionCanceled(subscription);
        break;
      }
      
      default:
        console.log(`💭 Unrecognized cosmic transmission: ${event.type}`);
    }

    console.log(`✅ Ethereal event processed successfully: ${event.type}`);
    // Acknowledge receipt of the event to Stripe
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('💥 Error processing ethereal transmission:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session completion
 * This is called when a user successfully completes their first payment
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  try {
    // Extract metadata from the session
    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;
    
    if (!userId || !tier) {
      console.error('Missing userId or tier in session metadata');
      return;
    }

    // Get Stripe customer and subscription IDs from the session
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if (!stripeCustomerId || !stripeSubscriptionId) {
      console.error('Missing customer or subscription ID in completed session');
      return;
    }

    // Retrieve subscription details to get period end
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const subscriptionPeriodEnd = new Date((subscription as any).current_period_end * 1000);

    // DATABASE QUERY: Update user with Stripe data and activate subscription
    const success = await updateUserStripeData(
      parseInt(userId),
      stripeCustomerId,
      stripeSubscriptionId,
      'active',
      subscriptionPeriodEnd
    );
    
    if (success) {
      console.log(`Successfully activated subscription for user ${userId}`);
    } else {
      console.error(`Failed to update database for user ${userId}`);
    }

  } catch (error) {
    console.error('Error handling checkout session completion:', error);
  }
}

/**
 * Handle successful recurring payment
 * This is called for all subsequent successful monthly payments
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded for invoice:', invoice.id);
  
  // Use any type to access subscription property that exists in runtime but not in types
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) return;
  
  try {
    // Get subscription details to update period end
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionPeriodEnd = new Date((subscription as any).current_period_end * 1000);
    
    // DATABASE QUERY: Find user by subscription ID and update their period end
    const user = await getUserByStripeSubscriptionId(subscriptionId);
    
    if (user) {
      const success = await updateUserStripeData(
        user.id,
        user.stripe_customer_id!,
        subscriptionId,
        'active',
        subscriptionPeriodEnd
      );
      
      if (success) {
        console.log(`Payment successful - updated period end for user ${user.id}`);
      } else {
        console.error(`Failed to update period end for user ${user.id}`);
      }
    } else {
      console.error(`User not found for subscription ${subscriptionId}`);
    }

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 * This is called when a recurring payment fails
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed for invoice:', invoice.id);
  
  // Use any type to access subscription property that exists in runtime but not in types
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) return;
  
  try {
    // DATABASE QUERY: Find user by subscription ID and mark as past_due
    const user = await getUserByStripeSubscriptionId(subscriptionId);
    
    if (user) {
      const success = await updateUserStripeData(
        user.id,
        user.stripe_customer_id!,
        subscriptionId,
        'past_due' // Mark as past due, not inactive yet
      );
      
      if (success) {
        console.log(`Payment failed - marked user ${user.id} as past_due`);
      } else {
        console.error(`Failed to update status for user ${user.id}`);
      }
    } else {
      console.error(`User not found for subscription ${subscriptionId}`);
    }

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle subscription updates
 * This is called when subscription details change (plan upgrades, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  try {
    // DATABASE QUERY: Find user by subscription ID and update status
    const user = await getUserByStripeSubscriptionId(subscription.id);
    
    if (user) {
      // Map Stripe status to our internal status
      const status = mapStripeStatusToInternal((subscription as any).status);
      const subscriptionPeriodEnd = new Date((subscription as any).current_period_end * 1000);
      
      const success = await updateUserStripeData(
        user.id,
        user.stripe_customer_id!,
        subscription.id,
        status,
        subscriptionPeriodEnd
      );
      
      if (success) {
        console.log(`Subscription updated - status ${status} for user ${user.id}`);
      } else {
        console.error(`Failed to update subscription for user ${user.id}`);
      }
    } else {
      console.error(`User not found for subscription ${subscription.id}`);
    }

  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

/**
 * Handle subscription cancellation
 * This is called when a subscription is completely canceled
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  console.log('Subscription canceled:', subscription.id);
  
  try {
    // DATABASE QUERY: Find user by subscription ID and mark as canceled
    const user = await getUserByStripeSubscriptionId(subscription.id);
    
    if (user) {
      const success = await updateUserStripeData(
        user.id,
        user.stripe_customer_id!,
        subscription.id,
        'canceled'
      );
      
      if (success) {
        console.log(`Subscription canceled for user ${user.id}`);
      } else {
        console.error(`Failed to cancel subscription for user ${user.id}`);
      }
    } else {
      console.error(`User not found for subscription ${subscription.id}`);
    }

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

/**
 * Map Stripe subscription status to our internal status
 */
function mapStripeStatusToInternal(stripeStatus: string): 'active' | 'inactive' | 'canceled' | 'past_due' {
  switch (stripeStatus) {
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
    case 'cancelled':
      return 'canceled';
    case 'incomplete':
    case 'incomplete_expired':
    case 'unpaid':
    default:
      return 'inactive';
  }
}
