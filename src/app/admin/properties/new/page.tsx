"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useCreatePropertyMutation } from "@/lib/redux/slices/apiSlice";
import ImageUrlManager from "@/components/ImageUrlManager";

const FIELD_CLASS =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm";
const LABEL_CLASS = "block text-sm font-semibold text-gray-700 mb-1.5";
const SECTION_CLASS =
  "bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6";

export default function NewProperty() {
  const router = useRouter();
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    area: "",
    city: "Mumbai",
    type: "Apartment",
    status: "For Sale",
    bedrooms: "",
    bathrooms: "",
    size: "",
    amenities: "",
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        size: Number(formData.size),
        location: {
          address: formData.address,
          area: formData.area,
          city: formData.city,
        },
        amenities: formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        images,
      };
      await createProperty(dataToSubmit).unwrap();
      router.push("/admin/properties");
      router.refresh();
    } catch (err: unknown) {
      setError(
        (err as { data?: { error?: string } })?.data?.error ||
          "Failed to create property. Please check all fields.",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Add New Property</h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 font-medium"
        >
          <Save className="w-5 h-5 mr-2" />
          {isLoading ? "Saving..." : "Save Property"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={SECTION_CLASS}>
          <h3 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={LABEL_CLASS}>Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 3 BHK Luxury Apartment in South Mumbai"
                className={FIELD_CLASS}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLASS}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={FIELD_CLASS}
                required
                placeholder="Describe the property, its highlights, and what makes it special..."
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={FIELD_CLASS}
                required
                placeholder="e.g. 15000000"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Property Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={FIELD_CLASS}
              >
                <option>Apartment</option>
                <option>Villa</option>
                <option>Commercial</option>
                <option>Plot</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>Listing Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={FIELD_CLASS}
              >
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="featured"
                className="text-sm font-semibold text-gray-700"
              >
                Mark as Featured{" "}
                <span className="text-gray-400 font-normal">
                  (appears on homepage)
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <h3 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100">
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={LABEL_CLASS}>Full Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={FIELD_CLASS}
                required
                placeholder="e.g. 12, Marine Lines, Near Charni Road Station"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Area / Locality *</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Bandra West"
                className={FIELD_CLASS}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={FIELD_CLASS}
                required
              />
            </div>
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <h3 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100">
            Features & Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={LABEL_CLASS}>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className={FIELD_CLASS}
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className={FIELD_CLASS}
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Size (Sq Ft) *</label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className={FIELD_CLASS}
                required
                placeholder="e.g. 1200"
              />
            </div>
            <div className="md:col-span-3">
              <label className={LABEL_CLASS}>
                Amenities{" "}
                <span className="text-gray-400 font-normal">
                  (comma-separated)
                </span>
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="Parking, Swimming Pool, Gym, Security, Power Backup, Club House"
                className={FIELD_CLASS}
              />
            </div>
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <h3 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100">
            Property Images
          </h3>
          <p className="text-sm text-gray-500">
            Add image URLs from any hosting service (e.g. Unsplash, Cloudinary,
            etc.)
          </p>
          <ImageUrlManager images={images} onChange={setImages} />
        </div>
      </form>
    </div>
  );
}
