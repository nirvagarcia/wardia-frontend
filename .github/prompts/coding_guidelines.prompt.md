---
mode: ask
description: Wardia module migration rules and architecture conventions. Use when migrating a view to /modules, creating a new feature module, or when asked to follow the project architecture.
---

# Wardia Frontend — Module Architecture Rules

Apply all rules below for any migration or new feature module task in this workspace.

---

## Module Structure

All feature code lives in `src/modules/{feature}/`. Canonical layout:

```
src/modules/{feature}/
├── {Feature}Page.tsx          # Default export — full page component
├── index.tsx                  # Barrel: export { default as {Feature}Module } from "./{Feature}Page"
├── hooks/
│   └── use-{feature}-page.ts  # All page logic, state, derived values, handlers
├── utils/
│   └── helpers.ts             # Pure functions only (formatters, option builders, transformers)
└── components/
    ├── {section}.tsx
    └── modals/
        └── {modal-name}.tsx
```

**App Router proxy** — `src/app/(main)/{route}/page.tsx` is always 1 line:
```tsx
export { default } from "@/modules/{feature}/{Feature}Page";
```

---

## Self-Containment

A module must have **zero imports from `src/views/`** or other modules' internals.
Only allowed external imports: `@/shared/`, `@/server/`, npm packages.

---

## Page Component Pattern

```tsx
"use client";
import { use{Feature}Page } from "./hooks/use-{feature}-page";

export default function {Feature}Page() {
  const { mounted, activeModal, openModal, closeModal, t, ...rest } = use{Feature}Page();

  if (!mounted) return <{Feature}PageSkeleton t={t} />;

  return (
    <div className="space-y-6">
      <{Feature}PageHeader t={t} />
      <SectionA ... />
      <ModalA isOpen={activeModal === "a"} onClose={closeModal} />
    </div>
  );
}

// Page-specific fragments under ~20 lines stay in THIS file — not separate files
function {Feature}PageHeader({ t }: { t: (key: string) => string }) { ... }
function {Feature}PageSkeleton({ t }: { t: (key: string) => string }) { ... }
```

---

## Hook Pattern

```ts
"use client";

export type ModalKey = "a" | "b" | "c";

export function use{Feature}Page() {
  // Single modal state — never N boolean flags
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const openModal = (key: ModalKey) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const t = (key: string) => getTranslation(language, key);

  // All derived values, labels, option lists, handlers here

  return { mounted, activeModal, openModal, closeModal, t, ...everything };
}
```

---

## i18n — STRICT NO-HARDCODED-TEXT RULE

> **Every single user-visible string MUST go through `t(key)`.**
> This is a hard rule — no exceptions for labels, placeholders, button text, error messages, toast messages, empty states, modal titles, or confirmations.

- `t(key)` resolves to `getTranslation(language, key)` from `@/shared/langs`
- Add every new key to **both** `src/shared/langs/es.json` and `src/shared/langs/en.json` in the same commit
- ❌ BAD: `toast.success("Tablero eliminado")` / `<p>Nada archivado aún</p>` / `placeholder="ej: Juego de ollas"`
- ✅ GOOD: `toast.success(t("planning.boardDeleted"))` / `<p>{t("planning.noArchived")}</p>` / `placeholder={t("planning.itemTitlePlaceholder")}`
- Locale strings: `language === "es" ? "es-PE" : "en-US"` (never hardcoded `"es"`)
- The only acceptable hardcoded strings are: developer-facing `console.error/warn` messages and internal constants (e.g. status values like `"pending"`, `"purchased"`)

---

## File Rules

| Rule | Constraint |
|------|-----------|
| Max file length | 250 lines |
| Page components | PascalCase: `UserPage.tsx` |
| Hooks | kebab-case: `use-user-page.ts` |
| Sections / components | kebab-case: `profile-header.tsx` |
| Modals | kebab-case: `edit-profile-modal.tsx` |
| Comments | Only for non-obvious business logic — no dividers, no JSDoc on obvious functions |
| `utils/helpers.ts` | Pure functions only — no React components or hooks |
| No `React` import | Not needed in React 19 / Next.js 15+ |
| No `any` | Use `unknown` + type narrowing |
| Interface prefix | `I` prefix: `IUser`, `ITransaction` |

---

## Migration Checklist (View → Module)

- [ ] Create `{Feature}Page.tsx` — full page
- [ ] Extract hook → `hooks/use-{feature}-page.ts`
- [ ] Extract sections → `components/{section}.tsx`
- [ ] Copy modals → `components/modals/{modal}.tsx`
- [ ] Copy helpers → `utils/helpers.ts` (actual source, not re-exports)
- [ ] Copy shared components (avatar, etc.) → `components/`
- [ ] Create `index.tsx` barrel (2 lines max)
- [ ] Update `src/app/(main)/{route}/page.tsx` to 1-line re-export
- [ ] All internal imports use relative paths (`./`, `../`)
- [ ] Grep: `Get-ChildItem "src" -Recurse -Include "*.ts","*.tsx" | Select-String "views/{feature}"`
- [ ] Delete `src/views/{feature}/` — no legacy folders, no duplication
- [ ] All text through `t()` — no hardcoded strings
- [ ] Every file < 250 lines
