import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertiesClient from "./PropertiesClient";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Luxury Properties in Mumbai | Roman Estate",
  description:
    "Explore luxury homes in Mumbai and premium commercial properties with Roman Estate — your trusted real estate channel partner for new launch projects and residential projects in Mumbai.",
  path: "/properties",
});

export const dynamic = "force-dynamic";

interface PropertiesPageProps {
  searchParams: Promise<{ search?: string; type?: string; status?: string }>;
}

// Cached across requests (not just per-request) so this listing never has to
// round-trip Mongo unless a property actually changed — admin writes bust it
// via revalidateTag("properties"). Only the fields the cards render are
// selected (no description/amenities, only the cover image) to keep the
// cached payload — and every page load — as small as possible.
const getProperties = unstable_cache(
  async () => {
    try {
      await connectDB();
      const properties = await Property.find({})
        .select({
          title: 1,
          price: 1,
          location: 1,
          type: 1,
          status: 1,
          bedrooms: 1,
          bathrooms: 1,
          size: 1,
          featured: 1,
          createdAt: 1,
          images: { $slice: 1 },
        })
        .sort({ createdAt: -1 })
        .lean();
      return JSON.parse(JSON.stringify(properties));
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  },
  ["properties-list"],
  { tags: ["properties"], revalidate: 3600 },
);

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const properties = await getProperties();
  const sp = await searchParams;
  const initialSearch = sp?.search || "";
  const initialType = sp?.type || "All";
  const initialStatus = sp?.status || "All";

  return (
    <div className="bg-cream min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-28 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-brand-primary/5 to-transparent -skew-x-12 translate-x-24" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Properties for <span className="gradient-text">Sale & Rent</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
            Discover your next investment or dream home in the heart of Mumbai.
            We bring you the most exclusive listings across the city.
          </p>
        </div>
      </div>

      <PropertiesClient
        initialProperties={properties}
        initialSearch={initialSearch}
        initialType={initialType}
        initialStatus={initialStatus}
      />
    </div>
  );
}
