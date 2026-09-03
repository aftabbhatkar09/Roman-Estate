import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import AdminUsersClient from "./AdminUsersClient";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

async function getUsers(page: number) {
  try {
    await connectDB();
    const [users, total] = await Promise.all([
      User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      User.countDocuments({}),
    ]);
    // Explicitly stringify _id so the client always receives a plain string
    return { users: users.map((u) => ({ ...u, _id: String(u._id) })), total };
  } catch {
    return { users: [], total: 0 };
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (session?.role !== "super_admin") redirect("/admin");

  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);
  const { users, total } = await getUsers(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminUsersClient initialUsers={users} page={page} totalPages={totalPages} />
  );
}
