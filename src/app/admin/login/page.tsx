"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Hard navigate so the admin layout mounts completely fresh
      window.location.href = from;
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
          Email Address
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="admin@romanestate.com"
          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000] transition-all text-gray-900 font-medium placeholder:text-gray-400"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            className="w-full px-4 py-3.5 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000] transition-all text-gray-900 font-medium placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#800000] hover:bg-red-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#800000]/20 active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Signing In…
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" /> Sign In to Admin
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-[#1a0000] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#800000]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#800000]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="flex flex-col items-center leading-none">
              <span
                className="text-4xl font-black tracking-tight text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Roman<span className="text-[#c5a059]">.</span>
              </span>
              <span className="text-[11px] font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">
                Estate
              </span>
            </div>
          </Link>
          <p className="text-gray-500 text-sm font-medium mt-4">
            Admin Panel — Restricted Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">
                  Admin Sign In
                </h1>
                <p className="text-gray-400 text-xs font-medium">
                  Roman Estate Management System
                </p>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="px-8 py-8">
            <Suspense
              fallback={
                <div className="h-48 animate-pulse bg-gray-100 rounded-xl" />
              }
            >
              <LoginForm />
            </Suspense>
          </div>

          {/* Card footer */}
          <div className="px-8 pb-8">
            <div className="border-t border-gray-100 pt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors"
              >
                ← Back to public website
              </Link>
            </div>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-gray-600 text-xs font-medium mt-6">
          🔒 Secured with encrypted session tokens
        </p>
      </div>
    </div>
  );
}
