'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useDeleteBlogMutation } from '@/lib/redux/slices/apiSlice';
import DeleteModal from '@/components/DeleteModal';

interface AdminBlogsClientProps {
  initialBlogs: any[];
}

export default function AdminBlogsClient({ initialBlogs }: AdminBlogsClientProps) {
  const [blogs, setBlogs] = useState<any[]>(initialBlogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [deleteBlog] = useDeleteBlogMutation();

  const openDeleteModal = (blog: any) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;

    try {
      await deleteBlog(selectedBlog._id).unwrap();
      setBlogs(blogs.filter(b => b._id !== selectedBlog._id));
      setIsModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  return (
    <div className="space-y-6">
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={selectedBlog?.title || ''}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Blogs</h2>
        <Link
          href="/admin/blogs/new"
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl flex items-center hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Post Info</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Author</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500 italic" colSpan={5}>
                  No blog posts found. Share your first insight!
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{blog.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{blog.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {blog.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      blog.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/blogs/${blog._id}`}
                      className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(blog)}
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
