# ⚡ Statzy Studio

> Turn your social media growth into stories worth sharing.
> A production-ready React + Vite card customization studio.

![Statzy Studio](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-4-orange?style=flat-square)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

---

## 📁 Project Structure

```
statzy-studio/
├── src/
│   ├── components/
│   │   ├── LiveCard.jsx          # The actual rendered card (exported as PNG)
│   │   ├── TopBar.jsx            # Header with export buttons
│   │   ├── TemplatePanel.jsx     # Left sidebar — template picker
│   │   ├── ControlPanel.jsx      # Right sidebar — all customization controls
│   │   ├── PreviewArea.jsx       # Center canvas
│   │   ├── MobileDrawer.jsx      # Mobile full-screen preview
│   │   └── MobileControlTabs.jsx # Mobile bottom tab controls
│   ├── hooks/
│   │   └── useExport.js          # PNG/clipboard export via html-to-image
│   ├── store/
│   │   └── useStudio.js          # Zustand global state (persisted to localStorage)
│   ├── utils/
│   │   └── colors.js             # Color helpers (lighten, hexAlpha, isLight)
│   ├── styles/
│   │   └── globals.css           # Tailwind + custom CSS variables
│   ├── App.jsx                   # Root layout (responsive)
│   └── main.jsx                  # Entry point
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js                # Build config with manual code splitting
├── tailwind.config.js
└── package.json
```

---

## 🎨 Features

### Card Customization
- **5 template styles**: Bubblegum Blob, Neon Glass, Rave Scanner, Y2K Chrome, Clean Minimal
- **8 palette presets** + custom color pickers (Color 1, Color 2, Accent, Background)
- **4 fonts**: Syne, Space Mono, Outfit, DM Serif Display
- **Typography controls**: Number size slider (40–100px)
- **Shape controls**: Corner radius slider (0–40px)
- **3 export sizes**: Square (1:1), Story (9:16), Banner (1.91:1)
- **Toggles**: Mini stats, Live dot, Watermark

### Content Controls
- Main stat number + label
- Handle, growth badge, platform
- 3 mini stat chips (value + label each)

### Export
- **Free**: PNG at 3× pixel ratio via `html-to-image`
- **Pro** (wired up, awaiting backend): Animated GIF, MP4 Video Recap
- Copy to clipboard support

### UX
- Persisted state via `localStorage` (Zustand persist middleware)
- 🎲 Randomize button for instant inspiration
- Responsive: desktop 3-column layout, mobile bottom tabs + preview drawer
- Animated card backgrounds (blobs, scan line, shimmer, orbs)

---

## 🏗️ Deployment

### Vercel (Recommended — free for up to ~10K users/month)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

**vercel.json** (add to root):
```json
{
  "builds": [{ "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }],
  "routes": [{ "src": "/(.*)", "dest": "/index.html" }]
}
```

### Netlify

```bash
# Build
npm run build

# Drag dist/ folder to netlify.com/drop
# Or: netlify deploy --prod --dir=dist
```

Add `public/_redirects`:
```
/*  /index.html  200
```

### Docker (for self-hosting 10K+ users)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
events { worker_connections 1024; }
http {
  include mime.types;
  gzip on;
  gzip_types text/css application/javascript image/svg+xml;
  
  server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
      try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|svg|woff2)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
  }
}
```

---

## 📈 Scaling to 10,000 Users

This app is **entirely frontend** — no backend required for the free tier. It scales to virtually unlimited users via CDN.

| Users | Infrastructure | Cost/month |
|-------|---------------|------------|
| 0–10K | Vercel Free / Netlify Free | $0 |
| 10K–100K | Vercel Pro / Netlify Pro | ~$20 |
| 100K+ | Cloudflare Pages + R2 | ~$5 |

**Optimization checklist:**
- [x] Code splitting (vendor, motion, state, export chunks)
- [x] Lazy font loading via Google Fonts
- [x] Zustand (tiny, no re-render overhead)
- [x] `html-to-image` only loaded when exporting (dynamic import recommended)
- [ ] Add `<Suspense>` lazy loading for ControlPanel on mobile
- [ ] Service Worker for offline support (add Vite PWA plugin)
- [ ] CDN for fonts (self-host via `fontsource` npm packages for full offline)

**To add analytics (PostHog):**
```bash
npm install posthog-js
```
```js
// main.jsx
import posthog from 'posthog-js'
posthog.init('YOUR_KEY', { api_host: 'https://app.posthog.com' })
```

---

## 🔌 Adding a Backend (Phase 2)

When you're ready for user accounts, Pro subscriptions, and real social data:

```
Backend stack recommendation:
├── Supabase (auth + database)        # Free up to 500MB
├── Stripe (payments)                  # % per transaction
├── Cloudflare Workers (API routes)    # Free 100K req/day
└── Upstash Redis (rate limiting)      # Free tier
```

**API endpoints to build:**
- `POST /api/auth` — OAuth with Instagram/LinkedIn
- `GET  /api/metrics/:platform` — Fetch real user analytics
- `POST /api/export/gif` — Server-side animated GIF generation (FFmpeg)
- `POST /api/export/video` — MP4 recap generation
- `GET  /api/templates` — User's saved templates

---

## 🧩 Tech Stack

| Package | Purpose | Why |
|---------|---------|-----|
| **React 18** | UI framework | Concurrent mode, fastest ecosystem |
| **Vite 5** | Build tool | HMR in <50ms, fastest dev experience |
| **Tailwind 3** | Utility CSS | Zero runtime, purged in production |
| **Zustand 4** | State management | 1KB, no boilerplate, persisted |
| **html-to-image** | PNG/blob export | Cleanest DOM→image library |
| **framer-motion** | Animations | Installed, ready for page transitions |
| **react-colorful** | Color picker | Installed, use as upgrade to native input |

---

## 🔧 Environment Variables

Create `.env.local`:
```env
VITE_APP_URL=https://statzy.app
VITE_POSTHOG_KEY=your_posthog_key
VITE_STRIPE_PK=pk_live_...
```

Access in code: `import.meta.env.VITE_APP_URL`

---

## 📜 License

MIT — build on it freely.

---

**Made with ⚡ by Statzy**
