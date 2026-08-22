import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET a single property
export async function GET(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    await connectDB();
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(property);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// UPDATE a property
export async function PUT(request: NextRequest, context: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();
    const data = await request.json();
    const property = await Property.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }
    revalidatePath("/properties");
    revalidatePath("/admin/properties");
    revalidatePath(`/properties/${id}`);
    revalidatePath(`/admin/properties/${id}`);
    return NextResponse.json({
      message: "Property updated successfully",
      property,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE a property
export async function DELETE(request: NextRequest, context: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }
    revalidatePath("/properties");
    revalidatePath("/admin/properties");
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
