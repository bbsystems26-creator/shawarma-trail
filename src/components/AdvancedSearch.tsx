"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const REGIONS = [
  { value: "", label: "כל האזורים" },
  { value: "north", label: "צפון" },
  { value: "center", label: "מרכז" },
  { value: "jerusalem", label: "ירושלים" },
  { value: "south", label: "דרום" },
  { value: "shfela", label: "שפלה" },
];

const MEAT_TYPES = [
  { value: "", label: "כל סוגי הבשר" },
  { value: "lamb", label: "כבש" },
  { value: "beef", label: "בקר" },
  { value: "chicken", label: "עוף" },
  { value: "turkey", label: "הודו" },
  { value: "mixed", label: "מעורב" },
];

export default function AdvancedSearch() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [meatType, setMeatType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name) params.set("q", name);
    if (region) params.set("region", region);
    if (meatType) params.set("meat", meatType);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם המקום..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/10 focus:border-amber-400 focus:outline-none transition-colors"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:border-amber-400 focus:outline-none transition-colors appearance-none cursor-pointer"
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value} className="bg-zinc-800 text-white">
              {r.label}
            </option>
          ))}
        </select>
        <select
          value={meatType}
          onChange={(e) => setMeatType(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:border-amber-400 focus:outline-none transition-colors appearance-none cursor-pointer"
        >
          {MEAT_TYPES.map((m) => (
            <option key={m.value} value={m.value} className="bg-zinc-800 text-white">
              {m.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          חפשו
        </button>
      </div>
    </form>
  );
}
