import { Car, Truck, Armchair, Wifi, Baby, Flame, Calendar, Accessibility, Hexagon, Snowflake, Sun, Dog, Shield, Umbrella } from "lucide-react";

const TAG_ICON_MAP: Record<string, React.ComponentType<{className?: string}>> = {
  parking: Car,
  delivery: Truck,
  seating: Armchair,
  wifi: Wifi,
  kids: Baby,
  "open-friday": Flame,
  "open-saturday": Calendar,
  accessible: Accessibility,
  halal: Hexagon,
  "air-conditioned": Snowflake,
  "outdoor-seating": Sun,
  "pet-friendly": Dog,
  "reservist-discount": Shield,
  shelter: Umbrella,
};

export function TagIcon({ tag, className = "w-4 h-4" }: { tag: string; className?: string }) {
  const Icon = TAG_ICON_MAP[tag];
  return Icon ? <Icon className={className} /> : null;
}
