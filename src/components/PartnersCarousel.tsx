"use client";
import React from "react";
import ImageWithFallback from "@/components/ImageWithFallback";

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  website?: string;
  order?: number;
  active?: boolean;
}

export default function PartnersCarousel({
  partners,
}: {
  partners: Partner[];
}) {
  if (!partners || partners.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 text-gray-500">
        No partners added yet.
      </div>
    );
  }

  const items = [...partners, ...partners];

  return (
    <div className="relative max-w-7xl mx-auto overflow-hidden py-4 group/carousel">
      {/* Gradient masks for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div className="flex w-max animate-partner-scroll group-hover/carousel:[animation-play-state:paused]">
        {items.map((partner, i) => {
          const card = (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 h-28 flex items-center justify-center sm:grayscale sm:opacity-50 hover:grayscale-0 hover:opacity-100 hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500">
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src={partner.logo}
                  alt={partner.name || "Partner"}
                  fill
                  sizes="(min-width: 768px) 150px, 110px"
                  className="object-contain"
                />
              </div>
            </div>
          );

          return (
            <div
              key={`${partner._id}-${i}`}
              className="min-w-45 md:min-w-55 shrink-0 px-3"
            >
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={partner.name}
                  className="cursor-pointer block"
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
