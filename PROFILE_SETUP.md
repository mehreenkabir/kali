# Enhanced Portal Profile Setup

## Overview

The portal now includes an enhanced profile editing system with the following features:

### ✨ New Features Added:

1. **Profile Tab in Portal**: Users can now edit their profile directly from the portal page
2. **Google Maps Integration**: Automatic address completion and location selection
3. **Enhanced Address Forms**: Dropdown menus for states and better address validation
4. **Spiritual Profile Management**: Birth information, astrology signs, crystal preferences
5. **Shipping Address Management**: Complete shipping information with auto-completion
6. **Jewelry Preferences**: Ring sizes, metal preferences, and customization options

### 🗂️ Profile Sections:

#### Spiritual Tab:
- Birth date, time, and location with Google Maps autocomplete
- Zodiac, moon, and rising signs with dropdowns
- Favorite crystals (multi-select checkboxes)
- Spiritual goals and meditation experience
- Preferred practice times

#### Address Tab:
- Google Maps autocomplete for addresses
- US states dropdown
- Auto-populated city, state, zip from Google Maps
- Phone number and emergency contact

#### Preferences Tab:
- Preferred metals (multi-select)
- Jewelry sizing (rings, bracelets, necklaces)
- Crystal allergies and preferences

### 🔧 Setup Instructions:

#### Google Maps API Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google Maps JavaScript API and Places API
4. Create an API key
5. Restrict the API key to your domain (localhost:3001 for development)
6. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
   ```

#### Development Mode:
- The system currently works with demo data when API key is set to `demo_key_for_development`
- In demo mode, it shows dropdown menus instead of Google Maps autocomplete
- All other functionality works normally

### 📍 Features:

#### Without Google Maps API:
- Manual address entry with state dropdown
- City selection from predefined list
- Birth location from major US cities dropdown

#### With Google Maps API:
- Real-time address autocomplete
- Automatic city/state/zip population
- Global location search for birth places
- Address validation and formatting

### 🎯 User Experience:

1. **Portal Access**: Users sign in and access the portal at `/portal`
2. **Profile Tab**: Click the "Profile" tab to access profile editing
3. **Tabbed Interface**: Switch between Spiritual, Address, and Preferences
4. **Auto-Save**: Profile saves automatically when clicking "Save Profile"
5. **Visual Feedback**: Success/error messages for save operations

### 🔒 Security:

- All profile data is saved to the authenticated user's account
- Session validation on all API calls
- SQL injection protection with parameterized queries
- Data validation on both client and server side

### 📊 Database Schema:

The profile system uses the existing `users` table with enhanced columns:
- Spiritual information (birth data, astrology, preferences)
- Shipping address (complete address with validation)
- Jewelry preferences (sizes, metals, allergies)
- Profile completion tracking

### 🚀 Production Deployment:

1. Set up Google Maps API key in production environment
2. Configure domain restrictions for the API key
3. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in production environment variables
4. Test address autocomplete functionality
5. Monitor API usage and set up billing alerts

The enhanced profile system provides a comprehensive spiritual sanctuary experience where users can manage all their personal information in one beautiful, integrated interface.
