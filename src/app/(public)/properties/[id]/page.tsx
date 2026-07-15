import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import {
  MapPin,
  Star,
  CheckCircle2,
  Phone,
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

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  await connectDB();
  const property = await Property.findById(id);

  if (!property) return { title: "Property Not Found" };

  return {
    title: `${property.title} | Roman Estate`,
    description: property.description.substring(0, 160),
  };
}

async function getProperty(id: string) {
  try {
    await connectDB();
    const property = await Property.findById(id).lean();
    if (!property) return null;
    return JSON.parse(JSON.stringify(property));
  } catch {
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  return (
    <div className="bg-white min-h-screen pb-24 mt-20 md:mt-24">
      {/* Hero Gallery */}
      <PropertyGallery images={property.images} title={property.title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-16">
            {/* Title & Price Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-100 pb-12">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                    {property.type}
                  </span>
                  <span className="bg-brand-dark text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {property.status}
                  </span>
                  {property.featured && (
                    <span className="bg-white border border-brand-primary text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Premium Selection
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-500 font-medium">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mr-4 shrink-0">
                    <MapPin className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-lg">
                    {property.location.address}, {property.location.area},{" "}
                    {property.location.city}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-dark to-brand-dark-light p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl text-center md:text-right w-full md:min-w-[280px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 relative z-10">
                  Valuation
                </p>
                <p className="text-4xl font-black gradient-text relative z-10">
                  ₹{property.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
                <div
                  key={i}
                  className="bg-gray-50/50 p-5 sm:p-6 md:p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-card transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mb-6 group-hover:from-brand-primary group-hover:to-brand-accent group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <spec.icon className="w-6 h-6 text-brand-primary group-hover:text-white" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    {spec.label}
                  </p>
                  <p className="text-xl font-black text-brand-dark">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-gradient-to-b from-brand-primary to-brand-accent rounded-full" />
                <h2 className="text-3xl font-black text-brand-dark tracking-tight">
                  Overview
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-500 leading-relaxed font-medium">
                {property.description
                  .split("\n")
                  .map((p: string, i: number) => (
                    <p key={i} className="mb-6">
                      {p}
                    </p>
                  ))}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-brand-primary to-brand-accent rounded-full" />
                  <h2 className="text-3xl font-black text-brand-dark tracking-tight">
                    Exclusive Features
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.amenities.map((amenity: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center p-5 bg-white rounded-2xl border border-gray-100 group hover:border-brand-primary/30 hover:shadow-card transition-all duration-500"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mr-4 shrink-0 group-hover:from-brand-primary group-hover:to-brand-accent transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-brand-primary group-hover:text-white" />
                      </div>
                      <span className="font-bold text-brand-dark">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-brand-dark to-brand-dark-light rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group sticky top-28">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-primary/15 to-brand-accent/15 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />

              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-3xl font-black mb-2 tracking-tight">
                    Acquire this Residence
                  </h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Schedule an exclusive walkthrough with our senior
                    consultant.
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href="tel:+919876543210"
                    className="w-full premium-button-primary py-5 text-lg flex items-center justify-center group/call"
                  >
                    <Phone className="w-5 h-5 mr-3 group-hover/call:rotate-12 transition-transform" />{" "}
                    Contact Agent
                  </a>
                  <Link
                    href={`/contact`}
                    className="block w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black text-lg text-center transition-all border border-white/10"
                  >
                    Request Information
                  </Link>
                </div>

                <div className="pt-8 border-t border-white/10 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-black text-2xl shadow-xl">
                    RE
                  </div>
                  <div>
                    <p className="font-black text-xl tracking-tight">
                      Roman Estate
                    </p>
                    <p className="text-xs text-brand-primary-light font-bold flex items-center gap-2 mt-1 uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" />
                      Elite Advisor
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] border border-brand-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-full -mr-10 -mt-10" />
              <h4 className="font-black text-brand-dark mb-4 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-brand-primary" />
                Market Insight
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
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
            </div>

            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
              <h4 className="font-black text-brand-dark mb-6 text-xs uppercase tracking-[0.2em]">
                Property Signature
              </h4>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-400">Reference ID</span>
                  <span className="font-black text-brand-dark font-mono">
                    #{property._id?.toString().slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-400">Category</span>
                  <span className="font-black text-brand-dark">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">City</span>
                  <span className="font-black text-brand-dark">
                    {property.location.city}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
