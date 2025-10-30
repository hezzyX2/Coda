# Coda - AI-Powered Student Organizer

Coda is a comprehensive productivity app designed for students, powered by AI to help organize tasks, plan schedules, journal thoughts, and receive personalized guidance.

## 🌟 Features

### Free Tier
- ✅ Task management with difficulty levels and time estimates
- ✅ Intelligent planning with focus blocks and breaks
- ✅ Rotating journal prompts for daily reflection
- ✅ Basic AI task tips
- ✅ Wisdom quotes library
- ✅ Multiple aesthetic themes
- ✅ Customizable preferences

### Premium Tier ($9.99/month)
- ✨ **AI Chat** - Unlimited conversations with Coda about life, academics, and personal growth
- ✨ **Journal AI Analysis** - Deep analysis of journal entries with personalized insights
- ✨ **Enhanced AI Advice** - More detailed, comprehensive guidance (2-4x longer responses)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Coda Website V1"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to your Vercel project settings
   - Add `OPENAI_API_KEY` and `NEXT_PUBLIC_SITE_URL`

### Other Platforms

This is a Next.js 14 app, so it can be deployed to:
- **Netlify** - Use Next.js plugin
- **AWS Amplify** - Configure for Next.js
- **Railway** - Connect your GitHub repo
- **DigitalOcean App Platform** - Select Next.js preset

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site's URL (for metadata) | No |

### Customization

- **Themes**: Edit `styles/themes.css` to modify color schemes
- **Quotes**: Add more quotes in `data/quotes.ts`
- **Journal Prompts**: Customize prompts in `data/prompts.ts`

## 📱 Features in Detail

### Task Management
- Create tasks with titles, due dates, difficulty (1-5), and time estimates
- Filter by status (all, pending, completed)
- View urgent tasks (due within 2 days)
- Get AI-powered step-by-step instructions

### Planning
- Automatic schedule generation based on preferences
- Focus blocks and break sessions
- Difficulty bias options (easy-first, hard-first, balanced)

### Journaling
- Daily rotating prompts
- Journal entry tracking
- Premium: AI analysis of patterns and insights

### AI Chat
- Premium feature
- Conversations about academics, relationships, personal growth
- Tailored to user's preferred tone (encouraging, direct, gentle)

### Wisdom Library
- 25+ inspirational quotes
- Categorized by mindset, productivity, growth, wisdom, motivation
- Favorites system
- Daily reflection prompts

## 🎨 Themes

Choose from 5 beautiful themes:
- **Lilac Mist** - Soft purple gradients
- **Midnight Neon** - Cyberpunk cyan
- **Sunset Glow** - Warm oranges
- **Ocean Breeze** - Calming blues
- **Forest Fog** - Natural greens

## 🔐 Authentication

- Local authentication system (stored in localStorage)
- Email and password required
- Session management
- User preferences persist per account

## 💳 Premium Subscription

- One-click upgrade to Premium
- Premium status persists in user account
- Enhanced AI features throughout the app
- More detailed and comprehensive AI responses

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables
- **AI**: OpenAI GPT-4o-mini
- **Storage**: localStorage (client-side)

## 📝 Notes

- All data is stored locally in the browser (localStorage)
- Premium status and user data persist across sessions
- For production, consider adding a backend for data persistence
- OpenAI API key is kept secure server-side (never exposed to client)

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

All rights reserved.

## 🆘 Support

For issues or questions:
1. Check the documentation
2. Review environment variable setup
3. Ensure OpenAI API key is valid and has credits

## 🎯 Roadmap

Future enhancements:
- Backend API for data persistence
- Real payment integration for Premium
- Mobile app version
- Social features
- Calendar integration
- Export/import functionality

---

Built with ❤️ for students everywhere

