# 🏃 How to Run Your Website Locally

## ✅ Correct Way: Use Next.js Dev Server

Your app is built with **Next.js 14**, so you should use Next.js commands:

### Start Development Server:

```bash
npm run dev
```

Then visit: **http://localhost:3000**

---

## ❌ Cannot Use 11ty

**11ty (Eleventy)** is a completely different framework:
- 11ty = Static site generator (like Jekyll)
- Next.js = React framework with server-side rendering
- **They are incompatible** - you cannot run a Next.js app with 11ty

---

## 📋 Available Commands

### Development (What You Should Use)

```bash
npm run dev
```
- Starts development server at `http://localhost:3000`
- Hot reload enabled
- Best for development

### Production Build (Test Production Locally)

```bash
npm run build
npm start
```
- Builds optimized production version
- Starts production server at `http://localhost:3000`
- Best for testing before deployment

### Other Commands

```bash
npm run lint        # Check for code issues
npm run type-check  # Check TypeScript types
```

---

## 🔧 Troubleshooting

### Port Already in Use?

If port 3000 is taken:

```bash
# Use a different port
PORT=3001 npm run dev
```

Or edit `package.json` to change default port (not recommended).

### Module Errors?

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## ✅ Quick Start

1. **Make sure you're in project directory:**
   ```bash
   cd "/Users/ryanpolicicchio/Coda Website V1"
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   - Visit: `http://localhost:3000`
   - You should see your app!

---

**Use `npm run dev` to run your Next.js app locally! 🚀**

