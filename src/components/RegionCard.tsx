import Link from "next/link";
import Image from "next/image";
import { REGIONS_DATA } from "@/lib/constants";

interface RegionCardProps {
  region: (typeof REGIONS_DATA)[number];
}

export default function RegionCard({ region }: RegionCardProps) {
  return (
    <Link
      href={`/explore?region=${region.name}`}
      className={`group relative block rounded-xl overflow-hidden min-h-[140px] md:min-h-[160px] border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
    >
      {/* Gradient fallback (shows while image loads or if missing) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${region.gradient}`} />

      {/* Background image */}
      {region.image && (
        <Image
          src={region.image}
          alt={region.label}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/60 transition-colors" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-5">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-lg">
          {region.label}
        </h3>
        <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
          גלו מקומות באזור →
        </p>
      </div>
    </Link>
  );
}
