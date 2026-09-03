import { cache } from "react";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import {
  MapPin,
  CheckCircle2,
  Calendar,
  Ruler,
  Bed,
  Bath,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PropertyGallery from "./PropertyGallery";
import { buildMetadata } from "@/lib/metadata";
import Reveal from "@/components/Reveal";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

// Pre-renders every listing at build time. New listings added later still
// work — Next.js renders and caches them on their first visit.
export async function generateStaticParams() {
  try {
    await connectDB();
    const properties = await Property.find({}).select("_id").lean();
    return properties.map((property) => ({ id: String(property._id) }));
  } catch (error) {
    console.error("Error generating static params for property:", error);
    return [];
  }
}

// Memoized per-request: generateMetadata and the page component both need
// this document, so this ensures only one DB round-trip instead of two.
const getProperty = cache(async (id: string) => {
  try {
    await connectDB();
    const property = await Property.findById(id).lean();
    if (!property) return null;
    return JSON.parse(JSON.stringify(property));
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) return { title: "Property Not Found" };

  return buildMetadata({
    title: `${property.title} | Roman Estate`,
    description: property.description.substring(0, 160),
    images: property.images?.length ? property.images : undefined,
    path: `/properties/${id}`,
  });
}

export default async function PropertyDetailPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  return (
    <div className="bg-cream min-h-screen pb-24 pt-24 sm:pt-28 md:pt-32">
      {/* Hero Gallery */}
      <PropertyGallery images={property.images} title={property.title} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-8 sm:mt-10 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-10 sm:space-y-12 md:space-y-16">
            {/* Title & Price Header */}
            <Reveal className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 border-b border-gray-100 pb-8 sm:pb-10 md:pb-12">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className="bg-linear-to-r from-brand-primary/10 to-brand-accent/10 text-brand-primary px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                    {property.type}
                  </span>
                  <span className="bg-brand-dark text-white px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                    {property.status}
                  </span>
                  {property.featured && (
                    <span className="bg-white border border-brand-primary text-brand-primary px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Premium Selection
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark tracking-tight leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-500 font-medium">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mr-2 sm:mr-4 shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                  </div>
                  <span className="text-sm sm:text-base md:text-lg wrap-break-word">
                    {property.location.address}, {property.location.area},{" "}
                    {property.location.city}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-br from-brand-dark via-brand-dark-light to-brand-dark p-4 sm:p-5 md:p-6 rounded-3xl sm:rounded-4xl shadow-xl border border-white/10 shrink-0 relative overflow-hidden group flex items-center gap-4 sm:gap-5 self-start">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-brand-primary/20 to-brand-accent/20 rounded-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />

                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white shadow-lg shrink-0 relative z-10">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div className="relative z-10">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-0.5">
                    Valuation
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text tracking-tight whitespace-nowrap">
                    ₹{property.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Key Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[
                {
                  icon: Bed,
                  label: "Bedrooms",
                  value: `${property.bedrooms} BHK`,
                },
                {
                  icon: Bath,
                  label: "Bathrooms",
                  value: `${property.bathrooms} Baths`,
                },
                {
                  icon: Ruler,
                  label: "Total Area",
                  value: `${property.size} Sq Ft`,
                },
                {
                  icon: Calendar,
                  label: "Published",
                  value: new Date(property.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  ),
                },
              ].map((spec, i) => (
                <Reveal
                  key={i}
                  delay={i * 100}
                  className="bg-cream/50 p-3 sm:p-4 md:p-5 lg:p-8 rounded-[1rem] sm:rounded-3xl md:rounded-4xl border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-card transition-all duration-500"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:from-brand-primary group-hover:to-brand-accent group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <spec.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary group-hover:text-white" />
                  </div>
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 sm:mb-2">
                    {spec.label}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-brand-dark">
                    {spec.value}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Description */}
            <Reveal className="space-y-5 sm:space-y-6 md:space-y-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-1 h-8 sm:w-1.5 sm:h-10 bg-linear-to-b from-brand-primary to-brand-accent rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                  Overview
                </h2>
              </div>
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-gray-500 leading-relaxed font-medium">
                {property.description
                  .split("\n")
                  .map((p: string, i: number) => (
                    <p key={i} className="mb-4 sm:mb-6">
                      {p}
                    </p>
                  ))}
              </div>
            </Reveal>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-6 sm:space-y-8 md:space-y-10">
                <Reveal className="flex items-center gap-3 sm:gap-4">
                  <div className="w-1 h-8 sm:w-1.5 sm:h-10 bg-linear-to-b from-brand-primary to-brand-accent rounded-full" />
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                    Exclusive Features
                  </h2>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {property.amenities.map((amenity: string, i: number) => (
                    <Reveal
                      key={i}
                      delay={(i % 6) * 80}
                      className="flex items-center p-3 sm:p-4 md:p-5 bg-white rounded-xl sm:rounded-2xl border border-gray-100 group hover:border-brand-primary/30 hover:shadow-card transition-all duration-500"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-linear-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mr-3 sm:mr-4 shrink-0 group-hover:from-brand-primary group-hover:to-brand-accent transition-colors">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary group-hover:text-white" />
                      </div>
                      <span className="font-bold text-brand-dark text-sm sm:text-base">
                        {amenity}
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <Reveal delay={100} className="bg-linear-to-br from-brand-dark to-brand-dark-light rounded-3xl sm:rounded-4xl md:rounded-[3rem] p-5 sm:p-6 md:p-8 lg:p-10 text-white shadow-2xl overflow-hidden group sticky top-28">
              <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-linear-to-br from-brand-primary/15 to-brand-accent/15 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-1000" />

              <div className="relative z-10 space-y-5 sm:space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                    Acquire this Residence
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                    Schedule an exclusive walkthrough with our senior
                    consultant.
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* <a
                    href="tel:+918424886355"
                    className="w-full premium-button-primary py-3.5 sm:py-4 md:py-5 text-base sm:text-lg flex items-center justify-center group/call"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover/call:rotate-12 transition-transform shrink-0" />{" "}
                    Contact Agent
                  </a> */}
                  <Link
                    href={`/contact`}
                    className="block w-full bg-white/5 hover:bg-white/10 text-white py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg text-center transition-all border border-white/10"
                  >
                    Request Information
                  </Link>
                </div>

                <div className="pt-5 sm:pt-6 md:pt-8 border-t border-white/10 flex items-center gap-4 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-brand-primary to-brand-accent flex items-center justify-center font-black text-lg sm:text-xl md:text-2xl shadow-xl shrink-0">
                    RE
                  </div>
                  <div>
                    <p className="font-black text-base sm:text-lg md:text-xl tracking-tight">
                      Roman Estate
                    </p>
                    <p className="text-[10px] sm:text-xs text-brand-primary-light font-bold flex items-center gap-1 sm:gap-2 mt-1 uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                      Elite Advisor
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="bg-linear-to-br from-brand-primary/5 to-brand-accent/5 p-5 sm:p-6 md:p-8 lg:p-10 rounded-3xl sm:rounded-4xl md:rounded-[3rem] border border-brand-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-linear-to-br from-brand-primary/5 to-brand-accent/5 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10" />
              <h4 className="font-black text-brand-dark mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary shrink-0" />
                Market Insight
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                Properties in{" "}
                <span className="text-brand-dark font-bold">
                  {property.location.area}
                </span>{" "}
                are currently trending with a{" "}
                <span className="text-brand-dark font-bold">
                  12% annual appreciation
                </span>
                . This unit offers high liquidity and premium rental yield.
              </p>
            </Reveal>

            <Reveal delay={300} className="bg-cream p-5 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl md:rounded-[2.5rem] border border-gray-100">
              <h4 className="font-black text-brand-dark mb-4 sm:mb-6 text-[10px] sm:text-xs uppercase tracking-[0.2em]">
                Property Signature
              </h4>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium">
                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100 gap-2">
                  <span className="text-gray-500 shrink-0">Reference ID</span>
                  <span className="font-black text-brand-dark font-mono text-right break-all max-w-45">
                    #{property._id?.toString().slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100 gap-2">
                  <span className="text-gray-500 shrink-0">Category</span>
                  <span className="font-black text-brand-dark text-right">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 sm:py-3 gap-2">
                  <span className="text-gray-500 shrink-0">City</span>
                  <span className="font-black text-brand-dark text-right">
                    {property.location.city}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
