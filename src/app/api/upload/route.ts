import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB (base64 adds ~33% overhead, keep under MongoDB's 16MB doc limit)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `"${file.name}" is not a supported image type. Use JPG, PNG, WebP, or GIF.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `"${file.name}" exceeds the 3 MB size limit.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      urls.push(dataUrl);
    }

    return NextResponse.json({ urls });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Upload API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
