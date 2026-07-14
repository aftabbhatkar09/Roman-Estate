import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import AdminUsersClient from "./AdminUsersClient";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getUsers() {
  try {
    await connectDB();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    // Explicitly stringify _id so the client always receives a plain string
    return users.map((u) => ({ ...u, _id: String(u._id) }));
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const session = await getSession();
  if (session?.role !== "super_admin") redirect("/admin");

  const users = await getUsers();
  return <AdminUsersClient initialUsers={users} />;
}
