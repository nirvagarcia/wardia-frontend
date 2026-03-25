# WARDIA Frontend Architecture Guide

**Updated**: January 2025  
**Version**: 2.0 - Post-Refactoring

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Organization](#component-organization)
3. [File Size Guidelines](#file-size-guidelines)
4. [Modularization Patterns](#modularization-patterns)
5. [UI Utilities](#ui-utilities)
6. [Internationalization](#internationalization)
7. [Best Practices](#best-practices)

---

## Project Structure

```
src/
├── app/                           # Next.js App Router pages
│   ├── (auth)/                    # Authentication routes
│   │   ├── layout.tsx             # Auth layout wrapper
│   │   └── login/
│   │       └── page.tsx           # Login page (thin wrapper)
│   ├── (main)/                    # Main application routes
│   │   ├── layout.tsx             # Main layout with Sidebar + BottomNav
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard page (thin wrapper)
│   │   ├── accounts/
│   │   │   └── page.tsx           # Accounts page (thin wrapper)
│   │   ├── services/
│   │   │   └── page.tsx           # Services page (thin wrapper)
│   │   └── profile/
│   │       └── page.tsx           # Profile page (thin wrapper)
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home redirect
│
├── components/
│   ├── features/                  # Feature-specific components
│   │   ├── account-card.tsx       # Individual account display card
│   │   ├── accounts-grid.tsx      # Account cards grid layout
│   │   ├── bank-credentials-section.tsx  # Credentials container (158 lines)
│   │   ├── credential-card.tsx    # Individual credential card (178 lines)
│   │   ├── credential-field.tsx   # Reusable credential field (65 lines)
│   │   ├── credit-card-display.tsx  # Credit card visualization
│   │   ├── debit-card-visual.tsx  # Debit card visualization
│   │   ├── empty-credentials-state.tsx  # Empty state (24 lines)
│   │   └── interactive-card.tsx   # Interactive card component
│   │
│   ├── layout/                    # Layout components
│   │   ├── sidebar.tsx            # Main sidebar (90 lines)
│   │   ├── sidebar-header.tsx     # Sidebar logo/collapse (51 lines)
│   │   ├── sidebar-controls.tsx   # Theme/language/currency (80 lines)
│   │   ├── sidebar-nav-item.tsx   # Navigation item (53 lines)
│   │   ├── sidebar-profile.tsx    # User profile section (45 lines)
│   │   └── bottom-nav.tsx         # Mobile bottom navigation
│   │
│   ├── modals/                    # Modal dialogs
│   │   ├── add-account-modal.tsx  # Add/edit account modal (189 lines)
│   │   ├── modal-header.tsx       # Reusable modal header (23 lines)
│   │   ├── modal-actions.tsx      # Cancel/Submit buttons (26 lines)
│   │   ├── account-type-selector.tsx  # Debit/credit toggle (53 lines)
│   │   ├── account-form-fields.tsx    # Debit form fields
│   │   ├── credit-card-form-fields.tsx  # Credit form fields
│   │   ├── form-validation.ts     # Validation logic
│   │   ├── add-credentials-modal.tsx  # Add credentials modal
│   │   ├── add-service-modal.tsx  # Add service modal
│   │   └── confirm-modal.tsx      # Confirmation dialog
│   │
│   ├── providers/                 # Context providers
│   │   └── theme-provider.tsx     # Theme provider wrapper
│   │
│   ├── ui/                        # Base UI components (future)
│   │   # Placeholder for reusable Button, Card, Badge components
│   │
│   └── views/                     # Page view components
│       ├── dashboard-view.tsx     # Dashboard content (263 lines)
│       ├── accounts-view.tsx      # Accounts page content (496 lines)
│       ├── accounts-helpers.ts    # Account utilities (104 lines)
│       ├── services-view.tsx      # Services page content (447 lines)
│       ├── services-helpers.ts    # Services utilities (98 lines)
│       ├── profile-view.tsx       # Profile page content (369 lines)
│       ├── profile-helpers.ts     # Profile data structures (94 lines)
│       └── selection-modal.tsx    # Generic selection modal (78 lines)
│
├── hooks/                         # Custom React hooks
│   ├── use-clipboard.ts           # Clipboard operations
│   └── use-mask.ts                # Value masking/unmasking
│
├── lib/                           # Utilities and helpers
│   ├── bank-logos.ts              # Bank logo mappings
│   ├── currency.ts                # Currency formatting
│   ├── i18n.ts                    # Internationalization core (50 lines)
│   ├── mock-data.ts               # Mock data orchestrator (15 lines)
│   ├── security.ts                # Security utilities
│   ├── utils.ts                   # General utilities
│   │
│   ├── i18n/                      # Translation files
│   │   ├── en.json                # English translations
│   │   └── es.json                # Spanish translations
│   │
│   ├── mock/                      # Mock data modules
│   │   ├── accounts.ts            # Mock accounts
│   │   ├── services.ts            # Mock services
│   │   ├── credentials.ts         # Mock credentials
│   │   ├── transactions.ts        # Mock transactions
│   │   └── credit-cards.ts        # Mock credit cards
│   │
│   └── ui/                        # UI utility classes
│       ├── index.ts               # Centralized export
│       ├── button-variants.ts     # Button Tailwind utilities
│       ├── card-variants.ts       # Card Tailwind utilities
│       ├── input-variants.ts      # Input Tailwind utilities
│       └── badge-variants.ts      # Badge Tailwind utilities
│
├── store/                         # Zustand state management
│   ├── preferences-store.ts       # User preferences (theme, language, currency)
│   └── ui-store.ts                # UI state management
│
└── types/                         # TypeScript definitions
    ├── finance.ts                 # Financial data types
    └── index.ts                   # General types
```

---

## Component Organization

### **Page Structure Pattern**

Next.js App Router requires `page.tsx` files for routing. We use a **thin wrapper pattern**:

```tsx
// src/app/(main)/dashboard/page.tsx
import { DashboardView } from "@/components/views/dashboard-view";

export default function Page() {
  return <DashboardView />;
}
```

**Why?**
- ✅ Separates routing concerns from business logic
- ✅ Keeps page files minimal (9-13 lines)
- ✅ Makes view components reusable and testable
- ✅ Improves code organization and maintainability

### **View Components**

View components contain the actual page content and logic:

- Located in `src/components/views/`
- Named with `-view.tsx` suffix
- Can be 200-500 lines depending on complexity
- Split into helpers when logic exceeds 100 lines

**Example:**
```tsx
// src/components/views/dashboard-view.tsx
"use client";
export function DashboardView() {
  // Page content and logic here
}
```

### **Feature Components**

Reusable, feature-specific components:

- Located in `src/components/features/`
- Single responsibility principle
- Typically 50-200 lines
- Can be used across multiple views

### **Layout Components**

Navigation and layout wrappers:

- Located in `src/components/layout/`
- Modularized for maintainability
- Example: Sidebar split into 5 components (90 lines main + 4 sub-components)

### **Modal Components**

Dialog and modal windows:

- Located in `src/components/modals/`
- Aggressive modularization for complex modals
- Reusable modal parts (header, actions, form fields)
- Example: `add-account-modal.tsx` → 6 sub-components

---

## File Size Guidelines

### **Target Ranges**

| File Type | Target Lines | Maximum Lines | Action if Exceeded |
|-----------|--------------|---------------|-------------------|
| Page wrappers | 9-15 | 20 | Extract to view component |
| View components | 200-500 | 600 | Split into helpers + sub-components |
| Feature components | 50-200 | 300 | Extract sub-components |
| Modal components | 100-250 | 350 | Extract modal parts (header, actions, fields) |
| Helper utilities | 50-150 | 200 | Split by responsibility |
| Layout components | 80-150 | 200 | Modularize (header, nav, footer) |

### **When to Modularize**

**Immediate Action Required (>300 lines):**
- Create helper file for data structures/utilities
- Extract repeated UI patterns into sub-components
- Separate form logic from display logic

**Recommended Refactoring (200-300 lines):**
- Consider extracting large sections (e.g., forms, lists, cards)
- Move inline components to separate files
- Create reusable variants for similar patterns

**Good As-Is (<200 lines):**
- Keep as single file if cohesive
- Document complex logic with comments
- Ensure single responsibility principle

---

## Modularization Patterns

### **Pattern 1: View + Helpers**

For views with complex data structures or utilities:

```
profile/
└── page.tsx (9 lines) → Thin wrapper

components/views/
├── profile-view.tsx (369 lines) → Main view logic
├── profile-helpers.ts (94 lines) → Data structures, options
└── selection-modal.tsx (78 lines) → Reusable modal
```

### **Pattern 2: Container + Cards**

For list/grid displays:

```
accounts-view.tsx (496 lines) → Container with state
├── accounts-grid.tsx → Grid layout
├── account-card.tsx → Individual card
└── accounts-helpers.ts (104 lines) → Utilities
```

### **Pattern 3: Modal Decomposition**

For complex modals with forms:

```
add-account-modal.tsx (189 lines) → Orchestrator
├── modal-header.tsx (23 lines) → Reusable header
├── modal-actions.tsx (26 lines) → Reusable buttons
├── account-type-selector.tsx (53 lines) → Toggle selector
├── account-form-fields.tsx → Debit form
├── credit-card-form-fields.tsx → Credit form
└── form-validation.ts → Validation logic
```

### **Pattern 4: Section + Sub-Components**

For complex sections with nested UI:

```
bank-credentials-section.tsx (158 lines) → DnD container
├── credential-card.tsx (178 lines) → Sortable card
├── credential-field.tsx (65 lines) → Reusable field
└── empty-credentials-state.tsx (24 lines) → Empty state
```

---

## UI Utilities

### **Tailwind Utility Variants**

To reduce repetitive Tailwind classes, use utility variants:

```ts
import { getButtonClasses, getCardClasses, getBadgeClasses } from "@/lib/ui";

// Button example
<button className={getButtonClasses("primary", "md", false, false, "custom-class")}>
  Submit
</button>

// Card example
<div className={getCardClasses(true, false, "lg", "custom-shadow")}>
  Card content
</div>

// Badge example
<span className={getBadgeClasses("cyan", "md", "font-bold")}>
  Active
</span>
```

### **Available Variants**

**Buttons:**
- Variants: `primary`, `secondary`, `outline`, `danger`, `ghost`, `success`
- Sizes: `sm`, `md`, `lg`

**Cards:**
- Options: `elevated`, `interactive`
- Padding: `none`, `sm`, `md`, `lg`, `xl`
- Utilities: `header`, `footer` (with borders)

**Inputs:**
- States: `default`, `error`, `success`, `disabled`
- Includes: Label, error message, helper text utilities

**Badges:**
- Variants: `default`, `cyan`, `green`, `red`, `amber`, `purple`
- Sizes: `sm`, `md`, `lg`

**Gradients:**
- `subtle`, `cyan`, `purple`, `amber`

---

## Internationalization

### **Structure**

```
lib/
├── i18n.ts (50 lines) → Core i18n logic
└── i18n/
    ├── en.json (300+ keys) → English translations
    └── es.json (300+ keys) → Spanish translations
```

### **Usage**

```tsx
import { getTranslation } from "@/lib/i18n";

const { language } = usePreferencesStore();
const t = (key: string, vars?: Record<string, string | number>) => 
  getTranslation(language, key, vars);

// Simple translation
<h1>{t("dashboard.title")}</h1>

// With variables
<p>{t("accounts.balance", { amount: "1,234.56" })}</p>
```

### **Translation Keys Organization**

```json
{
  "nav": { "home": "Home", "accounts": "Accounts", ... },
  "dashboard": { "title": "Dashboard", ... },
  "accounts": { "title": "Accounts", ... },
  "services": { "title": "Services", ... },
  "profile": { "title": "Profile", ... },
  "credentials": { "username": "Username", ... },
  "creditCard": { "cardNumber": "Card Number", ... },
  "common": { "edit": "Edit", "delete": "Delete", ... }
}
```

---

## Best Practices

### **1. Component Creation**

✅ **DO:**
- Start with a single file for new components
- Extract when file exceeds 200-300 lines
- Use descriptive, specific names (`credential-card.tsx` not `card.tsx`)
- Follow existing patterns in the codebase

❌ **DON'T:**
- Create unnecessarily small files (<30 lines unless reused)
- Over-engineer simple components
- Mix routing logic with business logic in page files

### **2. State Management**

✅ **DO:**
- Use Zustand for global preferences (theme, language, currency)
- Keep local state in components with `useState`
- Lift state only when needed by multiple components

❌ **DON'T:**
- Put all state in global store
- Pass state through 5+ levels of components (use context or extract)

### **3. Styling**

✅ **DO:**
- Use Tailwind utility classes directly for simple components
- Use UI variants (`getButtonClasses`, etc.) for repeated patterns
- Follow dark mode patterns: `dark:bg-zinc-900`, `dark:text-white`
- Use `cn()` helper from `@/lib/utils` for conditional classes

❌ **DON'T:**
- Create CSS modules or styled-components
- Repeat the same 10+ class pattern without extracting to utility
- Forget dark mode variants

### **4. Imports**

✅ **DO:**
- Use path aliases: `@/components`, `@/lib`, `@/types`
- Group imports: React → Next.js → Third-party → Local
- Use named exports for utilities (`export function getTranslation`)
- Use default exports for page components

❌ **DON'T:**
- Use relative imports beyond one level (`../../../`)
- Mix default and named exports inconsistently

### **5. TypeScript**

✅ **DO:**
- Define interfaces for component props
- Use existing types from `@/types/finance`
- Leverage TypeScript inference when obvious
- Export types that might be reused

❌ **DON'T:**
- Use `any` type (use `unknown` if needed)
- Create duplicate type definitions
- Over-complicate types with advanced generics

### **6. Performance**

✅ **DO:**
- Use `"use client"` directive only when needed (hooks, interactivity)
- Memoize expensive calculations with `useMemo`
- Optimize images with Next.js `Image` component
- Lazy load modals and heavy components

❌ **DON'T:**
- Mark everything as client components unnecessarily
- Render large lists without virtualization
- Load all modal content on page load

### **7. Code Organization**

✅ **DO:**
- Follow single responsibility principle
- Keep related files together (`profile-view.tsx` + `profile-helpers.ts`)
- Document complex logic with comments
- Use consistent naming conventions

❌ **DON'T:**
- Create "util" or "common" dumping grounds
- Mix concerns (UI + API + business logic in one file)
- Leave TODOs without context or tracking

---

## Migration Notes

### **Refactoring Summary (January 2025)**

**Page Files Reduced:**
- `dashboard/page.tsx`: 299 → 13 lines (95.7%)
- `accounts/page.tsx`: 528 → 13 lines (97.5%)
- `services/page.tsx`: 474 → 13 lines (97.3%)
- `profile/page.tsx`: 439 → 9 lines (97.9%)

**Total Reduction:** 2,156 → 104 lines (95.2%)

**Large Files Modularized:**
- `i18n.ts`: 479 → 50 lines + 2 JSON files (89.6%)
- `mock-data.ts`: 376 → 15 lines + 5 modules (96.0%)
- `add-account-modal.tsx`: 584 → 189 lines + 6 components (67.6%)
- `bank-credentials-section.tsx`: 412 → 158 lines + 3 components (61.7%)
- `sidebar.tsx`: 251 → 90 lines + 4 components (64.1%)

**New Patterns Introduced:**
- Thin page wrapper pattern
- View + Helper pattern
- Modal decomposition pattern
- UI utility variants system

**No Breaking Changes:**
- All existing functionality preserved
- Build succeeds with 0 errors
- All routes tested and working

---

## Future Enhancements

### **Phase 1: Base Components (Q1 2025)**
- Create reusable `<Button>` component in `components/ui/`
- Create reusable `<Card>` component
- Create reusable `<Input>` and `<Select>` components
- Create reusable `<Badge>` component

### **Phase 2: Optimization (Q2 2025)**
- Implement virtual scrolling for large lists
- Add image optimization for bank logos
- Implement code splitting for modals
- Add loading states and suspense boundaries

### **Phase 3: Testing (Q2 2025)**
- Add unit tests for utilities
- Add component tests with React Testing Library
- Add E2E tests with Playwright
- Add visual regression tests

---

**For Questions or Contributions:**
- Follow patterns established in this guide
- Maintain file size guidelines
- Keep refactoring incremental and tested
- Document significant architectural changes

**Last Updated:** January 2025 after major refactoring initiative
