import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import AdminPropertiesClient from "./AdminPropertiesClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

async function getProperties(page: number) {
  try {
    await connectDB();
    const [properties, total] = await Promise.all([
      Property.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Property.countDocuments({}),
    ]);
    return { properties: JSON.parse(JSON.stringify(properties)), total };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { properties: [], total: 0 };
  }
}

export default async function AdminProperties({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);
  const { properties, total } = await getProperties(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPropertiesClient
      initialProperties={properties}
      page={page}
      totalPages={totalPages}
    />
  );
}
