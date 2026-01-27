import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/constants";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  keywords: [
    "שווארמה",
    "שווארמה מומלצת",
    "שווארמה בישראל",
    "shawarma",
    "best shawarma israel",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-[family-name:var(--font-heebo)] antialiased min-h-screen bg-[var(--color-bg)]">
        {/* ConvexProvider will wrap this once Convex is connected */}
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🥙</span>
              <span className="text-xl font-bold text-orange-400">
                {SITE_NAME}
              </span>
            </a>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <a href="/" className="hover:text-orange-400 transition-colors">
                מפה
              </a>
              <a
                href="#top-rated"
                className="hover:text-orange-400 transition-colors"
              >
                מובילים
              </a>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-zinc-800 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>
              {SITE_NAME} © {new Date().getFullYear()} — BB Systems
            </p>
            <p className="mt-1">המדריך המלא לשווארמה בישראל 🥙</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
