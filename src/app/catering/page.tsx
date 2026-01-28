import type { Metadata } from "next";
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Users,
  Utensils,
  Truck,
  PartyPopper,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";

/* ───────────────────────── SEO ───────────────────────── */

export const metadata: Metadata = {
  title: "קייטרינג שווארמה לאירועים | שווארמה ביס",
  description:
    "מצאו ספקי קייטרינג שווארמה לאירועים בכל הארץ — חתונות, אירועי חברה, מסיבות פרטיות ופוד טראקים. השוו מחירים, קראו ביקורות והזמינו עוד היום.",
  keywords: [
    "קייטרינג שווארמה",
    "שווארמה לאירוע",
    "קייטרינג לחתונה",
    "פוד טראק שווארמה",
    "קייטרינג בשרי",
    "שווארמה לאירועים",
    "קייטרינג ישראלי",
  ],
  openGraph: {
    title: "קייטרינג שווארמה לאירועים | שווארמה ביס",
    description:
      "מצאו ספקי קייטרינג שווארמה לאירועים בכל הארץ — חתונות, אירועי חברה, מסיבות פרטיות ופוד טראקים.",
    type: "website",
  },
};

/* ───────────────────────── Types ───────────────────────── */

type ServiceType = "wedding" | "corporate" | "private" | "foodtruck";

interface CateringProvider {
  name: string;
  description: string;
  city: string;
  region: string;
  priceRange: string;
  services: ServiceType[];
  phone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
}

/* ───────────────────── Service metadata ───────────────── */

const SERVICE_META: Record<
  ServiceType,
  { label: string; icon: typeof PartyPopper }
> = {
  wedding: { label: "חתונות", icon: PartyPopper },
  corporate: { label: "אירועי חברה", icon: Users },
  private: { label: "אירועים פרטיים", icon: Utensils },
  foodtruck: { label: "פוד טראק", icon: Truck },
};

/* ───────────────────── Provider data ────────────────────── */

const providers: CateringProvider[] = [
  {
    name: "שווארמה VIP קייטרינג",
    description:
      "קייטרינג שווארמה יוקרתי לאירועים גדולים. עמדות שף מקצועיות, בשר טרי בהכנה במקום, תפריט מותאם אישית ושירות ברמה הגבוהה ביותר.",
    city: "תל אביב",
    region: "מרכז",
    priceRange: "₪₪₪",
    services: ["wedding", "corporate"],
    phone: "03-9876543",
    whatsapp: "972539876543",
    rating: 4.9,
    reviewCount: 187,
  },
  {
    name: "הגריל הנודד",
    description:
      "פוד טראק שווארמה מקצועי שמגיע לכל מקום. אווירה רחוב אותנטית עם שווארמה על האש, סלטים טריים ולפתנים ביתיים.",
    city: "חיפה",
    region: "צפון",
    priceRange: "₪₪",
    services: ["private", "foodtruck"],
    phone: "04-8765432",
    whatsapp: "972548765432",
    rating: 4.7,
    reviewCount: 124,
  },
  {
    name: "שווארמה המלך ירושלים",
    description:
      "מסורת ירושלמית של בשר על האש. קייטרינג כשר למהדרין לאירועים, בר מצוות, שבתות חתן ואירועי חברה.",
    city: "ירושלים",
    region: "ירושלים",
    priceRange: "₪₪₪",
    services: ["wedding", "corporate", "private"],
    phone: "02-6543210",
    whatsapp: "972526543210",
    rating: 4.8,
    reviewCount: 203,
  },
  {
    name: "בשר על האש — קייטרינג דרום",
    description:
      "קייטרינג שווארמה במחירים הוגנים לאירועים בדרום. מתמחים במסיבות פרטיות, ימי הולדת ואירועי חצר עם עמדת גריל חיה.",
    city: "באר שבע",
    region: "דרום",
    priceRange: "₪₪",
    services: ["private", "foodtruck"],
    phone: "08-6234567",
    whatsapp: "972586234567",
    rating: 4.5,
    reviewCount: 89,
  },
  {
    name: "עמדת שווארמה פרימיום",
    description:
      "עמדות שווארמה מעוצבות לחתונות ואירועים מיוחדים. חוויה קולינרית מלאה עם שף ראשי, תאורה אווירתית ותפריט דגסטציה.",
    city: "רמת גן",
    region: "מרכז",
    priceRange: "₪₪₪",
    services: ["wedding", "corporate"],
    phone: "03-7654321",
    whatsapp: "972507654321",
    rating: 4.9,
    reviewCount: 156,
  },
  {
    name: "שווארמה ישראלית אמיתית",
    description:
      "טעם ביתי אותנטי לכל אירוע. מנות שווארמה שלמות עם אורז, סלטים, חומוס ופיתות טריות. מחירים נגישים לכל כיס.",
    city: "נתניה",
    region: "מרכז",
    priceRange: "₪₪",
    services: ["private", "corporate"],
    phone: "09-8345678",
    whatsapp: "972528345678",
    rating: 4.6,
    reviewCount: 97,
  },
  {
    name: "המעשנה הנודדת",
    description:
      "פוד טראק ייחודי המשלב שווארמה עם בשרים מעושנים. חוויית אוכל רחוב ברמה גבוהה — מושלם לפסטיבלים, חתונות שטח ואירועי חברה.",
    city: "טבריה",
    region: "צפון",
    priceRange: "₪₪",
    services: ["wedding", "foodtruck", "private"],
    phone: "04-6789012",
    whatsapp: "972546789012",
    rating: 4.8,
    reviewCount: 112,
  },
  {
    name: "שף השווארמה — קייטרינג מקצועי",
    description:
      "שף שווארמה מנוסה עם 15 שנות ניסיון בקייטרינג לאירועים. תפריט מותאם, חומרי גלם מובחרים וליווי אישי מהתכנון ועד הביצוע.",
    city: "ראשון לציון",
    region: "מרכז",
    priceRange: "₪₪₪",
    services: ["wedding", "corporate", "private"],
    phone: "03-9012345",
    whatsapp: "972559012345",
    rating: 4.7,
    reviewCount: 143,
  },
  {
    name: "שווארמה בסטייל",
    description:
      "קייטרינג שווארמה צעיר ודינמי. מתמחים באירועים בינוניים ומסיבות עם אווירה, מוזיקה ועמדות אוכל מגוונות.",
    city: "מודיעין",
    region: "מרכז",
    priceRange: "₪₪",
    services: ["private", "corporate", "foodtruck"],
    phone: "08-9123456",
    whatsapp: "972529123456",
    rating: 4.6,
    reviewCount: 78,
  },
];

/* ───────────────── Stars sub-component ──────────────── */

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
                ? "fill-amber-200 text-amber-400"
                : "text-gray-300"
          }`}
        />
      ))}
      <span className="mr-1 text-sm font-medium text-gray-700">{rating}</span>
      <span className="text-sm text-gray-500">({count} ביקורות)</span>
    </div>
  );
}

/* ──────────────── Provider card component ───────────── */

function ProviderCard({ provider }: { provider: CateringProvider }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-shawarma-300 hover:shadow-lg">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-bold leading-tight text-gray-900">
          {provider.name}
        </h3>
        <span className="shrink-0 rounded-full bg-shawarma-50 px-3 py-1 text-sm font-semibold text-shawarma-600">
          {provider.priceRange}
        </span>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <Stars rating={provider.rating} count={provider.reviewCount} />
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        {provider.description}
      </p>

      {/* Location */}
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <MapPin className="h-4 w-4 text-shawarma-400" />
        <span>{provider.city}</span>
        <span className="text-gray-300">|</span>
        <span>{provider.region}</span>
      </div>

      {/* Services */}
      <div className="mb-4 flex flex-wrap gap-2">
        {provider.services.map((service) => {
          const meta = SERVICE_META[service];
          const Icon = meta.icon;
          return (
            <span
              key={service}
              className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex gap-3 border-t border-gray-100 pt-4">
        <a
          href={`tel:${provider.phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          <Phone className="h-4 w-4" />
          {provider.phone}
        </a>
        <a
          href={`https://wa.me/${provider.whatsapp}?text=${encodeURIComponent("היי, אשמח לשמוע על שירותי הקייטרינג שלכם 🍖")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

/* ──────────────── Contact form section ──────────────── */

function ContactForm() {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
        📋 בקשת הצעת מחיר
      </h2>
      <p className="mb-8 text-center text-gray-500">
        מלאו את הפרטים ונחזור אליכם עם הצעות מותאמות
      </p>

      <form className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              שם מלא
            </label>
            <input
              type="text"
              id="name"
              placeholder="ישראל ישראלי"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-shawarma-400 focus:ring-2 focus:ring-shawarma-100"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              טלפון
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="050-1234567"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-shawarma-400 focus:ring-2 focus:ring-shawarma-100"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="eventType"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              סוג אירוע
            </label>
            <select
              id="eventType"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-shawarma-400 focus:ring-2 focus:ring-shawarma-100"
            >
              <option value="">בחרו סוג אירוע</option>
              <option value="wedding">חתונה</option>
              <option value="corporate">אירוע חברה</option>
              <option value="private">מסיבה פרטית</option>
              <option value="birthday">יום הולדת</option>
              <option value="barmitzvah">בר/בת מצווה</option>
              <option value="other">אחר</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              תאריך משוער
            </label>
            <input
              type="date"
              id="date"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-shawarma-400 focus:ring-2 focus:ring-shawarma-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="guests"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            מספר אורחים משוער
          </label>
          <input
            type="number"
            id="guests"
            placeholder="100"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-shawarma-400 focus:ring-2 focus:ring-shawarma-100"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            הערות נוספות
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="ספרו לנו על האירוע שלכם..."
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-shawarma-400 focus:ring-2 focus:ring-shawarma-100"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-gradient-to-l from-amber-500 to-shawarma-500 px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
        >
          🍖 שלחו בקשה
        </button>
      </form>
    </section>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */

export default function CateringPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* ───── Hero Section ───── */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-amber-500 via-orange-500 to-shawarma-500">
        <div className="absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
          <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow-md sm:text-5xl lg:text-6xl">
            🍖 שווארמה לאירוע
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            הפכו כל אירוע לחוויה בלתי נשכחת עם קייטרינג שווארמה מקצועי.
            חתונות, ימי הולדת, אירועי חברה — מצאו את הספק המושלם באזור שלכם.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-white/80">
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <PartyPopper className="h-4 w-4" /> חתונות
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4" /> אירועי חברה
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Utensils className="h-4 w-4" /> מסיבות פרטיות
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Truck className="h-4 w-4" /> פוד טראקים
            </span>
          </div>
        </div>
      </section>

      {/* ───── Providers Grid ───── */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
          ספקי קייטרינג שווארמה מומלצים
        </h2>
        <p className="mb-10 text-center text-gray-500">
          בחרנו עבורכם את ספקי הקייטרינג המובילים בכל הארץ
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.name} provider={provider} />
          ))}
        </div>
      </section>

      {/* ───── Contact Form ───── */}
      <section className="bg-gradient-to-b from-gray-50 to-shawarma-50/30 px-4 py-16">
        <ContactForm />
      </section>

      {/* ───── FAQ Section ───── */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
          ❓ שאלות נפוצות
        </h2>
        <p className="mb-10 text-center text-gray-500">
          כל מה שצריך לדעת על קייטרינג שווארמה לאירועים
        </p>
        <FaqAccordion />
      </section>
    </div>
  );
}
