# Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Set Up GitHub
```bash
cd "Coda Website V1"
git init
git add .
git commit -m "Initial commit"
# Create a repo on GitHub, then:
git remote add origin https://github.com/yourusername/coda.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. **Add Environment Variables:**
   - `OPENAI_API_KEY` = your OpenAI API key
   - `NEXT_PUBLIC_SITE_URL` = your domain (optional)
5. Click "Deploy"

**Done!** Your site is live at `https://your-project.vercel.app`

### Step 3: Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS as instructed
4. SSL certificate auto-provisioned

## ✅ Test Your Deployment

1. Visit your live URL
2. Sign up for an account
3. Create a task
4. Test AI features (verify API key works)
5. Try premium upgrade

## 📝 Important Notes

- **OpenAI API Key**: Required for AI features. Get one at [platform.openai.com](https://platform.openai.com)
- **Free Tier**: Works without premium, but Chat and Journal AI are locked
- **Data**: Stored in browser localStorage (users' data stays on their device)

## 🆘 Troubleshooting

**Build fails?**
- Check Node.js version (needs 18+)
- Verify `OPENAI_API_KEY` is set

**AI not working?**
- Verify API key is correct
- Check OpenAI account has credits
- Look at browser console for errors

**Styles broken?**
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

