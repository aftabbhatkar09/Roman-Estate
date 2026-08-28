import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: NextRequest, context: Params) {
  try {
    const { slug } = await context.params;
    await connectDB();
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(blog);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
