'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema } from '@/lib/validation/schemas';

export default function ServiceFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!isNew);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [upgradePathsInput, setUpgradePathsInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      deliverables: [] as string[],
      upgradePaths: [] as string[],
      currency: 'NPR',
      order: 0,
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/services/${id}`)
        .then((res) => res.json())
        .then((data) => {
          reset(data);
          setDeliverablesInput((data.deliverables || []).join(', '));
          setUpgradePathsInput((data.upgradePaths || []).join(', '));
          setIsLoading(false);
        });
    }
  }, [id, isNew, reset]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (data: any) => {
    const url = isNew ? '/api/admin/services' : `/api/admin/services/${id}`;
    const method = isNew ? 'POST' : 'PATCH';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('Service saved!', 'success');
        setTimeout(() => { router.push('/admin/services'); router.refresh(); }, 800);
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  if (isLoading) return <div>Loading form...</div>;

  return (
    <div className="max-w-4xl">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-8">{isNew ? 'New Service' : 'Edit Service'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input {...register('name')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" placeholder="Static Site" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <select {...register('slug')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent">
              <option value="">Select slug</option>
              <option value="static">static</option>
              <option value="dynamic-cms">dynamic-cms</option>
              <option value="ecommerce">ecommerce</option>
            </select>
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message as string}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <input {...register('tagline')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          {errors.tagline && <p className="text-red-500 text-xs mt-1">{errors.tagline.message as string}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Starting Price</label>
            <input type="number" {...register('startingPrice', { valueAsNumber: true })} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
            {errors.startingPrice && <p className="text-red-500 text-xs mt-1">{errors.startingPrice.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input {...register('currency')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" placeholder="NPR" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timeline</label>
            <input {...register('timeline')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" placeholder="1-2 Weeks" />
            {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline.message as string}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Revisions</label>
          <input {...register('revisions')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" placeholder="e.g. 2 rounds of revisions" />
          {errors.revisions && <p className="text-red-500 text-xs mt-1">{errors.revisions.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deliverables <span className="text-neutral-400 font-normal">(comma separated)</span></label>
          <input
            type="text"
            value={deliverablesInput}
            className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
            placeholder="Next.js, Tailwind, SEO"
            onChange={(e) => {
              setDeliverablesInput(e.target.value);
              setValue('deliverables', e.target.value.split(',').map((s) => s.trim()).filter(Boolean));
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upgrade Paths <span className="text-neutral-400 font-normal">(comma separated)</span></label>
          <input
            type="text"
            value={upgradePathsInput}
            className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
            placeholder="Dynamic CMS, Ecommerce"
            onChange={(e) => {
              setUpgradePathsInput(e.target.value);
              setValue('upgradePaths', e.target.value.split(',').map((s) => s.trim()).filter(Boolean));
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input type="number" {...register('order', { valueAsNumber: true })} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Service'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-neutral-200 rounded-lg font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
