import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { updateUserSubscription, getUserByEmail, updateUserStripeData, getUserByStripeCustomerId } from '@/lib/database';
import { sendWelcomeEmail, sendPaymentFailureEmail } from '@/lib/emailService';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('🔔 Stripe webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          const { userId, tier, userEmail } = session.metadata || {};
          
          if (!userId || !tier || !userEmail) {
            console.error('Missing metadata in checkout session:', session.id);
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
          }

          // Update user subscription status
          const updateSuccess = await updateUserSubscription(userEmail, {
            subscription_tier: tier,
            subscription_status: 'active',
            subscription_start_date: new Date().toISOString()
          });

          // Update Stripe customer data
          if (session.customer && session.subscription) {
            await updateUserStripeData(userEmail, {
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string
            });
          }

          if (updateSuccess) {
            console.log(`✅ Subscription activated for user ${userEmail}: ${tier}`);
            
            // Send welcome email
            try {
              await sendWelcomeEmail(userEmail, tier);
              console.log(`📧 Welcome email sent to ${userEmail}`);
            } catch (emailError) {
              console.error(`❌ Failed to send welcome email to ${userEmail}:`, emailError);
            }
          } else {
            console.error(`❌ Failed to update subscription for user ${userEmail}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get user by Stripe customer ID
        const user = await getUserByStripeCustomerId(customerId);
        
        if (user) {
          const status = subscription.status === 'active' ? 'active' : 
                        subscription.status === 'canceled' ? 'canceled' : 'inactive';
          
          await updateUserSubscription(user.email, {
            subscription_status: status
          });
          
          console.log(`🔄 Subscription updated for user ${user.email}: ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get user by Stripe customer ID
        const user = await getUserByStripeCustomerId(customerId);
        
        if (user) {
          await updateUserSubscription(user.email, {
            subscription_tier: 'none',
            subscription_status: 'canceled'
          });
          
          console.log(`❌ Subscription cancelled for user ${user.email}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`💰 Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        // Get user by Stripe customer ID
        const user = await getUserByStripeCustomerId(customerId);
        
        if (user) {
          console.log(`💸 Payment failed for user ${user.email}, invoice ${invoice.id}`);
          
          // Send payment failure notification
          try {
            await sendPaymentFailureEmail(user.email, user.name || 'Valued Customer');
            console.log(`📧 Payment failure email sent to ${user.email}`);
          } catch (emailError) {
            console.error(`❌ Failed to send payment failure email to ${user.email}:`, emailError);
          }
        }
        break;
      }

      default:
        console.log(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}