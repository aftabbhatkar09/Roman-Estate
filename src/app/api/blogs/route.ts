import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(blogs);
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      errors?: Record<string, { message: string }>;
    };
    console.error("Blog GET Error:", error);
    return NextResponse.json(
      { error: err.message || "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const blog = await Blog.create(data);
    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    return NextResponse.json(
      { message: "Blog created successfully", blog },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      errors?: Record<string, { message: string }>;
    };
    console.error("Blog POST Error:", error);
    return NextResponse.json(
      {
        error: err.message || "Failed to create blog",
        details:
          err.errors && typeof err.errors === "object"
            ? Object.keys(err.errors).map((key) => ({
                field: key,
                message:
                  (err.errors as Record<string, { message?: string }>)[key]
                    ?.message || "",
              }))
            : null,
      },
      { status: 500 },
    );
  }
}
