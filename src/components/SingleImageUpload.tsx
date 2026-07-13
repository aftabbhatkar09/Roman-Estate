"use client";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  /** aspect-ratio class for the preview — default "aspect-video" */
  previewClass?: string;
  /** object-fit for the preview image — default "object-cover" */
  objectFit?: "object-cover" | "object-contain";
}

export default function SingleImageUpload({
  value,
  onChange,
  label,
  hint,
  previewClass = "aspect-video",
  objectFit = "object-cover",
}: SingleImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // ── Upload ──────────────────────────────────────────────────────────────────
  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.urls[0] as string);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  // ── Drag & drop ─────────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── URL input ────────────────────────────────────────────────────────────────
  const applyUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onChange(url);
    setUrlInput("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-semibold text-gray-700">{label}</p>
      )}

      {value ? (
        /* ── Preview ── */
        <div className={`relative w-full ${previewClass} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group`}>
          <Image
            src={value}
            alt="Preview"
            fill
            className={`${objectFit} transition-opacity`}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.01]"
              : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
              <p className="text-sm font-semibold text-blue-600">Uploading…</p>
            </div>
          ) : isDragging ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 pointer-events-none">
              <Upload className="w-9 h-9 text-blue-500" />
              <p className="text-sm font-bold text-blue-600">Drop image here</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-sm font-semibold text-gray-700">
                  Drag & drop or{" "}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-blue-600 hover:underline"
                  >
                    choose from device
                  </button>
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP — up to 10 MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Upload error */}
      {uploadError && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" /> {uploadError}
        </p>
      )}

      {/* URL toggle */}
      <div>
        <button
          type="button"
          onClick={() => { setShowUrlInput((v) => !v); setUploadError(""); }}
          className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1.5"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? "Hide URL input" : "Or paste an image URL instead"}
        </button>

        {showUrlInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={applyUrl}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
