'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { ITestimonialClient } from '@/lib/types';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<ITestimonialClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setIsLoading(false);
      });
  }, []);

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    setTestimonials(testimonials.filter((t) => t._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold text-sm"
        >
          Add Testimonial
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-sm uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : testimonials.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No testimonials found.</td></tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors text-sm">
                  <td className="px-6 py-4 font-medium">{testimonial.author}</td>
                  <td className="px-6 py-4 text-neutral-500">{testimonial.role}</td>
                  <td className="px-6 py-4 text-neutral-500">{testimonial.rating}/5</td>
                  <td className="px-6 py-4 space-x-4">
                    <Link href={`/admin/testimonials/${testimonial._id}`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => deleteTestimonial(testimonial._id)} className="text-red-600 hover:underline">Delete</button>
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
