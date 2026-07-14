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
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-morphism p-2 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-2">
        <div className="flex-1 w-full flex items-center px-6 py-4">
          <MapPin className="w-5 h-5 text-brand-gold mr-3 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search location, project, or developer..."
            className="w-full bg-transparent text-brand-dark outline-none text-base placeholder:text-gray-400 font-medium"
          />
        </div>
        
        <div className="hidden md:block w-px h-10 bg-gray-200/50" />

        <div className="w-full md:w-56 flex items-center px-6 py-4">
          <HomeIcon className="w-5 h-5 text-brand-gold mr-3 shrink-0" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-transparent text-brand-dark outline-none text-base font-medium w-full appearance-none cursor-pointer"
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
          className="w-full md:w-auto premium-button-primary !rounded-2xl flex items-center justify-center gap-2 group"
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="md:hidden lg:inline">Find Properties</span>
          <span className="hidden md:inline lg:hidden">Search</span>
        </button>
      </div>
      
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-white/80 text-sm">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Popular: South Mumbai</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Bandra West</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Worli Skyline</span>
      </div>
    </div>
  );
}
