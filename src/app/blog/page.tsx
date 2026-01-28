import Link from "next/link";
import { BookOpen, Clock, ArrowLeft } from "lucide-react";
import { articles } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מגזין שווארמה | שווארמה ביס",
  description:
    "מאמרים, מדריכים וטיפים על שווארמה בישראל — דירוגים, מסלולי טעימות, השוואות ועוד.",
  openGraph: {
    title: "מגזין שווארמה | שווארמה ביס",
    description:
      "מאמרים, מדריכים וטיפים על שווארמה בישראל — דירוגים, מסלולי טעימות, השוואות ועוד.",
    locale: "he_IL",
    type: "website",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <span className="text-sm font-semibold text-amber-600 tracking-wide">
              מגזין שווארמה ביס
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            כל מה שצריך לדעת על שווארמה
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            מדריכים, דירוגים, מסלולי טעימות וכתבות מעמיקות — הכל במקום אחד.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className={`group block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${
                idx === 0 ? "md:col-span-2" : ""
              }`}
            >
              {/* Gradient image placeholder */}
              <div
                className={`${article.image} w-full ${
                  idx === 0 ? "h-56 md:h-72" : "h-48 md:h-56"
                } flex items-center justify-center relative`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <span className="relative text-white/90 text-5xl md:text-6xl">
                  🔥
                </span>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 bg-white">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2
                  className={`font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors ${
                    idx === 0
                      ? "text-xl sm:text-2xl md:text-3xl"
                      : "text-lg sm:text-xl"
                  }`}
                >
                  {article.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-2">
                  {article.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                    קראו עוד
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
