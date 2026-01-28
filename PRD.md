# 🥙 ShawarmaBis — PRD (Product Requirements Document)

**שם פרויקט:** ShawarmaBis (שווארמה ביס)
**דומיין:** shawarma-trail.vercel.app (זמני) | shawarmabis.co.il (מתוכנן)
**תאריך התחלה:** 2026-01-27
**סטטוס:** ✅ MVP מושלם — מוכן להשקה
**מחבר:** דוד 🔧 + בנימין
**עדכון אחרון:** 2026-01-28 10:30 UTC

---

## 📊 סטטוס בנייה

### ✅ שבוע 1 — הושלם (27.01.2026)
- [x] Setup: Next.js 16 + Convex + Tailwind CSS + GitHub repo
- [x] DB Schema v2: places, reviews, users, lists
- [x] Convex API: listAll, search, getBySlug, filterBy*, listFeatured, listNewest, listByTag
- [x] Seed Data: 29 מקומות
- [x] Homepage, Explore, Place pages
- [x] Leaflet/OSM map
- [x] Filters, Dark theme, Responsive
- [x] Vercel auto-deploy

### ✅ שבוע 2 — יום 1 (28.01.2026)
- [x] **Rebrand** → ShawarmaBis
- [x] **לוגו חדש** — לוגו מותאם אישית של בנימין (שיפוד + דגל + להבות)
- [x] **תמונות אוכל** — 6 תמונות Nano Banana Pro
- [x] **Lucide React** — 40+ אייקונים SVG
- [x] **Footer מקצועי** — 4 עמודות, ניוזלטר, רשתות
- [x] **OpenStatus, SocialLinks, TagIcon, CategoryCarousel**
- [x] **AdvancedSearch** — טופס 3 שדות
- [x] **Desktop Responsive** — כל הדפים
- [x] **Light Theme** — המרה מלאה בסגנון CoffeeTrail
- [x] **Image Slider** — 5 תמונות hero עם fade
- [x] **קרוסלת אזורים** — 5 כרטיסים עם תמונות נוף
- [x] **PlaceCards** — כרטיסים עם תמונות אוכל

### ✅ שבוע 2 — יום 1 אחה"צ (28.01.2026)
- [x] **Homepage Sections** — RouteSearch (7 כבישים), EventsBanner, FeaturedArticle, HighwayBanner CTA
- [x] **Alternating Sections** — לבן ↔ קרם ↔ full-width
- [x] **SEO** — robots.txt, sitemap.xml דינמי, JSON-LD Schema.org, meta tags, Twitter cards, OG
- [x] **Google Maps** — מפה אמיתית בדף מקום + כפתורי Waze/Google Maps
- [x] **דף /map** — מפה מלאה עם sidebar, חיפוש, מרקרים, info windows
- [x] **Data** — 47 מקומות בפרודקשן (29 seed + 18 אמיתיים)
- [x] **Convex Prod** — deployed + synced
- [x] **Google API** — key מוגדר ב-local, Convex, Vercel
- [x] **Blog** — 5 כתבות SEO בעברית + /blog + /blog/[slug]
- [x] **Catering** — /catering עם 9 ספקים, טופס, FAQ
- [x] **Favicon** — 32px, 180px, 192px, 512px + PWA manifest
- [x] **OG Image** — Next.js ImageResponse דינמי
- [x] **Skeleton Loading** — PlaceCardSkeleton, CarouselSkeleton
- [x] **CSS Animations** — fadeInUp
- [x] **Nav Links** — בלוג + קייטרינג בנאבבר + פוטר
- [x] **Mobile Navbar** — לוגו ממורכז בלי טקסט (CoffeeTrail-style)

---

## 🔲 Phase 2 — פיצ'רים הבאים

### 🔴 עדיפות גבוהה
- [ ] **Auth** — הרשמה/התחברות (Clerk / Convex Auth)
- [ ] **ביקורות אמיתיות** — מחוברות ל-user, 5 קטגוריות
- [ ] **דומיין** — shawarmabis.co.il + חיבור ל-Vercel
- [ ] **Google Search Console** — רישום + הגשת sitemap

### 🟡 עדיפות בינונית
- [ ] **תמונות אמיתיות** — Google Places Photos API
- [ ] **Analytics** — Google Analytics / Vercel Analytics
- [ ] **דף הוספת מקום** — טופס לבעלי עסקים
- [ ] **מגזין דינמי** — articles בDB במקום static
- [ ] **Claiming** — בעל עסק מאשר ומעדכן מקום

### 🟢 עדיפות נמוכה
- [ ] **PWA** — service worker, offline support
- [ ] **Lighthouse** — audit + אופטימיזציה
- [ ] **i18n** — English + Arabic
- [ ] **API ציבורי** — לאפליקציות צד שלישי
- [ ] **אפליקציית מובייל** — React Native / PWA

---

## 🔧 Stack טכני

| רכיב | טכנולוגיה |
|------|----------|
| Frontend | Next.js 16.1.5 (App Router) |
| Backend/DB | Convex |
| Styling | Tailwind CSS 4 + @tailwindcss/typography |
| Icons | Lucide React |
| Maps | Google Maps JavaScript API (@googlemaps/js-api-loader v2) |
| Images | Nano Banana Pro (Gemini) |
| SEO | JSON-LD, dynamic sitemap, OG images |
| Deploy | Vercel (auto from GitHub) |
| Repo | github.com/bbsystems26-creator/shawarma-trail |

---

## 📁 מבנה קבצים

```
src/
├── app/
│   ├── layout.tsx              # Root layout + fonts + JsonLd
│   ├── page.tsx                # Homepage (15 sections)
│   ├── globals.css             # Global styles + animations
│   ├── favicon.ico
│   ├── robots.ts               # robots.txt
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── opengraph-image.tsx     # OG image generator
│   ├── explore/page.tsx        # Browse/filter page
│   ├── place/[slug]/page.tsx   # Place detail
│   ├── map/page.tsx            # Full interactive map
│   ├── blog/page.tsx           # Blog listing
│   ├── blog/[slug]/page.tsx    # Article detail + ShareButtons
│   └── catering/page.tsx       # Catering page + FaqAccordion
├── components/
│   ├── GoogleMap.tsx            # Reusable Google Maps wrapper
│   ├── StaticMap.tsx            # Map + Waze/GMaps nav
│   ├── Skeleton.tsx             # Loading skeletons
│   ├── JsonLd.tsx               # Schema.org component
│   ├── FaqAccordion.tsx         # Collapsible FAQ
│   ├── HeroSection.tsx          # Image slider hero
│   ├── RouteSearch.tsx          # Highway search
│   ├── EventsBanner.tsx         # Events CTA
│   ├── FeaturedArticle.tsx      # Featured article
│   ├── HighwayBanner.tsx        # Community CTA
│   ├── Navbar.tsx               # Mobile/desktop nav
│   ├── Footer.tsx               # 4-column footer
│   └── [+15 more components]
├── lib/
│   ├── constants.ts             # Labels, colors, data
│   ├── articles.ts              # Static blog articles
│   └── structured-data.ts      # Schema.org helpers
convex/
├── schema.ts                    # DB schema
├── places.ts                    # Place queries
├── placesAdmin.ts               # Upsert/delete mutations
├── reviews.ts                   # Review mutations
└── seedData.ts                  # Demo data
scripts/
├── scrape-google-maps.ts        # Google Maps scraper
├── import-to-convex.ts          # Data importer
├── real-places.json             # 18 curated places
└── README.md
public/
├── images/logo.png              # Custom logo (28KB)
├── images/hero/                 # 5 hero images
├── images/food/                 # 8 food photos
├── images/regions/              # 5 region landscapes
├── manifest.json                # PWA manifest
├── apple-touch-icon.png
├── icon-192.png
└── icon-512.png
```

---

## 📈 סטטיסטיקות

| מדד | ערך |
|-----|-----|
| Routes | 15 |
| Components | 25+ |
| מקומות בDB | 47 |
| כתבות בלוג | 5 |
| ספקי קייטרינג | 9 |
| קומיטים | 20+ |
| שורות קוד | ~8,000+ |

---

*עדכון אחרון: 2026-01-28 10:30 UTC — דוד 🔧*
