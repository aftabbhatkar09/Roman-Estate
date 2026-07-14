"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";

// High-quality real estate fallback images from Unsplash
const FALLBACKS = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=85&w=1600",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=85&w=1600",
  "https://images.unsplash.com/photo-1582407947304-fd86f28f958f?auto=format&fit=crop&q=85&w=1600",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1600",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1600",
];

// Pick a consistent fallback based on the original src string
function pickFallback(src: string): string {
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = (hash * 31 + src.charCodeAt(i)) & 0xffffffff;
  }
  return FALLBACKS[Math.abs(hash) % FALLBACKS.length];
}

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallback?: string;
}

export default function ImageWithFallback({
  src,
  fallback,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const resolvedSrc =
    src && src.trim() !== ""
      ? src
      : fallback ?? pickFallback(alt ?? "default");

  const [imgSrc, setImgSrc] = useState(resolvedSrc);
  const [errored, setErrored] = useState(false);

  function handleError() {
    if (!errored) {
      setErrored(true);
      setImgSrc(fallback ?? pickFallback(resolvedSrc));
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
