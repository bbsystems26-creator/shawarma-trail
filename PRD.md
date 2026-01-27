# 🥙 ShawarmaTrail — PRD (Product Requirements Document)

**שם פרויקט:** ShawarmaTrail (שווארמה טרייל)
**דומיין מוצע:** shawarmatrail.co.il / shawarma.co.il / shwarma.co.il
**תאריך:** 2026-01-27
**סטטוס:** MVP Planning
**מחבר:** דוד 🔧 + בנימין

---

## 1. סקירת מוצר

### מה זה?
אתר ייעודי למציאת השווארמה הטובה בישראל — מפה אינטראקטיבית, דירוגים, ביקורות, ופילטרים חכמים. "הקופיטרייל של השווארמה."

### למה עכשיו?
- **ביקוש מוכח:** קהילת פייסבוק "שווארמה מומלצת" עם 170,000+ חברים
- **אין פתרון ייעודי:** רק קבוצות פייסבוק מפוזרות — לא ניתן לחיפוש, לא מפה, לא מסודר
- **SEO goldmine:** "שווארמה מומלצת ב[עיר]" = חיפושים עם intent גבוה ותחרות נמוכה
- **מודל מוכח:** coffeetrail.co.il הוכיח שהפורמט עובד לקולינריה ישראלית
- **תרבות:** שווארמה זה לא אוכל — זו דת. ישראלים נוסעים שעות למקום טוב

### מודל ההשראה — coffeetrail.co.il
| פיצ'ר | coffeetrail | ShawarmaTrail (שלנו) |
|--------|------------|----------------------|
| מפה | עגלות קפה על מפה | מקומות שווארמה על מפה |
| חיפוש מסלול | "קפה בדרך ל..." | "שווארמה בדרך ל..." |
| פילטרים | כשרות, שבת, שירותים | כשרות, סוג בשר, סגנון, מחיר |
| אירועים | עגלות לאירועים | קייטרינג שווארמה לאירועים |
| תוכן | כתבות, סיפורי בעלים | ביקורות, דירוגים, "המסלול האולטימטיבי" |
| קהילה | עגלות חדשות, מומלצות | דירוגי קהילה, תמונות משתמשים |

---

## 2. קהל יעד

### משתמשים ראשיים (B2C)
- **חובבי שווארמה** — חברי הקהילות, מחפשים מקומות חדשים
- **תיירים פנימיים** — "אנחנו בצפון, איפה יש שווארמה טובה?"
- **מחפשי ארוחה** — פשוט רוצים שווארמה עכשיו ורוצים מקום טוב קרוב

### משתמשים משניים (B2B)
- **בעלי מקומות שווארמה** — רוצים חשיפה, לקוחות חדשים
- **קייטרינג שווארמה** — רוצים הזמנות לאירועים
- **רשתות מזון** — רוצים פרסום ממוקד

---

## 3. פיצ'רים — MVP (Phase 1)

### 3.1 🗺️ מפה אינטראקטיבית (הליבה)
- מפת ישראל עם כל מקומות השווארמה
- סמנים צבעוניים לפי דירוג (זהב/כסף/ברונזה)
- לחיצה על סמן → כרטיס מידע מהיר (שם, דירוג, תמונה, כתובת)
- Clustering בזום רחוק
- **טכנולוגיה:** Mapbox GL JS / Google Maps API

### 3.2 🔍 חיפוש ופילטרים
**חיפוש:**
- חיפוש חופשי (שם מקום, עיר, אזור)
- חיפוש לפי מיקום נוכחי ("שווארמה קרובה אליי")
- חיפוש לפי מסלול ("שווארמה בדרך מתל אביב לחיפה")

**פילטרים:**
| פילטר | אפשרויות |
|--------|----------|
| כשרות | ללא / רגילה / מהדרין / בד"ץ |
| סוג בשר | כבש / עגל / הודו / מעורב |
| סגנון | לאפה / פיתה / צלחת / על האש |
| טווח מחיר | ₪ / ₪₪ / ₪₪₪ |
| פתוח עכשיו | כן/לא |
| משלוחים | כן/לא |
| ישיבה במקום | כן/לא |
| דירוג מינימלי | 3+ / 4+ / 4.5+ |
| אזור | צפון / מרכז / דרום / ירושלים / שפלה |

### 3.3 📄 דף מקום (Listing Page)
- שם, לוגו, תמונות (גלריה)
- כתובת + קישור ניווט (Waze/Google Maps)
- שעות פעילות
- טלפון + WhatsApp
- תפריט (PDF או inline)
- כשרות ותגיות
- דירוג כולל + מס' ביקורות
- ביקורות משתמשים עם תמונות
- "מקומות דומים באזור"

### 3.4 ⭐ דירוגים וביקורות
- דירוג 1-5 כוכבים
- קטגוריות משנה: טעם הבשר | הלאפה/פיתה | תוספות | שירות | תמורה למחיר
- טקסט חופשי + העלאת תמונות
- סימון "ביקורת מאומתת" (ביקר במקום)
- like/helpful על ביקורות
- **אנטי-ספאם:** אימות טלפון/גוגל לכתיבת ביקורת

### 3.5 🏆 דירוגים וטופ ליסטים
- "10 השווארמות הטובות בישראל" (עדכון שנתי)
- "הטוב ביותר ב[עיר]" — לכל עיר גדולה
- "עולה חדשה" — מקומות חדשים עם דירוג גבוה
- "בחירת הקהילה" — הצבעה חודשית/רבעונית
- **SEO killer** — כל ליסט = דף נחיתה עם חיפוש אורגני

### 3.6 📱 רספונסיב מלא
- Mobile-first design (80%+ traffic יהיה מובייל)
- PWA — אפשרות התקנה כאפליקציה
- מהיר — Core Web Vitals ירוקים

---

## 4. פיצ'רים — Phase 2 (אחרי אימות)

### 4.1 🛣️ "שווארמה בדרך" (Route-based)
- הזן נקודת מוצא ויעד
- קבל רשימת מקומות שווארמה לאורך המסלול
- שילוב עם Waze/Google Maps API

### 4.2 🎉 קייטרינג שווארמה
- דף ייעודי למקומות שעושים קייטרינג/אירועים
- טופס בקשת הצעת מחיר
- פילטר: מגיעים אליכם / אירוע במקום

### 4.3 📝 מגזין / כתבות
- ביקורות מעמיקות (עורכים)
- "מסלולי שווארמה" — יום טיול בין מקומות
- סיפורי מקור — ההיסטוריה של מקומות מיתולוגיים
- טיפים — "איך לזהות שווארמה טובה"

### 4.4 👥 פרופיל משתמש
- רשימת ביקורות שכתבתי
- מועדפים / רשימת "חייב לנסות"
- תגים / achievements ("ביקרת ב-50 מקומות!")
- Follow משתמשים אחרים

### 4.5 🤖 פיצ'רים חכמים
- "מגלה שווארמה" — quiz שמציע מקום לפי העדפות
- התראות — "מקום חדש נפתח באזור שלך"
- AI ביקורות — סיכום ביקורות לכל מקום

---

## 5. ארכיטקטורה טכנית

### Tech Stack (MVP)
| שכבה | טכנולוגיה | סיבה |
|-------|-----------|------|
| Frontend | **Next.js 15 (App Router)** | SSR/SSG ל-SEO, React, מהיר |
| Styling | **Tailwind CSS** | מהיר לפיתוח, רספונסיב |
| Maps | **Mapbox GL JS** | חינמי עד 50K loads, יפה, מהיר |
| Backend | **Convex** | Real-time sync, TypeScript functions, zero config |
| Database | **Convex DB** | Document-relational, reactive queries, אינדקסים |
| Auth | **Convex Auth / Clerk** | Google/Phone login, שילוב מובנה |
| Images | **Convex File Storage + Cloudinary** | אחסון מובנה + אופטימיזציה |
| Hosting | **Vercel** (frontend) + **Convex Cloud** (backend) | חינמי, מהיר, CI/CD |
| Analytics | **Plausible / Umami** | פרטיות, חינמי self-hosted |

### למה Convex?
- ⚡ **Real-time מובנה** — ביקורות חדשות מופיעות מיידית לכל המשתמשים
- 🔧 **TypeScript end-to-end** — פונקציות backend ב-TS עם type safety מלא
- 📦 **Zero config** — אין DB לנהל, אין migrations, אין DevOps
- 🔄 **Reactive queries** — useQuery() מתעדכן אוטומטית כשנתונים משתנים
- 🎯 **Transactions מובנות** — כל mutation היא transaction אטומית
- 💰 **Free tier נדיב** — מספיק ל-MVP ואחריו

### ארכיטקטורת Convex
```
convex/
├── schema.ts          — הגדרת טבלאות ואינדקסים
├── places.ts          — queries/mutations למקומות
├── reviews.ts         — queries/mutations לביקורות
├── users.ts           — queries/mutations למשתמשים
├── search.ts          — חיפוש וסינון
├── geo.ts             — חישובי מרחק ו-bounding box
├── seed.ts            — actions לטעינת דאטה ראשוני
└── auth.config.ts     — הגדרות auth
```

### סכמת DB (Convex Schema)
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  places: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    region: v.union(
      v.literal("north"), v.literal("center"),
      v.literal("south"), v.literal("jerusalem"), v.literal("shfela")
    ),
    lat: v.number(),
    lng: v.number(),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    website: v.optional(v.string()),
    kashrut: v.union(
      v.literal("none"), v.literal("regular"),
      v.literal("mehadrin"), v.literal("badatz")
    ),
    meatTypes: v.array(v.string()),    // ["lamb","beef","turkey","mixed"]
    style: v.array(v.string()),         // ["laffa","pita","plate","fire"]
    priceRange: v.union(v.literal(1), v.literal(2), v.literal(3)),
    hasDelivery: v.boolean(),
    hasSeating: v.boolean(),
    openingHours: v.optional(v.any()),  // flexible JSON
    images: v.array(v.string()),        // Convex storage IDs
    menuUrl: v.optional(v.string()),
    avgRating: v.number(),
    reviewCount: v.number(),
    isFeatured: v.boolean(),
    isVerified: v.boolean(),
    claimedBy: v.optional(v.id("users")),
  })
    .index("by_slug", ["slug"])
    .index("by_city", ["city"])
    .index("by_region", ["region"])
    .index("by_rating", ["avgRating"])
    .index("by_featured", ["isFeatured"])
    .searchIndex("search_name", { searchField: "name" }),

  reviews: defineTable({
    placeId: v.id("places"),
    userId: v.id("users"),
    ratingOverall: v.number(),
    ratingMeat: v.number(),
    ratingBread: v.number(),
    ratingSides: v.number(),
    ratingService: v.number(),
    ratingValue: v.number(),
    text: v.string(),
    images: v.array(v.string()),
    helpfulCount: v.number(),
    isVerifiedVisit: v.boolean(),
  })
    .index("by_place", ["placeId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["ratingOverall"]),

  users: defineTable({
    name: v.string(),
    avatar: v.optional(v.string()),
    email: v.optional(v.string()),
    reviewCount: v.number(),
    role: v.union(
      v.literal("user"), v.literal("editor"),
      v.literal("admin"), v.literal("owner")
    ),
  }),

  // Phase 2
  lists: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    placeIds: v.array(v.id("places")),
    authorId: v.id("users"),
    type: v.union(v.literal("editorial"), v.literal("community")),
  }).index("by_slug", ["slug"]),
});
```

### חיפוש גאוגרפי (ללא PostGIS)
Convex לא תומך ב-PostGIS, אז נשתמש ב-**Bounding Box + Haversine**:
```typescript
// convex/geo.ts — חיפוש לפי bounding box ואז סינון מדויק
// 1. אינדקס על lat/lng range (bounding box)
// 2. Haversine formula בצד הסרבר לחישוב מרחק מדויק
// 3. מיון לפי קרבה
// לחלופין: Convex action שקוראת ל-Google Maps Distance API למסלולים
```

---

## 6. מונטיזציה

### Phase 1 — חינמי + ליסטינג בסיסי
- כל המקומות מופיעים חינם
- בעלי עסקים יכולים "לתבוע" את הדף שלהם (claim)
- בניית בסיס משתמשים ותוכן

### Phase 2 — Freemium לבעלי עסקים
| תוכנית | מחיר | מה כלול |
|---------|------|---------|
| בסיסי | חינם | ליסטינג, מידע בסיסי |
| פרימיום | ₪99/חודש | הדגשה במפה, badge "מומלץ", תמונות ללא הגבלה, סטטיסטיקות |
| זהב | ₪199/חודש | כל הפרימיום + ראשון בתוצאות חיפוש, באנר באזור, קופון מותאם |

### Phase 3 — הכנסות נוספות
- 🎯 קופונים/דילים בלעדיים (עמלה 10-15%)
- 📢 תוכן ממומן (כתבות, ביקורות VIP)
- 🤝 שיתופי פעולה עם אפליקציות משלוחים (אפיליאט)
- 🏆 חסות על דירוגים שנתיים / אירועי שווארמה

---

## 7. אסטרטגיית תוכן ו-SEO

### דפי נחיתה אוטומטיים (Programmatic SEO)
- `/shawarma/[city]` — "שווארמה מומלצת ב[עיר]" (50+ ערים)
- `/shawarma/[region]` — "שווארמה בצפון/מרכז/דרום"
- `/best/[city]` — "הכי טוב ב[עיר]"
- `/place/[slug]` — דף מקום יחיד
- `/route/[from]-to-[to]` — "שווארמה בדרך מ... ל..."

### תוכן editorial (Phase 2)
- ביקורות שבועיות
- "מסלול שווארמה" חודשי
- רשימות "טוב 10" עונתיות

### Social Media
- שיתוף הדדי עם קהילת פייסבוק (170K)
- אינסטגרם — תמונות שווארמה (הויזואל מוכר את עצמו)
- טיקטוק — ביקורות קצרות, "blind taste tests"

---

## 8. Data Seeding — איך ממלאים את ה-DB

### Phase 0 (לפני השקה)
1. **סקרייפינג Google Maps** — כל מקום עם "שווארמה" בישראל (~2,000-3,000 מקומות)
   - שם, כתובת, קואורדינטות, שעות, טלפון, דירוג Google
2. **קהילת Facebook** — המקומות המומלצים ביותר (top 200-300)
3. **Wolt/Waze/10bis** — רשימות נוספות
4. **ידני** — 50 מקומות מובילים עם תמונות ותיאורים מלאים

### אחרי השקה
- בעלי עסקים מוסיפים/מעדכנים (claim)
- משתמשים מוסיפים מקומות חדשים (suggest)
- ביקורות = תוכן שנוצר ע"י משתמשים

---

## 9. KPIs (מדדים להצלחה)

### MVP (חודש 1-3)
- [ ] 500+ מקומות במאגר
- [ ] 1,000 ביקורים ייחודיים/חודש
- [ ] 50+ ביקורות משתמשים
- [ ] Top 3 בגוגל ל-"שווארמה מומלצת" (ערים בודדות)

### Growth (חודש 3-6)
- [ ] 2,000+ מקומות
- [ ] 10,000 ביקורים/חודש
- [ ] 500+ ביקורות
- [ ] 20 בעלי עסקים שתבעו דף
- [ ] ראשון בגוגל ל-5+ ערים

### Monetization (חודש 6-12)
- [ ] 50+ לקוחות פרימיום (₪5K MRR)
- [ ] 50,000 ביקורים/חודש
- [ ] שיתוף פעולה עם קהילת FB

---

## 10. לו"ז פיתוח

### שבוע 1 — Foundation
- [ ] Setup: Next.js + Convex + Vercel
- [ ] DB schema + seed initial data (Google Maps scraping)
- [ ] מפה בסיסית עם סמנים
- [ ] דף מקום בסיסי

### שבוע 2 — Core Features
- [ ] חיפוש וגילטרים
- [ ] Auth (Google + Phone)
- [ ] דירוגים וביקורות
- [ ] Mobile responsive

### שבוע 3 — Content & SEO
- [ ] דפי נחיתה לפי עיר/אזור (SSG)
- [ ] Meta tags, sitemap, structured data (LocalBusiness schema)
- [ ] 50 מקומות מובילים עם תוכן מלא
- [ ] דף "טופ 10"

### שבוע 4 — Polish & Launch
- [ ] ביצועים (Core Web Vitals)
- [ ] PWA setup
- [ ] Analytics
- [ ] Beta testing
- [ ] 🚀 השקה!

---

## 11. סיכונים ומענה

| סיכון | הסתברות | מענה |
|-------|---------|------|
| תוכן דליל בהתחלה | גבוה | Seed מ-Google Maps + ידני ל-top 50 |
| בעלי עסקים לא משלמים | בינוני | חינמי בהתחלה, ערך מוכח לפני מונטיזציה |
| תחרות (מישהו אחר בונה) | נמוך | First mover advantage + SEO + קהילה |
| Google Maps מספיק | בינוני | ניש ייעודי > כללי. פילטרים, קהילה, תוכן |
| קשה למשוך תנועה | בינוני | SEO programmatic + שיתוף עם FB group |

---

## 12. Verification Criteria (לפיתוח)

### MVP עובר אם:
- [ ] מפה נטענת תוך <2 שניות עם 500+ מקומות
- [ ] חיפוש לפי עיר מחזיר תוצאות תוך <500ms
- [ ] כל פילטר עובד ומסנן בזמן אמת
- [ ] דף מקום מציג כל המידע + ביקורות
- [ ] משתמש יכול להירשם, לכתוב ביקורת, ולדרג
- [ ] Lighthouse score: Performance >90, SEO 100
- [ ] עובד חלק במובייל (iPhone Safari + Android Chrome)
- [ ] Google indexing: דפי ערים מופיעים בתוצאות

---

*"כל מהפכה מתחילה בארוחה טובה" — ומהפכת השווארמה מתחילה כאן.* 🥙🔥
