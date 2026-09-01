import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogListingClient from "./BlogListingClient";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Real Estate Insights & News | Roman Estate",
  description:
    "Stay updated with the latest trends in Mumbai's real estate market, investment tips, and neighborhood guides.",
  path: "/blog",
});

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogListingPage() {
  const blogs = await getBlogs();

  return (
    <div className="bg-cream min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-28 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-linear-to-r from-brand-primary/5 to-transparent skew-x-12 -translate-x-24" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Roman Estate <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium px-2 sm:px-0">
            Stay updated with the latest trends in Mumbai&apos;s real estate
            market, investment tips, and neighborhood guides.
          </p>
        </div>
      </div>

      <BlogListingClient initialBlogs={blogs} />
    </div>
  );
}
