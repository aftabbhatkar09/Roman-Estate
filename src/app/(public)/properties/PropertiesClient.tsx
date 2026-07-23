"use client";
import { useState } from "react";
import {
  Search,
  MapPin,
  Home,
  Star,
  SlidersHorizontal,
  X,
  BedDouble,
  Bath,
  Square,
  ArrowRight,
} from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";

interface PropertiesClientProps {
  initialProperties: any[];
  initialSearch?: string;
  initialType?: string;
  initialStatus?: string;
}

export default function PropertiesClient({
  initialProperties,
  initialSearch = "",
  initialType = "All",
  initialStatus = "All",
}: PropertiesClientProps) {
  const [filter, setFilter] = useState({
    type: initialType,
    status: initialStatus,
    search: initialSearch,
    minPrice: "",
    maxPrice: "",
  });

  const filteredProperties = initialProperties.filter((p) => {
    const matchType = filter.type === "All" || p.type === filter.type;
    const matchStatus = filter.status === "All" || p.status === filter.status;
    const matchSearch =
      !filter.search ||
      p.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      p.location.area.toLowerCase().includes(filter.search.toLowerCase()) ||
      p.location.city.toLowerCase().includes(filter.search.toLowerCase());
    const matchMinPrice =
      !filter.minPrice || p.price >= Number(filter.minPrice);
    const matchMaxPrice =
      !filter.maxPrice || p.price <= Number(filter.maxPrice);
    return (
      matchType && matchStatus && matchSearch && matchMinPrice && matchMaxPrice
    );
  });

  const hasActiveFilters =
    filter.type !== "All" ||
    filter.status !== "All" ||
    filter.search !== "" ||
    filter.minPrice !== "" ||
    filter.maxPrice !== "";

  const clearFilters = () =>
    setFilter({
      type: "All",
      status: "All",
      search: "",
      minPrice: "",
      maxPrice: "",
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-16 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-card border border-gray-100 space-y-6 sm:space-y-8 sticky top-28">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-brand-dark font-black text-lg sm:text-xl tracking-tight">
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-brand-primary" />
              Refine Search
            </div>
          </div>

          {/* Search */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Location or Project
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
              <input
                type="text"
                placeholder="Where would you like to live?"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium"
                value={filter.search}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Property Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["All", "Apartment", "Villa", "Commercial", "Plot"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter({ ...filter, type: t })}
                  className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                    filter.type === t
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-lg shadow-brand-primary/20"
                      : "border-gray-100 text-gray-500 hover:border-brand-primary/50 hover:text-brand-primary bg-gray-50/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Listing Status
            </label>
            <div className="flex flex-col gap-2">
              {["All", "For Sale", "For Rent"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter({ ...filter, status })}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    filter.status === status
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg shadow-brand-primary/20"
                      : "text-gray-500 hover:bg-gray-100 bg-gray-50/50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Budget Range (₹)
            </label>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Minimum"
                value={filter.minPrice}
                onChange={(e) =>
                  setFilter({ ...filter, minPrice: e.target.value })
                }
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium"
              />
              <input
                type="number"
                placeholder="Maximum"
                value={filter.maxPrice}
                onChange={(e) =>
                  setFilter({ ...filter, maxPrice: e.target.value })
                }
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Reset All Filters
            </button>
          )}
        </div>
      </aside>

      {/* Property Grid */}
      <div className="flex-1 min-w-0">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-10 bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
              Property Collection
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-1">
              Showing{" "}
              <span className="text-brand-primary font-bold">
                {filteredProperties.length}
              </span>{" "}
              exclusive listings in Mumbai
            </p>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 md:p-20 rounded-[2rem] sm:rounded-[3rem] text-center space-y-8 border border-dashed border-gray-200 shadow-sm">
            <div className="w-32 h-32 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-16 h-16 text-gray-200" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl sm:text-3xl font-black text-brand-dark mb-3 tracking-tight">
                No matching properties
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                We couldn&apos;t find any listings matching your current criteria.
                Try broadening your search or resetting the filters.
              </p>
            </div>
            <button onClick={clearFilters} className="premium-button-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {filteredProperties.map((property) => (
              <Link
                href={`/properties/${property._id}`}
                key={property._id}
                className="premium-card group/item bg-white flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : null
                    }
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="group-hover/item:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="glass-morphism px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                      {property.type}
                    </span>
                    {property.featured && (
                      <span className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-brand-primary/30">
                      ₹{property.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="absolute top-5 right-5">
                    <span className="bg-brand-dark/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {property.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">
                      <Star className="w-3 h-3 fill-current" />
                      Premium Listing
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-brand-dark group-hover/item:text-brand-primary transition-colors line-clamp-1 mb-2">
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
                        <span className="text-sm font-semibold">
                          {property.bedrooms || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Bath className="w-4 h-4 text-brand-primary" />
                        <span className="text-sm font-semibold">
                          {property.bathrooms || 2}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Square className="w-4 h-4 text-brand-primary" />
                        <span className="text-sm font-semibold">
                          {property.size || 0}{" "}
                          <span className="text-[10px] uppercase">Sq.Ft</span>
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover/item:text-brand-primary group-hover/item:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
