"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home as HomeIcon, MapPin, ChevronDown } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [open, setOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="glass-morphism p-2 sm:p-2.5 rounded-3xl sm:rounded-4xl shadow-2xl shadow-brand-primary/10 flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <div className="flex-1 w-full flex items-center px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-[1rem] sm:rounded-3xl hover:bg-white/50 transition-colors">
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

        <div className="hidden md:block w-px h-10 bg-linear-to-b from-transparent via-brand-primary/20 to-transparent" />

        <div className="w-full md:w-48 lg:w-56 relative z-50" ref={typeRef}>
          <div
            className="flex items-center px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-[1rem] sm:rounded-3xl hover:bg-white/50 transition-colors cursor-pointer select-none"
            onClick={() => setOpen(!open)}
          >
            <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary mr-2 sm:mr-3 shrink-0" />
            <span
              className={`flex-1 truncate text-sm sm:text-base font-medium ${
                type === "All" ? "text-gray-400" : "text-brand-dark"
              }`}
            >
              {type === "All" ? "Explore Properties" : type}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-brand-primary/60 shrink-0 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>

          {open && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-brand-primary/10 border border-brand-primary/10 overflow-hidden p-1">
              {["All", "Apartment", "Commercial"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                    type === t
                      ? "bg-linear-to-r from-brand-primary to-brand-accent text-white"
                      : "text-brand-dark hover:bg-gray-50"
                  }`}
                >
                  {t === "All" ? "Explore Properties" : t}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="w-full md:w-auto premium-button-primary rounded-[1rem]! sm:rounded-3xl! flex items-center justify-center gap-2 group py-3 md:py-3"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          <span className="md:hidden lg:inline">Find Properties</span>
          <span className="hidden md:inline lg:hidden">Search</span>
        </button>
      </div>

      <div className="mt-3 sm:mt-5 flex flex-wrap justify-center gap-2 sm:gap-4 text-white/80 text-xs sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />{" "}
          Popular: South Mumbai
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />{" "}
          Bandra West
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />{" "}
          Worli Skyline
        </span>
      </div>
    </div>
  );
}
