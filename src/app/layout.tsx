import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "שווארמה טרייל — מצאו את השווארמה הטובה בישראל",
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
    title: "שווארמה טרייל 🥙",
    description: "מצאו את השווארמה הטובה בישראל",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="antialiased bg-shawarma-950 text-shawarma-50 font-[family-name:var(--font-heebo)]">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
