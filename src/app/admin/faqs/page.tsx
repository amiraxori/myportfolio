'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { IFaqClient } from '@/lib/types';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<IFaqClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/faqs')
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data);
        setIsLoading(false);
      });
  }, []);

  const deleteFaq = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
    setFaqs(faqs.filter((f) => f._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">FAQs</h1>
        <Link
          href="/admin/faqs/new"
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold text-sm"
        >
          Add FAQ
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-sm uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Question</th>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : faqs.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-neutral-500">No FAQs found.</td></tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors text-sm">
                  <td className="px-6 py-4 font-medium">{faq.question}</td>
                  <td className="px-6 py-4 text-neutral-500">{faq.order}</td>
                  <td className="px-6 py-4 space-x-4">
                    <Link href={`/admin/faqs/${faq._id}`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => deleteFaq(faq._id)} className="text-red-600 hover:underline">Delete</button>
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
