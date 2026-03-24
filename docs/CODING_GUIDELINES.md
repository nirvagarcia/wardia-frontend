# WARDIA - Strict Coding Guidelines & Rules

## 1. Absolute TypeScript Strictness
* **No `any` allowed:** The use of `any` is strictly prohibited. If a type is truly unknown, use `unknown` and perform type narrowing.
* **Interfaces over Types:** Prefer `interface` for object shapes and data contracts. Use `type` only for unions, intersections, or utility types.
* **Explicit Return Types:** All functions, especially React components and custom hooks, must have explicit return types (e.g., `React.FC<Props>`, `JSX.Element`, or specific data types).
* **Strict Null Checks:** Always handle `null` and `undefined` explicitly. Use optional chaining (`?.`) and nullish coalescing (`??`) appropriately, but do not use them to mask bad data flow.

## 2. Next.js App Router Paradigms
* **Server Components by Default:** All components must be Server Components unless interactivity or browser APIs are strictly required.
* **Leaf Node Client Components:** Push the `"use client"` directive as far down the component tree as possible. Do not make a whole page a client component just because one button needs an `onClick`.
* **Data Fetching:** Fetch data in Server Components and pass it down as props. Do not use `useEffect` for initial data fetching unless absolutely necessary for client-side-only mutations.
* **No `next/router`:** Use `next/navigation` for the App Router (`useRouter`, `usePathname`, `useSearchParams`).

## 3. UI, Styling & Animations
* **Tailwind Merge:** Always use the `cn` utility (combining `clsx` and `tailwind-merge`) when exposing `className` props in custom components to avoid style conflicts.
* **Framer Motion Rules:** Do not wrap entire pages in `motion` divs unless explicitly designing a page transition. Apply `motion` strictly to the elements being animated (e.g., the interactive credit card).
* **Modularity:** If a combination of Tailwind classes is repeated more than twice (e.g., a specific glassmorphism effect), extract it into a reusable UI component or a custom Tailwind class in `globals.css`.

## 4. State Management (Zustand & React)
* **Zustand for Global State:** Use Zustand for shared UI state (e.g., sidebars, active global modals). Create granular, feature-specific slices, not one giant store.
* **Local State First:** Do not put state into Zustand if it only belongs to one component or its immediate children. Use `useState` or `useReducer`.
* **Avoid Unnecessary Re-renders:** Use `useMemo` for heavy calculations (like summing up financial totals) and `useCallback` for functions passed as props to memoized children.

## 5. Security & Financial Data Handling
* **Zero Trust Variables:** Treat all data coming from APIs or user inputs as potentially malicious.
* **Mandatory Masking:** Financial data (Account numbers, CCIs, Credit Card PANs) must be passed through a `maskData()` utility function before rendering in the UI.
* **Clipboard Sanitization:** When implementing copy-to-clipboard, ensure the exact string being copied is what the user expects. Trigger a temporary toast notification confirming the action, and clear the clipboard after 60 seconds if it contains highly sensitive data (like a generated one-time password).
* **No LocalStorage Secrets:** Authentication tokens or unmasked financial data MUST NEVER touch `localStorage` or `sessionStorage`. 

## 6. Naming Conventions & Code Cleanliness
* **Files:** Use `kebab-case` for file names (e.g., `interactive-card.tsx`).
* **Components & Interfaces:** Use `PascalCase` (e.g., `InteractiveCard`, `IUserAccount`).
* **Functions & Variables:** Use `camelCase` (e.g., `calculateTotalBalance`, `isCardActive`).
* **Constants:** Use `UPPER_SNAKE_CASE` for global constants (e.g., `MAX_RETRIES`, `DEFAULT_CURRENCY`).
* **Comments:** Explain *why* something is done, not *what* is done. The TypeScript code should explain the *what*.

## 7. Internationalization (i18n) - STRICT LAW
* **NEVER use inline translations:** NEVER write `language === "es" ? "Texto en español" : "English text"` in components.
* **ALWAYS use translation keys:** ALL user-facing text MUST use the `t(key)` function with a proper translation key.
* **Translation key naming:** Use `camelCase` for translation keys (e.g., `t("deleteCredentials")`, `t("confirmDelete")`, `t("lastUpdated")`).
* **No hardcoded strings:** Button labels, modal titles, error messages, placeholders, and ALL UI text must come from the translation system.
* **Exceptions:** Only developer-facing content (like `console.log`, comments, or error stack traces) can have hardcoded English strings.

### ❌ WRONG - NEVER DO THIS:
```tsx
<button>{language === "es" ? "Guardar" : "Save"}</button>
<Modal title={language === "es" ? "Eliminar Cuenta" : "Delete Account"} />
```

### ✅ CORRECT - ALWAYS DO THIS:
```tsx
<button>{t("save")}</button>
<Modal title={t("deleteAccount")} />
```