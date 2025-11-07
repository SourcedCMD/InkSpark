# Deployment Guide for NoteFlow

This guide will walk you through deploying NoteFlow to Netlify and setting up Supabase.

## Prerequisites

- A GitHub account
- A Supabase account (free tier works)
- A Netlify account (free tier works)
- Node.js 18+ installed locally

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `noteflow` (or any name you prefer)
   - Database Password: Choose a strong password (save it!)
   - Region: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this takes a few minutes)

### 1.2 Set Up the Database

1. In your Supabase project dashboard, go to the "SQL Editor"
2. Click "New query"
3. Copy the entire contents of `supabase-setup.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### 1.3 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to "Settings" > "API"
2. You'll need two values:
   - **Project URL** (under "Project URL")
   - **anon public key** (under "Project API keys" > "anon public")

Save these values - you'll need them in the next step.

## Step 2: Set Up the Application Locally

### 2.1 Clone and Install

```bash
# Install dependencies
npm install
```

### 2.2 Configure Environment Variables

1. Create a `.env` file in the root directory
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 1.3.

### 2.3 Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test the application:
1. Create an account
2. Create a note
3. Test sharing functionality

## Step 3: Deploy to Netlify

### 3.1 Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/noteflow.git
git push -u origin main
```

### 3.2 Deploy to Netlify

#### Option A: Deploy via Netlify Dashboard

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Show advanced" and add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
7. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Deploy:

```bash
netlify deploy --prod
```

4. When prompted, set environment variables:

```bash
netlify env:set VITE_SUPABASE_URL "your_project_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_anon_key"
```

5. Redeploy:

```bash
netlify deploy --prod
```

### 3.3 Verify Deployment

1. Visit your Netlify site URL
2. Test all functionality:
   - Sign up
   - Create notes
   - Share notes
   - Download notes

## Step 4: Configure Supabase Authentication

### 4.1 Set Up Email Authentication

1. In Supabase dashboard, go to "Authentication" > "Providers"
2. Enable "Email" provider (it should be enabled by default)
3. Configure email templates if desired

### 4.2 (Optional) Set Up Custom Domain

If you want to use a custom domain:
1. In Netlify, go to "Domain settings"
2. Add your custom domain
3. Follow Netlify's instructions to configure DNS

### 4.3 (Optional) Configure Email Redirects

1. In Supabase dashboard, go to "Authentication" > "URL Configuration"
2. Add your Netlify site URL to "Site URL"
3. Add redirect URLs as needed

## Troubleshooting

### Issue: "Failed to sign in" errors

**Solution**: Check that your Supabase credentials are correct in Netlify environment variables.

### Issue: Notes not saving

**Solution**: 
1. Verify the database table was created correctly
2. Check Supabase logs for errors
3. Verify RLS policies are set up correctly

### Issue: Shared notes not accessible

**Solution**:
1. Verify the note is marked as `is_public = true`
2. Check that the share_token is correct
3. Verify the RLS policies allow public access

### Issue: Build fails on Netlify

**Solution**:
1. Check build logs for specific errors
2. Verify Node.js version (should be 18+)
3. Ensure all dependencies are in `package.json`

## Security Considerations

1. **Never commit `.env` file**: It's already in `.gitignore`
2. **Use environment variables**: Always use Netlify's environment variables for production
3. **RLS Policies**: The database uses Row Level Security - verify policies are correct
4. **Share Tokens**: Share tokens are unique and hard to guess, but consider adding expiration dates for sensitive notes

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase and Netlify logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

