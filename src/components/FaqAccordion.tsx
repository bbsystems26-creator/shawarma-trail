"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "מה מספר האורחים המינימלי להזמנת קייטרינג שווארמה?",
    answer:
      "רוב הספקים מקבלים הזמנות החל מ-30 אורחים. לאירועים קטנים יותר, מומלץ לבדוק עם הספק ישירות כי חלקם גמישים ומוכנים להתאים חבילה מותאמת.",
  },
  {
    question: "כמה עולה קייטרינג שווארמה לאירוע?",
    answer:
      "המחירים נעים בין 60 ל-150 ₪ לאורח, תלוי ברמת השירות, מגוון התפריט ומיקום האירוע. חבילה בסיסית כוללת שווארמה, סלטים ולחם. חבילות פרימיום כוללות עמדת שף, תוספות מיוחדות ועיצוב העמדה.",
  },
  {
    question: "עד כמה רחוק הספקים מוכנים לנסוע?",
    answer:
      "רוב הספקים שלנו מכסים את כל שטח ישראל. ספקים מאזור המרכז מגיעים בדרך כלל עד חיפה והנגב ללא עלות נוספת. לאירועים באזורים מרוחקים ייתכן חיוב נסיעה קטן.",
  },
  {
    question: "האם יש אפשרות לקייטרינג כשר?",
    answer:
      "בהחלט! חלק מהספקים שלנו מציעים כשרות רבנות ואף כשרות למהדרין. בעמוד הספק תוכלו לראות את סוג הכשרות. מומלץ לציין את דרישות הכשרות כבר בפנייה הראשונית.",
  },
  {
    question: "כמה זמן לפני האירוע צריך להזמין?",
    answer:
      "מומלץ להזמין לפחות 2-3 שבועות מראש, ובעונת החתונות (אפריל-אוקטובר) אף חודש מראש. הזמנה מוקדמת מבטיחה זמינות ומאפשרת התאמה מלאה של התפריט.",
  },
  {
    question: "האם ניתן להתאים את התפריט?",
    answer:
      "כמובן! כל הספקים שלנו מציעים גמישות בתפריט. תוכלו לבחור סוגי בשר (עוף, הודו, כבש), סלטים, רטבים ותוספות. חלק מהספקים מציעים גם אפשרויות טבעוניות וצמחוניות לצד השווארמה.",
  },
  {
    question: "מה כולל שירות פוד טראק?",
    answer:
      "פוד טראק שווארמה מגיע כעמדה עצמאית הכוללת את כל הציוד, חומרי הגלם, השף והצוות. הפוד טראק עצמו מהווה חלק מהאטרקציה ויוצר חוויה ייחודית. מתאים במיוחד לאירועי שטח וחתונות בוהו.",
  },
  {
    question: "האם הספקים מביאים ציוד או שצריך לספק?",
    answer:
      "הספקים מגיעים עם הכל — שיפודים, גריל, עמדות הגשה, כלים חד-פעמיים או כלים מכובדים (בהתאם לחבילה), מפות ותאורה. כל מה שאתם צריכים לספק זה מקום עם גישה לחשמל.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-right"
            >
              <span className="text-base font-semibold text-gray-900">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-4 text-sm leading-relaxed text-gray-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
