"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  Link as LinkIcon,
  Trash2,
  Loader2,
  Plus,
  X,
  Star,
} from "lucide-react";

interface ImageUrlManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUrlManager({
  images,
  onChange,
}: ImageUrlManagerProps) {
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      const body = new FormData();
      files.forEach((f) => body.append("files", f));

      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Upload failed");

      onChange([...images, ...(json.urls as string[])]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images],
  );

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrlError("URL must start with http:// or https://");
      return;
    }
    if (images.includes(url)) {
      setUrlError("This URL is already in the list.");
      return;
    }
    onChange([...images, url]);
    setUrlInput("");
    setUrlError("");
  };

  const removeImage = (idx: number) =>
    onChange(images.filter((_, i) => i !== idx));

  const moveToFirst = (idx: number) => {
    const copy = [...images];
    const [item] = copy.splice(idx, 1);
    onChange([item, ...copy]);
  };

  return (
    <div className="space-y-5">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
            : "border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-sm font-semibold text-indigo-600">
              Uploading images…
            </p>
          </div>
        ) : isDragging ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-base font-bold text-indigo-600">
              Drop images here
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                Drag & drop images here
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WebP, GIF — up to 10 MB each
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-500/20"
            >
              <Upload className="w-4 h-4" />
              Choose Files from Device
            </button>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          <X className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => {
            setShowUrlInput((v) => !v);
            setUrlError("");
          }}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlInput ? "Hide URL input" : "Or add image by URL instead"}
        </button>

        {showUrlInput && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addUrl();
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addUrl}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {urlError && (
              <p className="text-red-500 text-xs font-medium">{urlError}</p>
            )}
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">
              {images.length} image{images.length !== 1 ? "s" : ""} added
            </p>
            <p className="text-xs text-gray-400">
              Hover over an image to remove or set as primary
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="relative group rounded-xl overflow-hidden border-2 bg-gray-100 aspect-video transition-all duration-200 hover:shadow-lg"
                style={{ borderColor: idx === 0 ? "#6366f1" : "transparent" }}
              >
                <Image
                  src={url}
                  alt={`Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    el.parentElement!.classList.add("bg-gray-200");
                  }}
                />

                {idx === 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Star className="w-2.5 h-2.5 fill-current" /> Primary
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => moveToFirst(idx)}
                      title="Set as primary"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors shadow-lg"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    title="Remove"
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors shadow-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-indigo-500"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">Add More</span>
            </button>
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Star className="w-3 h-3 text-indigo-500 fill-current" />
            The first (indigo-bordered) image is the primary display image. Hover
            to change.
          </p>
        </div>
      )}
    </div>
  );
}
