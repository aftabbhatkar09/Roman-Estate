"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home as HomeIcon, MapPin } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (type !== "All") params.set("type", type);
    router.push(`/properties?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="glass-morphism p-2 sm:p-2.5 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-brand-primary/10 flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <div className="flex-1 w-full flex items-center px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-[1rem] sm:rounded-[1.5rem] hover:bg-white/50 transition-colors">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary mr-2 sm:mr-3 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search location, project, or developer..."
            className="w-full bg-transparent text-brand-dark outline-none text-sm sm:text-base placeholder:text-gray-400 font-medium"
          />
        </div>

        <div className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent" />

        <div className="w-full md:w-48 lg:w-56 flex items-center px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-[1rem] sm:rounded-[1.5rem] hover:bg-white/50 transition-colors">
          <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary mr-2 sm:mr-3 shrink-0" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-transparent text-brand-dark outline-none text-sm sm:text-base font-medium w-full appearance-none cursor-pointer"
          >
            <option value="All">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plot</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="w-full md:w-auto premium-button-primary !rounded-[1rem] sm:!rounded-[1.5rem] flex items-center justify-center gap-2 group py-3 md:py-3"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          <span className="md:hidden lg:inline">Find Properties</span>
          <span className="hidden md:inline lg:hidden">Search</span>
        </button>
      </div>

      <div className="mt-3 sm:mt-5 flex flex-wrap justify-center gap-2 sm:gap-4 text-white/80 text-xs sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" /> Popular: South Mumbai
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" /> Bandra West
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" /> Worli Skyline
        </span>
      </div>
    </div>
  );
}
