"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, ChevronDown, Plus, LogIn } from "lucide-react";
import { useConvexAuth } from "convex/react";
import UserMenu from "./auth/UserMenu";

const REGIONS = [
  { label: "צפון", value: "north" },
  { label: "מרכז", value: "center" },
  { label: "ירושלים", value: "jerusalem" },
  { label: "דרום", value: "south" },
  { label: "שפלה", value: "shfela" },
];

const NAV_LINKS = [
  { label: "בית", href: "/" },
  { label: "גלה מקומות", href: "/explore" },
  { label: "מפה", href: "/map" },
  { label: "מגזין", href: "/blog" },
  { label: "דירוג", href: "/leaderboard" },
  { label: "קייטרינג", href: "/catering" },
];

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100" dir="rtl">
      {/* === Mobile Navbar === */}
      <div className="md:hidden max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Hamburger — right side (RTL) */}
        <button
          type="button"
          className="text-gray-700 p-1.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="תפריט"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo — centered */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/images/logo.png" alt="שווארמה ביס" className="h-14 w-auto" />
        </Link>

        {/* Auth button / UserMenu */}
        <div className="w-10 h-10 flex items-center justify-center">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="text-amber-600 hover:text-amber-700 p-1.5"
              aria-label="התחברות"
            >
              <LogIn className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>

      {/* === Desktop Navbar === */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-3 justify-between items-center">
        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-gray-900 shrink-0">
          <img src="/images/logo.png" alt="ShawarmaBis" className="h-12 w-auto" />
          שווארמה ביס
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-amber-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm lg:text-base transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Region dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setRegionDropdownOpen(true)}
            onMouseLeave={() => setRegionDropdownOpen(false)}
          >
            <button
              type="button"
              className="text-gray-700 hover:text-amber-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm lg:text-base transition-colors inline-flex items-center gap-1"
              onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
            >
              אזורים
              <ChevronDown className={`w-4 h-4 transition-transform ${regionDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {regionDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[160px] z-50">
                {REGIONS.map((region) => (
                  <Link
                    key={region.value}
                    href={`/explore?region=${region.value}`}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:text-amber-600 hover:bg-gray-50 transition-colors"
                    onClick={() => setRegionDropdownOpen(false)}
                  >
                    {region.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: CTA + Auth */}
        <div className="flex items-center gap-3">
          <Link
            href="/add"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-4 py-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            הוסיפו מקום
          </Link>

          {/* Auth */}
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-amber-500 hover:text-amber-600 text-gray-700 font-medium rounded-full px-4 py-2 text-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              התחברות
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-700 hover:text-amber-600 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-base transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile regions section */}
            <div className="px-3 py-2.5">
              <span className="text-sm text-amber-600 font-medium">אזורים</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {REGIONS.map((region) => (
                  <Link
                    key={region.value}
                    href={`/explore?region=${region.value}`}
                    className="text-sm bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-700 px-3 py-1.5 rounded-full transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {region.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile CTA */}
            <Link
              href="/add"
              className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-4 py-2.5 text-base transition-colors mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className="w-4 h-4" />
              הוסיפו מקום
            </Link>

            {/* Mobile login link (only if not authenticated) */}
            {!isAuthenticated && !isLoading && (
              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 font-medium rounded-full px-4 py-2.5 text-base transition-colors mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                התחברות
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
