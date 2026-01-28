# 🥙 ShawarmaBis — Task Breakdown

**Project:** ShawarmaBis (שווארמה ביס)
**Method:** Parallel Agent Pipeline
**Last Updated:** 2026-01-28

---

## ✅ הושלם — שבוע 1 (27.01.2026)

### TASK A — Backend: Schema + Seed + Queries ✅
- Schema v2: 29 שדות + ownerStory, tags, menuItems, tips, createdAt
- 29 מקומות עם data עשיר
- queries: listAll, getBySlug, filterByRegion/City/Kashrut, listFeatured, listNewest, listByTag

### TASK B1 — Navbar + Footer ✅
### TASK B2 — Listing Page ✅
### TASK B3 — Homepage ✅
### TASK B4 — Explore Page ✅
### P0 UI/UX Overhaul ✅

---

## ✅ הושלם — שבוע 2 יום 1 (28.01.2026)

### Rebrand ✅
- שם: ShawarmaTrail → ShawarmaBis (שווארמה ביס)
- לוגו חדש: Nano Banana Pro — פיתה עם ביס

### Wave 1 — P1 Features ✅
- Footer מקצועי (4 עמודות, ניוזלטר, רשתות)
- Tag icons (Lucide SVG)
- Value proposition cards
- OpenStatus (פתוח/סגור)
- SocialLinks
- Menu display בדף מקום

### Wave 2 — Icons + Images ✅
- 40+ אימוג'ים → Lucide React SVG icons
- 6 תמונות אוכל (Nano Banana Pro)
- לוגו מקצועי
- CategoryCarousel, StaticMap, AdvancedSearch components

### Wave 3 — Desktop Responsive ✅
- Homepage: Hero רחב, קרוסלות קטגוריה, AdvancedSearch
- Components: PlaceCard, Carousel ("הצג הכל"), Navbar (dropdown + CTA)
- Pages: דף מקום 2-columns, Explore grid רחב

### Light Theme ✅
- 22 קבצים — המרה מלאה לרקע בהיר
- Hero בסגנון CoffeeTrail עם תמונת רקע + כרטיס חיפוש לבן
- Navbar לבן, Footer כהה
- כרטיסים לבנים עם צל

---

## 🔲 נותר — שבוע 2

### TASK D — שדרוג מבנה Homepage (CoffeeTrail-style)
**Priority:** 🔴 P0 — השינוי המבני הגדול
**Dependencies:** Light Theme ✅

#### D.1 — Image Slider ב-Hero
- תמונות מתחלפות (3-5 slides) עם fade animation
- שם האתר + subtitle overlay
- כרטיס חיפוש צף

#### D.2 — קרוסלת אזורים (במקום grid)
- 4-5 כרטיסים עם תמונות נוף אמיתיות
- prev/next arrows
- שם אזור כ-overlay על התמונה

#### D.3 — כרטיסי מקום עם תמונות
- תמונות אמיתיות במקום gradient placeholders
- Badge מאומת ✓ + לוגו thumbnail
- כתובת + pin icon

#### D.4 — סקציות נוספות בדף הבית
- "לפי מסלול" — רקע קרם + איור + CTA
- חיפוש לפי כבישים (1, 2, 4, 6, 40, 70, 90)
- באנר אירועים — full-width תמונה + CTA
- כתבה Featured — תמונה + טקסט + CTA

#### D.5 — Full-width Sections
- Hero, באנרים — לא מוגבלים ל-max-w-7xl
- סקציות מתחלפות: לבן ↔ קרם

### TASK E — תוכן ו-SEO
- [ ] כתבות SEO ראשוניות (3-5)
- [ ] Meta tags + OG tags
- [ ] Sitemap
- [ ] Structured data (Schema.org)

### TASK F — Google Maps Scraper
- [ ] סקריפט למשיכת נתונים אמיתיים
- [ ] תמונות, שעות פתיחה, ביקורות

---

## 🔲 שבוע 3-4

### TASK G — Auth + Users
- [ ] הרשמה / התחברות
- [ ] פרופיל משתמש
- [ ] ביקורות מחוברות ל-user

### TASK H — מגזין
- [ ] מודל articles ב-Convex
- [ ] דף /mag
- [ ] 5 כתבות ראשונות

### TASK I — אירועים/קייטרינג
- [ ] דף /catering
- [ ] רשימת ספקים

---

## Execution Stats (28.01.2026)

| Wave | Agents | Time | Files | Lines |
|------|--------|------|-------|-------|
| 1 | 4 parallel | ~4 min | 7 | +503 |
| 2 | 3 parallel | ~5 min | 25 | +246 |
| 3 | 4 parallel | ~8 min | 15 | +503 |
| Light Theme | 1 | ~9 min | 22 | +260/-277 |
| **Total** | **12 sessions** | **~26 min** | **69 files** | **~1500+ lines** |

---

*עדכון: דוד 🔧 | 2026-01-28 07:30 UTC*
