"use client";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

const FIELD =
  "w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800 pr-12";
const LABEL =
  "text-xs font-bold text-gray-400 uppercase tracking-widest ml-1";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, next: false });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirmation don't match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to change password.");
      toast.success("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
        <KeyRound className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-800 font-medium leading-relaxed">
          Change the password you use to sign in to this admin panel. You&apos;ll
          need your current password to confirm.
        </p>
      </div>

      <div className="space-y-2">
        <label className={LABEL}>Current Password</label>
        <div className="relative">
          <input
            type={show.current ? "text" : "password"}
            required
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) => set("currentPassword", e.target.value)}
            className={FIELD}
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {show.current ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className={LABEL}>New Password</label>
        <div className="relative">
          <input
            type={show.next ? "text" : "password"}
            required
            minLength={6}
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(e) => set("newPassword", e.target.value)}
            className={FIELD}
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {show.next ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 ml-1">At least 6 characters.</p>
      </div>

      <div className="space-y-2">
        <label className={LABEL}>Confirm New Password</label>
        <input
          type={show.next ? "text" : "password"}
          required
          minLength={6}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => set("confirmPassword", e.target.value)}
          className={FIELD.replace(" pr-12", "")}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <KeyRound className="w-4 h-4" />
        )}
        {saving ? "Changing…" : "Change Password"}
      </button>
    </form>
  );
}
