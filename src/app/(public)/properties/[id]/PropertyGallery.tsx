"use client";
import { useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Maximize2,
} from "lucide-react";

const FALLBACK =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const allImages = images && images.length > 0 ? images : [FALLBACK];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = () =>
    setActiveIdx((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () =>
    setActiveIdx((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <div className="max-w-360 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-3 sm:mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh]">
        {/* Main Large Image */}
        <div className="lg:col-span-8 relative rounded-[1rem] sm:rounded-3xl md:rounded-4xl overflow-hidden group min-h-0">
          <ImageWithFallback
            src={allImages[activeIdx]}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-brand-dark/50 via-transparent to-brand-dark/10" />

          {/* Back Button */}
          <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-20">
            <Link
              href="/properties"
              className="glass-morphism px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl font-bold hover:bg-white transition-all flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm shadow-xl"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary shrink-0" />
              <span className="text-brand-dark hidden sm:inline">
                Return to Collection
              </span>
            </Link>
          </div>

          {/* Navigation Arrows on Left and Right of Image */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white transition-all shadow-xl z-20 group/btn"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-brand-dark group-hover/btn:text-brand-primary" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white transition-all shadow-xl z-20 group/btn"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-brand-dark group-hover/btn:text-brand-primary" />
              </button>
            </>
          )}

          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 sm:bottom-4 md:bottom-8 left-3 sm:left-4 md:left-8 glass-morphism px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm hover:bg-white transition-all shadow-xl flex items-center gap-1 sm:gap-2 text-brand-dark"
          >
            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary shrink-0" />
            <span className="hidden sm:inline">Expand Gallery</span>
            <span className="sm:hidden">Gallery</span>
          </button>
        </div>

        {/* Side Thumbnails showing all photos */}
        <div className="hidden lg:flex lg:col-span-4 flex-col h-full bg-cream/80 p-4 sm:p-5 rounded-3xl md:rounded-4xl border border-gray-100/90 overflow-hidden">
          <div className="flex items-center justify-between pb-3.5 px-1 border-b border-gray-200/60 mb-4 shrink-0">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-dark flex items-center gap-2">
              <Images className="w-4 h-4 text-brand-primary" /> Photo Gallery (
              {allImages.length})
            </span>
            <span className="text-[10px] text-gray-500 font-bold">
              {activeIdx + 1} of {allImages.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 pr-3 pb-4 grid grid-cols-2 gap-4 sm:gap-5 content-start custom-scrollbar">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative h-28 sm:h-32 w-full rounded-xl sm:rounded-2xl overflow-hidden group transition-all duration-300 ${
                  activeIdx === i
                    ? "border-2 sm:border-3 border-brand-primary shadow-md shadow-brand-primary/20 z-10"
                    : "opacity-75 hover:opacity-100 border border-gray-200 hover:border-brand-primary/50"
                }`}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${title} ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {activeIdx === i && (
                  <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Thumbnails Strip */}
      <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-2 custom-scrollbar">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`View photo ${i + 1}`}
            className={`relative w-20 sm:w-24 h-14 sm:h-16 shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
              activeIdx === i
                ? "ring-2 ring-brand-primary ring-offset-1 border-2 border-brand-primary scale-105 shadow-md"
                : "opacity-60 hover:opacity-100 border-2 border-transparent"
            }`}
          >
            <ImageWithFallback
              src={img}
              alt=""
              fill
              sizes="100px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-100 bg-brand-dark flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            <div className="flex flex-col min-w-0">
              <span className="text-white font-black text-sm sm:text-base md:text-lg tracking-tight truncate max-w-50 sm:max-w-none">
                {title}
              </span>
              <span className="linear-text text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {activeIdx + 1} of {allImages.length} Photos
              </span>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/10 shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center px-2 sm:px-4 md:px-8 lg:px-20">
            <ImageWithFallback
              src={allImages[activeIdx]}
              alt={title}
              fill
              sizes="100vw"
              quality={95}
              className="object-contain p-4 sm:p-8 md:p-10"
            />
            <button
              onClick={prev}
              className="absolute left-1 sm:left-2 md:left-4 lg:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-white/5 hover:bg-linear-to-br hover:from-brand-primary hover:to-brand-accent flex items-center justify-center text-white transition-all border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>
            <button
              onClick={next}
              className="absolute right-1 sm:right-2 md:right-4 lg:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-white/5 hover:bg-linear-to-br hover:from-brand-primary hover:to-brand-accent flex items-center justify-center text-white transition-all border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>
          </div>

          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 sm:gap-4 justify-center min-w-max mx-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={`relative w-16 h-10 sm:w-20 sm:h-14 md:w-24 md:h-16 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ${
                    i === activeIdx
                      ? "ring-2 ring-brand-primary scale-105 sm:scale-110 shadow-2xl"
                      : "opacity-40 hover:opacity-100"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
