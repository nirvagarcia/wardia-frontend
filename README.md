# 💰 WARDIA - Personal Finance PWA

<div align="center">
  <p><strong>Modern, Secure, and Highly Performant Personal Finance Management</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Structure</a>
  </p>
</div>

---

## 📋 Overview

**WARDIA** is a Progressive Web App designed for comprehensive personal finance management. Built with modern web technologies, it provides a seamless experience for tracking bank accounts, credit cards, recurring services, and banking credentials - all in one secure place.

### Key Highlights
- 🎨 **Beautiful UI** - Tailwind CSS with dark/light theme support
- 🌍 **Multi-language** - Spanish & English (i18n ready)
- 💱 **Multi-currency** - PEN, USD, EUR support
- 📱 **PWA Ready** - Install as a native app
- 🔒 **Security First** - Credential management with clipboard utilities
- ⚡ **Performance** - Next.js 15 with App Router

---

## ✨ Features

### 📊 Dashboard
- Personalized greeting with real-time date
- Financial summary (total balance, credit usage, monthly services)
- Upcoming payments alerts

### 💳 Accounts & Cards
- **Bank Accounts** - View balances, account numbers, CCI with copy-to-clipboard
- **Credit Cards** - Monitor credit usage, limits, and payment dates
- **Credentials** - Secure storage of banking credentials (username, password, digital keys)

### 🔄 Services & Subscriptions
- Track recurring payments (Netflix, Spotify, utilities, etc.)
- Category-based organization
- Payment alerts and frequency tracking
- Add new services with detailed forms

### 👤 Profile & Preferences
- Theme selection (Light/Dark/System)
- Language switcher (Spanish/English)
- Currency preferences (PEN/USD/EUR)
- Notification settings

---

## 🛠 Tech Stack

### Core
- **[Next.js 15.2](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Strict typing
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[React 19](https://react.dev/)** - UI library

### State & Data
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **localStorage** - Persistence for preferences

### UI/UX
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### PWA
- **[@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa)** - Progressive Web App support

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wardia-frontend.git
   cd wardia-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # .env file is already configured with defaults
   # Modify if needed for your environment
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

