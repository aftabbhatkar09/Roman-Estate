import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import AdminPartnersClient from "./AdminPartnersClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

async function getPartners(page: number) {
  try {
    await connectDB();
    const [partners, total] = await Promise.all([
      Partner.find({})
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Partner.countDocuments({}),
    ]);
    return { partners: JSON.parse(JSON.stringify(partners)), total };
  } catch (error) {
    console.error("Error fetching partners:", error);
    return { partners: [], total: 0 };
  }
}

export default async function AdminPartners({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);
  const { partners, total } = await getPartners(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPartnersClient
      initialPartners={partners}
      page={page}
      totalPages={totalPages}
    />
  );
}
