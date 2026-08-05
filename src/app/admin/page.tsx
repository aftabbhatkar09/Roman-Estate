import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Blog from "@/models/Blog";
import Inquiry from "@/models/Inquiry";
import { Home, FileText, MessageSquare } from "lucide-react";
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

interface RecentInquiry {
  _id: string;
  name: string;
  email: string;
  createdAt: string | Date;
}

interface RecentProperty {
  _id: string;
  title: string;
  location?: { area?: string };
  price: number;
  status: string;
}

export default async function AdminDashboard() {
  const data = await getStats();

  const stats = [
    {
      name: "Total Properties",
      value: data.propertyCount,
      icon: Home,
      href: "/admin/properties",
      color: "bg-blue-500",
    },
    {
      name: "Blog Posts",
      value: data.blogCount,
      icon: FileText,
      href: "/admin/blogs",
      color: "bg-purple-500",
    },
    {
      name: "Inquiries",
      value: data.inquiryCount,
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back to the Roman Estate admin panel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-all group"
            >
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} p-3 sm:p-4 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Inquiries</h3>
            <Link
              href="/admin/inquiries"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="p-4 sm:p-6">
            {data.recentInquiries.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No recent inquiries found.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentInquiries.map((inquiry: RecentInquiry) => (
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
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center">
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
          <div className="p-4 sm:p-6">
            {data.recentProperties.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No properties added yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentProperties.map((property: RecentProperty) => (
                  <li
                    key={property._id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {property.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {property.location?.area || ""} • ₹
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
