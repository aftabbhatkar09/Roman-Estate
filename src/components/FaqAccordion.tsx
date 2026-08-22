"use client";
import { useState } from "react";
import { Plus, HelpCircle } from "lucide-react";

interface Faq {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 sm:space-y-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(isOpen ? null : i)}
            aria-expanded={isOpen}
            className="w-full text-left bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-brand-primary/30 transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start sm:items-center gap-3">
              <h4 className="font-bold text-brand-dark flex items-start sm:items-center gap-2 sm:gap-3 text-sm sm:text-base">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary shrink-0 mt-0.5 sm:mt-0" />
                {faq.q}
              </h4>
              <Plus
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-brand-primary transition-transform shrink-0 mt-0.5 sm:mt-0 ${
                  isOpen ? "rotate-45 text-brand-primary" : ""
                }`}
              />
            </div>
            {isOpen && (
              <p className="mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                {faq.a}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
