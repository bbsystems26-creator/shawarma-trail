"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Star,
  Trophy,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Users,
  PenLine,
  Gift,
} from "lucide-react";

const BENEFITS = [
  {
    icon: PenLine,
    title: "כתיבת ביקורות",
    description: "פרסמו ביקורות מקצועיות על מקומות השווארמה הטובים בישראל",
  },
  {
    icon: Trophy,
    title: "Badge מיוחד",
    description: "תג מבקר מאושר יופיע ליד השם שלכם בכל האתר",
  },
  {
    icon: Ticket,
    title: "השתתפות בהגרלות",
    description: "כל ביקורת = כרטיס להגרלה חודשית עם פרסים שווים",
  },
  {
    icon: Gift,
    title: "הטבות בלעדיות",
    description: "הנחות והטבות ממקומות שווארמה נבחרים",
  },
];

export default function JoinSquadPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.viewer);
  const application = useQuery(api.reviewerApplications.getMyApplication);
  const submitApplication = useMutation(api.reviewerApplications.submit);

  const [form, setForm] = useState({
    whyJoin: "",
    favoritePlace: "",
    experience: "",
    socialLinks: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    redirect("/login?redirect=/join-squad");
  }

  // Loading state
  if (authLoading || user === undefined || application === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // User is already a reviewer
  const isReviewer =
    user?.role === "reviewer" ||
    user?.role === "senior_reviewer" ||
    user?.role === "admin";

  if (isReviewer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              את/ה כבר חלק מנבחרת המבקרים!
            </h1>
            <p className="text-gray-600 mb-6">
              תודה שאתם חלק מהקהילה שלנו. המשיכו לכתוב ביקורות ולהשתתף בהגרלות.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-6 py-3 transition-colors"
              >
                לפרופיל שלי
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-bold rounded-full px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                חפשו מקומות לביקורת
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has a pending application
  if (application?.status === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              המועמדות שלך בבדיקה
            </h1>
            <p className="text-gray-600 mb-6">
              קיבלנו את הבקשה שלך להצטרף לנבחרת המבקרים. אנחנו בודקים אותה ונחזור
              אליך בהקדם.
            </p>
            <div className="bg-amber-50 rounded-xl p-4 text-right mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">
                מה כתבת בבקשה:
              </h3>
              <p className="text-amber-700 text-sm">{application.whyJoin}</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-bold rounded-full px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User's application was rejected
  if (application?.status === "rejected") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              המועמדות לא אושרה
            </h1>
            <p className="text-gray-600 mb-4">
              לצערנו, הבקשה שלך לא אושרה הפעם.
            </p>
            {application.rejectionReason && (
              <div className="bg-red-50 rounded-xl p-4 text-right mb-6">
                <h3 className="font-semibold text-red-800 mb-2">סיבה:</h3>
                <p className="text-red-700 text-sm">
                  {application.rejectionReason}
                </p>
              </div>
            )}
            <p className="text-gray-500 text-sm mb-6">
              אפשר להגיש מועמדות מחדש בעתיד. נסו לשפר את הבקשה ולנסות שוב.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-bold rounded-full px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.whyJoin.length < 50) {
      setError("אנא כתבו לפחות 50 תווים בשאלה למה רוצים להצטרף");
      return;
    }

    if (!form.favoritePlace.trim()) {
      setError("אנא מלאו את מקום השווארמה האהוב עליכם");
      return;
    }

    if (!form.experience.trim()) {
      setError("אנא ספרו על הניסיון שלכם בכתיבה או ביקורות");
      return;
    }

    setSubmitting(true);
    try {
      const socialLinksArray = form.socialLinks
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean);

      await submitApplication({
        whyJoin: form.whyJoin,
        favoritePlace: form.favoritePlace,
        experience: form.experience,
        socialLinks: socialLinksArray.length > 0 ? socialLinksArray : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בשליחת הבקשה");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            נבחרת המבקרים של שווארמה ביס
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            הצטרפו לנבחרת המבקרים
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            קהילה סגורה של חובבי שווארמה אמיתיים שכותבים ביקורות איכותיות,
            משתתפים בהגרלות חודשיות ונהנים מהטבות בלעדיות.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {BENEFITS.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            טופס הצטרפות
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Why Join */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                למה את/ה רוצה להצטרף לנבחרת? *
              </label>
              <textarea
                value={form.whyJoin}
                onChange={(e) => setForm({ ...form, whyJoin: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="ספרו לנו למה אתם אוהבים שווארמה ולמה אתם רוצים לכתוב ביקורות..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.whyJoin.length}/50 תווים מינימום
              </p>
            </div>

            {/* Favorite Place */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מקום השווארמה האהוב עליך *
              </label>
              <input
                type="text"
                value={form.favoritePlace}
                onChange={(e) =>
                  setForm({ ...form, favoritePlace: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="למשל: שווארמה אמיל בתל אביב"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ניסיון בכתיבה או ביקורות *
              </label>
              <textarea
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="ספרו לנו על ניסיון קודם בכתיבה, בלוגים, ביקורות אוכל או כל דבר רלוונטי..."
                required
              />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                לינקים לרשתות חברתיות (אופציונלי)
              </label>
              <input
                type="text"
                value={form.socialLinks}
                onChange={(e) =>
                  setForm({ ...form, socialLinks: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="הפרידו עם פסיק: instagram.com/user, facebook.com/user"
                dir="ltr"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-6 py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {submitting ? "שולח..." : "שליחת בקשה"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              הבקשות נבדקות תוך 1-2 ימי עסקים. נשלח לכם הודעה במייל עם התשובה.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
