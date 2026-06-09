# 🛠️ Development & Setup Guide

Complete guide for setting up Mkulima AI for development and deployment.

## 🎯 Quick Setup (5 minutes)

```bash
# 1. Clone and install
git clone <your-repo>
cd mkulima-ai-firebase
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your Gemini API key

# 3. Start development
npm run dev

# 4. Open browser
# Visit http://localhost:5173
```

## 📋 System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.0.0 | 20.x or latest LTS |
| npm | 9.0.0 | 10.x |
| RAM | 2GB | 4GB+ |
| Disk Space | 500MB | 1GB+ |
| OS | Linux/Mac/Windows | Mac or Linux |

## 📦 Installation Steps

### 1. Install Node.js & npm

**macOS (Homebrew)**
```bash
brew install node
```

**Ubuntu/Debian**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows**
Download from [nodejs.org](https://nodejs.org)

Verify installation:
```bash
node --version  # v18.0.0 or higher
npm --version   # 9.0.0 or higher
```

### 2. Clone Repository

```bash
git clone https://github.com/yourusername/mkulima-ai.git
cd mkulima-ai-firebase
```

### 3. Install Dependencies

```bash
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### 4. Setup Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit with your API key
nano .env.local  # or use your editor
```

**Content of `.env.local`:**
```
VITE_GEMINI_API_KEY=sk-...your-key-here...
VITE_ENV=development
VITE_API_MODEL=gemini-3-flash-preview
```

### 5. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key
5. Paste it in your `.env.local` file

## 🚀 Running Locally

### Development Server

```bash
npm run dev
```

**Output:**
```
  VITE v6.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### What happens in development:

- **Hot Module Replacement (HMR)** - Changes auto-reload
- **Source Maps** - Easy debugging
- **No minification** - Readable code in DevTools
- **Unoptimized bundle** - Faster build times

### Browser DevTools

Press `F12` or right-click → Inspect

**Check API Key:**
```javascript
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```

**Clear Chat History:**
```javascript
sessionStorage.clear()
```

## 🔨 Building for Production

### Build Command

```bash
npm run build
```

**What it does:**
- Minifies JavaScript & CSS
- Optimizes images
- Splits code into chunks
- Creates `dist/` folder (~200KB gzipped)

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-{hash}.js
│   ├── vendor-{hash}.js
│   └── style-{hash}.css
└── vite.svg
```

### Preview Production Build

```bash
npm run preview
```

Opens at `http://localhost:4173`

## 📁 Project Structure Explained

```
mkulima-ai-firebase/
│
├── src/                          # Source code
│   ├── App.jsx                   # Main component (376 lines)
│   │   ├── SYSTEM_PROMPT        # AI behavior config
│   │   ├── getKeywordHints()    # Context hints
│   │   ├── handleSend()         # Message logic
│   │   └── UI rendering         # React JSX
│   ├── main.jsx                  # React entry
│   └── index.css                 # Tailwind imports
│
├── public/                       # Static assets
│   ├── robots.txt               # SEO
│   └── README.md                # Info
│
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.js               # Build config
├── tailwind.config.js           # Tailwind config
├── firebase.json                # Firebase config
├── .firebaserc                  # Firebase project ID
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore patterns
├── README.md                    # User guide
├── DEPLOYMENT.md                # Firebase deployment
└── SETUP.md                     # This file
```

## 🔧 Configuration Files

### vite.config.js

```javascript
// Controls build process
- Input: src/
- Output: dist/
- Plugins: React, Tailwind
- Min size, source maps disabled
```

### tailwind.config.js

```javascript
// Tailwind CSS configuration
- Colors: primary (#5A5A40), secondary, accent
- Extend default theme
- Dark mode support
```

### firebase.json

```json
// Firebase Hosting config
- Public directory: dist/
- Rewrites: SPA routing
- Headers: Cache control
```

### .firebaserc

```json
// Firebase project mapping
- Default project ID
- Must match your Firebase project
```

## 📝 Git Workflow

### Initial Setup

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/yourusername/mkulima-ai.git
git branch -M main
git push -u origin main
```

### Daily Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add dark mode toggle"

# Push to GitHub
git push origin main
```

### Good Commit Messages

```
feat: add weather integration
fix: resolve chat scroll issue
docs: update API documentation
style: improve button styling
refactor: optimize message rendering
chore: update dependencies
```

## 🚀 Deployment Workflows

### Quick Deploy to Firebase

```bash
# Build and deploy in one command
npm run deploy

# Equivalent to:
npm run build && firebase deploy --only hosting
```

### Step-by-Step Deploy

```bash
# 1. Test locally
npm run dev

# 2. Build production
npm run build

# 3. Preview build
npm run preview

# 4. Commit changes
git add .
git commit -m "Release v1.0.0"
git push origin main

# 5. Deploy
firebase deploy --only hosting

# 6. Check deployment
firebase hosting:channel:list
```

## 🔍 Code Quality

### ESLint (Optional - Add Later)

```bash
npm install --save-dev eslint eslint-plugin-react

# Create config
npx eslint --init

# Run linting
npx eslint src/
```

### Prettier (Optional - Add Later)

```bash
npm install --save-dev prettier

# Format code
npx prettier --write src/
```

## 🐛 Debugging

### Browser Console Logs

```javascript
// In App.jsx
console.log("Message received:", input);
console.log("API Response:", response);
```

**Access in browser:**
1. Right-click → Inspect
2. Console tab
3. Filter by "mkulima" to find logs

### Network Requests

In DevTools → Network tab:
- Filter by "api"
- Check request headers
- Verify API key is being sent
- Check response status

### React DevTools Extension

```bash
# Install extension for Chrome/Firefox
# Then inspect React components directly
```

### Local Storage

```javascript
// Check chat history
sessionStorage.getItem('mkulima_chat_history')

// Clear all storage
sessionStorage.clear()
```

## 🚨 Common Issues & Solutions

### "Cannot find module '@google/genai'"

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "API Key missing" Error

```javascript
// Check in console
console.log(import.meta.env.VITE_GEMINI_API_KEY)

// If undefined:
// 1. Verify .env.local exists
// 2. Check key is correct
// 3. Restart dev server (Ctrl+C then npm run dev)
```

### Port 5173 Already in Use

```bash
# Use different port
npm run dev -- --port 3000
```

### Dark mode not persisting

```javascript
// Check localStorage
localStorage.getItem('theme')

// Clear and reset
localStorage.clear()
```

## 📚 Additional Resources

### Official Docs
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Gemini API](https://ai.google.dev/)

### Tutorials
- [React Hooks](https://react.dev/reference/react)
- [Tailwind Components](https://tailwindcss.com/docs/customization/colors)
- [Firebase Console](https://console.firebase.google.com)

### Community
- [Discord](#)
- [GitHub Discussions](#)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

## 🎓 Learning Path

### Beginner
1. Understand project structure
2. Run dev server
3. Make simple CSS changes
4. Deploy to Firebase

### Intermediate
1. Add new UI components
2. Modify AI system prompt
3. Handle API errors
4. Optimize performance

### Advanced
1. Add user authentication
2. Integrate cloud database (Firestore)
3. Add PWA features
4. Custom domain setup

## ✅ Pre-Deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables set (`.env.local`)
- [ ] Code committed to git (`git push origin main`)
- [ ] Build succeeds (`npm run build`)
- [ ] Build previewed locally (`npm run preview`)
- [ ] No console errors in browser
- [ ] API key working correctly
- [ ] Chat responses streaming properly
- [ ] Dark mode toggle functional
- [ ] Mobile responsive tested
- [ ] Firebase CLI installed (`firebase --version`)
- [ ] Logged into Firebase (`firebase login`)
- [ ] Project ID in `.firebaserc` correct

## 🎯 Next Steps

1. **Complete Setup**
   - [ ] Install Node.js
   - [ ] Clone repository
   - [ ] Run `npm install`
   - [ ] Add API key to `.env.local`
   - [ ] Start dev server: `npm run dev`

2. **Test Locally**
   - [ ] Open http://localhost:5173
   - [ ] Test chat functionality
   - [ ] Try dark mode
   - [ ] Test mobile view (F12 → responsive)

3. **Deploy**
   - [ ] Follow DEPLOYMENT.md
   - [ ] Deploy to Firebase
   - [ ] Test live URL
   - [ ] Share with users

## 🆘 Support

If stuck:

1. Check this guide first
2. Search [GitHub Issues](https://github.com/yourusername/mkulima-ai/issues)
3. Check browser console for errors
4. Ask in Discord/Community
5. Create new issue with:
   - What you tried
   - Error message
   - Your environment (OS, Node version)
   - Steps to reproduce

---

**Happy Coding! 🚀**

Last Updated: March 2026
Version: 1.0.0
