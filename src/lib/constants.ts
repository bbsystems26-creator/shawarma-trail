// All Hebrew UI strings as constants for i18n readiness

// ==================== General ====================
export const SITE_NAME = "שווארמה טרייל";
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
  wifi: "bg-blue-500/20 text-blue-300",
  parking: "bg-green-500/20 text-green-300",
  seating: "bg-amber-500/20 text-amber-300",
  delivery: "bg-purple-500/20 text-purple-300",
  kids: "bg-pink-500/20 text-pink-300",
  "open-saturday": "bg-yellow-500/20 text-yellow-300",
  "open-friday": "bg-orange-500/20 text-orange-300",
  shelter: "bg-red-500/20 text-red-300",
  accessible: "bg-teal-500/20 text-teal-300",
  "air-conditioned": "bg-cyan-500/20 text-cyan-300",
  "outdoor-seating": "bg-lime-500/20 text-lime-300",
  "pet-friendly": "bg-emerald-500/20 text-emerald-300",
  halal: "bg-indigo-500/20 text-indigo-300",
  "reservist-discount": "bg-rose-500/20 text-rose-300",
};

// ==================== Regions Data (for RegionCards) ====================
export const REGIONS_DATA = [
  { name: "north", label: "צפון", gradient: "from-emerald-800 to-emerald-950" },
  { name: "center", label: "מרכז", gradient: "from-blue-800 to-blue-950" },
  { name: "south", label: "דרום", gradient: "from-amber-800 to-amber-950" },
  { name: "jerusalem", label: "ירושלים", gradient: "from-purple-800 to-purple-950" },
  { name: "shfela", label: "שפלה", gradient: "from-rose-800 to-rose-950" },
] as const;

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
