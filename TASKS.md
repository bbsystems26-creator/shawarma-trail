# 🥙 ShawarmaBis — Task Breakdown

**Project:** ShawarmaBis (שווארמה ביס)
**Method:** Parallel Agent Pipeline
**Last Updated:** 2026-01-28 10:30 UTC

---

## ✅ Phase 1 — MVP (הושלם 28.01.2026)

### TASK A — Backend: Schema + Seed + Queries ✅
### TASK B — Pages: Home, Explore, Place, Navbar, Footer ✅
### TASK C — Rebrand + Light Theme + Desktop Responsive ✅
### TASK D — Homepage CoffeeTrail Structure ✅
- D.1 ✅ Image Slider (5 תמונות, fade animation)
- D.2 ✅ קרוסלת אזורים (5 regions with photos)
- D.3 ✅ כרטיסי מקום עם תמונות
- D.4 ✅ סקציות נוספות (RouteSearch, EventsBanner, FeaturedArticle, HighwayBanner)
- D.5 ✅ Full-width alternating sections (לבן ↔ קרם)

### TASK E — SEO ✅
- E.1 ✅ robots.txt + sitemap.xml (dynamic)
- E.2 ✅ JSON-LD Schema.org (WebSite + Restaurant)
- E.3 ✅ Meta tags + Twitter cards + OG
- E.4 ✅ OG Image (Next.js ImageResponse)
- E.5 ✅ 5 כתבות SEO (/blog + /blog/[slug])

### TASK F — Data ✅
- F.1 ✅ 47 מקומות (29 seed + 18 real)
- F.2 ✅ Convex prod deployed + synced
- F.3 ✅ Google Maps scraper scripts (ready to run)
- F.4 ✅ Convex upsertPlace mutation

### TASK G — Google Maps ✅
- G.1 ✅ Google API key configured (local + Convex + Vercel)
- G.2 ✅ GoogleMap.tsx reusable component
- G.3 ✅ StaticMap → real Google Maps + Waze/GMaps nav
- G.4 ✅ /map page (full map + sidebar + search + markers + info windows)

### TASK H — Polish ✅
- H.1 ✅ Binyamin's custom logo (optimized 2.3MB→28KB)
- H.2 ✅ Mobile navbar (centered logo, no text)
- H.3 ✅ Favicon + Apple Touch Icon + PWA manifest
- H.4 ✅ Skeleton loading (PlaceCardSkeleton, CarouselSkeleton)
- H.5 ✅ CSS animations (fadeInUp)
- H.6 ✅ /catering page (9 providers, contact form, FAQ)
- H.7 ✅ Nav links updated (blog + catering)

---

## 🔲 Phase 2 — Growth Features

### TASK I — Auth + Users 🔴
- [ ] I.1 — Auth provider setup (Clerk / Convex Auth)
- [ ] I.2 — הרשמה / התחברות (email + Google + Facebook)
- [ ] I.3 — פרופיל משתמש (שם, אווטאר, ביקורות שלי)
- [ ] I.4 — ביקורות מחוברות ל-user (5 קטגוריות דירוג)
- [ ] I.5 — "הביקורת שלי" badge + verified visit

### TASK J — Domain + Launch 🔴
- [ ] J.1 — רכישת דומיין shawarmabis.co.il
- [ ] J.2 — חיבור ל-Vercel
- [ ] J.3 — Google Search Console + sitemap submission
- [ ] J.4 — Google Analytics / Vercel Analytics

### TASK K — Real Data 🟡
- [ ] K.1 — תמונות אמיתיות (Google Places Photos API)
- [ ] K.2 — שעות פתיחה אמיתיות
- [ ] K.3 — הרצת scraper על 17 ערים
- [ ] K.4 — הוספה ידנית של מקומות מוכרים

### TASK L — Business Features 🟡
- [ ] L.1 — דף הוספת מקום (טופס לבעלי עסקים)
- [ ] L.2 — Claiming (בעל עסק מאמת ומעדכן)
- [ ] L.3 — Dashboard לבעל עסק (סטטיסטיקות, ביקורות)
- [ ] L.4 — Premium listing (מנוי בתשלום)

### TASK M — Content 🟢
- [ ] M.1 — מגזין דינמי (articles ב-Convex)
- [ ] M.2 — "שווארמה של השבוע" feature
- [ ] M.3 — User-generated lists ("הטופ שלי")
- [ ] M.4 — Events calendar

---

## 📊 Sprint Summary

| Sprint | תאריך | משימות | שורות | קומיטים |
|--------|--------|--------|-------|---------|
| Week 1 | 27.01 | A+B | ~3,000 | 8 |
| Week 2 Day 1 AM | 28.01 | C (rebrand+theme) | ~2,500 | 6 |
| Week 2 Day 1 PM | 28.01 | D+E+F+G+H | ~6,000+ | 12+ |
| **Total** | | **All Phase 1** | **~11,500+** | **26+** |

---

*עדכון אחרון: 2026-01-28 10:30 UTC — דוד 🔧*
