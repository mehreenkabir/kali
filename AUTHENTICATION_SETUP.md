# 🔐 Authentication Setup Guide for Kalianïa Portfolio

This guide will help you set up MongoDB Atlas and SSO authentication for your portfolio.

## 📋 Prerequisites

Before starting, make sure you have:
- A MongoDB Atlas account
- Google Developer Console access
- (Optional) GitHub, Microsoft, and Apple Developer accounts for additional SSO providers

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create a MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in or create an account
3. Click "Create" to create a new project
4. Name your project (e.g., "Kaliania-Portfolio")
5. Click "Build a Database"
6. Choose "FREE" (M0 Sandbox)
7. Select your preferred region
8. Name your cluster (e.g., "Kaliania-Cluster")
9. Click "Create Cluster"

### 1.2 Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Create a username and secure password
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

## 🔑 Step 2: Google OAuth Setup

### 2.1 Create Google OAuth Credentials

1. Go to [Google Developer Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Go to "Credentials" in the left sidebar
4. Click "Create Credentials" → "OAuth client ID"
5. Configure consent screen if prompted
6. Choose "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
8. Copy Client ID and Client Secret

## 🔧 Step 3: Environment Variables

Update your `.env.local` file with the following:

```bash
# MongoDB Configuration
MONGODB_URI=your_mongodb_atlas_connection_string_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Optional: Additional SSO Providers
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here

APPLE_ID=your_apple_id_here
APPLE_TEAM_ID=your_apple_team_id_here
APPLE_PRIVATE_KEY=your_apple_private_key_here
APPLE_KEY_ID=your_apple_key_id_here
```

## 🚀 Step 4: Run Your Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000/contact` to test authentication

## 📱 Step 5: Additional SSO Providers (Optional)

### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret

### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to Azure Active Directory → App registrations
3. Create new registration
4. Add redirect URI: `http://localhost:3000/api/auth/callback/microsoft`
5. Generate client secret
6. Copy Application (client) ID and client secret

### Apple OAuth
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to Certificates, Identifiers & Profiles
3. Create new App ID and Services ID
4. Configure Sign in with Apple
5. Generate private key and get required IDs

## 🔒 Security Notes

- Always use strong, unique passwords
- Keep your `.env.local` file secure and never commit it to version control
- Use different credentials for development and production
- Regularly rotate your secrets and API keys
- Enable 2FA on all your developer accounts

## 🧪 Testing Authentication

1. Visit `/contact` page
2. Try signing up with email/password
3. Test SSO providers (Google, GitHub, etc.)
4. Verify user data is stored in MongoDB Atlas
5. Check session persistence across page reloads

## 🚨 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check connection string format
   - Verify network access settings
   - Confirm database user credentials

2. **OAuth Redirect Mismatch**
   - Verify redirect URLs in provider settings
   - Check NEXTAUTH_URL in environment variables

3. **Session Not Persisting**
   - Verify NEXTAUTH_SECRET is set
   - Check MongoDB connection
   - Ensure cookies are enabled

4. **CORS Issues**
   - Verify origin URLs in OAuth provider settings
   - Check NEXTAUTH_URL configuration

## 📊 Database Collections

The authentication system will create these MongoDB collections:
- `users` - User account data
- `accounts` - OAuth provider account links
- `sessions` - Active user sessions
- `verification_tokens` - Email verification tokens

## 🎉 You're All Set!

Your Kalianïa portfolio now has a complete authentication system with:
- ✅ Email/password registration and login
- ✅ Google SSO (and other providers)
- ✅ MongoDB user data storage
- ✅ Secure session management
- ✅ Beautiful, brand-consistent UI

Users can now create accounts and access exclusive content in your digital sanctuary!
