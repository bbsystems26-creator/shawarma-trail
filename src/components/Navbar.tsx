"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, ChevronDown, Plus } from "lucide-react";

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
];

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-gray-900 shrink-0">
          <img src="/images/logo.png" alt="ShawarmaBis" className="h-8 w-8 md:h-10 md:w-10" />
          שווארמה ביס
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
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

        {/* Desktop CTA + Mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* CTA button — desktop only */}
          <Link
            href="/add"
            className="hidden md:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-4 py-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            הוסיפו מקום
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="md:hidden text-gray-700 p-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="תפריט"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
