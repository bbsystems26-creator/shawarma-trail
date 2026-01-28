# 🥙 ShawarmaBis — PRD (Product Requirements Document)

**שם פרויקט:** ShawarmaBis (שווארמה ביס)
**שם קודם:** ShawarmaTrail (שונה ב-28.01.2026)
**דומיין:** shawarmabis.vercel.app (זמני) | shawarmabis.co.il (מתוכנן)
**תאריך התחלה:** 2026-01-27
**סטטוס:** MVP+ — שבוע 1 הושלם, שבוע 2 בפיתוח
**מחבר:** דוד 🔧 + בנימין
**עדכון אחרון:** 2026-01-28

---

## 📊 סטטוס בנייה

### ✅ שבוע 1 — הושלם (27.01.2026)
- [x] Setup: Next.js 16 + Convex + Tailwind CSS + GitHub repo
- [x] DB Schema v2: places (29 שדות + v2 fields), reviews, users, lists
- [x] Convex API: listAll, search, getBySlug, filterByRegion/City/Kashrut, listFeatured, listNewest, listByTag
- [x] Seed Data: 29 מקומות עם ownerStory, tags, createdAt, socialLinks, tips
- [x] עמוד ראשי: Hero + חיפוש + regions + carousels
- [x] מפה: Leaflet/OSM עם סמנים
- [x] עמוד מקום: כל הפרטים + ביקורות + tips + תפריט
- [x] פילטרים: אזור, כשרות, סוג בשר, סגנון, מחיר, דירוג
- [x] עיצוב: Dark theme, RTL, responsive
- [x] Deploy: Vercel auto-deploy מ-GitHub

### ✅ שבוע 2 — יום 1 (28.01.2026)
- [x] **Rebrand:** ShawarmaTrail → ShawarmaBis (שווארמה ביס)
- [x] **לוגו:** Nano Banana Pro — פיתה עם ביס, flat design
- [x] **תמונות אוכל:** 6 תמונות שווארמה ל-PlaceCards
- [x] **Lucide React SVG Icons:** 40+ אימוג'ים → אייקונים מקצועיים
- [x] **Footer מקצועי:** 4 עמודות, ניוזלטר, רשתות חברתיות
- [x] **OpenStatus:** פתוח/סגור בזמן אמת (Asia/Jerusalem)
- [x] **SocialLinks:** Instagram/Facebook/TikTok לכל מקום
- [x] **תצוגת תפריט:** קטגוריות + מחירים בדף מקום
- [x] **TagIcon component:** אייקון SVG לכל תגית
- [x] **CategoryCarousel:** קרוסלות לפי קטגוריה (פתוח בשבת, משלוחים...)
- [x] **StaticMap:** מפה סטטית בדף מקום
- [x] **AdvancedSearch:** טופס 3 שדות (שם, אזור, סוג בשר)
- [x] **Desktop Responsive:** כל הדפים + קומפוננטות
- [x] **Navbar:** dropdown אזורים + "הוסיפו מקום" CTA
- [x] **Carousel:** "הצג הכל" link + חצים גדולים
- [x] **דף מקום:** layout 2 עמודות בדסקטופ
- [x] **Light Theme:** המרה מלאה — רקע קרם, כרטיסים לבנים, Hero עם תמונה
- [x] **Value Props:** מיזוג לסקציה אחת עם טקסט + 3 כרטיסים

### 🔲 שבוע 2 — נותר
- [ ] **שדרוג מבנה Homepage** — לפי ניתוח CoffeeTrail (ראו סעיף מבנה למטה)
- [ ] **Image Slider ב-Hero** — תמונות מתחלפות (לא תמונה אחת)
- [ ] **תמונות אמיתיות בכרטיסים** — במקום gradient placeholders
- [ ] **קרוסלת אזורים** — במקום grid (כמו CoffeeTrail)
- [ ] **סקציית "לפי מסלול"** — רקע קרם + איור + CTA
- [ ] **חיפוש לפי כבישים** — כפתורים (1, 2, 4, 6, 40, 70, 90)
- [ ] **באנר אירועים** — full-width תמונה + CTA
- [ ] **כתבה Featured** — תמונה + טקסט + CTA
- [ ] **MiniMap** — מפה קטנה בדף מקום (iframe OSM)

### 🔲 שבוע 3-4
- [ ] מערכת מגזין / כתבות SEO
- [ ] Google Maps Scraper — נתונים אמיתיים
- [ ] אימות משתמשים (Auth)
- [ ] דף קייטרינג/אירועים
- [ ] SEO + Analytics + Structured Data
- [ ] PWA / App-like experience

---

## 🏗️ מבנה Homepage — יעד (בהשראת CoffeeTrail)

מבוסס על ניתוח 9 צילומי מסך של coffeetrail.co.il (שמורים ב-docs/reference/):

### סדר סקציות מלמעלה למטה:
1. **Navbar** — לוגו ימין, ניווט (בית, גלה מקומות, מפה, אזורים▾, אירועים, מגזין), CTA "הרשמה לניוזלטר"
2. **Hero** — Full-width image slider (תמונות מתחלפות) + שם האתר + subtitle + כרטיס חיפוש לבן צף + 2 לינקים (חיפוש לפי מסלול, מעבר למפה)
3. **קרוסלת אזורים** — 4-5 כרטיסים עם תמונות נוף ישראלי + שם אזור overlay (צפון, מרכז, ירושלים, דרום, שפלה)
4. **"ששווה לנסות"** — קרוסלה 3 כרטיסים גדולים עם תמונות אמיתיות + badge מאומת + שם + כתובת + לוגו
5. **"חדשים שהצטרפו"** — אותו פורמט
6. **תגיות פופולריות** — chips עם אייקונים (2 שורות)
7. **"קצת על שווארמה ביס"** — טקסט ממורכז + 3 כרטיסי Value Props (מצאו, דרגו, אירוע) + 2 CTAs
8. **קרוסלות קטגוריה** — פתוח בשבת, משלוחים, ישיבה בחוץ, ידידותי לילדים...
9. **כתבה Featured** — תמונה גדולה + טקסט + CTA "לכתבה המלאה"
10. **חיפוש לפי כבישים** — כפתורי כבישים (1, 2, 4, 6, 40, 70, 90)
11. **באנר אירועים** — full-width תמונת רקע + "מחפשים שווארמה לאירוע?" + CTA
12. **כתבות נבחרות** — 3 כרטיסי כתבות (תמונה + קטגוריה tag + כותרת + תאריך)
13. **ניוזלטר** — שם + אימייל + כפתור
14. **Footer** — כהה, 4 עמודות (ניווט, אזורים, חיפושים פופולריים, רשתות)

### עקרונות עיצוב:
- **רקע:** קרם חם (#FAF8F3), לא לבן טהור
- **צבע ראשי:** כתום/אמבר (amber-500) — CoffeeTrail משתמש בירוק
- **סקציות מתחלפות:** לבן ↔ קרם ↔ צבע רקע בהיר
- **כרטיסי מקום:** תמונה אמיתית + badge מאומת ✓ + שם + כתובת + לוגו thumbnail
- **Full-width:** Hero, באנרים — לא מוגבלים ל-max-w-7xl
- **Typography:** נקי, מודרני, RTL
- **Mobile-first:** כל סקציה רספונסיבית

---

## 🔧 Stack טכני

| רכיב | טכנולוגיה |
|------|----------|
| Frontend | Next.js 16.1.5 |
| Backend/DB | Convex |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Maps | Leaflet + OpenStreetMap |
| Images | Nano Banana Pro (Gemini) |
| Deploy | Vercel (auto from GitHub) |
| Repo | github.com/bbsystems26-creator/shawarma-trail |

---

## 📁 מבנה קבצים

```
src/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── explore/
│   │   ├── page.tsx        # Explore/browse page
│   │   └── layout.tsx
│   └── place/
│       └── [slug]/
│           └── page.tsx    # Place detail page
├── components/
│   ├── ActionButtons.tsx   # Phone/WhatsApp/Share/Waze
│   ├── AdvancedSearch.tsx  # 3-field search form
│   ├── Carousel.tsx        # Horizontal scroll carousel
│   ├── CategoryCarousel.tsx # Carousel filtered by tag
│   ├── ConvexClientProvider.tsx
│   ├── Filters.tsx         # Filter panel
│   ├── Footer.tsx          # 4-column footer
│   ├── HeroSection.tsx     # Full-width hero with search
│   ├── Map.tsx             # Leaflet map
│   ├── Navbar.tsx          # Nav with dropdown + CTA
│   ├── OpenStatus.tsx      # Open/Closed status badge
│   ├── PlaceCard.tsx       # Place listing card
│   ├── RegionCard.tsx      # Region photo card
│   ├── ReviewForm.tsx      # Review submission form
│   ├── SearchBar.tsx       # Simple search bar
│   ├── SocialLinks.tsx     # Social media links
│   ├── StarRating.tsx      # Star rating display
│   ├── StaticMap.tsx       # OSM iframe map
│   ├── TagBadges.tsx       # Tag pill badges
│   └── TagIcon.tsx         # Tag → Lucide icon mapping
└── lib/
    └── constants.ts        # Labels, colors, data

convex/
├── schema.ts               # DB schema
├── places.ts               # Place queries
├── reviews.ts              # Review mutations
├── seedData.ts             # 29 demo places
└── _generated/

public/images/
├── logo.png                # ShawarmaBis logo
├── hero/hero-1.png         # Hero background
├── food/                   # 8 food photos
│   ├── shawarma-laffa.png
│   ├── shawarma-pita.png
│   ├── shawarma-plate-1.png
│   ├── shawarma-plate-2.png
│   ├── shawarma-plate-3.png
│   ├── shawarma-grill-1.png
│   ├── shawarma-wrap-1.png
│   └── shawarma-spread-1.png
├── regions/                # 5 region landscapes
│   ├── north.png
│   ├── center.png
│   ├── jerusalem.png
│   ├── south.png
│   └── shephelah.png
└── illustrations/          # (planned)

docs/reference/             # CoffeeTrail screenshots (9)
```

---

*עדכון אחרון: 2026-01-28 07:28 UTC — דוד 🔧*
