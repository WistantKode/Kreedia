# 🌱 Kreedia - Clean the Environment, Earn Crypto

A complete Next.js 14 application that transforms environmental actions into crypto rewards and NFTs.

![Kreedia Logo](public/logo_green.png)

## ✨ Features

### 🔐 Authentication

- **Google OAuth Login** via Firebase Auth
- **Route protection** with automatic redirection
- **Persistent session** management

### 📊 Complete Dashboard

- **Crypto balance** with weekly progression
- **Impact statistics** (missions, cleaned areas, photos)
- **Progress chart** of earnings with Recharts
- **Ongoing and available** missions
- **Quick actions** for easy navigation

### 🎯 Mission System

- **Advanced filtering** by difficulty and location
- **Search** by name, description or place
- **Multiple statuses**: Available, In Progress, Completed
- **Crypto rewards** and NFTs
- **Responsive view** grid/list

### 🏆 NFT Collection

- **Responsive gallery** with grid and list views
- **Rarity filtering** (Common to Legendary)
- **Sorting** by date, rarity or name
- **Detailed statistics** by rarity type
- **Complete metadata** (location, date, description)

### 👤 User Profile

- **Environmental impact** statistics
- **Achievement system** with progression
- **Detailed activity** history
- **Account management** and logout

### 🎨 Design & UX

- **Mobile-first responsive** with adaptive navigation
- **Dark/light mode** with localStorage persistence
- **Smooth animations** and transitions
- **Consistent green** color scheme (#22c55e)
- **Reusable components** with Tailwind CSS

### 🔔 Notification System

- **Real-time notifications** with counter badge
- **Multiple types**: success, info, warning, error
- **Contextual actions** (mark as read, delete)
- **Smart relative** timestamps

## 🚀 Technologies

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + custom components
- **Authentication**: Firebase Auth + Google Provider
- **Database**: Firestore (NoSQL)
- **Charts**: Recharts for visualizations
- **Icons**: Lucide React (1000+ icons)
- **TypeScript**: Complete type safety
- **Responsive**: Mobile-first design
- **Web3**: RainbowKit + Wagmi for wallet connection

## 📱 Responsive Navigation

### Mobile (< 768px)

- **Bottom navigation** with 4 main tabs
- **Touch-friendly** large buttons
- **Visual active** indicator
- **Optimized vertical** layout

### Desktop (≥ 768px)

- **Top navigation** horizontal
- **Potential sidebar** for extensions
- **Adaptive grid** layout
- **Rich hover** effects

## 🎯 Architecture

```
app/
├── (dashboard)/              # Protected route group
│   ├── layout.tsx           # Layout with Header + NavBar
│   ├── dashboard/page.tsx   # Main page
│   ├── missions/page.tsx    # Mission management
│   ├── nft/page.tsx         # NFT collection
│   ├── profile/page.tsx     # User profile
│   └── settings/page.tsx    # User settings
├── auth/signin/page.tsx     # Login page
└── api/                     # API routes

components/
├── ui/                     # Base UI components
│   ├── Button.tsx         # Button with variants
│   ├── Card.tsx           # Card component
│   ├── Badge.tsx          # Colored badges
│   ├── ImageUpload.tsx    # Image upload component
│   └── MultiFileUpload.tsx # Multiple file upload
├── Header.tsx             # Header with notifications
├── NavBar.tsx             # Responsive navigation
├── CryptoBalanceCard.tsx  # Crypto balance display
├── MissionCard.tsx        # Mission card
├── NFTCard.tsx            # NFT card
├── WeeklyStats.tsx        # Weekly statistics
├── ProgressChart.tsx      # Progress chart
└── NotificationSystem.tsx # Notification system

lib/
├── firebase/              # Firebase configuration
│   ├── config.ts         # Firebase config
│   ├── auth.ts           # Firebase Auth
│   └── services/         # Firestore services
├── upload/               # File upload API
│   └── api.ts           # Upload service
├── providers.tsx         # React providers
├── theme-provider.tsx    # Dark mode provider
└── utils.ts              # Utilities

hooks/
├── useAuth.ts           # Authentication hook
├── useMissions.ts       # Missions hook
├── useWallet.ts         # Wallet connection hook
└── useFileUpload.ts     # File upload hook
```

## 📊 Data & State

### Firebase Integration

- **Firestore Database** for real-time data
- **Firebase Auth** for user authentication
- **Cloud Storage** for file uploads
- **Real-time listeners** for live updates
- **Offline support** with caching

### State Management

- **Local state** for UI (filters, search)
- **Firebase Auth** for authentication
- **localStorage** for theme preferences
- **Custom hooks** for data fetching
- **Minimal props drilling** with composition

## 🎨 Theme & Design

### Color Palette

- **Primary**: #22c55e (eco-friendly green)
- **Backgrounds**: White/Dark gray adaptive
- **Text**: Optimal contrasts for accessibility
- **Borders**: Subtle and consistent

### Styled Components

- **Cards** with hover effects and shadows
- **Buttons** multiple variants (primary, outline, ghost)
- **Badges** colored by context
- **Forms** with focus states
- **Loading** spinners consistent

## 🔧 Simplified Configuration

1. **Clone the project**
2. **Install dependencies**: `npm install`
3. **Create .env.local** (see ENV-SETUP.md)
4. **Run**: `npm run dev`
5. **Enjoy**: Automatic connection without configuration! 🎉

### 🎭 Firebase Integration

The application works with **real backend** thanks to:

- **Firebase Authentication** with Google OAuth
- **Firestore Database** for real-time data
- **Cloud Storage** for file uploads
- **Real-time updates** and synchronization
- **Web3 integration** with RainbowKit

## 🌟 Key Features

- ✅ **Production-ready code** with TypeScript
- ✅ **Consistent and professional** design
- ✅ **Optimized performance** Next.js 14
- ✅ **Security** OAuth authentication
- ✅ **Accessibility** WCAG guidelines
- ✅ **Responsive** all devices
- ✅ **Extensible** modular architecture
- ✅ **Maintainable** organized and documented code
- ✅ **Web3 ready** wallet integration
- ✅ **Real-time data** with Firebase

## 🚀 Deployment

Application ready for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Railway**

All dependencies are serverless compatible.

## 📚 Documentation

- **Environment Setup**: See `ENV-SETUP.md`
- **Firebase Configuration**: See `FIREBASE-SETUP.md`
- **Upload API**: See `UPLOAD-API-SETUP.md`
- **Google Maps**: See `ENV-GOOGLE-MAPS.md`

---

_Built with ❤️ and 🌱 for a greener future_
