'use client';

import { useState, useEffect } from 'react';
import { ILeadClient } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-neutral-100 text-neutral-600',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<ILeadClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ILeadClient | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((res) => res.json())
      .then((data) => { setLeads(data); setIsLoading(false); });
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setLeads((prev) => prev.map((l) => l._id === id ? { ...l, status: newStatus as ILeadClient['status'] } : l));
      if (selectedLead?._id === id) setSelectedLead((prev) => prev ? { ...prev, status: newStatus as ILeadClient['status'] } : prev);
    }
  };

  const deleteLead = async (id: string) => {
    const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l._id !== id));
      if (selectedLead?._id === id) setSelectedLead(null);
      setConfirmDelete(null);
      showToast('Lead deleted', 'success');
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

      <h1 className="text-2xl font-bold">Incoming Leads</h1>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-sm uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Package</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No leads found.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors text-sm">
                  <td className="px-6 py-4 text-neutral-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4 uppercase text-xs font-bold">{lead.package || 'Custom'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[lead.status] ?? ''}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <button onClick={() => setSelectedLead(lead)} className="text-blue-600 hover:underline text-xs">
                        View
                      </button>
                      <select
                        className="bg-transparent text-xs border rounded p-1"
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                      {confirmDelete === lead._id ? (
                        <span className="flex items-center gap-1">
                          <span className="text-xs text-neutral-500">Sure?</span>
                          <button onClick={() => deleteLead(lead._id)} className="text-red-600 text-xs font-medium hover:underline">Yes</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-neutral-500 text-xs hover:underline">No</button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmDelete(lead._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelectedLead(null)} />
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto p-8 space-y-5">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">Lead Detail</h2>
              <button onClick={() => setSelectedLead(null)} className="text-2xl text-neutral-400 hover:text-black dark:hover:text-white leading-none">×</button>
            </div>
            <div className="space-y-4 text-sm">
              <DetailRow label="Name" value={selectedLead.name} />
              <DetailRow label="Email" value={selectedLead.email} />
              {selectedLead.phone && <DetailRow label="Phone" value={selectedLead.phone} />}
              {selectedLead.company && <DetailRow label="Company" value={selectedLead.company} />}
              {selectedLead.budget && <DetailRow label="Budget" value={selectedLead.budget} />}
              {selectedLead.package && <DetailRow label="Package" value={selectedLead.package.toUpperCase()} />}
              <div>
                <span className="text-neutral-500 font-medium block mb-1">Message</span>
                <p className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg leading-relaxed">{selectedLead.message}</p>
              </div>
              {selectedLead.source && <DetailRow label="Source" value={selectedLead.source} />}
              <div className="flex gap-3">
                <span className="text-neutral-500 font-medium w-24 shrink-0">Status</span>
                <select
                  className="bg-transparent text-xs border rounded p-1"
                  value={selectedLead.status}
                  onChange={(e) => updateStatus(selectedLead._id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <DetailRow label="Received" value={new Date(selectedLead.createdAt).toLocaleString()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-neutral-500 font-medium w-24 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
