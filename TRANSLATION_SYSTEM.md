# Translation System Implementation

## Overview
The translation system has been implemented to support French, English, and Arabic languages with proper RTL support for Arabic.

## How It Works

### 1. Translation Function
Use the `t()` function from `@/lib/translations`:

```typescript
import { t, type Locale } from "@/lib/translations";

// In a server component
const locale: Locale = params.locale || 'fr';
const title = t(locale, "dashboard.title");
```

### 2. Translation Keys
Translation keys use dot notation for nested objects:
- `"navigation.overview"` → `messages[locale].navigation.overview`
- `"dashboard.totalEmployees"` → `messages[locale].dashboard.totalEmployees`

### 3. Usage in Components

**Server Components:**
```typescript
export default async function MyPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale || 'fr';
  return <h1>{t(locale, "dashboard.title")}</h1>;
}
```

**Client Components:**
```typescript
"use client";
import { useTranslations } from "@/lib/translations";
import { usePathname } from "next/navigation";
import { extractLocaleFromPath } from "@/lib/i18n-utils";

export function MyComponent() {
  const pathname = usePathname();
  const locale = extractLocaleFromPath(pathname);
  const translate = useTranslations(locale);
  
  return <h1>{translate("dashboard.title")}</h1>;
}
```

## Files Updated

### Core Translation System
- ✅ `lib/translations.ts` - Translation utility functions
- ✅ `lib/i18n-utils.ts` - Locale utilities (RTL detection, path manipulation)
- ✅ `app/rtl.css` - RTL stylesheet

### Dashboard Components
- ✅ `app/[locale]/dashboard/layout.tsx` - Navigation uses translations
- ✅ `app/[locale]/dashboard/page.tsx` - Dashboard content uses translations

### Translation Files
- ✅ `messages/fr.json` - French translations (complete)
- ✅ `messages/en.json` - English translations (complete)
- ✅ `messages/ar.json` - Arabic translations (complete)

## Translation Keys Structure

```json
{
  "navigation": {
    "overview": "...",
    "employees": "...",
    "payroll": "...",
    "analytics": "...",
    "leaves": "...",
    "aiAssistant": "...",
    "settings": "...",
    "logout": "..."
  },
  "dashboard": {
    "title": "...",
    "totalEmployees": "...",
    "activeEmployees": "...",
    "welcome": "...",
    "quickActions": "...",
    "cnssDeclarations": "..."
  }
}
```

## Adding Translations to Other Pages

To add translations to any page:

1. **Import the translation function:**
```typescript
import { t, type Locale } from "@/lib/translations";
```

2. **Get locale from params:**
```typescript
const locale = params.locale || 'fr';
```

3. **Replace hardcoded text:**
```typescript
// Before
<h1>Tableau de bord</h1>

// After
<h1>{t(locale, "dashboard.title")}</h1>
```

4. **Add translation keys to all language files:**
- `messages/fr.json`
- `messages/en.json`
- `messages/ar.json`

## RTL Support

RTL is automatically applied when Arabic is selected:
- Layout direction reverses
- Text aligns to the right
- Forms input from right to left
- Tables display in RTL
- Spacing utilities reverse

The RTL CSS is automatically loaded via `app/[locale]/layout.tsx`.

## Testing

1. Switch to Arabic: `/ar/dashboard`
2. Verify:
   - Navigation items show in Arabic
   - Dashboard content shows in Arabic
   - Layout is RTL (right-aligned)
   - Forms work correctly in RTL

## Next Steps

To complete translation support:
1. Update other pages (employees, payroll, leaves, settings, etc.)
2. Update components (forms, dialogs, buttons)
3. Add missing translation keys as needed
4. Test all pages in all three languages

