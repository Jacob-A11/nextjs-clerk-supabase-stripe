# LetsReWise - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ GitHub repository with latest code (DONE)
- ✅ Vercel account (free tier works perfectly)
- ⚠️ Environment variables ready (see below)

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `sree-pm/letsrewise`
4. Vercel will auto-detect Next.js configuration
5. Add environment variables (see section below)
6. Click "Deploy"

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /path/to/letsrewise
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings
# - Add environment variables when prompted
```

### 3. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

#### Required for Landing Page (Minimal Deployment)

```env
# Clerk Authentication (for sign-in/sign-up buttons)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### Optional (for full functionality)

```env
# Supabase (for database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (for quiz generation)
OPENAI_API_KEY=sk-...

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PostHog (for analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App URL (will be provided by Vercel)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Vercel Configuration

The project is already configured for Vercel with:

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `pnpm build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `pnpm install` (auto-detected)

**Performance:**
- Edge Functions: Enabled
- Image Optimization: Enabled
- Automatic HTTPS: Enabled
- CDN: Global edge network

### 5. Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `letsrewise.com`)
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

### 6. Post-Deployment Checklist

After successful deployment:

- [ ] Visit your Vercel URL (e.g., `letsrewise.vercel.app`)
- [ ] Test landing page loads correctly
- [ ] Verify responsive design on mobile
- [ ] Check navigation links work
- [ ] Test sign-up flow (if Clerk is configured)
- [ ] Monitor Vercel Analytics dashboard
- [ ] Set up custom domain (optional)

## 🎯 Current Deployment Status

### What's Ready to Deploy NOW

✅ **Landing Page** - Fully functional, production-ready
- Clean Brillance-style design
- Credit-based pricing display
- Responsive layout
- SEO optimized
- Fast loading

✅ **Navigation** - Working sign-in/sign-up links

✅ **Static Assets** - All images and styles

### What Needs Configuration

⚠️ **Authentication** - Requires Clerk API keys
⚠️ **Database** - Requires Supabase setup
⚠️ **AI Features** - Requires OpenAI API key
⚠️ **Payments** - Requires Stripe configuration

## 📋 Minimal Deployment (Landing Page Only)

To deploy just the landing page without backend features:

1. Deploy to Vercel (no environment variables needed initially)
2. Landing page will work perfectly
3. Sign-in/Sign-up buttons will show Clerk's "keyless mode" message
4. Add Clerk keys later to enable authentication

## 🔧 Service Setup Guides

### Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com)
2. Create free account
3. Create new application
4. Copy API keys from Dashboard
5. Add to Vercel environment variables

**Free Tier:** 10,000 monthly active users

### Supabase (Database)

1. Go to [supabase.com](https://supabase.com)
2. Create free account
3. Create new project
4. Run migration: `supabase/migrations/001_initial_schema.sql`
5. Copy API keys from Settings → API
6. Add to Vercel environment variables

**Free Tier:** 500MB database, 1GB file storage

### OpenAI (AI Features)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account and add payment method
3. Create API key
4. Add to Vercel environment variables

**Cost:** ~£0.003 per quiz generation (GPT-4o-mini)

### Stripe (Payments)

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Get test API keys from Dashboard
4. Add to Vercel environment variables
5. Set up webhook endpoint: `https://your-app.vercel.app/api/webhooks/stripe`

**Free Tier:** No monthly fees, pay per transaction

## 🚨 Important Notes

### Security

- Never commit `.env` file to GitHub
- Use Vercel's environment variables feature
- Enable Vercel's security headers
- Set up Vercel's DDoS protection

### Performance

- Vercel automatically optimizes images
- Edge functions run globally
- Static pages are cached at edge
- Incremental Static Regeneration enabled

### Monitoring

- Vercel Analytics: Track page views and performance
- Vercel Logs: Monitor API routes and errors
- PostHog: User behavior analytics (optional)

## 🎉 Expected Result

After deployment, you'll have:

- **Live URL**: `https://letsrewise.vercel.app` (or custom domain)
- **Global CDN**: Fast loading worldwide
- **Automatic HTTPS**: SSL certificate included
- **Auto-deploys**: Every git push triggers new deployment
- **Preview URLs**: Every PR gets a preview deployment

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure GitHub repository is up to date
4. Contact Vercel support (excellent free support)

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- GitHub Repository: https://github.com/sree-pm/letsrewise

---

**Ready to deploy!** The landing page is production-ready and can be deployed to Vercel in under 5 minutes.
