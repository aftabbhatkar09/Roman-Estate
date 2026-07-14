"use client";
import { useState, useEffect, use, startTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import SingleImageUpload from "@/components/SingleImageUpload";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "@/lib/redux/slices/apiSlice";

const FIELD_CLASS =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm";
const LABEL_CLASS = "block text-sm font-semibold text-gray-700 mb-1.5";
const SECTION_CLASS =
  "bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6";

export default function EditBlog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { data: blog, isLoading: loading } = useGetBlogByIdQuery(id);
  const [updateBlog, { isLoading: saving }] = useUpdateBlogMutation();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    excerpt: "",
    image: "",
    tags: "",
    published: false,
  });

  useEffect(() => {
    if (blog) {
      startTransition(() =>
        setFormData({
          title: blog.title,
          content: blog.content,
          author: blog.author,
          excerpt: blog.excerpt,
          image: blog.image || "",
          tags: blog.tags.join(", "),
          published: blog.published,
        }),
      );
    }
  }, [blog]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      await updateBlog({ id, data: dataToSubmit }).unwrap();
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err?.data?.error || "Failed to update blog post.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Blog Post</h2>
            <p className="text-sm text-gray-500 truncate max-w-xs">
              {formData.title}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 font-medium"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? "Saving..." : "Update Post"}
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
                className={FIELD_CLASS}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
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
                className={FIELD_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <SingleImageUpload
                label="Cover Image"
                value={formData.image}
                onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                hint="This image appears at the top of the blog post and in the listing grid."
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
