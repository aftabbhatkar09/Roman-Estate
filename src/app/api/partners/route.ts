import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const partners = await Partner.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(partners);
  } catch (error: unknown) {
    console.error("Partner GET Error:", error);
    const message = error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json({ error: message }, { status: 500 });
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

    const partner = await Partner.create(data);
    revalidatePath("/");
    revalidatePath("/admin/partners");
    return NextResponse.json(
      { message: "Partner created successfully", partner },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Partner POST Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create partner";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
