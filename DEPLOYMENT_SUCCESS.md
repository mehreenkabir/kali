# 🌟 Kalïanïa - Complete Spiritual Sanctuary Platform

## ✨ **Successfully Deployed to GitHub!**

**Repository:** [https://github.com/mehreenkabir/kali](https://github.com/mehreenkabir/kali)

---

## 🧘‍♀️ **What This Is**

This is a complete, production-ready spiritual sanctuary platform that combines:

- **Enhanced Portal Experience** with mood tracking and journaling
- **Google Maps Integration** for precise address management
- **Stripe Payment System** for yoga subscription tiers
- **Comprehensive User Authentication** with NextAuth.js
- **SQLite Database** with full profile and spiritual data persistence

---

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/mehreenkabir/kali.git
cd kali

# Install dependencies
npm install

# Set up the database
npm run db:init

# Start development server
npm run dev
```

**Access the platform:** `http://localhost:3001`

---

## 🌟 **Key Features**

### **Portal Experience** (`/portal`)
- **4 Unified Tabs:** Overview, Daily Mood, Sacred Journal, Profile
- **Daily Mood Tracking:** 8 emotional states with intensity levels
- **Personal Spiritual Journal:** Full CRUD with tagging system
- **Enhanced Profile Editor:** Birth info, astrology, spiritual preferences

### **Google Maps Integration**
- **Address Autocomplete:** Real-time location selection
- **Birth Location Picker:** Global city search for astrological data
- **Shipping Management:** Auto-populated city, state, ZIP

### **Authentication System**
- **NextAuth.js Integration:** Secure session management
- **Sign Up/Sign In Pages:** Beautiful, responsive forms
- **Protected Routes:** Portal access for authenticated users only

### **Stripe Subscription System**
- **Yoga Sanctuary Tiers:** The Sanctuary, The Inner Sanctum
- **Checkout Integration:** Seamless payment processing
- **Webhook Handling:** Automatic subscription status updates

### **Database & API**
- **SQLite Database:** Local file-based storage with migrations
- **RESTful APIs:** User profiles, mood entries, journal entries
- **Data Persistence:** All spiritual journey data saved securely

---

## 📁 **Project Structure**

```
kali/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── portal/             # Main spiritual sanctuary portal
│   │   ├── auth/               # Sign in/up pages
│   │   ├── api/                # API routes (auth, user data, Stripe)
│   │   ├── yoga/               # Yoga subscription page
│   │   └── subscribe/          # Subscription tiers
│   ├── components/
│   │   ├── diary/              # MoodTracker, PersonalJournal
│   │   ├── profile/            # Profile management components
│   │   ├── yoga/               # Spiritual journey components
│   │   └── ui/                 # Reusable UI components
│   └── lib/                    # Database, Stripe, utilities
├── migrations/                 # Database schema migrations
├── scripts/                    # Setup and utility scripts
└── data/                       # SQLite database files
```

---

## 🔧 **Configuration Required**

### **1. Environment Variables** (`.env.local`)
```bash
# Authentication
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3001

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### **2. Stripe Setup**
```bash
# Check Stripe status
npm run check:stripe

# Create products and prices
npm run setup:stripe

# Set up webhooks for production
npm run webhook:create
```

---

## 🎯 **User Journey**

1. **Homepage** → **Portal** → **Sign In/Sign Up**
2. **Portal Overview** → Access all spiritual tools
3. **Daily Mood Tab** → Track emotional states
4. **Sacred Journal Tab** → Write spiritual reflections
5. **Profile Tab** → Manage personal/shipping information
6. **Yoga Page** → Subscribe to spiritual practices

---

## 💎 **Technical Highlights**

- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** with custom spiritual sanctuary styling
- **SQLite** with proper migrations and indexing
- **NextAuth.js** for secure authentication
- **Stripe** for subscription billing
- **Google Maps API** for location services
- **RESTful API design** with proper error handling

---

## 📚 **Documentation**

- **[Profile Setup Guide](./PROFILE_SETUP.md)** - Google Maps integration details
- **[Quick Start Guide](./QUICK_START.md)** - Stripe payment setup
- **[Stripe Configuration](./STRIPE_IMPLEMENTATION.md)** - Complete payment system

---

## 🌟 **What Makes This Special**

This isn't just a portfolio - it's a **complete spiritual sanctuary platform** that users can:

- Track their daily emotional journey with mood logging
- Maintain a personal spiritual diary with full persistence
- Manage comprehensive profile information with Google Maps
- Subscribe to yoga services with Stripe integration
- Experience a unified, beautiful interface designed for spiritual practice

**Perfect for:** Spiritual practitioners, yoga instructors, wellness coaches, or anyone building a spiritual community platform.

---

## 🎉 **Success!**

✅ **Fully Deployed to GitHub**  
✅ **89 Files Added/Modified**  
✅ **10,324+ Lines of Code**  
✅ **Complete Spiritual Platform Ready**

**Your spiritual sanctuary platform is now live on GitHub and ready for the world!** 🌟✨

---

*Built with 💜 for the spiritual community*
