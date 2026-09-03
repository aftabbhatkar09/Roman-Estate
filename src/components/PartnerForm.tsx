"use client";
import { useState, useEffect, startTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import SingleImageUpload from "@/components/SingleImageUpload";
import {
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useGetPartnerByIdQuery,
} from "@/lib/redux/slices/apiSlice";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PartnerForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditing = Boolean(id);

  const [createPartner] = useCreatePartnerMutation();
  const [updatePartner] = useUpdatePartnerMutation();

  const { data: existingPartner, isLoading: isFetching } =
    useGetPartnerByIdQuery(id, {
      skip: !isEditing,
    });

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    order: 0,
    active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && existingPartner) {
      startTransition(() => {
        setFormData({
          name: existingPartner.name || "",
          logo: existingPartner.logo || "",
          website: existingPartner.website || "",
          order: existingPartner.order || 0,
          active:
            existingPartner.active !== undefined
              ? existingPartner.active
              : true,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingPartner]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logo) {
      setError("Please upload a partner logo.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      if (isEditing) {
        await updatePartner({ id, data: formData }).unwrap();
        toast.success("Partner updated successfully");
      } else {
        await createPartner(formData).unwrap();
        toast.success("Partner created successfully");
      }
      router.push("/admin/partners");
      router.refresh();
    } catch (err: unknown) {
      console.error("Save failed:", err);
      const errorMessage =
        (err as { data?: { error?: string } })?.data?.error ||
        (err as Error)?.message ||
        "Failed to save partner";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing && isFetching) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading partner details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/partners"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Partner" : "Add New Partner"}
          </h2>
        </div>
        <button
          type="submit"
          form="partner-form"
          disabled={isLoading}
          className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {isLoading ? "Saving..." : "Save Partner"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form id="partner-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Partner Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="e.g. Godrej Properties"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <SingleImageUpload
                label="Partner Logo *"
                value={formData.logo}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, logo: url }))
                }
                previewClass="h-36"
                objectFit="object-contain"
                hint="For best results use a PNG with a transparent background."
                folder="partners"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sort Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500">
                Lower numbers appear first. Use 0 for default.
              </p>
            </div>

            <div className="space-y-2 flex items-center mt-8">
              <input
                type="checkbox"
                name="active"
                id="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 rounded mr-3 focus:ring-indigo-500"
              />
              <label
                htmlFor="active"
                className="text-sm font-medium text-gray-700"
              >
                Active (Visibile on frontend)
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
