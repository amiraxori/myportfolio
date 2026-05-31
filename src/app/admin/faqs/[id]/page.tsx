'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faqSchema } from '@/lib/validation/schemas';

export default function FaqFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      order: 0,
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/faqs/${id}`)
        .then((res) => res.json())
        .then((data) => {
          reset(data);
          setIsLoading(false);
        });
    }
  }, [id, isNew, reset]);

  const onSubmit = async (data: any) => {
    const url = isNew ? '/api/admin/faqs' : `/api/admin/faqs/${id}`;
    const method = isNew ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/admin/faqs');
      router.refresh();
    } else {
      alert('Failed to save FAQ');
    }
  };

  if (isLoading) return <div>Loading form...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">{isNew ? 'New FAQ' : 'Edit FAQ'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <input {...register('question')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Answer</label>
          <textarea {...register('answer')} rows={5} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input type="number" {...register('order', { valueAsNumber: true })} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold">
            Save FAQ
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-neutral-200 rounded-lg font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
