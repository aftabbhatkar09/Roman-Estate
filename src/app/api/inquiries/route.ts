import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Check for honeypot
    if (data._honeypot) {
      return NextResponse.json({ message: "Spam detected" }, { status: 200 });
    }

    // Basic validation
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.requirementType ||
      !data.message
    ) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 },
      );
    }

    if (!["Buying", "Selling", "Renting"].includes(data.requirementType)) {
      return NextResponse.json(
        { error: "Invalid requirement type" },
        { status: 400 },
      );
    }

    const inquiry = await Inquiry.create(data);
    return NextResponse.json(
      { message: "Inquiry submitted successfully", inquiry },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      errors?: Record<string, { message: string }>;
    };
    console.error("Inquiry POST Error:", error);
    return NextResponse.json(
      {
        error: err.message || "Failed to submit inquiry",
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

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Inquiry GET Error:", error);
    return NextResponse.json(
      { error: err.message || "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}
