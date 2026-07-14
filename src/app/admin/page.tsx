import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Blog from "@/models/Blog";
import Inquiry from "@/models/Inquiry";
import { Home, FileText, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    await connectDB();
    const [propertyCount, blogCount, inquiryCount] = await Promise.all([
      Property.countDocuments(),
      Blog.countDocuments(),
      Inquiry.countDocuments(),
    ]);

    const recentInquiries = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const recentProperties = await Property.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      propertyCount,
      blogCount,
      inquiryCount,
      recentInquiries: JSON.parse(JSON.stringify(recentInquiries)),
      recentProperties: JSON.parse(JSON.stringify(recentProperties)),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      propertyCount: 0,
      blogCount: 0,
      inquiryCount: 0,
      recentInquiries: [],
      recentProperties: [],
    };
  }
}

export default async function AdminDashboard() {
  const data = await getStats();

  const stats = [
    {
      name: "Total Properties",
      value: data.propertyCount,
      icon: Home,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      name: "Total Blogs",
      value: data.blogCount,
      icon: FileText,
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      name: "New Inquiries",
      value: data.inquiryCount,
      icon: MessageSquare,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      name: "Total Visits",
      value: "0",
      icon: TrendingUp,
      gradient: "from-indigo-400 to-cyan-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white mr-4 shadow-lg shadow-indigo-500/10`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Inquiries</h3>
            <Link
              href="/admin/inquiries"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            {data.recentInquiries.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No recent inquiries found.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentInquiries.map((inquiry: any) => (
                  <li key={inquiry._id} className="py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {inquiry.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {inquiry.email} •{" "}
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              Recently Added Properties
            </h3>
            <Link
              href="/admin/properties"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            {data.recentProperties.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No properties added yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentProperties.map((property: any) => (
                  <li
                    key={property._id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {property.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {property.location.area} • ₹
                        {property.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 uppercase">
                      {property.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
