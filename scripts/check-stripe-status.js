// FILE: scripts/check-stripe-status.js
// Run this script to check your Stripe account setup status
// Usage: node scripts/check-stripe-status.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function checkStripeStatus() {
  try {
    console.log('🌟 KALÏANÏA Sanctuary - Stripe Status Check\n');

    // Check if we're in test or live mode
    const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');
    console.log(`📊 Mode: ${isTestMode ? '🧪 TEST MODE' : '🚀 LIVE MODE'}`);

    // Get account information
    let account;
    try {
      account = await stripe.accounts.retrieve();
    } catch (error) {
      console.error('❌ Failed to retrieve account:', error.message);
      return;
    }
    
    console.log(`\n👤 Account Details:`);
    console.log(`   ID: ${account.id}`);
    console.log(`   Country: ${account.country}`);
    console.log(`   Email: ${account.email || 'Not provided'}`);
    console.log(`   Type: ${account.type}`);

    // Check verification status
    console.log(`\n✅ Verification Status:`);
    console.log(`   Charges enabled: ${account.charges_enabled ? '✅' : '❌'}`);
    console.log(`   Payouts enabled: ${account.payouts_enabled ? '✅' : '❌'}`);
    console.log(`   Details submitted: ${account.details_submitted ? '✅' : '❌'}`);

    // Check for verification requirements
    if (account.requirements && account.requirements.currently_due && account.requirements.currently_due.length > 0) {
      console.log(`\n⚠️  Requirements needed:`);
      account.requirements.currently_due.forEach(req => {
        console.log(`   - ${req}`);
      });
    } else {
      console.log(`\n✅ No outstanding verification requirements`);
    }

    // Check bank accounts - handle different account types
    console.log(`\n🏦 Bank Account Status:`);
    try {
      if (account.type === 'standard') {
        // For standard accounts, check external_accounts
        if (account.external_accounts && account.external_accounts.data && account.external_accounts.data.length > 0) {
          console.log(`   ✅ Bank accounts connected:`);
          account.external_accounts.data.forEach((bank, index) => {
            const last4 = bank.last4 || 'N/A';
            const bankName = bank.bank_name || bank.account_holder_name || 'Bank';
            const status = bank.status || 'unknown';
            console.log(`   ${index + 1}. ****${last4} (${bankName}) - Status: ${status}`);
          });
        } else {
          // Try to fetch external accounts separately
          try {
            const externalAccounts = await stripe.accounts.listExternalAccounts(account.id, {
              object: 'bank_account',
              limit: 10
            });
            
            if (externalAccounts.data.length > 0) {
              console.log(`   ✅ Bank accounts found:`);
              externalAccounts.data.forEach((bank, index) => {
                const last4 = bank.last4 || 'N/A';
                const bankName = bank.bank_name || bank.account_holder_name || 'Bank';
                const status = bank.status || 'unknown';
                console.log(`   ${index + 1}. ****${last4} (${bankName}) - Status: ${status}`);
              });
            } else {
              console.log(`   ⚠️  No bank accounts found via external accounts API`);
              console.log(`   📝 Add at: https://dashboard.stripe.com/settings/payouts`);
            }
          } catch (extError) {
            console.log(`   ⚠️  Could not fetch external accounts: ${extError.message}`);
            console.log(`   📝 Check your bank accounts in: https://dashboard.stripe.com/settings/payouts`);
          }
        }
      } else {
        // For express/custom accounts, the structure might be different
        console.log(`   💡 Account type: ${account.type}`);
        console.log(`   💡 Check bank accounts in your Stripe Dashboard: https://dashboard.stripe.com/settings/payouts`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check bank accounts: ${error.message}`);
      console.log(`   💡 If you added a bank account, it should show in: https://dashboard.stripe.com/settings/payouts`);
    }

    // List existing products and prices
    console.log(`\n💰 Products & Prices:`);
    try {
      const products = await stripe.products.list({ limit: 10 });
      const prices = await stripe.prices.list({ limit: 10 });

      if (products.data.length === 0) {
        console.log(`   ⚠️  No products found - run 'npm run stripe:setup' to create them`);
      } else {
        products.data.forEach(product => {
          console.log(`   📦 ${product.name} (${product.id})`);
          const productPrices = prices.data.filter(price => price.product === product.id);
          productPrices.forEach(price => {
            const amount = (price.unit_amount || 0) / 100;
            const interval = price.recurring?.interval || 'one-time';
            console.log(`      💲 $${amount}/${interval} (${price.id})`);
          });
        });
      }
    } catch (error) {
      console.log(`   ❌ Error fetching products: ${error.message}`);
    }

    // Check webhook endpoints
    console.log(`\n🔗 Webhook Endpoints:`);
    try {
      const webhooks = await stripe.webhookEndpoints.list();
      if (webhooks.data.length === 0) {
        console.log(`   ⚠️  No webhooks configured in Dashboard`);
        console.log(`   📝 For local testing: Use Stripe CLI`);
        console.log(`   📝 For production: Add https://kaliania.com/api/stripe/webhook`);
      } else {
        console.log(`   ✅ Webhook endpoints found:`);
        webhooks.data.forEach(webhook => {
          console.log(`   🔗 ${webhook.url}`);
          console.log(`      Status: ${webhook.status}`);
          console.log(`      Events: ${webhook.enabled_events.length} configured`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Error fetching webhooks: ${error.message}`);
    }

    // Check tax configuration
    console.log(`\n🧾 Tax Configuration:`);
    try {
      const taxSettings = await stripe.tax.settings.retrieve();
      console.log(`   ✅ Tax settings configured`);
      console.log(`   Status: ${taxSettings.status || 'Not configured'}`);
      if (taxSettings.defaults && taxSettings.defaults.tax_behavior) {
        console.log(`   Default calculation: ${taxSettings.defaults.tax_behavior}`);
      }
      console.log(`   💡 Code has automatic_tax enabled: ✅`);
    } catch (error) {
      console.log(`   ⚠️  Tax not configured: ${error.message}`);
      console.log(`   📝 Enable in: Dashboard → Settings → Tax`);
    }

    // Check environment variables
    console.log(`\n� Environment Check:`);
    console.log(`   STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   STRIPE_PUBLISHABLE_KEY: ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SANCTUARY_PRICE_ID: ${process.env.STRIPE_SANCTUARY_PRICE_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SANCTUM_PRICE_ID: ${process.env.STRIPE_SANCTUM_PRICE_ID ? '✅ Set' : '❌ Missing'}`);

    // Summary and next steps
    console.log(`\n� KALÏANÏA Sanctuary Readiness:`);
    
    const canChargeCustomers = account.charges_enabled;
    const canReceivePayouts = account.payouts_enabled;
    const hasProducts = (await stripe.products.list({ limit: 1 })).data.length > 0;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    
    // Check bank accounts more thoroughly
    let hasBankAccount = false;
    try {
      if (account.external_accounts?.data?.length > 0) {
        hasBankAccount = true;
      } else {
        // Try alternative method
        const externalAccounts = await stripe.accounts.listExternalAccounts(account.id, {
          object: 'bank_account',
          limit: 1
        });
        hasBankAccount = externalAccounts.data.length > 0;
      }
    } catch (error) {
      // If we can't check bank accounts via API, but payouts are enabled, 
      // it's likely that bank accounts are set up (Stripe requires bank accounts for payouts)
      if (canReceivePayouts) {
        hasBankAccount = true; // Assume bank account exists if payouts are enabled
      }
    }
    
    console.log(`   💳 Can accept payments: ${canChargeCustomers ? '✅' : '❌'}`);
    console.log(`   🏦 Can receive payouts: ${canReceivePayouts ? '✅' : '❌'}`);
    console.log(`   💰 Bank account added: ${hasBankAccount ? '✅' : '❌'}`);
    console.log(`   📦 Products created: ${hasProducts ? '✅' : '❌'}`);
    console.log(`   � Webhook configured: ${hasWebhookSecret ? '✅' : '❌'}`);

    if (canChargeCustomers && canReceivePayouts && hasBankAccount && hasProducts) {
      console.log(`\n🎉 Your sanctuary is ready to welcome souls and receive payments! ✨`);
      if (isTestMode) {
        console.log(`   🧪 Currently in test mode - switch to live mode when ready for real payments`);
      }
    } else {
      console.log(`\n📋 Next Steps to Complete Your Sanctuary:`);
      if (!canChargeCustomers || !canReceivePayouts) {
        console.log(`   1. ⚠️  Complete account verification in Stripe Dashboard`);
      }
      if (!hasBankAccount) {
        console.log(`   2. 🏦 Add your bank account: https://dashboard.stripe.com/settings/payouts`);
      }
      if (!hasProducts) {
        console.log(`   3. 📦 Run 'npm run stripe:setup' to create subscription products`);
      }
      if (!hasWebhookSecret) {
        console.log(`   4. 🔗 Set up webhook endpoint for event handling`);
      }
    }

  } catch (error) {
    console.error('💫 Error checking sanctuary status:', error.message);
    
    if (error.message.includes('No such')) {
      console.log('\n💡 This might be because you\'re using test keys. Make sure your STRIPE_SECRET_KEY is set correctly.');
    }
  }
}

if (require.main === module) {
  checkStripeStatus();
}

module.exports = { checkStripeStatus };
