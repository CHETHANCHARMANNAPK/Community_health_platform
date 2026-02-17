# HealthCare+ Community Health Platform

A comprehensive community health platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. This platform connects communities around blood donation, hygiene awareness, environmental cleanliness, and overall wellness.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth_&_Firestore-orange?logo=firebase)

## Features

### Core Modules
- **Blood Donation Registration** — Full donor registration form with validation
- **Hygiene Awareness** — Educational content on hygiene best practices
- **Cleaning Drive Management** — Create, manage, and register for community cleanup events

### Advanced Features
- **Blood Bank Inventory** — Real-time blood stock levels by blood type with critical alerts
- **Community Forum** — Post discussions, reply, like, search, and filter by category
- **Health Blog** — Articles with markdown rendering, categories, and search
- **Events Calendar** — Monthly calendar view with event types and upcoming events sidebar
- **Emergency SOS** — Emergency contacts directory and step-by-step first aid guides
- **User Dashboard** — Personal stats, health tracking, activity history, and badges
- **Health Tracker** — Track water intake, steps, sleep, calories, and BMI calculator
- **Leaderboard & Gamification** — Points system, badges, and community rankings
- **Certificate Generator** — PDF certificates for blood donation and volunteer service
- **Interactive Map** — Leaflet/OpenStreetMap integration showing drive locations
- **Notifications** — In-app notification center with read/unread management

### Platform Features
- **Dark Mode** — System-aware theme toggle (light/dark/system)
- **Multi-language Support (i18n)** — English, Spanish, Hindi, and French
- **PWA Support** — Installable as a mobile app with offline caching
- **Responsive Design** — Fully responsive across all screen sizes
- **Admin Dashboard** — Analytics charts, donor management, drive management

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Authentication | Firebase Auth (Google Sign-In) |
| Database | Firebase Firestore (with in-memory fallback) |
| Charts | Recharts |
| Maps | Leaflet + React Leaflet |
| PDF Generation | jsPDF |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **pnpm** package manager (`npm install -g pnpm`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Community_health_platform.git
   cd Community_health_platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables** (optional — app works without Firebase)
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Firebase config values (see [Firebase Setup](#firebase-setup) below).

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Firebase Setup

The app works out of the box with local guest authentication and in-memory data. To enable Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Google Sign-In** under Authentication → Sign-in method
3. Create a **Firestore Database** (start in test mode for development)
4. Go to Project Settings → Your apps → Add a Web app
5. Copy the config values into your `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
6. Restart the dev server

## Project Structure

```
app/                    # Next.js App Router pages
├── admin/              # Admin dashboard with analytics
├── api/                # API routes (blood-bank, forum, blog, etc.)
├── blog/               # Blog listing and article pages
├── blood-bank/         # Blood bank inventory page
├── calendar/           # Events calendar page
├── dashboard/          # User dashboard page
├── emergency/          # Emergency SOS page
├── forum/              # Community forum page
├── leaderboard/        # Leaderboard page
├── layout.tsx          # Root layout with providers
└── page.tsx            # Home page

components/             # React components
├── ui/                 # shadcn/ui base components
├── auth-provider.tsx   # Authentication context
├── header.tsx          # Navigation header
├── i18n-provider.tsx   # Internationalization context
├── health-tracker.tsx  # Health tracking widget
├── notification-bell.tsx
└── ...                 # Other feature components

lib/                    # Utility libraries
├── firestore.ts        # Firestore integration with fallback
├── i18n.ts             # Translation strings
└── utils.ts            # Shared utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
