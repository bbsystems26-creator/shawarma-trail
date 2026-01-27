# 🥙 ShawarmaTrail — Task Breakdown & Execution Plan

**Project:** ShawarmaTrail
**Method:** Parallel Agent Pipeline
**Last Updated:** 2026-01-27

---

## Dependency Graph

```
                    ┌─────────┐
                    │  TASK A  │  Schema + Seed + Queries (Backend)
                    └────┬────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
       ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
       │ TASK B2 │ │ TASK B3 │ │ TASK B4 │
       │Listing  │ │Homepage │ │Explore  │
       │Page     │ │Overhaul │ │Page     │
       └─────────┘ └─────────┘ └─────────┘
                                    
  ┌─────────┐  (independent — runs parallel with A)
  │ TASK B1 │  Navbar + Footer Components
  └─────────┘

  ┌─────────┐  (after B2-B4 done)
  │ TASK C  │  Deploy + Polish
  └─────────┘
```

**Parallel lanes:**
- 🟢 Lane 1: A → B2 → (done)
- 🟢 Lane 2: B1 (anytime) → feed into B3
- 🟢 Lane 3: A → B3 (needs queries + Navbar/Footer from B1)
- 🟢 Lane 4: A → B4
- 🟢 Lane 5: C (after all B tasks)

**Max parallelism:** A ‖ B1 (2 agents), then B2 ‖ B3 ‖ B4 (3 agents)

---

## TASK A — Backend: Schema + Seed + Queries
**Priority:** 🔴 P0 — Blocks B2, B3, B4
**Estimated time:** ~10 min
**Dependencies:** None

### Sub-tasks:
1. **A.1** Update `convex/schema.ts`
   - Add to `places` table:
     - `ownerStory: v.optional(v.string())` — סיפור הבעלים
     - `tags: v.array(v.string())` — תגיות מאפיינים (wifi, parking, shelter, kids, open-saturday, etc.)
     - `profileImage: v.optional(v.string())` — לוגו/תמונת פרופיל URL
     - `socialLinks: v.optional(v.any())` — { instagram?, facebook?, tiktok? }
     - `menuItems: v.optional(v.any())` — [{ category, items: [{ name, price, description }] }]
     - `tips: v.optional(v.any())` — [{ category: "kids"|"trips"|"parking", text }]
     - `createdAt: v.number()` — timestamp for "newest" sorting
   - Add index: `by_createdAt` on `["createdAt"]`
   - Add index: `by_featured` on `["isFeatured"]`

2. **A.2** Update `convex/seedData.ts`
   - Add to all 30 places:
     - `ownerStory` — 2-3 sentences in Hebrew per place
     - `tags` — 3-6 tags per place (from: wifi, parking, seating, delivery, kids, open-saturday, open-friday, shelter, accessible, halal, reservist-discount, air-conditioned, outdoor-seating, pet-friendly)
     - `createdAt` — staggered timestamps (last 90 days)
     - `socialLinks` — Instagram for ~50% of places
     - `menuItems` — for ~30% of places (3-5 items each)
     - `tips` — for ~50% of places

3. **A.3** Update `convex/places.ts` — Add queries:
   - `listFeatured` — returns places where `isFeatured === true`, limit 6
   - `listNewest` — returns places sorted by `createdAt` desc, limit 6
   - `listByTag` — accepts `tag: string`, returns places where `tags` includes that tag

4. **A.4** Deploy & verify:
   - Run `npx convex dev --once`
   - Run `npx convex run seedData:seed`
   - Verify no errors

5. **A.5** Commit: `git add -A && git commit -m "✨ Schema v2: ownerStory, tags, menuItems, tips + new queries"`

### Output:
- Updated schema with new fields
- 30 places with rich data
- 3 new query functions
- Clean commit

---

## TASK B1 — UI Components: Navbar + Footer
**Priority:** 🟡 P1
**Estimated time:** ~8 min
**Dependencies:** None (can run parallel with A)

### Sub-tasks:
1. **B1.1** Create `src/components/Navbar.tsx`
   - Logo (🥙 שווארמה טרייל) + text
   - Nav links: בית, גלה, מגזין (disabled), צור קשר (disabled)
   - Mobile hamburger menu
   - Dark theme, RTL
   - Sticky top

2. **B1.2** Create `src/components/Footer.tsx`
   - 4 columns: ניווט, מידע שימושי, חיפושים פופולריים, עקבו אחרינו
   - Newsletter email input (UI only)
   - "© 2026 ShawarmaTrail. כל הזכויות שמורות"
   - Social icons (Instagram, Facebook, TikTok)
   - Dark theme, RTL

3. **B1.3** Update `src/app/layout.tsx` — Import and render Navbar + Footer

4. **B1.4** Update `src/lib/constants.ts` — Add nav labels, footer labels

5. **B1.5** Verify: `npm run build` passes

6. **B1.6** Commit: `git add -A && git commit -m "🧭 Navbar + Footer components"`

### Output:
- Navbar.tsx, Footer.tsx components
- Layout updated
- Constants updated

---

## TASK B2 — Listing Page Overhaul
**Priority:** 🔴 P0
**Estimated time:** ~12 min
**Dependencies:** ✅ TASK A must be complete

### Sub-tasks:
1. **B2.1** Update `src/app/place/[slug]/page.tsx`:
   - **Action buttons row:** WhatsApp (opens `https://wa.me/{whatsapp}`), Phone (`tel:{phone}`), Share (Web Share API with fallback copy-link), Waze nav
   - **Open/Closed status:** Calculate from `openingHours` + current time, show badge
   - **Owner Story section:** Display `ownerStory` with styled quote block
   - **Tags badges:** Display `tags[]` as colored pill badges
   - **Mini-map:** Small Leaflet map showing just this place's location
   - **Social links:** Instagram/Facebook/TikTok icons from `socialLinks`
   - **Menu section:** Tabbed display of `menuItems` if present
   - **Tips section:** "מה כדאי לדעת" tabs from `tips` if present

2. **B2.2** Create `src/components/ActionButtons.tsx`
   - WhatsApp, Phone, Share, Navigate buttons
   - Reusable component

3. **B2.3** Create `src/components/OpenStatus.tsx`
   - Takes `openingHours` object + returns פתוח/סגור badge with color

4. **B2.4** Create `src/components/MiniMap.tsx`
   - Small Leaflet map, single marker, non-interactive (or minimal interaction)

5. **B2.5** Create `src/components/TagBadges.tsx`
   - Takes `tags[]`, renders colored pills
   - Hebrew labels from constants

6. **B2.6** Update `src/lib/constants.ts` — Tag labels in Hebrew:
   ```
   TAG_LABELS: { wifi: "WiFi", parking: "חניה", seating: "ישיבה", ... }
   ```

7. **B2.7** Verify: `npm run build` passes

8. **B2.8** Commit: `git add -A && git commit -m "📄 Listing page: WhatsApp, share, status, ownerStory, tags, map"`

### Output:
- Rich listing page matching CoffeeTrail quality
- 4 new reusable components
- Updated constants

---

## TASK B3 — Homepage Overhaul
**Priority:** 🔴 P0
**Estimated time:** ~12 min
**Dependencies:** ✅ TASK A (queries), ✅ TASK B1 (Navbar/Footer)

### Sub-tasks:
1. **B3.1** Rewrite `src/app/page.tsx`:
   - **Hero section:** Full-width with search, region buttons (צפון, מרכז, דרום, ירושלים, שפלה)
   - **Featured carousel:** "שווה לנסות" — 6 cards from `listFeatured` query, horizontal scroll
   - **Newest carousel:** "חדשים שהצטרפו" — 6 cards from `listNewest` query
   - **Popular tags section:** Clickable tag pills (links to Explore with filter)
   - **Region sections:** Cards for each region with hero image/gradient + count
   - **Marketing text:** "קצת על שווארמה טרייל" section
   - Keep existing map + grid below or integrate into explore link

2. **B3.2** Create `src/components/Carousel.tsx`
   - Horizontal scroll container with arrows
   - Accepts children (PlaceCards)
   - Touch-friendly swipe on mobile

3. **B3.3** Create `src/components/HeroSection.tsx`
   - Full-width background gradient/image
   - Search bar centered
   - Region quick-links

4. **B3.4** Create `src/components/RegionCard.tsx`
   - Region name + gradient background + place count
   - Links to Explore filtered by region

5. **B3.5** Update `src/lib/constants.ts` — Region display data, marketing text

6. **B3.6** Verify: `npm run build` passes

7. **B3.7** Commit: `git add -A && git commit -m "🏠 Homepage: hero, carousels, regions, tags"`

### Output:
- Professional homepage with 6+ sections
- 3 new reusable components
- CoffeeTrail-quality landing page

---

## TASK B4 — Explore Page
**Priority:** 🟡 P1
**Estimated time:** ~10 min
**Dependencies:** ✅ TASK A (queries)

### Sub-tasks:
1. **B4.1** Create `src/app/explore/page.tsx`:
   - **Split layout:** Map (left/top) + List (right/bottom)
   - Mobile: toggle between map and list views
   - Desktop: side-by-side (60% list / 40% map, or configurable)

2. **B4.2** Sort options toolbar:
   - מומלצים (default — by rating)
   - חדשים (by createdAt)
   - קרוב אליי (by geo distance — requires location permission)
   - דירוג גבוה (by avgRating)

3. **B4.3** Filter panel:
   - Reuse existing `Filters.tsx` or create compact version
   - Add tag-based filtering

4. **B4.4** Load more / Pagination:
   - Show 20 places initially
   - "הצג עוד" button loads next 20
   - Update map markers to match visible list

5. **B4.5** Open/Closed status on each card (reuse `OpenStatus.tsx` from B2)

6. **B4.6** Map-list interaction:
   - Hover on list card → highlight marker on map
   - Click marker → scroll to card in list

7. **B4.7** Verify: `npm run build` passes

8. **B4.8** Commit: `git add -A && git commit -m "🗺️ Explore page: map+list, sort, pagination"`

### Output:
- Full explore page with map/list split
- Sort + filter + pagination
- Interactive map-list connection

---

## TASK C — Deploy + Polish
**Priority:** 🔴 P0
**Estimated time:** ~8 min
**Dependencies:** ✅ All B tasks complete

### Sub-tasks:
1. **C.1** Run full build: `npm run build` — fix any remaining errors
2. **C.2** Run `npm run lint` — fix warnings
3. **C.3** Test all pages manually (list routes)
4. **C.4** Optimize: Check image sizes, lazy loading, code splitting
5. **C.5** Deploy to Vercel: `npx vercel --prod` (or connect GitHub)
6. **C.6** Verify production site works
7. **C.7** Final commit: `git add -A && git commit -m "🚀 Week 2 complete — ready for production"`
8. **C.8** Push to GitHub: `git push origin main`

### Output:
- Production-ready build
- Deployed on Vercel
- All code pushed to GitHub

---

## Execution Schedule

```
Time    Lane 1          Lane 2          Lane 3
─────   ──────────      ──────────      ──────────
T+0     [TASK A]        [TASK B1]       
T+10    [TASK B2]       [TASK B3]       [TASK B4]
T+22    [TASK C]                        
T+30    ✅ DONE
```

**Total estimated time:** ~30-40 minutes
**Agent sessions:** 5-6 sequential, up to 3 parallel

---

## Session Template

Each Claude Code session receives:
```
Read CLAUDE.md and relevant source files.
Your task: [TASK ID] — [Task Name]

[Paste sub-tasks here]

RULES:
- Hebrew UI text → use constants.ts
- Tailwind dark theme (bg-zinc-900, text-zinc-100)
- RTL (dir="rtl")
- Mobile-first responsive
- Run `npm run build` to verify before committing
- Commit with descriptive emoji message

When finished run: clawdbot gateway wake --text 'Done: [TASK ID] complete' --mode now
```

---

*Generated by דוד 🔧 | Method: Parallel Agent Pipeline*
