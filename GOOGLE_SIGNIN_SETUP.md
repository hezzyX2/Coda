# 🔐 Google Sign-In Setup Guide

This guide will walk you through setting up Google Sign-In for Codak step-by-step.

## ✅ Quick Setup (5-10 minutes)

### Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top (next to "Google Cloud")
   - Click "NEW PROJECT"
   - Enter project name: `Codak App` (or any name you like)
   - Click "CREATE"
   - Wait 10-20 seconds for project to be created
   - Click "SELECT PROJECT" to switch to your new project

### Step 2: Enable Google Sign-In API

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" > "Library"
   - OR go directly to: https://console.cloud.google.com/apis/library

2. **Search for Google Sign-In**
   - In the search bar, type: `Google Identity Services`
   - Click on "Google Identity Services API"
   - Click the blue "ENABLE" button
   - Wait a few seconds for it to enable

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials Page**
   - In the left sidebar, click "APIs & Services" > "Credentials"
   - OR go directly to: https://console.cloud.google.com/apis/credentials

2. **Configure OAuth Consent Screen** (First time only)
   - Click "CONFIGURE CONSENT SCREEN" button at the top
   - Select "External" (unless you have Google Workspace)
   - Click "CREATE"
   - Fill in the required fields:
     - App name: `Codak`
     - User support email: Your email
     - Developer contact email: Your email
   - Click "SAVE AND CONTINUE"
   - On "Scopes" page, click "SAVE AND CONTINUE"
   - On "Test users" page, click "SAVE AND CONTINUE"
   - On "Summary" page, click "BACK TO DASHBOARD"

3. **Create OAuth Client ID**
   - Click "CREATE CREDENTIALS" button (top of page)
   - Select "OAuth client ID"
   - Application type: Select "Web application"
   - Name: `Codak Web Client` (or any name)
   
   - **Authorized JavaScript origins:**
     - Click "ADD URI"
     - Add: `http://localhost:3000`
     - Add: `https://your-domain.vercel.app` (your actual Vercel URL)
     - Example: `https://coda-website-v1.vercel.app`
   
   - **Authorized redirect URIs:**
     - Click "ADD URI"
     - Add: `http://localhost:3000`
     - Add: `https://your-domain.vercel.app`
   
   - Click "CREATE"
   - **IMPORTANT:** A popup will show your Client ID - **COPY THIS NOW!**
     - It looks like: `123456789-abc123def456.apps.googleusercontent.com`
     - You won't be able to see it again (but can create a new one if needed)

### Step 4: Add Client ID to Your App

1. **Create/Edit `.env.local` file**
   - In your project root folder (`Coda Website V1`), create a file named `.env.local`
   - If it already exists, open it

2. **Add Your Client ID**
   - Add this line (replace with YOUR actual Client ID):
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
   
   - Example:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
   ```

3. **Save the file**

### Step 5: Add to Vercel (for Production)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Go to Settings > Environment Variables**
   - Click "Settings" tab
   - Click "Environment Variables" in left sidebar

3. **Add Environment Variable**
   - Name: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Value: Your Client ID (the same one from `.env.local`)
   - Environment: Select "Production", "Preview", and "Development"
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots (⋯) on your latest deployment
   - Click "Redeploy"

### Step 6: Update Google Console with Production URL

1. **Go back to Google Cloud Console**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click on your OAuth 2.0 Client ID

2. **Add Production URLs**
   - Under "Authorized JavaScript origins", add your Vercel URL:
     - `https://your-domain.vercel.app`
   - Under "Authorized redirect URIs", add:
     - `https://your-domain.vercel.app`
   - Click "SAVE"

### Step 7: Test It!

1. **Restart your dev server** (if running locally):
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Test locally**
   - Go to `http://localhost:3000/login`
   - You should see a "Continue with Google" button
   - Click it and test signing in

3. **Test in production**
   - After redeploying on Vercel, test on your live site
   - The Google Sign-In button should appear and work

## ⚠️ Important Notes

- **The app works WITHOUT Google Sign-In!** Email/password login still works perfectly.
- If you don't set up Google Sign-In, the button just won't appear - that's fine!
- You can set up Google Sign-In later - it's optional.
- The Client ID is safe to expose (it's public in your code).

## 🐛 Troubleshooting

### Button doesn't appear?
- Check that `.env.local` has `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set
- Restart your dev server after adding the env variable
- Check browser console for errors

### "Error 400: redirect_uri_mismatch"?
- Make sure your Vercel URL is added to "Authorized redirect URIs" in Google Console
- URLs must match exactly (including http vs https)

### "Invalid Client" error?
- Double-check the Client ID in `.env.local`
- Make sure there are no extra spaces or quotes
- The ID should end with `.apps.googleusercontent.com`

### Need help?
- Check Google's docs: https://developers.google.com/identity/gsi/web/guides/overview
- Make sure you enabled "Google Identity Services API"

## ✅ You're Done!

Once set up, users can:
- Sign up with Google (one-click registration)
- Sign in with Google (no password needed)
- Link existing email accounts to Google

The app works perfectly fine without this setup - Google Sign-In is just a nice bonus feature!

