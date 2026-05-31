'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Globe, Lock } from 'lucide-react';

export default function BlogListing() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link 
          href="/admin/blog/new" 
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Plus size={20} /> New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm">Title</th>
              <th className="px-6 py-4 font-semibold text-sm">Status</th>
              <th className="px-6 py-4 font-semibold text-sm">Published At</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs text-neutral-500">{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  {post.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <Globe size={12} /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                      <Lock size={12} /> Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/admin/blog/${post._id}`}
                      className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => deletePost(post._id)}
                      className="p-2 text-neutral-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  No blog posts found. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
