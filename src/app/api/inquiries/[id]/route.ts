import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    await connectDB();
    const data = await request.json();
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true, runValidators: true }
    );
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Inquiry updated", inquiry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    await connectDB();
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
