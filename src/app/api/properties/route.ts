import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { parsePagination, paginationHeaders } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { page, limit, skip } = parsePagination(request);
    const [properties, total] = await Promise.all([
      Property.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Property.countDocuments({}),
    ]);
    return NextResponse.json(properties, {
      headers: paginationHeaders({ page, limit, total }),
    });
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      errors?: Record<string, { message: string }>;
    };
    console.error("API GET Error:", error);
    return NextResponse.json(
      { error: err.message || "Failed to fetch properties" },
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

    // Ensure numeric fields are correctly typed
    const propertyData = {
      ...data,
      price: Number(data.price),
      bedrooms: Number(data.bedrooms || 0),
      bathrooms: Number(data.bathrooms || 0),
      size: Number(data.size),
      featured: Boolean(data.featured),
    };

    const property = await Property.create(propertyData);
    revalidateTag("properties", { expire: 0 });
    revalidatePath("/properties");
    revalidatePath("/admin/properties");
    return NextResponse.json(
      { message: "Property created successfully", property },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      errors?: Record<string, { message: string }>;
    };
    console.error("API POST Error:", error);
    return NextResponse.json(
      {
        error: err.message || "Failed to create property",
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
