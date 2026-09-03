"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeletePropertyMutation } from "@/lib/redux/slices/apiSlice";
import DeleteModal from "@/components/DeleteModal";
import Pagination from "@/components/admin/Pagination";

interface Property {
  _id: string;
  title: string;
  type: string;
  status: string;
  price: number;
  location: { address?: string; area: string; city: string };
  bedrooms: number;
  createdAt?: string | Date;
}

interface AdminPropertiesClientProps {
  initialProperties: Property[];
  page: number;
  totalPages: number;
}

export default function AdminPropertiesClient({
  initialProperties,
  page,
  totalPages,
}: AdminPropertiesClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [deleteProperty] = useDeletePropertyMutation();

  const openDeleteModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;

    try {
      await deleteProperty(selectedProperty._id).unwrap();
      setProperties(properties.filter((p) => p._id !== selectedProperty._id));
      setIsModalOpen(false);
      setSelectedProperty(null);
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  return (
    <div className="space-y-6">
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={selectedProperty?.title || ""}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Properties</h2>
        <Link
          href="/admin/properties/new"
          className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8 text-center text-gray-500 italic">
            No properties found. Start by adding your first listing!
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900">
                    {property.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {property.type} • {property.bedrooms} BHK
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {property.location.area}, {property.location.city}
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                    property.status === "For Sale"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {property.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-indigo-600">
                  ₹{property.price.toLocaleString("en-IN")}
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/properties/${property._id}`}
                    className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openDeleteModal(property)}
                    className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-150">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Property
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Location
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Price
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-gray-500 italic"
                  colSpan={5}
                >
                  No properties found. Start by adding your first listing!
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr
                  key={property._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {property.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.type} • {property.bedrooms} BHK
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {property.location.area}, {property.location.city}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                    ₹{property.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.status === "For Sale"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/properties/${property._id}`}
                      className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(property)}
                      className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/properties" />
    </div>
  );
}
