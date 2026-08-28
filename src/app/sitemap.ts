import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Blog from "@/models/Blog";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://roman-estate.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    await connectDB();
    const [properties, blogs] = await Promise.all([
      Property.find({}).select("_id updatedAt").lean(),
      Blog.find({ published: true }).select("slug updatedAt").lean(),
    ]);

    const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
      url: `${SITE_URL}/properties/${p._id}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
