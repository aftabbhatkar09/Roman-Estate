import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import AdminBlogsClient from "./AdminBlogsClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

async function getBlogs(page: number) {
  try {
    await connectDB();
    const [blogs, total] = await Promise.all([
      Blog.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Blog.countDocuments({}),
    ]);
    return { blogs: JSON.parse(JSON.stringify(blogs)), total };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [], total: 0 };
  }
}

export default async function AdminBlogs({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);
  const { blogs, total } = await getBlogs(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminBlogsClient initialBlogs={blogs} page={page} totalPages={totalPages} />
  );
}
