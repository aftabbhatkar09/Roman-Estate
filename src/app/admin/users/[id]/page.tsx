"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from "lucide-react";

const FIELD = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";
const CARD  = "bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin", active: true });

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({ name: data.name, email: data.email, password: "", role: data.role, active: data.active });
        setLoading(false);
      })
      .catch(() => { setError("Failed to load user."); setLoading(false); });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body: Record<string, string | boolean> = { name: form.name, email: form.email, role: form.role, active: form.active };
      if (form.password) body.password = form.password;
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      router.push("/admin/users");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/users" className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
            <p className="text-sm text-gray-500 truncate max-w-xs">{form.email}</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={saving}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Update User"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
      )}

      <form onSubmit={handleSubmit} className={CARD}>
        <div>
          <label className={LABEL}>Full Name *</label>
          <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Email Address *</label>
          <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={form.password}
              onChange={(e) => set("password", e.target.value)} placeholder="••••••••"
              className={`${FIELD} pr-10`} minLength={6} />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className={LABEL}>Role *</label>
          <select value={form.role} onChange={(e) => set("role", e.target.value)} className={FIELD}>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="active" checked={form.active}
            onChange={(e) => set("active", e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <label htmlFor="active" className="text-sm font-semibold text-gray-700">
            Active <span className="text-gray-400 font-normal">(inactive users cannot log in)</span>
          </label>
        </div>
      </form>
    </div>
  );
}
