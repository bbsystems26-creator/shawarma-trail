"use client";

import Link from "next/link";
import { Route } from "lucide-react";

const highways = [
  { id: "1", name: "כביש 1", description: "ירושלים ↔ תל אביב" },
  { id: "2", name: "כביש 2", description: "תל אביב ↔ חיפה (חוף)" },
  { id: "4", name: "כביש 4", description: "אשדוד ↔ גדרה ↔ רעננה" },
  { id: "6", name: "כביש 6", description: "חוצה ישראל" },
  { id: "40", name: "כביש 40", description: "מרכז הארץ" },
  { id: "70", name: "כביש 70", description: "עמק יזרעאל ↔ חיפה" },
  { id: "90", name: "כביש 90", description: "מאילת לראש הנקרה" },
];

export default function RouteSearch() {
  return (
    <section dir="rtl" className="bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🛣️ שווארמה לאורך הדרך
              </h2>
              <p className="text-gray-600 text-lg">
                מצאו שווארמה לאורך הכבישים הראשיים
              </p>
            </div>

            {/* Highway cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {highways.map((highway) => (
                <Link
                  key={highway.id}
                  href={`/explore?highway=${highway.id}`}
                  className="group block bg-white border border-gray-200 rounded-xl shadow-sm p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-shrink-0 w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Route className="w-5 h-5 text-amber-700" />
                    </div>
                    <span className="font-bold text-gray-900 text-base">
                      {highway.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {highway.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Decorative illustration area - left side (visually left in RTL) */}
          <div className="hidden lg:flex flex-col items-center justify-center pt-16">
            <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center mb-3">
              <Route className="w-14 h-14 text-amber-600" strokeWidth={1.5} />
            </div>
            <div className="w-1 h-32 bg-gradient-to-b from-amber-200 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
