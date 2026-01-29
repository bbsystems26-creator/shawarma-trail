"use client";

import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import {
  Loader2,
  Ticket,
  Trophy,
  Gift,
  Calendar,
  Users,
  Star,
  ChevronLeft,
  Crown,
  Clock,
  CheckCircle,
} from "lucide-react";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function RaffleCard({
  raffle,
  isActive,
  myEntries,
}: {
  raffle: {
    _id: string;
    title: string;
    description: string;
    prize: string;
    prizeValue: number;
    month: string;
    startDate: number;
    endDate: number;
    status: string;
    totalEntries: number;
    participantCount: number;
    winner?: { _id: string; name?: string; avatar?: string } | null;
    winnerAnnouncedAt?: number;
  };
  isActive: boolean;
  myEntries: number;
}) {
  const isCompleted = raffle.status === "completed";
  const isUpcoming = raffle.status === "upcoming";

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border overflow-hidden ${
        isActive ? "border-amber-300 ring-2 ring-amber-200" : "border-gray-100"
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4 ${
          isActive
            ? "bg-gradient-to-r from-amber-500 to-orange-500"
            : isCompleted
              ? "bg-gradient-to-r from-gray-500 to-gray-600"
              : "bg-gradient-to-r from-blue-500 to-indigo-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isActive ? (
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
            ) : isCompleted ? (
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-white">{raffle.title}</h3>
              <p className="text-white/80 text-sm">
                {isActive
                  ? "הגרלה פעילה"
                  : isCompleted
                    ? "הסתיימה"
                    : "בקרוב"}
              </p>
            </div>
          </div>
          {isActive && (
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              פעיל עכשיו
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-4">{raffle.description}</p>

        {/* Prize */}
        <div className="bg-amber-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-600 font-medium">הפרס</p>
              <p className="text-lg font-bold text-gray-900">{raffle.prize}</p>
            </div>
            <div className="mr-auto text-left">
              <p className="text-2xl font-bold text-amber-600">
                {raffle.prizeValue}₪
              </p>
            </div>
          </div>
        </div>

        {/* Winner (if completed) */}
        {isCompleted && raffle.winner && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-4 border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-700 font-medium">הזוכה</p>
                <p className="text-lg font-bold text-gray-900">
                  {raffle.winner.name || "משתמש אנונימי"}
                </p>
              </div>
              <div className="mr-auto">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* My entries (if active and user has entries) */}
        {isActive && myEntries > 0 && (
          <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  הכרטיסים שלך
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {myEntries} כרטיסים
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Ticket className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {raffle.totalEntries}
            </p>
            <p className="text-xs text-gray-500">כרטיסים</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {raffle.participantCount}
            </p>
            <p className="text-xs text-gray-500">משתתפים</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold text-gray-900">
              {formatDate(raffle.endDate)}
            </p>
            <p className="text-xs text-gray-500">סיום</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RafflesPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const raffles = useQuery(api.raffles.list);
  const myEntries = useQuery(api.raffles.getMyTotalEntries);

  // Loading state
  if (raffles === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const activeRaffle = raffles.find((r) => r.status === "active");
  const completedRaffles = raffles.filter((r) => r.status === "completed");
  const upcomingRaffles = raffles.filter((r) => r.status === "upcoming");

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          חזרה לדף הבית
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            הגרלות חודשיות
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            הגרלות נבחרת המבקרים
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            כל ביקורת שתכתבו מזכה אתכם בכרטיס להגרלה החודשית. ככל שתכתבו יותר
            ביקורות, כך גדל הסיכוי לזכות!
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            איך זה עובד?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">כתבו ביקורת</h3>
                <p className="text-sm text-gray-600">
                  על כל מקום שווארמה שביקרתם
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">קבלו כרטיס</h3>
                <p className="text-sm text-gray-600">
                  כרטיס אוטומטי להגרלה החודשית
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">זכו בפרסים</h3>
                <p className="text-sm text-gray-600">
                  שוברים לשווארמה וכיבודים
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Raffle */}
        {activeRaffle && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-500" />
              הגרלה פעילה
            </h2>
            <RaffleCard
              raffle={activeRaffle}
              isActive={true}
              myEntries={myEntries || 0}
            />

            {/* CTA for non-reviewers */}
            {!authLoading && !isAuthenticated && (
              <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-center text-white">
                <h3 className="text-lg font-bold mb-2">רוצים להשתתף?</h3>
                <p className="text-white/90 mb-4">
                  הצטרפו לנבחרת המבקרים וכתבו ביקורות כדי לקבל כרטיסים להגרלה
                </p>
                <Link
                  href="/join-squad"
                  className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold rounded-full px-6 py-3 hover:bg-amber-50 transition-colors"
                >
                  הצטרפו לנבחרת
                </Link>
              </div>
            )}
          </div>
        )}

        {/* No active raffle message */}
        {!activeRaffle && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center mb-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              אין הגרלה פעילה כרגע
            </h3>
            <p className="text-gray-600">
              הגרלה חדשה תתחיל בקרוב. בינתיים, המשיכו לכתוב ביקורות!
            </p>
          </div>
        )}

        {/* Upcoming Raffles */}
        {upcomingRaffles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              הגרלות קרובות
            </h2>
            <div className="space-y-4">
              {upcomingRaffles.map((raffle) => (
                <RaffleCard
                  key={raffle._id}
                  raffle={raffle}
                  isActive={false}
                  myEntries={0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Raffles */}
        {completedRaffles.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gray-500" />
              הגרלות קודמות
            </h2>
            <div className="space-y-4">
              {completedRaffles.map((raffle) => (
                <RaffleCard
                  key={raffle._id}
                  raffle={raffle}
                  isActive={false}
                  myEntries={0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {raffles.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              עדיין אין הגרלות
            </h3>
            <p className="text-gray-600">
              ההגרלה הראשונה תתחיל בקרוב. הצטרפו לנבחרת כדי להיות מוכנים!
            </p>
            <Link
              href="/join-squad"
              className="inline-flex items-center gap-2 mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-6 py-3 transition-colors"
            >
              הצטרפו לנבחרת
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
