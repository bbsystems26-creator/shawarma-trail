import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
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
      </head>
      <body className="antialiased bg-white text-gray-900 font-[family-name:var(--font-heebo)]">
        <ConvexClientProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
