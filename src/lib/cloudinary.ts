import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: File,
  folder: string = "general"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `roman-estate/${folder}`,
    resource_type: "image",
    // "auto:best" favors visual fidelity over file size — images are the
    // core product on a real-estate site, so err on the side of clarity.
    quality: "auto:best",
    fetch_format: "auto",
    transformation: [{ width: 2560, crop: "limit" }],
  });

  return result.secure_url;
}
