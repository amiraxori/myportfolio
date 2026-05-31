'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { IServiceClient } from '@/lib/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<IServiceClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/admin/services')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => { setServices(Array.isArray(data) ? data : []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const deleteService = async (id: string) => {
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s._id !== id));
      setConfirmDelete(null);
      showToast('Service deleted', 'success');
    } else {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services</h1>
        <Link
          href="/admin/services/new"
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold text-sm"
        >
          Add Service
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-sm uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Timeline</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No services found.</td></tr>
            ) : (
              services.map((service) => (
                <tr key={service._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors text-sm">
                  <td className="px-6 py-4 font-medium">{service.name}</td>
                  <td className="px-6 py-4 font-mono text-neutral-500">NPR {service.startingPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-neutral-500">{service.timeline}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/services/${service._id}`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                      {confirmDelete === service._id ? (
                        <span className="flex items-center gap-1">
                          <span className="text-xs text-neutral-500">Sure?</span>
                          <button onClick={() => deleteService(service._id)} className="text-red-600 text-xs font-medium hover:underline">Yes</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-neutral-500 text-xs hover:underline">No</button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmDelete(service._id)} className="text-red-600 hover:underline text-sm">Delete</button>
                      )}
                    </div>
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
