import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "גלה מקומות — שווארמה טרייל",
  description:
    "כל מקומות השווארמה בישראל — סינון לפי אזור, כשרות, סגנון ומחיר",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
