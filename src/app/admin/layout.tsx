import { getSession } from "@/lib/session";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // No session = login page or unauthenticated — render bare (no sidebar)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminLayoutClient role={session.role} email={session.email}>
      {children}
    </AdminLayoutClient>
  );
}
