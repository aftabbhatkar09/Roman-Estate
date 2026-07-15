/**
 * One-time migration script: uploads base64 images from MongoDB to Cloudinary.
 *
 * Usage:  npx tsx scripts/migrate-to-cloudinary.ts
 *
 * Requires env vars: MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envPath = path.resolve(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI env var.");
  process.exit(1);
}

// Minimal schemas
const PropertySchema = new mongoose.Schema({
  title: String,
  images: [String],
});
const BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
});
const PartnerSchema = new mongoose.Schema({
  name: String,
  logo: String,
});

const Property = mongoose.model("Property", PropertySchema, "properties");
const Blog = mongoose.model("Blog", BlogSchema, "blogs");
const Partner = mongoose.model("Partner", PartnerSchema, "partners");

async function uploadBase64(
  dataUrl: string,
  folder: string,
  label: string
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: `roman-estate/${folder}`,
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
      transformation: [{ width: 2000, crop: "limit" }],
    });
    console.log(`  ✓ Uploaded ${label} → ${result.secure_url.slice(0, 60)}...`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ✗ Failed to upload ${label}:`, err);
    return null;
  }
}

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected.\n");

  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  // --- Properties ---
  console.log("--- Properties ---");
  const properties = await Property.find({ images: { $exists: true, $ne: [] } });
  for (const prop of properties) {
    const images = prop.images as string[];
    let changed = false;
    for (let i = 0; i < images.length; i++) {
      if (images[i].startsWith("data:image")) {
        const newUrl = await uploadBase64(
          images[i],
          "properties",
          `${prop.title || prop._id} [${i}]`
        );
        if (newUrl) {
          images[i] = newUrl;
          changed = true;
          totalMigrated++;
        } else {
          totalFailed++;
        }
      } else {
        totalSkipped++;
      }
    }
    if (changed) {
      await prop.save();
    }
  }

  // --- Blogs ---
  console.log("\n--- Blogs ---");
  const blogs = await Blog.find({ image: { $exists: true, $ne: "" } });
  for (const blog of blogs) {
    const blogImage = blog.image as string;
    if (blogImage.startsWith("data:image")) {
      const newUrl = await uploadBase64(
        blogImage,
        "blogs",
        `${blog.title || blog._id}`
      );
      if (newUrl) {
        blog.image = newUrl;
        await blog.save();
        totalMigrated++;
      } else {
        totalFailed++;
      }
    } else {
      totalSkipped++;
    }
  }

  // --- Partners ---
  console.log("\n--- Partners ---");
  const partners = await Partner.find({ logo: { $exists: true, $ne: "" } });
  for (const partner of partners) {
    const partnerLogo = partner.logo as string;
    if (partnerLogo.startsWith("data:image")) {
      const newUrl = await uploadBase64(
        partnerLogo,
        "partners",
        `${partner.name || partner._id}`
      );
      if (newUrl) {
        partner.logo = newUrl;
        await partner.save();
        totalMigrated++;
      } else {
        totalFailed++;
      }
    } else {
      totalSkipped++;
    }
  }

  console.log("\n--- Summary ---");
  console.log(`  Migrated: ${totalMigrated}`);
  console.log(`  Skipped (already URLs): ${totalSkipped}`);
  console.log(`  Failed: ${totalFailed}`);

  await mongoose.disconnect();
  console.log("\nDone.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
