import Link from "next/link";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
  Users,
  Trophy,
  Globe,
  Building2,
  Quote,
  Plus,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Partner from "@/models/Partner";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import PartnersCarousel from "@/components/PartnersCarousel";
import HeroSearch from "@/components/HeroSearch";

export const metadata: Metadata = {
  title: "Roman Estate | Luxury Real Estate Mumbai",
  description:
    "Find your dream home in Mumbai with Roman Estate. Premium properties, luxury apartments, and exclusive commercial spaces.",
};

export const dynamic = "force-dynamic";

async function getFeaturedProperties() {
  try {
    await connectDB();
    const properties = await Property.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(properties));
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
}

async function getLatestProperties() {
  try {
    await connectDB();
    const properties = await Property.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(properties));
  } catch (error) {
    console.error("Error fetching latest properties:", error);
    return [];
  }
}

async function getPartners() {
  try {
    await connectDB();
    const partners = await Partner.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(partners));
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();
  const latestProperties = await getLatestProperties();
  const partners = await getPartners();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-32 overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-brand-primary/30 via-brand-dark/80 to-brand-accent/20 z-10" />
          <Image
            src="/bg.jpg"
            alt="Luxury Mumbai Home"
            fill
            sizes="100vw"
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/60 to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center text-white space-y-6 md:space-y-12 py-12 sm:py-16 md:py-20">
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-brand-primary to-brand-accent text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-lg shadow-brand-primary/25">
              Mumbai&apos;s Premier Real Estate
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              Elevating Your <br />
              <span className="gradient-text">Lifestyle Experience</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed px-2 sm:px-0">
              Discover a curated collection of Mumbai&apos;s most exclusive
              properties, crafted for those who demand nothing less than
              perfection.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-16 delay-300 duration-1000">
            <HeroSearch />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-linear-to-b from-brand-primary to-transparent" />
          <span className="text-[10px] text-brand-primary-light uppercase tracking-[0.3em] font-bold rotate-90 origin-left mt-8">
            Scroll
          </span>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-30 -mt-12 sm:-mt-16 max-w-6xl mx-auto w-full px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 border border-gray-100">
          {[
            { label: "Premium Properties", value: "1,200+", icon: Building2 },
            { label: "Happy Homeowners", value: "850+", icon: Users },
            { label: "Years of Excellence", value: "32", icon: Trophy },
            { label: "Global Reach", value: "15+", icon: Globe },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mb-2 sm:mb-4 group-hover:from-brand-primary group-hover:to-brand-accent group-hover:rotate-6 transition-all duration-300">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary group-hover:text-white transition-colors" />
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark mb-1">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 md:flex-row md:justify-between mb-10 md:mb-20">
            <div className="space-y-3 sm:space-y-4 max-w-xl">
              <span className="text-brand-primary text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em]">
                Curated Selection
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark leading-tight">
                Masterpieces of <br className="hidden sm:block" />
                Mumbai Architecture
              </h2>
            </div>
            <Link
              href="/properties"
              className="premium-button-outline flex items-center gap-2 text-sm sm:text-base"
            >
              Explore Collection <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>

          <FeaturedCarousel properties={featuredProperties} />
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
            <div className="space-y-4">
              <span className="text-brand-primary text-sm font-bold uppercase tracking-[0.3em]">
                Our Network
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-dark">
                Trusted by Industry Titans
              </h2>
            </div>
          </div>

          <PartnersCarousel partners={partners} />
        </div>
      </section>

      {/* Investment Benefits / Why Choose Us */}
      <section className="py-16 sm:py-20 md:py-32 bg-brand-dark overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-brand-primary/5 to-transparent -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none w-full">
              <div className="absolute inset-3 sm:inset-4 border-2 border-brand-primary/30 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] -rotate-3" />
              <div className="absolute inset-0 bg-linear-to-br from-brand-primary/10 to-brand-accent/10 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] rotate-3" />
              <Image
                src="/bg2.jpg"
                alt="Our Expertise"
                fill
                className="relative z-10 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 -right-4 sm:-right-6 md:-right-10 glass-morphism p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-2xl z-20">
                <p className="text-2xl sm:text-3xl md:text-5xl font-black gradient-text mb-1">
                  30+
                </p>
                <p className="text-[10px] sm:text-xs text-brand-dark font-bold uppercase tracking-widest">
                  Years of Trust
                </p>
              </div>
            </div>

            <div className="space-y-6 md:space-y-10">
              <div className="space-y-4 sm:space-y-6">
                <span className="text-brand-primary text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em]">
                  Why Roman Estate
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  Your Strategic Partner in <br />
                  Luxury Real Estate
                </h3>
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
                  We don&apos;t just sell properties; we build legacies. Our
                  deep-rooted expertise in Mumbai&apos;s micro-markets ensures
                  your investment is both safe and prosperous.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                {[
                  {
                    title: "Market Intel",
                    desc: "Exclusive off-market opportunities.",
                    icon: Zap,
                  },
                  {
                    title: "Legal Safety",
                    desc: "100% verified documentation.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "ROI Focus",
                    desc: "Data-driven investment strategies.",
                    icon: TrendingUp,
                  },
                  {
                    title: "Concierge",
                    desc: "End-to-end property management.",
                    icon: CheckCircle2,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 sm:gap-4 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-white/5 to-white/2 border border-white/10 flex items-center justify-center shrink-0 group-hover:from-brand-primary group-hover:to-brand-accent group-hover:border-transparent transition-all">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary-light group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1 text-sm sm:text-base">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="premium-button-primary inline-flex items-center gap-2 mt-2 sm:mt-4 text-sm sm:text-base"
              >
                Consult an Expert <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings Grid */}
      <section className="py-16 sm:py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 md:mb-20">
            <span className="text-brand-primary text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em]">
              Latest Additions
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark">
              Newly Unveiled Properties
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2 sm:px-0">
              Explore our newest listings, ranging from sleek modern penthouses
              to timeless heritage villas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
            {latestProperties.map((property: any) => (
              <Link
                href={`/properties/${property._id}`}
                key={property._id}
                className="premium-card group/item bg-white flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : null
                    }
                    alt={property.title || "Property"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="group-hover/item:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-dark/40 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <span className="bg-brand-dark/80 backdrop-blur-md text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                      {property.status || "For Sale"}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark group-hover/item:text-brand-primary transition-colors mb-2 line-clamp-1">
                    {property.title}
                  </h4>
                  <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-brand-primary shrink-0" />
                    <span className="line-clamp-1">
                      {property.location?.city || "Mumbai"}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-base sm:text-lg md:text-xl font-black text-brand-dark">
                      ₹{property.price?.toLocaleString("en-IN")}
                    </p>
                    <span className="text-brand-primary font-bold text-xs sm:text-sm flex items-center gap-1 group/btn">
                      View Details
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 md:mt-20 text-center">
            <Link
              href="/properties"
              className="premium-button-outline inline-flex text-sm sm:text-base"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8">
              <span className="text-brand-primary text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em]">
                Testimonials
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark leading-tight">
                What Our Elite <br />
                Clients Say
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">
                We take pride in building lasting relationships. Here&apos;s how
                we&apos;ve helped Mumbai&apos;s elite find their perfect
                sanctuaries.
              </p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-brand-dark">
                    98%
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Client Satisfaction
                  </span>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-brand-dark">
                    400+
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Verified Reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  name: "Rajesh Malhotra",
                  role: "CEO, Tech Corp",
                  text: "Roman Estate's attention to detail and understanding of luxury is unparalleled in Mumbai.",
                },
                {
                  name: "Priya Sharma",
                  role: "Fashion Designer",
                  text: "They found me a hidden gem in Bandra that wasn't even on the market. Truly exceptional service.",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-4xl space-y-4 sm:space-y-6 relative group bg-linear-to-br hover:from-brand-primary hover:to-brand-accent transition-all duration-500 cursor-default"
                >
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary group-hover:text-white/30 transition-colors" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-white transition-colors leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <h5 className="font-bold text-brand-dark group-hover:text-white transition-colors text-sm sm:text-base">
                      {t.name}
                    </h5>
                    <p className="text-[10px] sm:text-xs text-gray-400 group-hover:text-white/70 transition-colors">
                      {t.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
            <span className="text-brand-primary text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em]">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: "What areas of Mumbai do you specialize in?",
                a: "We specialize in South Mumbai, Bandra, Worli, and emerging luxury hubs in the suburbs.",
              },
              {
                q: "Do you handle RERA and legal documentation?",
                a: "Yes, our in-house legal team ensures every property is 100% RERA compliant and handles all paperwork.",
              },
              {
                q: "Can you help with property management for NRIs?",
                a: "Absolutely. We offer comprehensive property management services tailored for NRI investors.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-brand-primary/30 transition-all cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start sm:items-center gap-3">
                  <h4 className="font-bold text-brand-dark flex items-start sm:items-center gap-2 sm:gap-3 text-sm sm:text-base">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary shrink-0 mt-0.5 sm:mt-0" />
                    {faq.q}
                  </h4>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-brand-primary transition-colors shrink-0 mt-0.5 sm:mt-0" />
                </div>
                <p className="mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
