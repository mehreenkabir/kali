# Quick Start Guide for Receiving Payments

## 🚀 Step-by-Step Setup

### 1. Set up your Stripe account (5-10 minutes)
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the verification process (upload ID, tax info)
3. Add your bank account in Settings → Bank accounts and scheduling

### 2. Get your API keys (2 minutes)
1. In Stripe Dashboard, go to Developers → API keys
2. Copy your Publishable key and Secret key
3. Create `.env.local` file in your project:

```env
# Copy from .env.example and fill in your real values
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Get these from your Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Create your subscription products (1 minute)
```bash
npm run stripe:setup
```
This creates your $33 Sanctuary and $55 Sanctum subscriptions in Stripe.

### 4. Check everything is working (1 minute)
```bash
npm run stripe:status
```
This shows your account status and what needs to be completed.

### 5. Set up webhook (3 minutes)
1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `http://localhost:3000/api/stripe/webhook` (for testing)
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook secret and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 6. Test a payment (2 minutes)
1. Start your app: `npm run dev`
2. Go to `/subscribe` and click a subscription button
3. Use Stripe test card: `4242 4242 4242 4242`
4. Check your Stripe Dashboard to see the payment

## 💰 When You Go Live

### For Real Payments:
1. **Switch to Live mode** in Stripe Dashboard
2. **Get Live API keys** (they start with `sk_live_` and `pk_live_`)
3. **Update .env.local** with live keys
4. **Create live webhook** pointing to `https://yourdomain.com/api/stripe/webhook`
5. **Run stripe:setup again** to create live products

### Typical Timeline:
- **Account verification**: 1-2 business days
- **First payout**: 7 days after first payment
- **Regular payouts**: 2-5 business days (you choose daily/weekly/monthly)

## 💡 Pro Tips

### Revenue Examples:
- **Sanctuary ($33/month)**: You receive ~$32.04 (after 2.9% + 30¢ fee)
- **Sanctum ($55/month)**: You receive ~$53.10 (after fees)

### Must-Do's:
- ✅ Complete Stripe verification (required for live payments)
- ✅ Add bank account (required to receive money)
- ✅ Set up webhooks (required for subscription management)
- ✅ Keep webhook secret secure

### Monitoring:
- Use `npm run stripe:status` to check account health
- Monitor Stripe Dashboard for payment activity
- Check your app's `/portal` for subscriber management

## 🔍 Quick Commands

```bash
# Check if Stripe is properly configured
npm run stripe:status

# Create subscription products in Stripe
npm run stripe:setup

# Initialize local database
npm run db:init

# Start development server
npm run dev
```

Once you complete the Stripe verification and add your bank account, payments will automatically flow to your account! 🎉
