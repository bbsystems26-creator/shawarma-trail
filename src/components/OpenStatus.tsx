"use client";

import { useState, useEffect } from "react";

interface OpenStatusProps {
  openingHours?: Record<string, string>;
}

const DAY_MAP: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

function isOpenNow(openingHours: Record<string, string>): boolean | null {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
  );
  const dayIndex = now.getDay();
  const dayName = DAY_MAP[dayIndex];

  const hours = openingHours[dayName];
  if (!hours || hours.toLowerCase() === "closed" || hours === "סגור") {
    return false;
  }

  // Parse time range like "10:00-23:00"
  const match = hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const [, openH, openM, closeH, closeM] = match;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseInt(openH) * 60 + parseInt(openM);
  let closeMinutes = parseInt(closeH) * 60 + parseInt(closeM);

  // Handle overnight hours (e.g. 18:00-02:00)
  if (closeMinutes <= openMinutes) {
    closeMinutes += 24 * 60;
    const adjustedCurrent =
      currentMinutes < openMinutes
        ? currentMinutes + 24 * 60
        : currentMinutes;
    return adjustedCurrent >= openMinutes && adjustedCurrent < closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export default function OpenStatus({ openingHours }: OpenStatusProps) {
  const [status, setStatus] = useState<"open" | "closed" | "unknown">(
    "unknown"
  );

  useEffect(() => {
    if (!openingHours || Object.keys(openingHours).length === 0) {
      setStatus("unknown");
      return;
    }

    const result = isOpenNow(openingHours);
    if (result === null) {
      setStatus("unknown");
    } else {
      setStatus(result ? "open" : "closed");
    }

    // Update every minute
    const interval = setInterval(() => {
      const r = isOpenNow(openingHours);
      if (r === null) setStatus("unknown");
      else setStatus(r ? "open" : "closed");
    }, 60_000);

    return () => clearInterval(interval);
  }, [openingHours]);

  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-1 bg-green-900/40 text-green-400 border border-green-700/50 px-3 py-1 rounded-full text-sm font-bold">
        🟢 פתוח עכשיו
      </span>
    );
  }

  if (status === "closed") {
    return (
      <span className="inline-flex items-center gap-1 bg-red-900/40 text-red-400 border border-red-700/50 px-3 py-1 rounded-full text-sm font-bold">
        🔴 סגור
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-zinc-800/60 text-gray-400 border border-zinc-700/50 px-3 py-1 rounded-full text-sm">
      ⏰ שעות לא ידועות
    </span>
  );
}
