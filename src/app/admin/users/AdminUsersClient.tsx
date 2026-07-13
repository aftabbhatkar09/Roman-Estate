"use client";
import { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  UserCog,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  X,
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  active: boolean;
  createdAt: string;
}

export default function AdminUsersClient({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync local state whenever the server re-fetches (e.g. after router.refresh())
  useEffect(() => {
    startTransition(() => setUsers(initialUsers));
  }, [initialUsers]);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    const userId = deleteModal.user._id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status}`);
      }
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setDeleteModal({ open: false, user: null });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user.";
      setDeleteModal({ open: false, user: null });
      showError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (user: User) => {
    setTogglingId(user._id);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, active: !u.active } : u)),
      );
      router.refresh();
    } catch (err: unknown) {
      showError(
        err instanceof Error ? err.message : "Failed to update user status.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => !deleting && setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title={deleteModal.user?.name ?? ""}
      />

      {/* Error banner */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
          <button
            onClick={() => setErrorMsg("")}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
          <p className="text-sm text-gray-500 mt-1">
            Only super admins can access this section.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                User
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Role
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Joined
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No users yet. Add your first user to get started.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === "super_admin"
                          ? "bg-[#800000]/10 text-[#800000]"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {user.role === "super_admin" ? (
                        <>
                          <ShieldCheck className="w-3 h-3" /> Super Admin
                        </>
                      ) : (
                        <>
                          <UserCog className="w-3 h-3" /> Admin
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={togglingId === user._id}
                      className="flex items-center gap-2 text-xs font-semibold disabled:opacity-40 transition-opacity"
                    >
                      {user.active ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-green-500" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <Link
                      href={`/admin/users/${user._id}`}
                      className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {user.role !== "super_admin" && (
                      <button
                        onClick={() => setDeleteModal({ open: true, user })}
                        className="inline-flex p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
