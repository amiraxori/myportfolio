'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testimonialSchema } from '@/lib/validation/schemas';
import ImageUploader from '@/components/admin/ImageUploader';

export default function TestimonialFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      order: 0,
      rating: 5,
    },
  });

  const avatar = watch('avatar');

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/testimonials/${id}`)
        .then((res) => res.json())
        .then((data) => {
          reset(data);
          setIsLoading(false);
        });
    }
  }, [id, isNew, reset]);

  const onSubmit = async (data: any) => {
    const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${id}`;
    const method = isNew ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/admin/testimonials');
      router.refresh();
    } else {
      alert('Failed to save testimonial');
    }
  };

  if (isLoading) return <div>Loading form...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">{isNew ? 'New Testimonial' : 'Edit Testimonial'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Author Name</label>
            <input {...register('author')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role / Job Title</label>
            <input {...register('role')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" placeholder="CEO, Marketing Manager" />
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message as string}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company (Optional)</label>
          <input {...register('company')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quote</label>
          <textarea {...register('quote')} rows={4} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          {errors.quote && <p className="text-red-500 text-xs mt-1">{errors.quote.message as string}</p>}
        </div>

        <ImageUploader 
          label="Avatar"
          currentImage={avatar}
          onUpload={(img) => setValue('avatar', img)}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <input type="number" min="1" max="5" {...register('rating', { valueAsNumber: true })} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input type="number" {...register('order', { valueAsNumber: true })} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold">
            Save Testimonial
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-neutral-200 rounded-lg font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
