# 🎖️ נבחרת המבקרים — PRD מלא

**פרויקט:** ShawarmaBis — מערכת מבקרים מאומתים
**תאריך:** 2026-01-29
**גרסה:** 1.0

---

## 📋 סקירה כללית

### הבעיה
- ביקורות פתוחות לכולם = ספאם, ביקורות מזויפות, איכות נמוכה
- אין מוטיבציה למשתמשים לכתוב ביקורות איכותיות
- קשה לבנות קהילה מעורבת

### הפתרון
מערכת "נבחרת המבקרים" — קהילה סגורה של מבקרים מאומתים עם תמריצים:
- רק מבקרים מאושרים יכולים לכתוב ביקורות וכתבות
- כל ביקורת = כרטיס להגרלה חודשית
- Badge מיוחד + פרופיל ציבורי
- תוכן UGC איכותי (כתבות, תמונות)

---

## 👥 סוגי משתמשים (Roles)

| Role | הרשאות | איך מקבלים |
|------|---------|------------|
| `visitor` | צפייה בלבד | ברירת מחדל |
| `applicant` | הגיש מועמדות, ממתין לאישור | הגשת טופס |
| `reviewer` | ביקורות + כתבות + הגרלות | אישור אדמין |
| `senior_reviewer` | + עריכת ביקורות אחרים | 10+ ביקורות איכותיות |
| `admin` | הכל + ניהול מבקרים והגרלות | ידני |

---

## 🗄️ Schema (Convex)

### users
```typescript
{
  _id: Id<"users">,
  // Auth
  email: string,
  passwordHash?: string,        // אם email auth
  googleId?: string,            // אם Google OAuth
  
  // Profile
  name: string,
  avatar?: string,              // URL or storage ID
  bio?: string,
  city?: string,
  
  // Role & Status
  role: "visitor" | "applicant" | "reviewer" | "senior_reviewer" | "admin",
  isActive: boolean,
  
  // Stats (denormalized for performance)
  reviewCount: number,
  articleCount: number,
  totalRaffleEntries: number,
  
  // Timestamps
  createdAt: number,
  updatedAt: number,
  lastLoginAt?: number,
}
```

### reviewerApplications
```typescript
{
  _id: Id<"reviewerApplications">,
  userId: Id<"users">,
  
  // Application content
  whyJoin: string,              // למה רוצה להצטרף (min 50 chars)
  favoritePlace: string,        // מקום השווארמה האהוב
  experience: string,           // ניסיון בביקורות/כתיבה
  socialLinks?: string[],       // לינקים לרשתות (אופציונלי)
  
  // Status
  status: "pending" | "approved" | "rejected",
  reviewedBy?: Id<"users">,     // מי טיפל בבקשה
  reviewedAt?: number,
  rejectionReason?: string,
  
  // Timestamps
  createdAt: number,
}
```

### reviews
```typescript
{
  _id: Id<"reviews">,
  placeId: Id<"places">,
  userId: Id<"users">,
  
  // Ratings (1-5)
  rating: number,               // ציון כללי
  tasteRating: number,          // טעם
  serviceRating: number,        // שירות
  cleanlinessRating: number,    // ניקיון
  valueRating: number,          // תמורה למחיר
  
  // Content
  title: string,                // כותרת הביקורת
  content: string,              // תוכן (min 100 chars)
  images?: string[],            // תמונות (max 5)
  visitDate: string,            // תאריך ביקור (YYYY-MM-DD)
  
  // Metadata
  isVerifiedVisit: boolean,     // ביקור מאומת (עתידי: קבלה/מיקום)
  helpfulCount: number,         // כמה אנשים מצאו מועיל
  
  // Raffle
  raffleEntryId?: Id<"raffleEntries">,  // הכרטיס שנוצר
  
  // Status
  status: "published" | "hidden" | "flagged",
  
  // Timestamps
  createdAt: number,
  updatedAt: number,
}
```

### articles
```typescript
{
  _id: Id<"articles">,
  userId: Id<"users">,
  
  // Content
  title: string,
  slug: string,                 // URL-friendly
  excerpt: string,              // תקציר (max 200 chars)
  content: string,              // Markdown
  coverImage?: string,
  
  // Relations
  placeIds?: Id<"places">[],    // מקומות שמוזכרים
  tags?: string[],
  
  // Type
  type: "review" | "guide" | "news" | "list",
  
  // Status
  status: "draft" | "pending_review" | "published" | "rejected",
  publishedAt?: number,
  
  // Stats
  viewCount: number,
  
  // Timestamps
  createdAt: number,
  updatedAt: number,
}
```

### raffles
```typescript
{
  _id: Id<"raffles">,
  
  // Details
  title: string,                // "הגרלת ינואר 2026"
  description: string,
  prize: string,                // "שובר 200₪ לשווארמה"
  prizeValue: number,           // 200
  
  // Dates
  month: string,                // "2026-01"
  startDate: number,
  endDate: number,
  drawDate: number,
  
  // Status
  status: "upcoming" | "active" | "drawing" | "completed",
  
  // Winner
  winnerId?: Id<"users">,
  winnerEntryId?: Id<"raffleEntries">,
  winnerAnnouncedAt?: number,
  
  // Stats
  totalEntries: number,
  participantCount: number,
  
  // Timestamps
  createdAt: number,
}
```

### raffleEntries
```typescript
{
  _id: Id<"raffleEntries">,
  raffleId: Id<"raffles">,
  userId: Id<"users">,
  
  // Source
  sourceType: "review" | "article" | "bonus",
  sourceId?: Id<"reviews"> | Id<"articles">,
  
  // Timestamps
  createdAt: number,
}
```

---

## 🔐 Auth Flow

### אפשרות 1: Email + Password (מומלץ להתחלה)
1. משתמש נרשם עם email + password
2. שולחים verification email
3. משתמש מאמת → role = "visitor"
4. יכול להגיש מועמדות לנבחרת

### אפשרות 2: Google OAuth (שלב 2)
1. Login with Google
2. מקבלים profile + email
3. יוצרים/מעדכנים user
4. אותו flow מכאן

### Convex Auth
נשתמש ב-`@convex-dev/auth` (ספריה רשמית):
- תומך email + OAuth
- Session management מובנה
- Hooks ל-React

---

## 📱 דפים ו-UI

### דפים חדשים

| דף | נתיב | תיאור |
|----|------|--------|
| התחברות | `/login` | Email + Google |
| הרשמה | `/signup` | טופס הרשמה |
| הפרופיל שלי | `/profile` | הביקורות והכתבות שלי |
| פרופיל מבקר | `/reviewer/[id]` | פרופיל ציבורי של מבקר |
| הצטרף לנבחרת | `/join-squad` | טופס מועמדות |
| נבחרת המבקרים | `/squad` | רשימת המבקרים + הסבר |
| כתוב ביקורת | `/place/[slug]/review` | טופס ביקורת (רק למבקרים) |
| כתוב כתבה | `/write` | עורך כתבות (רק למבקרים) |
| הגרלות | `/raffles` | הגרלה נוכחית + היסטוריה |
| אדמין | `/admin/*` | ניהול מבקרים, הגרלות |

### שינויים בדפים קיימים

| דף | שינוי |
|----|-------|
| `/place/[slug]` | הוספת ביקורות + כפתור "כתוב ביקורת" |
| `/blog` | הוספת כתבות של מבקרים |
| Navbar | Login/Profile button |

---

## 🎯 User Journeys

### Journey 1: גולש → מבקר
```
1. גולש נכנס לאתר → רואה ביקורות איכותיות
2. רוצה לכתוב ביקורת → "הצטרף לנבחרת"
3. נרשם (email/Google)
4. ממלא טופס מועמדות (2-3 דקות)
5. ממתין לאישור (1-2 ימים)
6. מקבל אישור + הודעה במייל
7. יכול לכתוב ביקורות וכתבות!
```

### Journey 2: מבקר כותב ביקורת
```
1. מבקר נכנס לדף מקום
2. לוחץ "כתוב ביקורת"
3. ממלא: כותרת, תוכן, 5 דירוגים, תמונות
4. שולח → ביקורת מתפרסמת
5. נוצר כרטיס הגרלה אוטומטית 🎟️
6. רואה "נוסף כרטיס להגרלת ינואר!"
```

### Journey 3: הגרלה חודשית
```
1. אדמין יוצר הגרלה חדשה (תחילת חודש)
2. מבקרים כותבים ביקורות → כרטיסים נצברים
3. סוף החודש: אדמין מגריל
4. הזוכה מקבל הודעה במייל
5. מתפרסם באתר + רשתות חברתיות
```

---

## 🛠️ תוכנית הטמעה

### שלב 1: Auth בסיסי (2-3 שעות)
- [ ] 1.1 התקנת `@convex-dev/auth`
- [ ] 1.2 Schema: users (בסיסי)
- [ ] 1.3 דפי Login + Signup
- [ ] 1.4 AuthProvider + hooks
- [ ] 1.5 Navbar עם Login/Profile
- [ ] 1.6 Protected routes middleware

**תוצאה:** משתמשים יכולים להירשם ולהתחבר

### שלב 2: מערכת מבקרים (2-3 שעות)
- [ ] 2.1 Schema: reviewerApplications
- [ ] 2.2 דף `/join-squad` (טופס מועמדות)
- [ ] 2.3 דף `/squad` (מי אנחנו + רשימת מבקרים)
- [ ] 2.4 דף `/reviewer/[id]` (פרופיל מבקר)
- [ ] 2.5 אדמין: רשימת מועמדויות + אישור/דחייה
- [ ] 2.6 Email notification לאישור

**תוצאה:** אפשר להגיש מועמדות ולקבל אישור

### שלב 3: ביקורות (2-3 שעות)
- [ ] 3.1 Schema: reviews
- [ ] 3.2 דף `/place/[slug]/review` (טופס ביקורת)
- [ ] 3.3 קומפוננטת ReviewCard
- [ ] 3.4 רשימת ביקורות בדף מקום
- [ ] 3.5 5 קטגוריות דירוג (כוכבים)
- [ ] 3.6 העלאת תמונות (Convex storage)
- [ ] 3.7 עדכון ממוצע דירוג במקום

**תוצאה:** מבקרים יכולים לכתוב ביקורות מלאות

### שלב 4: הגרלות (1-2 שעות)
- [ ] 4.1 Schema: raffles + raffleEntries
- [ ] 4.2 יצירת כרטיס אוטומטית עם ביקורת
- [ ] 4.3 דף `/raffles` (הגרלה נוכחית + היסטוריה)
- [ ] 4.4 אדמין: יצירת הגרלה + הגרלת זוכה
- [ ] 4.5 הצגת "X כרטיסים להגרלה" בפרופיל

**תוצאה:** מערכת הגרלות עובדת

### שלב 5: כתבות UGC (1-2 שעות)
- [ ] 5.1 Schema: articles (UGC)
- [ ] 5.2 דף `/write` (עורך Markdown)
- [ ] 5.3 אישור כתבות (admin)
- [ ] 5.4 שילוב ב-`/blog`
- [ ] 5.5 כרטיס הגרלה על כתבה

**תוצאה:** מבקרים יכולים לכתוב כתבות

### שלב 6: Polish (1 שעה)
- [ ] 6.1 Badges ו-UI polish
- [ ] 6.2 Email templates (Resend)
- [ ] 6.3 Loading states
- [ ] 6.4 Error handling
- [ ] 6.5 Mobile responsive

---

## 📊 Indexes (Convex)

```typescript
// users
.index("by_email", ["email"])
.index("by_role", ["role"])
.index("by_reviewCount", ["reviewCount"])

// reviewerApplications
.index("by_userId", ["userId"])
.index("by_status", ["status"])

// reviews
.index("by_placeId", ["placeId"])
.index("by_userId", ["userId"])
.index("by_createdAt", ["createdAt"])

// articles
.index("by_userId", ["userId"])
.index("by_status", ["status"])
.index("by_slug", ["slug"])

// raffles
.index("by_month", ["month"])
.index("by_status", ["status"])

// raffleEntries
.index("by_raffleId", ["raffleId"])
.index("by_userId", ["userId"])
```

---

## 🔒 Security Rules

```typescript
// reviews - רק מבקרים יכולים ליצור
if (user.role !== "reviewer" && user.role !== "senior_reviewer" && user.role !== "admin") {
  throw new Error("Only approved reviewers can write reviews");
}

// articles - רק מבקרים יכולים ליצור
// Same as reviews

// reviewerApplications - רק visitors יכולים להגיש
if (user.role !== "visitor") {
  throw new Error("You are already a reviewer or have a pending application");
}

// admin actions - רק admins
if (user.role !== "admin") {
  throw new Error("Admin access required");
}
```

---

## 📧 Emails (Resend)

| טריגר | נמען | תוכן |
|-------|------|------|
| הרשמה | משתמש | Welcome + verify email |
| מועמדות התקבלה | משתמש | אישור קבלה, מה עכשיו |
| מועמדות נדחתה | משתמש | סיבה + אפשרות לנסות שוב |
| זכייה בהגרלה | זוכה | מזל טוב + איך לממש |
| הגרלה חדשה | כל המבקרים | הגרלה החלה, כתבו ביקורות! |

---

## 📈 KPIs

| מדד | יעד חודש 1 | יעד חודש 3 |
|-----|------------|------------|
| מבקרים מאושרים | 10 | 50 |
| ביקורות | 30 | 200 |
| כתבות | 5 | 30 |
| משתתפים בהגרלה | 10 | 40 |

---

## 🚀 MVP Scope

**בתוך ה-MVP:**
- ✅ Auth (email)
- ✅ מועמדות + אישור
- ✅ ביקורות עם 5 דירוגים
- ✅ הגרלות בסיסיות
- ✅ פרופיל מבקר

**מחוץ ל-MVP (Phase 3):**
- ❌ Google OAuth
- ❌ כתבות UGC
- ❌ Verified visits (מיקום/קבלה)
- ❌ Senior reviewer role
- ❌ Email notifications מלאות

---

## ⏱️ הערכת זמנים

| שלב | זמן מוערך |
|-----|-----------|
| שלב 1: Auth | 2-3 שעות |
| שלב 2: מבקרים | 2-3 שעות |
| שלב 3: ביקורות | 2-3 שעות |
| שלב 4: הגרלות | 1-2 שעות |
| שלב 5: כתבות | 1-2 שעות |
| שלב 6: Polish | 1 שעה |
| **סה"כ** | **9-14 שעות** |

עם Claude Code במצב plan + execute: **~4-6 שעות עבודה בפועל**

---

*נכתב על ידי דוד 🔧 — 2026-01-29*
