import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    await connectDB();
    const partner = await Partner.findById(id);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    return NextResponse.json(partner);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    await connectDB();
    const data = await request.json();
    const partner = await Partner.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    revalidatePath("/");
    revalidatePath("/admin/partners");
    return NextResponse.json({
      message: "Partner updated successfully",
      partner,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    await connectDB();
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    revalidatePath("/");
    revalidatePath("/admin/partners");
    return NextResponse.json({ message: "Partner deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
