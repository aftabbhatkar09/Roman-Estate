"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const FIELD =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";
const CARD =
  "bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6";

export default function NewUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      toast.success("User created successfully");
      router.push("/admin/users");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create user";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
        </div>
        <button
          type="submit"
          form="user-form"
          disabled={saving}
          className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Save User"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form id="user-form" onSubmit={handleSubmit} className={CARD}>
        <div>
          <label className={LABEL}>Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="John Doe"
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="john@romanestate.com"
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>Password * (min 6 characters)</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              className={`${FIELD} pr-10`}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className={LABEL}>Role *</label>
          <select
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className={FIELD}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <p className="text-xs text-gray-400 mt-1.5">
            Super Admin can manage users. Admin can manage content only.
          </p>
        </div>
      </form>
    </div>
  );
}
