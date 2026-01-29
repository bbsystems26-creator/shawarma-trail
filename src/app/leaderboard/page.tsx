"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import {
  Loader2,
  Trophy,
  Medal,
  Users,
  FileText,
  ChevronLeft,
  Crown,
  Star,
  TrendingUp,
  Gem,
  Sparkles,
  Award,
} from "lucide-react";
import LeaderboardBadge, { RankBadge, type BadgeLevel, BADGE_LABELS } from "@/components/LeaderboardBadge";
import ReviewerBadge from "@/components/ReviewerBadge";

// Badge thresholds for display
const BADGE_THRESHOLDS = {
  bronze: 3,
  silver: 10,
  gold: 25,
  platinum: 50,
  diamond: 100,
};

function LeaderboardRow({
  reviewer,
  isCurrentUser = false,
}: {
  reviewer: {
    _id: string;
    rank: number;
    name: string;
    avatar?: string;
    city?: string;
    role: string;
    reviewCount: number;
    articleCount: number;
    badge: BadgeLevel;
  };
  isCurrentUser?: boolean;
}) {
  const isTop3 = reviewer.rank <= 3;

  return (
    <tr
      className={`
        border-b border-gray-100 hover:bg-gray-50 transition-colors
        ${isCurrentUser ? "bg-amber-50" : ""}
        ${isTop3 ? "bg-gradient-to-l from-amber-50/50 to-transparent" : ""}
      `}
    >
      {/* Rank */}
      <td className="py-4 px-4 text-center">
        {isTop3 ? (
          <RankBadge rank={reviewer.rank} />
        ) : (
          <span className="text-gray-500 font-medium">{reviewer.rank}</span>
        )}
      </td>

      {/* User */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            {reviewer.avatar ? (
              <img
                src={reviewer.avatar}
                alt={reviewer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                {reviewer.name.charAt(0)}
              </div>
            )}
            {/* Top 3 crown */}
            {reviewer.rank === 1 && (
              <Crown className="absolute -top-2 -right-1 w-4 h-4 text-yellow-500" />
            )}
          </div>

          {/* Name and details */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{reviewer.name}</span>
              {isCurrentUser && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  אתם
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {reviewer.city && (
                <span className="text-sm text-gray-500">{reviewer.city}</span>
              )}
              <ReviewerBadge role={reviewer.role} size="sm" showLabel={false} />
            </div>
          </div>
        </div>
      </td>

      {/* Badge */}
      <td className="py-4 px-4 text-center hidden sm:table-cell">
        <LeaderboardBadge badge={reviewer.badge} size="sm" />
      </td>

      {/* Reviews */}
      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-gray-900">{reviewer.reviewCount}</span>
        </div>
      </td>

      {/* Articles (hidden on small screens) */}
      <td className="py-4 px-4 text-center hidden md:table-cell">
        <span className="text-gray-600">{reviewer.articleCount}</span>
      </td>
    </tr>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Trophy;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function BadgeProgressCard() {
  const badges = [
    { level: "bronze" as const, threshold: BADGE_THRESHOLDS.bronze, icon: Medal, color: "text-amber-600 bg-amber-100" },
    { level: "silver" as const, threshold: BADGE_THRESHOLDS.silver, icon: Award, color: "text-slate-500 bg-slate-100" },
    { level: "gold" as const, threshold: BADGE_THRESHOLDS.gold, icon: Crown, color: "text-yellow-500 bg-yellow-100" },
    { level: "platinum" as const, threshold: BADGE_THRESHOLDS.platinum, icon: Gem, color: "text-cyan-500 bg-cyan-100" },
    { level: "diamond" as const, threshold: BADGE_THRESHOLDS.diamond, icon: Sparkles, color: "text-violet-500 bg-violet-100" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-amber-500" />
        רמות תגים
      </h2>
      <p className="text-gray-600 mb-4">
        צברו ביקורות וקבלו תגים מיוחדים
      </p>
      <div className="space-y-3">
        {badges.map(({ level, threshold, icon: Icon, color }) => (
          <div key={level} className="flex items-center gap-3">
            <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-900">{BADGE_LABELS[level]}</span>
            </div>
            <span className="text-sm text-gray-500">{threshold}+ ביקורות</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const leaderboard = useQuery(api.leaderboard.getLeaderboard, { limit: 50 });
  const stats = useQuery(api.leaderboard.getLeaderboardStats);
  const currentUser = useQuery(api.users.viewer);

  // Loading state
  if (leaderboard === undefined || stats === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          חזרה לדף הבית
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            טבלת מובילים
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            המבקרים המובילים
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            הכירו את המבקרים הפעילים ביותר בקהילה. כתבו ביקורות וטפסו בדירוג!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Users}
            label="מבקרים"
            value={stats.totalReviewers}
            color="bg-blue-500"
          />
          <StatsCard
            icon={FileText}
            label="ביקורות"
            value={stats.totalReviews}
            color="bg-green-500"
          />
          <StatsCard
            icon={Crown}
            label="תגי זהב+"
            value={stats.badgeCounts.gold + stats.badgeCounts.platinum + stats.badgeCounts.diamond}
            color="bg-yellow-500"
          />
          <StatsCard
            icon={Sparkles}
            label="תגי יהלום"
            value={stats.badgeCounts.diamond}
            color="bg-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">טבלת הדירוג</h2>
                    <p className="text-white/80 text-sm">
                      {leaderboard.length} מבקרים מובילים
                    </p>
                  </div>
                </div>
              </div>

              {/* Table */}
              {leaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full" dir="rtl">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                          #
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          מבקר
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          תג
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          ביקורות
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          כתבות
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((reviewer) => (
                        <LeaderboardRow
                          key={reviewer._id}
                          reviewer={reviewer}
                          isCurrentUser={currentUser?._id === reviewer._id}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    עדיין אין מבקרים בדירוג
                  </h3>
                  <p className="text-gray-600 mb-4">
                    היו הראשונים לכתוב ביקורות ולהופיע בטבלה!
                  </p>
                  <Link
                    href="/join-squad"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-6 py-3 transition-colors"
                  >
                    הצטרפו לנבחרת
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badge Progress */}
            <BadgeProgressCard />

            {/* CTA */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" />
                רוצים להיכנס לדירוג?
              </h3>
              <p className="text-white/90 text-sm mb-4">
                הצטרפו לנבחרת המבקרים וכתבו ביקורות על מקומות השווארמה האהובים עליכם
              </p>
              <Link
                href="/join-squad"
                className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold rounded-full px-5 py-2.5 hover:bg-amber-50 transition-colors text-sm"
              >
                הצטרפו עכשיו
              </Link>
            </div>

            {/* Top 3 Mini */}
            {leaderboard.length >= 3 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-amber-500" />
                  פודיום
                </h3>
                <div className="space-y-3">
                  {leaderboard.slice(0, 3).map((reviewer, index) => (
                    <div key={reviewer._id} className="flex items-center gap-3">
                      <RankBadge rank={index + 1} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {reviewer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {reviewer.reviewCount} ביקורות
                        </p>
                      </div>
                      <LeaderboardBadge badge={reviewer.badge} size="sm" showLabel={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
