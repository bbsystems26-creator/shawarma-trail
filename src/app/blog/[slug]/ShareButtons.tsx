"use client";

import {
  Facebook,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";

// Simple Twitter/X icon as inline SVG since lucide doesn't have it
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareButtonsProps {
  articleUrl: string;
  articleTitle: string;
}

export default function ShareButtons({
  articleUrl,
  articleTitle,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(articleTitle);

  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = articleUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnBase =
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} bg-green-50 text-green-700 hover:bg-green-100`}
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} bg-blue-50 text-blue-700 hover:bg-blue-100`}
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} bg-gray-50 text-gray-700 hover:bg-gray-100`}
      >
        <XIcon className="w-4 h-4" />
        X / Twitter
      </a>
      <button
        onClick={handleCopy}
        className={`${btnBase} ${
          copied
            ? "bg-green-100 text-green-700"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }`}
      >
        <LinkIcon className="w-4 h-4" />
        {copied ? "הקישור הועתק!" : "העתקת קישור"}
      </button>
    </div>
  );
}
