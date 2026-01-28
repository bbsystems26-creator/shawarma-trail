import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { generateWebsiteSchema } from "@/lib/structured-data";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shawarmabis.co.il"),
  title: "שווארמה ביס | מצאו את השווארמה הטובה בישראל",
  description:
    "מפה אינטראקטיבית של מקומות השווארמה הטובים בישראל — דירוגים, ביקורות, ופילטרים חכמים",
  keywords: [
    "שווארמה",
    "שווארמה מומלצת",
    "שווארמה בתל אביב",
    "שווארמה בירושלים",
    "שווארמה בחיפה",
    "אוכל ישראלי",
    "מסעדות",
  ],
  openGraph: {
    title: "שווארמה ביס",
    description: "מצאו את השווארמה הטובה בישראל",
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "שווארמה ביס | מצאו את השווארמה הטובה בישראל",
    description:
      "מפה אינטראקטיבית של מקומות השווארמה הטובים בישראל — דירוגים, ביקורות, ופילטרים חכמים",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        <JsonLd data={generateWebsiteSchema()} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F59E0B" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased bg-white text-gray-900 font-[family-name:var(--font-heebo)]">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
