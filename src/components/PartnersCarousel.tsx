"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const parent = scrollRef.current;
      const viewCenter = parent.scrollLeft + parent.clientWidth / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      Array.from(parent.children).forEach((childNode, index) => {
        const child = childNode as HTMLElement;
        if (child.tagName === "STYLE") return;

        const childCenter =
          child.offsetLeft - parent.offsetLeft + child.clientWidth / 2;
        const distance = Math.abs(viewCenter - childCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    }
  };

  if (!partners || partners.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 text-gray-500">
        No partners added yet.
      </div>
    );
  }

  return (
    <div className="relative group max-w-7xl mx-auto">
      {/* Navigation */}
      <div className="absolute -top-16 right-0 flex gap-2">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-white transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-white transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-4 no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {partners.map((partner) => (
          <div
            key={partner._id}
            className="min-w-[180px] md:min-w-[220px] snap-center shrink-0"
          >
            <div className="bg-white border border-gray-100 rounded-2xl p-6 h-28 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:border-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/5 transition-all duration-500 cursor-pointer">
              <div className="relative w-full h-full">
                <Image
                  src={partner.logo}
                  alt={partner.name || "Partner"}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Progress */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {partners.map((_, index) => (
          <button
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${
              activeIndex === index
                ? "w-8 bg-brand-gold"
                : "w-2 bg-gray-200"
            }`}
            aria-label={`Go to partner slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
