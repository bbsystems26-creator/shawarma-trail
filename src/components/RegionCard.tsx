import Link from "next/link";
import { REGIONS_DATA } from "@/lib/constants";

interface RegionCardProps {
  region: (typeof REGIONS_DATA)[number];
}

export default function RegionCard({ region }: RegionCardProps) {
  return (
    <Link
      href={`/explore?region=${region.name}`}
      className={`group relative block rounded-xl overflow-hidden p-6 md:p-8 min-h-[120px] bg-gradient-to-br ${region.gradient} border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
          {region.label}
        </h3>
        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
          גלו מקומות באזור →
        </p>
      </div>

      {/* Decorative glow */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
    </Link>
  );
}
