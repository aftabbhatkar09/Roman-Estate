import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import AdminInquiriesClient from "./AdminInquiriesClient";

export const dynamic = "force-dynamic";

async function getInquiries() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(inquiries));
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  return <AdminInquiriesClient initialInquiries={inquiries} />;
}
