"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
}

export default function ImageWithFallback({
  src,
  alt,
  fill,
  ...props
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  // If there's no src or it's empty, we treat it as errored right away
  const hasValidSrc = src && src.trim() !== "";

  if (errored || !hasValidSrc) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${fill ? "absolute inset-0" : "w-full h-full"} ${props.className || ""}`}
        style={props.style}
      >
        <ImageOff className="w-8 h-8 mb-2 opacity-40" />
        <span className="text-xs font-bold uppercase tracking-wider opacity-60">No Image Found</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      src={src!}
      alt={alt || "Image"}
      quality={85}
      onError={() => setErrored(true)}
    />
  );
}
