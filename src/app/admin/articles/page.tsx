"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowRight,
  FileText,
  Check,
  X,
} from "lucide-react";

type Category = "guide" | "review" | "news" | "culture";

const categoryLabels: Record<Category, string> = {
  guide: "מדריך",
  review: "ביקורת",
  news: "חדשות",
  culture: "תרבות",
};

const categoryColors: Record<Category, string> = {
  guide: "bg-blue-100 text-blue-700",
  review: "bg-purple-100 text-purple-700",
  news: "bg-green-100 text-green-700",
  culture: "bg-amber-100 text-amber-700",
};

const defaultCoverImages = [
  "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
  "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600",
  "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600",
  "bg-gradient-to-br from-red-400 via-rose-500 to-pink-600",
  "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600",
];

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: Category;
  tags: string;
  isPublished: boolean;
}

const emptyForm: ArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: defaultCoverImages[0],
  author: "צוות שווארמה ביס",
  category: "guide",
  tags: "",
  isPublished: false,
};

export default function AdminArticlesPage() {
  const articles = useQuery(api.articles.list, {});
  const createArticle = useMutation(api.articles.create);
  const updateArticle = useMutation(api.articles.update);
  const deleteArticle = useMutation(api.articles.remove);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<Id<"articles"> | null>(null);
  const [form, setForm] = useState<ArticleFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"articles"> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEdit = (article: NonNullable<typeof articles>[0]) => {
    setEditingId(article._id);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage,
      author: article.author,
      category: article.category,
      tags: article.tags.join(", "),
      isPublished: article.isPublished,
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (editingId) {
        await updateArticle({
          id: editingId,
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          coverImage: form.coverImage,
          author: form.author,
          category: form.category,
          tags: tagsArray,
          isPublished: form.isPublished,
        });
      } else {
        await createArticle({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          coverImage: form.coverImage,
          author: form.author,
          category: form.category,
          tags: tagsArray,
          isPublished: form.isPublished,
        });
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save article:", error);
      alert("שגיאה בשמירת הכתבה");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"articles">) => {
    try {
      await deleteArticle({ id });
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("שגיאה במחיקת הכתבה");
    }
  };

  const generateSlug = (title: string) => {
    // Simple slug generation for Hebrew titles
    return title
      .toLowerCase()
      .replace(/[^\w\s\u0590-\u05FF-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

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
              <FileText className="w-6 h-6 text-amber-600" />
              <h1 className="text-xl font-bold text-gray-900">ניהול מאמרים</h1>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              מאמר חדש
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isEditing ? (
          /* Edit/Create Form */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {editingId ? "עריכת מאמר" : "מאמר חדש"}
            </h2>

            <div className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    כותרת
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        title: e.target.value,
                        slug: form.slug || generateSlug(e.target.value),
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="כותרת המאמר"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (כתובת URL)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                    placeholder="article-url-slug"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תקציר
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="תיאור קצר של המאמר"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תוכן (HTML)
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                  placeholder="<h2>כותרת</h2><p>תוכן...</p>"
                  dir="rtl"
                />
              </div>

              {/* Category, Author, Tags */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    קטגוריה
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as Category })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מחבר
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="שם המחבר"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    תגיות (מופרדות בפסיק)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="דירוגים, מומלצים, ישראל"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תמונת כיסוי (בחר גרדיאנט)
                </label>
                <div className="flex flex-wrap gap-3">
                  {defaultCoverImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: img })}
                      className={`w-16 h-16 rounded-lg ${img} ${
                        form.coverImage === img
                          ? "ring-2 ring-amber-500 ring-offset-2"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.isPublished ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      form.isPublished ? "right-1" : "right-7"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">
                  {form.isPublished ? "מפורסם" : "טיוטה"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.slug}
                  className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  {saving ? "שומר..." : "שמור"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  ביטול
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Articles List */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {articles === undefined ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full mx-auto" />
                <p className="mt-4 text-gray-500">טוען מאמרים...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  אין מאמרים עדיין
                </h3>
                <p className="text-gray-500 mb-4">
                  לחצו על &quot;מאמר חדש&quot; כדי להתחיל
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {articles.map((article) => (
                  <div
                    key={article._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Cover preview */}
                      <div
                        className={`w-16 h-16 rounded-lg flex-shrink-0 ${article.coverImage}`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {article.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              categoryColors[article.category]
                            }`}
                          >
                            {categoryLabels[article.category]}
                          </span>
                          {article.isPublished ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <Eye className="w-3 h-3" />
                              מפורסם
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <EyeOff className="w-3 h-3" />
                              טיוטה
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{article.author}</span>
                          <span>
                            {article.publishedAt
                              ? formatDate(article.publishedAt)
                              : formatDate(article.createdAt)}
                          </span>
                          <span className="font-mono">/blog/{article.slug}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="צפייה"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="עריכה"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === article._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(article._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="אישור מחיקה"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                              title="ביטול"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(article._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="מחיקה"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
