import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import AdminInquiriesClient from "./AdminInquiriesClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

async function getInquiries(page: number) {
  try {
    await connectDB();
    const [inquiries, total, newCount, inProgressCount, resolvedCount] =
      await Promise.all([
        Inquiry.find({})
          .sort({ createdAt: -1 })
          .skip((page - 1) * PAGE_SIZE)
          .limit(PAGE_SIZE)
          .lean(),
        Inquiry.countDocuments({}),
        Inquiry.countDocuments({ status: "New" }),
        Inquiry.countDocuments({ status: "In Progress" }),
        Inquiry.countDocuments({ status: "Resolved" }),
      ]);
    return {
      inquiries: JSON.parse(JSON.stringify(inquiries)),
      total,
      statusCounts: {
        New: newCount,
        "In Progress": inProgressCount,
        Resolved: resolvedCount,
      },
    };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return {
      inquiries: [],
      total: 0,
      statusCounts: { New: 0, "In Progress": 0, Resolved: 0 },
    };
  }
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);
  const { inquiries, total, statusCounts } = await getInquiries(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminInquiriesClient
      initialInquiries={inquiries}
      page={page}
      totalPages={totalPages}
      statusCounts={statusCounts}
    />
  );
}
