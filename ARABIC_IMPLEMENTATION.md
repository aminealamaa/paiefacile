# Arabic Language Support Implementation

## Overview
This document describes the Arabic language support implementation for PaieFacile, including RTL (Right-to-Left) layout support.

## Implementation Summary

### 1. Language Switcher ✅
- **File**: `components/LanguageSwitcher.tsx`
- **Features**:
  - Detects current locale from URL pathname
  - Supports switching between French (fr), English (en), and Arabic (ar)
  - Displays current language label correctly
  - Properly handles route changes when switching languages

### 2. Middleware Updates ✅
- **File**: `middleware.ts`
- **Changes**:
  - Fixed Arabic routes to work properly (previously rewrote to /fr)
  - Now allows `/ar` routes to function correctly
  - Maintains security headers for all routes

### 3. Layout Updates ✅
- **File**: `app/[locale]/layout.tsx`
- **Features**:
  - Dynamically sets `dir` attribute (rtl for Arabic, ltr for others)
  - Dynamically sets `lang` attribute based on locale
  - Imports RTL CSS for proper styling

### 4. RTL CSS Support ✅
- **File**: `app/rtl.css`
- **Features**:
  - Comprehensive RTL styles for:
    - Text alignment
    - Flexbox layouts
    - Spacing utilities
    - Tables
    - Forms
    - Dropdowns and menus
    - Icons and arrows

### 5. Translation Files ✅
- **File**: `messages/ar.json`
- **Coverage**:
  - Navigation items
  - Dashboard
  - Employees management
  - Payroll calculations
  - Leave management
  - Company settings
  - Authentication
  - Landing page
  - AI Assistant
  - Common UI elements

### 6. i18n Utilities ✅
- **File**: `lib/i18n-utils.ts`
- **Functions**:
  - `isRTL(locale)`: Check if locale is RTL
  - `getDirection(locale)`: Get direction (ltr/rtl)
  - `getLangCode(locale)`: Get language code
  - `extractLocaleFromPath(pathname)`: Extract locale from URL
  - `removeLocaleFromPath(pathname)`: Remove locale from path
  - `addLocaleToPath(pathname, locale)`: Add locale to path

## Usage Examples

### Using Translations
```typescript
// In a component
import { useTranslations } from 'next-intl'; // If using next-intl
// Or load directly from messages/ar.json
```

### Detecting RTL
```typescript
import { isRTL, getDirection } from '@/lib/i18n-utils';

const locale = 'ar';
if (isRTL(locale)) {
  // Apply RTL-specific logic
}
```

### Language Switching
The language switcher automatically handles:
- Extracting current locale from pathname
- Replacing locale in URL when switching
- Maintaining current route structure

## RTL Layout Features

### Automatic RTL Support
When Arabic is selected:
- Text aligns to the right
- Forms input from right to left
- Tables display with RTL layout
- Flexbox containers reverse direction
- Spacing utilities adjust automatically

### CSS Classes
The RTL CSS automatically handles:
- `.text-left` → becomes right-aligned
- `.text-right` → becomes left-aligned
- `.ml-auto` → becomes `mr-auto`
- `.space-x-*` → reverses direction
- Flexbox rows → reverse automatically

## Translation Structure

### Example Translation Keys
```json
{
  "navigation": {
    "overview": "نظرة عامة",
    "employees": "الموظفين",
    "payroll": "كشف الرواتب"
  },
  "dashboard": {
    "title": "لوحة التحكم",
    "welcome": "مرحباً بك في باي فاسيل"
  }
}
```

## Testing Checklist

- [ ] Language switcher displays Arabic option
- [ ] Switching to Arabic changes URL to `/ar/*`
- [ ] RTL layout applies correctly (text right-aligned)
- [ ] Forms display correctly in RTL
- [ ] Tables align properly in RTL
- [ ] Navigation menu works in RTL
- [ ] All UI text displays in Arabic
- [ ] Buttons and labels are translated
- [ ] Error messages appear in Arabic
- [ ] Date pickers work in RTL
- [ ] Dropdowns align correctly

## Known Limitations

1. **Date Formatting**: May need additional configuration for Arabic date formats
2. **Number Formatting**: Arabic-Indic numerals (٠١٢٣) vs Western (0123) - currently uses Western
3. **Font Support**: Ensure Arabic fonts are loaded (Google Fonts supports Arabic)

## Future Enhancements

1. Add Arabic-Indic numerals option
2. Implement proper Arabic date formatting
3. Add more comprehensive RTL support for complex components
4. Add Arabic font loading optimization
5. Implement locale-based number formatting

## Files Modified

1. `middleware.ts` - Fixed Arabic route handling
2. `components/LanguageSwitcher.tsx` - Added locale detection
3. `app/[locale]/layout.tsx` - Added RTL support
4. `messages/ar.json` - Completed Arabic translations
5. `lib/i18n-utils.ts` - New utility functions
6. `app/rtl.css` - New RTL stylesheet

## Support

For issues or questions about Arabic/RTL support, refer to:
- RTL CSS: `app/rtl.css`
- i18n Utils: `lib/i18n-utils.ts`
- Translations: `messages/ar.json`

