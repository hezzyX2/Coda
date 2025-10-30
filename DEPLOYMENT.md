# Deployment Guide

## Quick Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `OPENAI_API_KEY` = your OpenAI API key
     - `NEXT_PUBLIC_SITE_URL` = your domain (e.g., `https://coda.yourdomain.com`)
   - Click "Deploy"

3. **Done!** Your site will be live at `https://your-project.vercel.app`

## Manual Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### 2. Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to test.

### 3. Choose Deployment Platform

#### Option A: Vercel (Easiest)
- Connect GitHub repo
- Auto-deploys on push
- Free SSL, CDN, and preview deployments

#### Option B: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Deploy: `netlify deploy --prod`

#### Option C: Railway
1. Create account at [railway.app](https://railway.app)
2. New project → Deploy from GitHub
3. Add environment variables
4. Auto-deploys on push

#### Option D: Docker
1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```
2. Build and run with Docker Compose

### 4. Environment Variables

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key

**Optional:**
- `NEXT_PUBLIC_SITE_URL` - For SEO metadata

### 5. Custom Domain

1. In your platform's dashboard, add custom domain
2. Update DNS records as instructed
3. SSL certificate auto-provisioned (Vercel/Netlify)

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test login/signup flow
- [ ] Test AI features (verify API key works)
- [ ] Check mobile responsiveness
- [ ] Test all pages load correctly
- [ ] Verify premium upgrade works
- [ ] Check error pages (404, etc.)
- [ ] Test theme switching
- [ ] Verify data persists (localStorage works)

## Troubleshooting

### Build Fails
- Check Node.js version (needs 18+)
- Verify all dependencies installed
- Check for TypeScript errors: `npm run build`

### AI Features Don't Work
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI API has credits
- Check browser console for errors

### Styles Not Loading
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`

## Monitoring

Consider adding:
- Analytics (Google Analytics, Plausible)
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)

## Performance Optimization

Already configured:
- ✅ SWC minification
- ✅ Image optimization
- ✅ Compression
- ✅ Security headers

## Security Notes

- API keys are server-side only
- Passwords stored in localStorage (consider backend for production)
- Security headers configured in `next.config.js`
- HTTPS enforced on production platforms

