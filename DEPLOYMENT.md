# 🚀 Mkulima AI - Firebase Deployment Guide

A complete guide to deploy your Mkulima AI application to Firebase Hosting.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18+) and npm installed
- **Firebase Account** (free at [firebase.google.com](https://firebase.google.com))
- **Google Cloud Project** (created automatically with Firebase)
- **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Git** installed (for version control)

## 📁 Project Structure

```
mkulima-ai-firebase/
├── src/
│   ├── App.jsx           # Main React component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles (Tailwind)
├── public/               # Static assets (favicons, etc.)
├── index.html            # HTML entry point
├── vite.config.js        # Vite bundler config
├── tailwind.config.js    # Tailwind CSS config
├── package.json          # Project dependencies
├── firebase.json         # Firebase Hosting config
├── .firebaserc          # Firebase project config
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore patterns
└── README.md            # This file
```

## 🔧 Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

## 🔐 Step 2: Authenticate with Firebase

```bash
firebase login
```

This opens a browser window to authenticate. Grant necessary permissions.

## 📦 Step 3: Initialize Firebase in Your Project

```bash
firebase init hosting
```

When prompted:
- **Select "Hosting"** (use spacebar to toggle)
- **Use existing project** → Select your Firebase project
- **What do you want to use as your public directory?** → Type `dist`
- **Configure as a single-page app (rewrite all URLs to /index.html)?** → Type `y` (yes)
- **Set up automatic builds and deploys with GitHub?** → Type `n` (no, do it manually)

After running `firebase init hosting`, update `.firebaserc`:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

Replace `your-firebase-project-id` with your actual Firebase project ID.

## 🔑 Step 4: Add Environment Variables

### Option A: Firebase Environment Variables (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Hosting
3. Click on "Hosting" and find the environment variables section
4. Add the following:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** `your-actual-gemini-api-key`

### Option B: Local .env File (Development Only)

Create a `.env.local` file:

```
VITE_GEMINI_API_KEY=your-actual-gemini-api-key
```

**⚠️ Never commit `.env.local` to Git!** It's listed in `.gitignore`.

## 📝 Step 5: Install Dependencies

```bash
npm install
```

## 🏗️ Step 6: Build the Project

```bash
npm run build
```

This creates an optimized `dist/` folder for production.

## ✅ Step 7: Test Locally (Optional)

Preview the production build locally:

```bash
npm run preview
```

Opens at `http://localhost:4173` by default.

## 🚀 Step 8: Deploy to Firebase

### One-Command Deploy

```bash
npm run deploy
```

This runs the build and deploys in one go.

### Manual Deploy (If Needed)

```bash
# Build first
npm run build

# Then deploy
firebase deploy --only hosting
```

### Deploy with Environment Variables

If you're using a `.env.local` file, ensure the API key is set before building:

```bash
# Make sure .env.local exists with VITE_GEMINI_API_KEY
npm run build && firebase deploy --only hosting
```

## 📱 Step 9: Access Your App

After deployment completes, Firebase provides a URL:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id
Hosting URL: https://your-project-id.web.app
```

Visit the **Hosting URL** to access your live Mkulima AI app!

## 🎯 Post-Deployment Checklist

- ✅ Test the app on the Firebase URL
- ✅ Test on mobile devices
- ✅ Verify dark mode toggle works
- ✅ Test chat functionality
- ✅ Check that the API key is being read correctly
- ✅ Test clearing chat history
- ✅ Monitor Firebase console for errors

## 🔄 Updating Your App

When you make changes to the code:

```bash
# Commit your changes
git add .
git commit -m "Description of changes"

# Build and deploy
npm run deploy
```

Or step by step:

```bash
npm run build
firebase deploy --only hosting
```

## 🐛 Troubleshooting

### Issue: "API Key missing" Error

**Solution:** Make sure `VITE_GEMINI_API_KEY` is set in:
1. Firebase environment variables, OR
2. `.env.local` file (development only)

To check in Firefox browser console:
```javascript
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```

### Issue: Build fails with "Cannot find module"

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Pages show 404 after refresh

**Solution:** Your `firebase.json` has a rewrite rule. If not, add:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Issue: Styles not loading

**Solution:** Clear Vite cache:
```bash
npm run clean
npm run build
firebase deploy --only hosting
```

## 📊 Monitoring Your App

### View Logs
```bash
firebase functions:log --project your-project-id
```

### Check Hosting Deployments
```bash
firebase hosting:channel:list
```

### View in Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click "Hosting" → View detailed analytics and logs

## 🔐 Security Notes

- **Never commit `.env.local` or API keys to Git**
- **Use Firebase's environment variables for production**
- **Rotate your API key regularly**
- **Enable Firebase Authentication if you need user login**
- **Set up Cloud Security rules to limit API usage**

## 🚀 Advanced: CI/CD with GitHub

To auto-deploy on every push to `main`:

1. Go to Firebase Console → Hosting → Connect repository
2. Select your GitHub repo
3. Configure auto-deploy:
   - **Build command:** `npm run build`
   - **Directory to publish:** `dist`

## 📚 Useful Links

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vite Build Docs](https://vitejs.dev/guide/build.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Gemini API Docs](https://ai.google.dev/docs)

## ✨ Next Steps

1. **Enhance the App:**
   - Add user authentication with Firebase Auth
   - Store chat history in Firestore
   - Add image upload for crop disease diagnosis

2. **Performance:**
   - Monitor Core Web Vitals in Firebase Console
   - Optimize images and assets
   - Use Firebase Performance Monitoring

3. **Analytics:**
   - Enable Google Analytics in Firebase
   - Track user interactions
   - Monitor error rates

## 📞 Support

If you encounter issues:

1. **Check Firebase logs:** `firebase hosting:channel:list`
2. **Check browser console:** Right-click → Inspect → Console tab
3. **Restart and rebuild:** 
   ```bash
   npm run clean
   npm install
   npm run build
   firebase deploy --only hosting
   ```

---

**Happy Farming with Mkulima AI! 🌾**
