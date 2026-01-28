"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import {
  Share2,
  Clock,
  User,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ShareButtons from "./ShareButtons";

/* ---------- helpers ---------- */
function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} דקות קריאה`;
}

/* ---------- page ---------- */
type PageProps = { params: Promise<{ slug: string }> };

export default function ArticlePage({ params }: PageProps) {
  const { slug } = use(params);
  const article = useQuery(api.articles.getBySlug, { slug });
  const related = useQuery(api.articles.getRelated, { slug, limit: 3 });

  // Loading state
  if (article === undefined) {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 relative">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-white/30 rounded w-1/3 mx-auto mb-6" />
              <div className="h-10 bg-white/30 rounded w-2/3 mx-auto mb-6" />
              <div className="h-4 bg-white/30 rounded w-1/4 mx-auto" />
            </div>
          </div>
        </div>
        <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-5/6" />
            <div className="h-6 bg-gray-200 rounded w-4/6" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
          </div>
        </article>
      </div>
    );
  }

  // Not found
  if (article === null) {
    notFound();
  }

  const articleUrl = `https://shawarmabis.co.il/blog/${slug}`;

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero banner */}
      <div className={`${article.coverImage} relative`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-white/80 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              ראשי
            </Link>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <Link href="/blog" className="hover:text-white transition-colors">
              מגזין
            </Link>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
              {article.title}
            </span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {estimateReadTime(article.content)}
            </span>
            <span>
              {article.publishedAt
                ? formatDate(article.publishedAt)
                : formatDate(article.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-gray-700
            prose-li:text-gray-700
            prose-strong:text-gray-900
            prose-ul:list-disc prose-ul:pr-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share buttons */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-700">שתפו את הכתבה</span>
          </div>
          <ShareButtons articleUrl={articleUrl} articleTitle={article.title} />
        </div>
      </article>

      {/* Related articles */}
      {related && related.length > 0 && (
        <section className="bg-amber-50/50 py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">
                כתבות נוספות שיעניינו אתכם
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r._id}
                  href={`/blog/${r.slug}`}
                  className="group block rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`${r.coverImage} h-36 md:h-44 flex items-center justify-center relative`}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <span className="relative text-white/90 text-4xl">🔥</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-2 line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {r.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {estimateReadTime(r.content)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                כל הכתבות
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
