"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useState, useEffect } from "react";
import { User, Mail, Camera, Save, Loader2, ArrowRight, MapPin, FileText } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.viewer);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Set initial values when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setCity(user.city || "");
    }
  }, [user]);

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    redirect("/login");
  }

  // Loading state
  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage(false);

    try {
      await updateProfile({ name, bio, city });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl = user.avatar || user.image;
  const displayName = user.name || "משתמש";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לפרופיל
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">הגדרות פרופיל</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center pb-6 border-b border-gray-100">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-400"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-2xl border-4 border-amber-400">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                  title="שינוי תמונה (בקרוב)"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">שינוי תמונה בקרוב...</p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="השם שלך"
                  required
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">לא ניתן לשנות את האימייל</p>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                עיר מגורים
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="תל אביב, ירושלים..."
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                קצת עליי
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="ספר/י על עצמך... מה את/ה אוהב/ת בשווארמה?"
                  rows={3}
                  maxLength={300}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{bio.length}/300 תווים</p>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    שמור שינויים
                  </>
                )}
              </button>

              {savedMessage && (
                <span className="text-green-600 font-medium">נשמר בהצלחה! ✓</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
