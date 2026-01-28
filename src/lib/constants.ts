// All Hebrew UI strings as constants for i18n readiness

// ==================== General ====================
export const SITE_NAME = "שווארמה ביס";
export const SITE_TAGLINE = "מצאו את השווארמה הטובה בישראל";
export const SITE_DESCRIPTION =
  "מפה אינטראקטיבית של מקומות השווארמה הטובים בישראל — דירוגים, ביקורות, ופילטרים חכמים";

// ==================== Navigation ====================
export const NAV = {
  home: "דף הבית",
  map: "מפה",
  topLists: "דירוגים",
  about: "אודות",
  addPlace: "הוסיפו מקום",
} as const;

// ==================== Kashrut Labels ====================
export const KASHRUT_LABELS: Record<string, string> = {
  none: "ללא כשרות",
  regular: "כשר",
  mehadrin: "מהדרין",
  badatz: 'בד"ץ',
};

export const KASHRUT_OPTIONS = [
  { value: "none", label: "ללא כשרות" },
  { value: "regular", label: "כשר" },
  { value: "mehadrin", label: "מהדרין" },
  { value: "badatz", label: 'בד"ץ' },
] as const;

// ==================== Region Labels ====================
export const REGION_LABELS: Record<string, string> = {
  north: "צפון",
  center: "מרכז",
  south: "דרום",
  jerusalem: "ירושלים",
  shfela: "שפלה",
};

export const REGION_OPTIONS = [
  { value: "north", label: "צפון" },
  { value: "center", label: "מרכז" },
  { value: "south", label: "דרום" },
  { value: "jerusalem", label: "ירושלים" },
  { value: "shfela", label: "שפלה" },
] as const;

// ==================== Meat Type Labels ====================
export const MEAT_TYPE_LABELS: Record<string, string> = {
  lamb: "כבש",
  beef: "עגל",
  turkey: "הודו",
  mixed: "מעורב",
  chicken: "עוף",
};

export const MEAT_TYPE_OPTIONS = [
  { value: "lamb", label: "כבש" },
  { value: "beef", label: "עגל" },
  { value: "turkey", label: "הודו" },
  { value: "mixed", label: "מעורב" },
  { value: "chicken", label: "עוף" },
] as const;

// ==================== Style Labels ====================
export const STYLE_LABELS: Record<string, string> = {
  laffa: "לאפה",
  pita: "פיתה",
  plate: "צלחת",
  fire: "על האש",
};

export const STYLE_OPTIONS = [
  { value: "laffa", label: "לאפה" },
  { value: "pita", label: "פיתה" },
  { value: "plate", label: "צלחת" },
  { value: "fire", label: "על האש" },
] as const;

// ==================== Price Range Labels ====================
export const PRICE_RANGE_LABELS: Record<number, string> = {
  1: "₪",
  2: "₪₪",
  3: "₪₪₪",
};

export const PRICE_RANGE_OPTIONS = [
  { value: 1, label: "₪ — זול" },
  { value: 2, label: "₪₪ — ממוצע" },
  { value: 3, label: "₪₪₪ — יקר" },
] as const;

// ==================== Review Rating Categories ====================
export const RATING_CATEGORIES = {
  ratingMeat: "טעם הבשר",
  ratingBread: "הלאפה / פיתה",
  ratingSides: "תוספות",
  ratingService: "שירות",
  ratingValue: "תמורה למחיר",
} as const;

// ==================== UI Strings ====================
export const UI = {
  // Hero
  heroTitle: "מצאו את השווארמה הטובה בישראל",
  heroSubtitle: "מפה אינטראקטיבית, דירוגים וביקורות — הכל במקום אחד",
  heroSearch: "חפשו מקום, עיר או אזור...",

  // Filters
  filtersTitle: "סינון",
  filterKashrut: "כשרות",
  filterMeatType: "סוג בשר",
  filterStyle: "סגנון",
  filterPriceRange: "טווח מחיר",
  filterRegion: "אזור",
  filterAll: "הכל",
  clearFilters: "נקו פילטרים",

  // Place Card
  reviews: "ביקורות",
  noReviews: "אין ביקורות עדיין",
  featured: "מומלץ",
  verified: "מאומת",
  delivery: "משלוחים",
  seating: "ישיבה במקום",

  // Place Detail
  aboutPlace: "אודות",
  addressLabel: "כתובת",
  phoneLabel: "טלפון",
  openingHoursLabel: "שעות פתיחה",
  navigateWaze: "נווטו עם Waze",
  navigateGoogle: "נווטו עם Google Maps",
  reviewsSection: "ביקורות",
  writeReview: "כתבו ביקורת",
  similarPlaces: "מקומות דומים באזור",

  // Review Form
  reviewFormTitle: "כתבו ביקורת",
  reviewPlaceholder: "ספרו לנו על החוויה שלכם...",
  submitReview: "שלחו ביקורת",
  ratingOverall: "דירוג כולל",

  // General
  loading: "טוען...",
  error: "שגיאה",
  noResults: "לא נמצאו תוצאות",
  showMore: "הצג עוד",
  backToHome: "חזרה לדף הבית",
  moreInfo: "מידע נוסף",

  // Map
  mapTitle: "מפת שווארמה",
  mapNoToken: "נדרש טוקן Mapbox להצגת המפה",

  // Setup
  setupMessage: "הגדירו את NEXT_PUBLIC_CONVEX_URL כדי להתחבר ל-Convex",
} as const;

// ==================== Tag Labels ====================
export const TAG_LABELS: Record<string, string> = {
  wifi: "WiFi",
  parking: "חניה",
  seating: "ישיבה",
  delivery: "משלוחים",
  kids: "ידידותי לילדים",
  "open-saturday": "פתוח בשבת",
  "open-friday": "פתוח בשישי",
  shelter: "מקלט",
  accessible: "נגישות",
  "air-conditioned": "מיזוג",
  "outdoor-seating": "ישיבה בחוץ",
  "pet-friendly": "ידידותי לחיות",
  halal: "חלאל",
  "reservist-discount": "הנחת מילואימניקים",
};

export const TAG_COLORS: Record<string, string> = {
  wifi: "bg-blue-50 text-blue-700 border border-blue-200",
  parking: "bg-green-50 text-green-700 border border-green-200",
  seating: "bg-amber-50 text-amber-800 border border-amber-200",
  delivery: "bg-purple-50 text-purple-700 border border-purple-200",
  kids: "bg-pink-50 text-pink-700 border border-pink-200",
  "open-saturday": "bg-yellow-50 text-yellow-800 border border-yellow-200",
  "open-friday": "bg-orange-50 text-orange-700 border border-orange-200",
  shelter: "bg-red-50 text-red-700 border border-red-200",
  accessible: "bg-teal-50 text-teal-700 border border-teal-200",
  "air-conditioned": "bg-cyan-50 text-cyan-700 border border-cyan-200",
  "outdoor-seating": "bg-lime-50 text-lime-700 border border-lime-200",
  "pet-friendly": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  halal: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "reservist-discount": "bg-rose-50 text-rose-700 border border-rose-200",
};

// ==================== Regions Data (for RegionCards) ====================
export const REGIONS_DATA = [
  { name: "north", label: "צפון", gradient: "from-emerald-800 to-emerald-950", image: "/images/regions/north.png" },
  { name: "center", label: "מרכז", gradient: "from-blue-800 to-blue-950", image: "/images/regions/center.png" },
  { name: "south", label: "דרום", gradient: "from-amber-800 to-amber-950", image: "/images/regions/south.png" },
  { name: "jerusalem", label: "ירושלים", gradient: "from-purple-800 to-purple-950", image: "/images/regions/jerusalem.png" },
  { name: "shfela", label: "שפלה", gradient: "from-rose-800 to-rose-950", image: "/images/regions/shephelah.png" },
] as const;

// ==================== Tag Icons ====================
// TAG_ICONS moved to src/components/TagIcon.tsx as React components (Lucide icons)

// ==================== Aliases (backward compat) ====================
export const UI_TEXT = {
  search: UI.heroSearch,
  noResults: UI.noResults,
  loading: UI.loading,
  reviews: UI.reviews,
  writeReview: UI.writeReview,
  submit: UI.submitReview,
  featured: UI.featured,
  verified: UI.verified,
  openNow: "פתוח עכשיו",
  delivery: UI.delivery,
  seating: UI.seating,
  showOnMap: "הצג על המפה",
  navigate: "נווט לכאן",
  allPlaces: "כל המקומות",
  topRated: "הכי מדורגים",
  nearby: "קרוב אליי",
  filterBy: UI.filtersTitle,
  clearFilters: UI.clearFilters,
  viewAll: "צפה בהכל",
  moreInfo: UI.moreInfo,
  phone: UI.phoneLabel,
  hours: UI.openingHoursLabel,
  menu: "תפריט",
  share: "שתף",
};

export const PRICE_LABELS = PRICE_RANGE_LABELS;

export const FILTER_TITLES = {
  kashrut: UI.filterKashrut,
  region: UI.filterRegion,
  meatType: UI.filterMeatType,
  style: UI.filterStyle,
  priceRange: UI.filterPriceRange,
  rating: "דירוג מינימלי",
};

export const RATING_LABELS = {
  overall: UI.ratingOverall,
  meat: RATING_CATEGORIES.ratingMeat,
  bread: RATING_CATEGORIES.ratingBread,
  sides: RATING_CATEGORIES.ratingSides,
  service: RATING_CATEGORIES.ratingService,
  value: RATING_CATEGORIES.ratingValue,
};
