"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Mail,
  Calendar,
  Link as LinkIcon,
  Check,
  X,
  Filter,
} from "lucide-react";

type ApplicationStatus = "pending" | "approved" | "rejected";

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "ממתין",
  approved: "אושר",
  rejected: "נדחה",
};

const statusColors: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusIcons: Record<ApplicationStatus, React.ElementType> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminApplicationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.viewer);
  const [statusFilter, setStatusFilter] = useState<
    ApplicationStatus | undefined
  >(undefined);
  const applications = useQuery(api.reviewerApplications.listAll, {
    status: statusFilter,
  });

  const approveApplication = useMutation(api.reviewerApplications.approve);
  const rejectApplication = useMutation(api.reviewerApplications.reject);

  const [processingId, setProcessingId] = useState<
    Id<"reviewerApplications"> | null
  >(null);
  const [rejectingId, setRejectingId] = useState<
    Id<"reviewerApplications"> | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");

  // Auth check
  if (!authLoading && !isAuthenticated) {
    redirect("/login");
  }

  // Loading state
  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Admin check
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">אין גישה</h1>
          <p className="text-gray-600 mb-4">רק מנהלים יכולים לגשת לדף זה.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  const handleApprove = async (applicationId: Id<"reviewerApplications">) => {
    setProcessingId(applicationId);
    try {
      await approveApplication({ applicationId });
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("שגיאה באישור הבקשה");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: Id<"reviewerApplications">) => {
    setProcessingId(applicationId);
    try {
      await rejectApplication({
        applicationId,
        reason: rejectReason || undefined,
      });
      setRejectingId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("שגיאה בדחיית הבקשה");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount =
    applications?.filter((app) => app.status === "pending").length || 0;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-600" />
              <h1 className="text-xl font-bold text-gray-900">ניהול מועמדויות</h1>
            </div>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingCount} ממתינות
              </span>
            )}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter || ""}
              onChange={(e) =>
                setStatusFilter(
                  (e.target.value as ApplicationStatus) || undefined
                )
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">כל הסטטוסים</option>
              <option value="pending">ממתינות</option>
              <option value="approved">אושרו</option>
              <option value="rejected">נדחו</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {applications === undefined ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-500">טוען מועמדויות...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              אין מועמדויות
            </h3>
            <p className="text-gray-500">
              {statusFilter
                ? `אין מועמדויות בסטטוס "${statusLabels[statusFilter]}"`
                : "עדיין לא הוגשו מועמדויות לנבחרת המבקרים"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const StatusIcon = statusIcons[app.status];
              const isRejecting = rejectingId === app._id;

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* User Avatar */}
                      {app.user?.image || app.user?.avatar ? (
                        <img
                          src={app.user.image || app.user.avatar}
                          alt={app.user.name || ""}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-amber-600" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {app.user?.name || "משתמש"}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusColors[app.status]}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusLabels[app.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          {app.user?.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {app.user.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(app.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {app.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(app._id)}
                          disabled={processingId === app._id}
                          className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {processingId === app._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          אישור
                        </button>
                        <button
                          onClick={() => setRejectingId(app._id)}
                          disabled={processingId === app._id}
                          className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          דחייה
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Why Join */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        למה רוצה להצטרף:
                      </h4>
                      <p className="text-gray-600 bg-gray-50 rounded-lg p-3 text-sm">
                        {app.whyJoin}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Favorite Place */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          מקום אהוב:
                        </h4>
                        <p className="text-gray-600 text-sm">{app.favoritePlace}</p>
                      </div>

                      {/* Experience */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          ניסיון:
                        </h4>
                        <p className="text-gray-600 text-sm">{app.experience}</p>
                      </div>
                    </div>

                    {/* Social Links */}
                    {app.socialLinks && app.socialLinks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          לינקים:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {app.socialLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={
                                link.startsWith("http") ? link : `https://${link}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                              dir="ltr"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rejection Reason (if rejected) */}
                    {app.status === "rejected" && app.rejectionReason && (
                      <div className="bg-red-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-red-700 mb-1">
                          סיבת דחייה:
                        </h4>
                        <p className="text-red-600 text-sm">{app.rejectionReason}</p>
                      </div>
                    )}

                    {/* Review Info (if reviewed) */}
                    {app.reviewedAt && (
                      <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                        נבדק בתאריך: {formatDate(app.reviewedAt)}
                      </div>
                    )}
                  </div>

                  {/* Rejection Form */}
                  {isRejecting && (
                    <div className="p-4 bg-red-50 border-t border-red-100">
                      <h4 className="text-sm font-medium text-red-700 mb-2">
                        סיבת דחייה (אופציונלי):
                      </h4>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-3"
                        placeholder="ספרו למה הבקשה לא אושרה..."
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(app._id)}
                          disabled={processingId === app._id}
                          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {processingId === app._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          אישור דחייה
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason("");
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          ביטול
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
