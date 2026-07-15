"use client";
import { useState } from "react";
import { Mail, Phone, Calendar, MessageSquare, Trash2 } from "lucide-react";
import {
  useUpdateInquiryStatusMutation,
  useDeleteInquiryMutation,
} from "@/lib/redux/slices/apiSlice";
import DeleteModal from "@/components/DeleteModal";

const STATUS_OPTIONS = ["New", "In Progress", "Resolved"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

const STATUS_STYLES: Record<Status, string> = {
  New: "bg-indigo-100 text-indigo-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Resolved: "bg-green-100 text-green-700",
};

const BORDER_STYLES: Record<Status, string> = {
  New: "bg-indigo-500",
  "In Progress": "bg-orange-500",
  Resolved: "bg-green-500",
};

export default function AdminInquiriesClient({
  initialInquiries,
}: {
  initialInquiries: any[];
}) {
  const [inquiries, setInquiries] = useState<any[]>(initialInquiries);
  const [updateStatus] = useUpdateInquiryStatusMutation();
  const [deleteInquiry] = useDeleteInquiryMutation();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    inquiry: any | null;
  }>({ open: false, inquiry: null });

  const handleStatusChange = async (id: string, newStatus: Status) => {
    setLoadingId(id);
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      setInquiries((prev) =>
        prev.map((inq) =>
          inq._id === id ? { ...inq, status: newStatus } : inq,
        ),
      );
    } catch {
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.inquiry) return;
    try {
      await deleteInquiry(deleteModal.inquiry._id).unwrap();
      setInquiries((prev) =>
        prev.filter((inq) => inq._id !== deleteModal.inquiry._id),
      );
      setDeleteModal({ open: false, inquiry: null });
    } catch {
      alert("Failed to delete inquiry");
    }
  };

  const counts = {
    New: inquiries.filter((i) => i.status === "New").length,
    "In Progress": inquiries.filter((i) => i.status === "In Progress").length,
    Resolved: inquiries.filter((i) => i.status === "Resolved").length,
  };

  return (
    <div className="space-y-8">
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, inquiry: null })}
        onConfirm={handleDelete}
        title={deleteModal.inquiry?.name || ""}
      />

      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500">
            Manage customer inquiries and messages.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <div
              key={s}
              className={`px-4 py-2 rounded-xl text-sm font-bold ${STATUS_STYLES[s]}`}
            >
              {s}: {counts[s]}
            </div>
          ))}
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border border-dashed border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No inquiries yet</h3>
          <p className="text-gray-500">
            New messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {inquiries.map((inquiry) => {
            const status: Status = inquiry.status || "New";
            return (
              <div
                key={inquiry._id}
                className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div
                  className={`absolute left-0 top-0 w-1.5 h-full ${BORDER_STYLES[status]}`}
                />

                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600 border border-indigo-100 text-lg">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {inquiry.name}
                        </h3>
                        <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                          {new Date(inquiry.createdAt).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                        <Mail className="w-4 h-4 mr-3 text-indigo-500" />
                        <span className="text-sm font-medium">
                          {inquiry.email}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                        <Phone className="w-4 h-4 mr-3 text-indigo-500" />
                        <span className="text-sm font-medium">
                          {inquiry.phone}
                        </span>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center">
                        <MessageSquare className="w-3 h-3 mr-2" /> Message
                      </p>
                      <p className="text-gray-700 leading-relaxed italic">
                        &ldquo;{inquiry.message}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-52 flex flex-col justify-between items-end gap-4">
                    <div
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[status]}`}
                    >
                      {status}
                    </div>

                    <div className="space-y-2 w-full">
                      {STATUS_OPTIONS.filter((s) => s !== status).map((s) => (
                        <button
                          key={s}
                          disabled={loadingId === inquiry._id}
                          onClick={() => handleStatusChange(inquiry._id, s)}
                          className="w-full bg-gray-100 text-gray-700 border border-gray-200 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors active:scale-95 disabled:opacity-50"
                        >
                          {loadingId === inquiry._id
                            ? "Updating..."
                            : `Mark ${s}`}
                        </button>
                      ))}
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="block w-full text-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white py-3 rounded-xl text-sm font-bold hover:from-[#1e293b] hover:to-[#0f172a] transition-all shadow-lg shadow-gray-900/10 active:scale-95"
                      >
                        Reply by Email
                      </a>
                      <button
                        onClick={() => setDeleteModal({ open: true, inquiry })}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
