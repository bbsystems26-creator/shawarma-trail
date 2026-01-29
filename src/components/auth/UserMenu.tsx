"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, ChevronDown, Star, Shield } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  const user = useQuery(api.users.viewer);
  const { signOut } = useAuthActions();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  if (user === undefined) {
    // Loading
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (user === null) {
    // Not logged in
    return null;
  }

  const avatarUrl = user.avatar || user.image;
  const displayName = user.name || "משתמש";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Role badge config
  const isReviewer = user.role === "reviewer" || user.role === "senior_reviewer";
  const isAdmin = user.role === "admin";
  const showBadge = isReviewer || isAdmin;

  const getRoleBadge = () => {
    if (isAdmin) {
      return { label: "מנהל", icon: Shield, color: "bg-red-500" };
    }
    if (user.role === "senior_reviewer") {
      return { label: "מבקר בכיר", icon: Star, color: "bg-amber-500" };
    }
    if (user.role === "reviewer") {
      return { label: "מבקר", icon: Star, color: "bg-green-500" };
    }
    return null;
  };

  const badge = getRoleBadge();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm border-2 border-amber-400">
            {initials}
          </div>
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform hidden md:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{displayName}</p>
              {badge && (
                <span className={`inline-flex items-center gap-1 ${badge.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                  <badge.icon className="w-3 h-3" />
                  {badge.label}
                </span>
              )}
            </div>
            {user.email && (
              <p className="text-sm text-gray-500 truncate" dir="ltr">
                {user.email}
              </p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-5 h-5 text-gray-400" />
              הפרופיל שלי
            </Link>
            <Link
              href="/profile/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              הגדרות
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              התנתק
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
