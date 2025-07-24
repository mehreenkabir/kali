// FILE: scripts/setup-stripe-products.js
// This script helps create the necessary Stripe products and prices
// Run this after setting up your Stripe account and API keys

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
  try {
    console.log('Creating Stripe products and prices...');

    // Create The Sanctuary product and price
    const sanctuaryProduct = await stripe.products.create({
      name: 'The Sanctuary',
      description: 'Personalized meditation, crystal collection, and spiritual guidance',
      metadata: {
        tier: 'sanctuary'
      }
    });

    const sanctuaryPrice = await stripe.prices.create({
      product: sanctuaryProduct.id,
      unit_amount: 3300, // $33.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        tier: 'sanctuary'
      }
    });

    // Create The Inner Sanctum product and price
    const sanctumProduct = await stripe.products.create({
      name: 'The Inner Sanctum',
      description: 'Advanced teachings, exclusive content, and personalized guidance',
      metadata: {
        tier: 'sanctum'
      }
    });

    const sanctumPrice = await stripe.prices.create({
      product: sanctumProduct.id,
      unit_amount: 5500, // $55.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        tier: 'sanctum'
      }
    });

    console.log('✅ Products and prices created successfully!');
    console.log('\nAdd these to your .env.local file:');
    console.log(`STRIPE_SANCTUARY_PRICE_ID=${sanctuaryPrice.id}`);
    console.log(`STRIPE_SANCTUM_PRICE_ID=${sanctumPrice.id}`);
    
    console.log('\nProduct Details:');
    console.log('Sanctuary:', sanctuaryProduct.id, '- Price:', sanctuaryPrice.id);
    console.log('Sanctum:', sanctumProduct.id, '- Price:', sanctumPrice.id);

  } catch (error) {
    console.error('Error creating products:', error);
  }
}

if (require.main === module) {
  createStripeProducts();
}

module.exports = { createStripeProducts };
