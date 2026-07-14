"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
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
    <div className="relative group">
      {/* Navigation Buttons */}
      <div className="absolute -top-16 right-0 flex gap-3">
        <button
          onClick={() => scroll("left")}
          className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pt-4 px-4 -mx-4 no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {properties.map((property) => (
          <div
            key={property._id}
            className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[30vw] snap-center shrink-0"
          >
            <Link
              href={`/properties/${property._id}`}
              className="premium-card h-full group/card flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden image-hover-zoom">
                <Image
                  src={
                    property.images && property.images.length > 0
                      ? property.images[0]
                      : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                  }
                  alt={property.title || "Property"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className="glass-morphism px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-5 left-5">
                  <span className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                    ₹{property.price?.toLocaleString()}
                  </span>
                </div>
                <div className="absolute top-5 right-5">
                  <span className="bg-brand-dark/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {property.status || "For Sale"}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">
                    <Star className="w-3 h-3 fill-current" />
                    Premium Collection
                  </div>
                  <h4 className="text-2xl font-bold text-brand-dark group-hover/card:text-brand-primary transition-colors line-clamp-1 mb-2">
                    {property.title}
                  </h4>
                  <div className="flex items-center text-gray-500 text-sm mb-6">
                    <MapPin className="w-4 h-4 mr-1.5 text-brand-primary shrink-0" />
                    <span className="line-clamp-1">
                      {property.location?.address ||
                        property.location?.city ||
                        property.location?.type ||
                        "Mumbai"}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <BedDouble className="w-4 h-4 text-brand-primary" />
                      <span className="text-sm font-semibold">{property.bedrooms || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Bath className="w-4 h-4 text-brand-primary" />
                      <span className="text-sm font-semibold">{property.bathrooms || 2}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Square className="w-4 h-4 text-brand-primary" />
                      <span className="text-sm font-semibold">{property.size || 0} <span className="text-[10px] uppercase">Sq.Ft</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Progress */}
      <div className="flex justify-center items-center gap-3 mt-4">
        {properties.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              activeIndex === index
                ? "w-12 bg-gradient-to-r from-brand-primary to-brand-accent"
                : "w-4 bg-gray-200 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
