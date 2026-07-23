"use client";
import React, { useRef, useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { MapPin, Star, ChevronLeft, ChevronRight, BedDouble, Square, Bath } from "lucide-react";

export default function FeaturedCarousel({
  properties,
}: {
  properties: any[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const parent = scrollRef.current;
      const viewCenter = parent.scrollLeft + parent.clientWidth / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      Array.from(parent.children).forEach((child: any, index) => {
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

  if (!properties || properties.length === 0) {
    return (
      <p className="text-gray-500 text-center py-10">
        No featured properties available.
      </p>
    );
  }

  return (
    <div className="relative group sm:px-14">
      {/* Navigation Buttons — overlaid on left/right edges */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm items-center justify-center hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hidden sm:flex"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm items-center justify-center hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hidden sm:flex"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 sm:pb-10 pt-2 no-scrollbar items-stretch -mx-1 sm:mx-0 px-1 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {properties.map((property) => (
          <div
            key={property._id}
            className="w-[85vw] sm:w-[75vw] md:w-[calc(50%-12px)] lg:w-[calc(33.3333%-16px)] min-[1400px]:w-[calc(25%-18px)] snap-center shrink-0 flex flex-col"
          >
            <Link
              href={`/properties/${property._id}`}
              className="premium-card flex-1 group/card flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden image-hover-zoom">
                <ImageWithFallback
                  src={
                    property.images && property.images.length > 0
                      ? property.images[0]
                      : null
                  }
                  alt={property.title || "Property"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1400px) 33vw, 25vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="group-hover/card:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-2 left-2">
                  <span className="glass-morphism px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-brand-dark">
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold shadow-lg whitespace-nowrap">
                    ₹{property.price?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-brand-dark/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                    {property.status || "For Sale"}
                  </span>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-dark group-hover/card:text-brand-primary transition-colors line-clamp-1 mb-1">
                    {property.title}
                  </h4>
                  <div className="flex items-center text-gray-500 text-[10px] sm:text-[11px] mb-2 sm:mb-3">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 text-brand-primary shrink-0" />
                    <span className="line-clamp-1">
                      {property.location?.city || "Mumbai"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-2.5 border-t border-gray-100 flex items-center gap-2 sm:gap-2">
                  <div className="flex items-center gap-0.5 text-gray-600">
                    <BedDouble className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-primary" />
                    <span className="text-[9px] sm:text-[10px] font-semibold">{property.bedrooms || 0}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-gray-600">
                    <Bath className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-primary" />
                    <span className="text-[9px] sm:text-[10px] font-semibold">{property.bathrooms || 2}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-gray-600">
                    <Square className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-primary" />
                    <span className="text-[9px] sm:text-[10px] font-semibold">{property.size || 0}<span className="text-[7px] sm:text-[8px] uppercase ml-0.5">Sqft</span></span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Progress */}
      <div className="flex justify-center items-center gap-2 mt-2">
        {properties.map((_, index) => (
          <button
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${
              activeIndex === index
                ? "w-8 bg-gradient-to-r from-brand-primary to-brand-accent"
                : "w-2 bg-gray-200 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
