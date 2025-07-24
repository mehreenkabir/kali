// FILE: scripts/create-production-webhook.js
// Creates a production webhook endpoint for kaliania.com
// Usage: node scripts/create-production-webhook.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProductionWebhook() {
  try {
    console.log('🌟 Creating KALÏANÏA Sanctuary Production Webhook...\n');

    // Create the webhook endpoint
    const webhook = await stripe.webhookEndpoints.create({
      url: 'https://kaliania.com/api/stripe/webhook',
      enabled_events: [
        'checkout.session.completed',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'customer.subscription.trial_will_end',
      ],
      description: 'KALÏANÏA Sanctuary Payment Events',
    });

    console.log('✅ Production webhook created successfully!\n');
    
    console.log('🔗 Webhook Details:');
    console.log(`   URL: ${webhook.url}`);
    console.log(`   ID: ${webhook.id}`);
    console.log(`   Status: ${webhook.status}`);
    console.log(`   Events: ${webhook.enabled_events.length} configured`);
    
    console.log('\n📋 Events Configured:');
    webhook.enabled_events.forEach(event => {
      console.log(`   ✓ ${event}`);
    });

    console.log('\n🔐 IMPORTANT - Save this webhook secret:');
    console.log(`   STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Add the webhook secret to your production environment');
    console.log('   2. Deploy your app to kaliania.com');
    console.log('   3. Your sanctuary will be ready to receive cosmic transmissions! ✨');

  } catch (error) {
    console.error('💫 Error creating production webhook:', error.message);
    
    if (error.code === 'url_invalid') {
      console.log('\n💡 Make sure kaliania.com is accessible and uses HTTPS');
    }
  }
}

createProductionWebhook();
