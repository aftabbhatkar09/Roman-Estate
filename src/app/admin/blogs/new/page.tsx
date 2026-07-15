"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import SingleImageUpload from "@/components/SingleImageUpload";
import { useCreateBlogMutation } from "@/lib/redux/slices/apiSlice";

const FIELD_CLASS =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm";
const LABEL_CLASS = "block text-sm font-semibold text-gray-700 mb-1.5";
const SECTION_CLASS =
  "bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6";

export default function NewBlog() {
  const router = useRouter();
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "Roman Estate",
    excerpt: "",
    image: "",
    tags: "",
    published: true,
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
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await createBlog(dataToSubmit).unwrap();
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      setError(
        err?.data?.error ||
          "Failed to create blog post. Please check all fields.",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 font-medium"
        >
          <Save className="w-5 h-5 mr-2" />
          {isLoading ? "Publishing..." : "Publish Post"}
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
            Post Details
          </h3>
          <div className="space-y-5">
            <div>
              <label className={LABEL_CLASS}>Post Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 5 Tips for First-Time Home Buyers in Mumbai"
                className={FIELD_CLASS}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>
                Excerpt{" "}
                <span className="text-gray-400 font-normal">
                  (short summary shown in listings)
                </span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="A brief overview to entice readers..."
                className={FIELD_CLASS}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={14}
                placeholder="Write your full blog content here. Each new line will become a new paragraph."
                className={`${FIELD_CLASS} font-mono`}
                required
              />
            </div>
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <h3 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100">
            Meta & Publishing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={LABEL_CLASS}>Author Name *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={FIELD_CLASS}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>
                Tags{" "}
                <span className="text-gray-400 font-normal">
                  (comma-separated)
                </span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Real Estate, Mumbai, Investment Tips"
                className={FIELD_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <SingleImageUpload
                label="Cover Image"
                value={formData.image}
                onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                hint="This image appears at the top of the blog post and in the listing grid."
                folder="blogs"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    published: e.target.checked,
                  }))
                }
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="published"
                className="text-sm font-semibold text-gray-700"
              >
                Published{" "}
                <span className="text-gray-400 font-normal">
                  (uncheck to save as draft)
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
