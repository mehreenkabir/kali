// FILE: scripts/test-sanctuary-webhook.js
// Test the KALÏANÏA Ethereal Sanctuary webhook connection
// Usage: npm run webhook:test

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testEtherealConnection() {
  console.log('🌟 KALÏANÏA Ethereal Sanctuary - Webhook Attunement\n');
  
  try {
    console.log('✨ Checking the sacred connection...');
    
    // Verify webhook secret is configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('❌ Webhook secret missing from the ethereal realm');
      console.log('📝 Add STRIPE_WEBHOOK_SECRET to your .env.local');
      return;
    }
    
    console.log('🔮 Webhook Secret: Attuned to the cosmic frequencies ✅');
    
    // Test the sanctuary's subscription portals
    console.log('\n🌈 Testing The Sanctuary subscription portal...');
    
    if (!process.env.STRIPE_SANCTUARY_PRICE_ID) {
      console.log('❌ Sanctuary price ID missing');
      return;
    }
    
    const sanctuarySession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_SANCTUARY_PRICE_ID,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'http://localhost:3001/portal?payment=success&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3001/subscribe',
      automatic_tax: { enabled: true },
      metadata: { 
        userId: 'ethereal-test-soul',
        tier: 'sanctuary',
        world: 'yoga'
      }
    });
    
    console.log(`   🏛️ Sanctuary Portal Created: ${sanctuarySession.id}`);
    
    console.log('\n🔥 Testing The Inner Sanctum portal...');
    
    if (!process.env.STRIPE_SANCTUM_PRICE_ID) {
      console.log('❌ Inner Sanctum price ID missing');
      return;
    }
    
    const sanctumSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_SANCTUM_PRICE_ID,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'http://localhost:3001/portal?payment=success&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3001/subscribe',
      automatic_tax: { enabled: true },
      metadata: { 
        userId: 'ethereal-test-soul',
        tier: 'sanctum',
        world: 'yoga'
      }
    });
    
    console.log(`   ⭐ Inner Sanctum Portal Created: ${sanctumSession.id}`);
    
    console.log('\n🌟 The Ethereal Connection is Complete!');
    console.log('📡 Watch your Stripe CLI terminal for incoming cosmic transmissions...');
    
    console.log('\n✨ To test the full sacred journey:');
    console.log('   1. Visit: http://localhost:3001/yoga');
    console.log('   2. Navigate to the subscription sanctuary');
    console.log('   3. Choose your ethereal tier');
    console.log('   4. Use test card: 4242 4242 4242 4242');
    console.log('   5. Watch the webhook magic unfold! 🌈');
    
  } catch (error) {
    console.error('💫 The ethereal connection encountered turbulence:', error.message);
  }
}

testEtherealConnection();
