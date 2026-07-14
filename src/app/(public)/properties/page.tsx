import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertiesClient from "./PropertiesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Properties in Mumbai | Roman Estate",
  description:
    "Explore our curated selection of luxury apartments, villas, and commercial spaces in Mumbai. Find your next investment or dream home.",
};

export const dynamic = "force-dynamic";

interface PropertiesPageProps {
  searchParams: Promise<{ search?: string; type?: string; status?: string }>;
}

async function getProperties() {
  try {
    await connectDB();
    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(properties));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const properties = await getProperties();
  const sp = await searchParams;
  const initialSearch = sp?.search || "";
  const initialType = sp?.type || "All";
  const initialStatus = sp?.status || "All";

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-24" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Properties for <span className="text-blue-600">Sale & Rent</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
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
