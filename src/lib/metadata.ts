import type { Metadata } from "next";

export const SITE_NAME = "Roman Estate";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://roman-estate.vercel.app";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Absolute image URL(s) to use for this page's share preview. Falls back
   * to the site-wide default (see app/opengraph-image.tsx) when omitted. */
  images?: string[];
  path?: string;
}

/**
 * Builds a full title/description/OG/Twitter metadata object so every page
 * gets a correct social share preview (WhatsApp, Facebook, X, etc.) instead
 * of relying on ambiguous metadata inheritance between route segments.
 */
export function buildMetadata({
  title,
  description,
  images,
  path = "",
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  // A page-level `openGraph` object replaces (rather than merges with) the
  // site-wide default opengraph-image, so every page must supply an image
  // explicitly — falling back to the shared branded default when the page
  // has no photo of its own (e.g. a property or blog post image).
  const resolvedImages = images?.length ? images : [`${SITE_URL}/opengraph-image`];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: resolvedImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolvedImages,
    },
  };
}
