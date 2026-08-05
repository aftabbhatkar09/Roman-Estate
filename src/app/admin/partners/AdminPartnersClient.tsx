"use client";
import { useState } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDeletePartnerMutation } from "@/lib/redux/slices/apiSlice";
import DeleteModal from "@/components/DeleteModal";

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  website?: string;
  order?: number;
  active?: boolean;
}

interface AdminPartnersClientProps {
  initialPartners: Partner[];
}

export default function AdminPartnersClient({
  initialPartners,
}: AdminPartnersClientProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [deletePartner] = useDeletePartnerMutation();

  const openDeleteModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPartner) return;

    try {
      await deletePartner(selectedPartner._id).unwrap();
      setPartners(partners.filter((p) => p._id !== selectedPartner._id));
      setIsModalOpen(false);
      setSelectedPartner(null);
    } catch (error) {
      console.error("Error deleting partner:", error);
      alert("Failed to delete partner");
    }
  };

  return (
    <div className="space-y-6">
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={selectedPartner?.name || ""}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Partners</h2>
        <Link
          href="/admin/partners/new"
          className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Partner
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-125">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Partner Details
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Order
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
            {partners.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-gray-500 italic"
                  colSpan={4}
                >
                  No partners found. Add your first partner!
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr
                  key={partner._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded p-1">
                      <ImageWithFallback
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {partner.name}
                      </div>
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-500 hover:underline"
                      >
                        {partner.website}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {partner.order || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        partner.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {partner.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/partners/${partner._id}`}
                      className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(partner)}
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
    </div>
  );
}
