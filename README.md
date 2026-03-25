# 💰 WARDIA - Personal Finance PWA

<div align="center">
  <p><strong>Modern, Secure, and Highly Performant Personal Finance Management</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a> •
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
- ⚡ **Performance** - Next.js 16 with App Router & Turbopack
- 🏗️ **Modular Architecture** - Clean, maintainable component structure

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

## 🏗️ Architecture

WARDIA follows a **modular, component-based architecture** designed for maintainability and scalability.

### Design Principles
- **Thin page wrappers** - Next.js pages delegate to view components (9-15 lines)
- **View components** - Core business logic components (200-500 lines)
- **Feature components** - Reusable, single-responsibility components (50-200 lines)
- **Helper utilities** - Separated data structures and utilities (50-150 lines)
- **UI variants** - Tailwind utility functions to reduce repetition

### Refactoring Results (January 2025)

**Before:**
- 4 page files: 2,156 lines of mixed routing + business logic
- Large monolithic files (400-600 lines)
- Repeated Tailwind patterns
- Translation dictionaries in code

**After:**
- 4 page files: **104 lines** (95.2% reduction) - thin wrappers only
- Modular components averaging 150-250 lines
- Reusable UI utility variants
- JSON-based translations

**Key Modularizations:**
- `add-account-modal.tsx`: 584 → **189 lines** + 6 sub-components
- `bank-credentials-section.tsx`: 412 → **158 lines** + 3 sub-components
- `sidebar.tsx`: 251 → **90 lines** + 4 sub-components
- `i18n.ts`: 479 → **50 lines** + 2 JSON files
- `mock-data.ts`: 376 → **15 lines** + 5 modules

**📖 Complete guide:** See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 🛠 Tech Stack

### Core
- **[Next.js 16.2](https://nextjs.org/)** - React framework with App Router & Turbopack
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

