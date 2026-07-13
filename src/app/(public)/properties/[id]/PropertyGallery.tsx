"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Images, Maximize2 } from "lucide-react";

const FALLBACK = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000";

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

  const prev = () => setActiveIdx((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[60vh] md:h-[70vh]">
        {/* Main Large Image */}
        <div className="lg:col-span-8 relative rounded-[2rem] overflow-hidden group">
          <Image
            src={allImages[activeIdx]}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-20">
            <Link
              href="/properties"
              className="glass-morphism px-5 py-2.5 rounded-2xl font-bold hover:bg-white transition-all flex items-center gap-2 text-sm shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 text-brand-gold" /> 
              <span className="text-brand-dark">Return to Collection</span>
            </Link>
          </div>

          {/* Navigation */}
          {allImages.length > 1 && (
            <div className="absolute bottom-8 right-8 flex gap-3 z-20">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white transition-all shadow-xl group/btn"
              >
                <ChevronLeft className="w-6 h-6 text-brand-dark group-hover/btn:text-brand-gold" />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white transition-all shadow-xl group/btn"
              >
                <ChevronRight className="w-6 h-6 text-brand-dark group-hover/btn:text-brand-gold" />
              </button>
            </div>
          )}

          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-8 left-8 glass-morphism px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white transition-all shadow-xl flex items-center gap-2 text-brand-dark"
          >
            <Maximize2 className="w-4 h-4 text-brand-gold" />
            Expand Gallery
          </button>
        </div>

        {/* Side Thumbnails */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 overflow-hidden">
          {allImages.slice(0, 3).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative flex-1 rounded-[1.5rem] overflow-hidden group transition-all duration-500 ${
                activeIdx === i ? 'ring-2 ring-brand-gold' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              {i === 2 && allImages.length > 3 && (
                <div className="absolute inset-0 bg-brand-dark/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                  <span className="text-3xl font-black text-brand-gold">+{allImages.length - 3}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">More Photos</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-brand-navy flex flex-col">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tight">{title}</span>
              <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">{activeIdx + 1} of {allImages.length} Photos</span>
            </div>
            <button 
              onClick={() => setLightboxOpen(false)} 
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center px-20">
            <Image
              src={allImages[activeIdx]}
              alt={title}
              fill
              className="object-contain p-10"
            />
            <button 
              onClick={prev} 
              className="absolute left-8 w-16 h-16 rounded-full bg-white/5 hover:bg-brand-gold flex items-center justify-center text-white transition-all border border-white/10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={next} 
              className="absolute right-8 w-16 h-16 rounded-full bg-white/5 hover:bg-brand-gold flex items-center justify-center text-white transition-all border border-white/10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="px-8 py-10 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 justify-center min-w-max mx-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                    i === activeIdx ? 'ring-2 ring-brand-gold scale-110 shadow-2xl' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
