'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostSchema } from '@/lib/validation/schemas';
import ImageUploader from '@/components/admin/ImageUploader';
import TiptapEditor from '@/components/blog/TiptapEditor';

export default function BlogPostFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!isNew);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      summary: '',
      tags: [] as string[],
      isPublished: false,
      author: 'Admin',
      publishedAt: new Date(),
    },
  });

  const coverImage = watch('coverImage');
  const tags = (watch('tags') as string[]) || [];
  const content = watch('content');

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/blog/${id}`)
        .then((res) => res.json())
        .then((data) => { 
          reset({
            ...data,
            publishedAt: new Date(data.publishedAt),
          }); 
          setIsLoading(false); 
        });
    }
  }, [id, isNew, reset]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const currentSlug = watch('slug');
    if (!currentSlug) {
      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      setValue('slug', slug);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,$/, '');
      if (tag && !tags.includes(tag)) setValue('tags', [...tags, tag]);
      setTagInput('');
    }
  };

  const onSubmit = async (data: any) => {
    const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${id}`;
    const method = isNew ? 'POST' : 'PATCH';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('Blog post saved!', 'success');
        setTimeout(() => { router.push('/admin/blog'); router.refresh(); }, 800);
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
      <h1 className="text-2xl font-bold mb-8">{isNew ? 'New Blog Post' : 'Edit Blog Post'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input {...register('title')} onBlur={handleTitleBlur} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug <span className="text-neutral-400 font-normal text-xs">(auto-fills from title)</span></label>
            <input {...register('slug')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message as string}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <textarea {...register('summary')} rows={3} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <TiptapEditor content={content} onChange={(html) => setValue('content', html)} />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message as string}</p>}
        </div>

        <ImageUploader
          label="Cover Image"
          currentImage={coverImage}
          onUpload={(img) => setValue('coverImage', img)}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">
                {tag}
                <button type="button" onClick={() => setValue('tags', tags.filter((t) => t !== tag))} className="text-neutral-400 hover:text-red-500 leading-none">×</button>
              </span>
            ))}
          </div>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
            placeholder="Type a tag and press Enter or comma"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register('isPublished')} id="isPublished" className="w-4 h-4" />
            <label htmlFor="isPublished" className="text-sm font-medium">Published</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input {...register('author')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Blog Post'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-neutral-200 rounded-lg font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
