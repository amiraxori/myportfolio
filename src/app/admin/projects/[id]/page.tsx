'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/validation/schemas';
import ImageUploader from '@/components/admin/ImageUploader';
import Image from 'next/image';

export default function ProjectFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!isNew);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [techInput, setTechInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      tech: [] as string[],
      gallery: [] as { url: string; publicId: string }[],
      featured: false,
      order: 0,
    },
  });

  const coverImage = watch('coverImage');
  const tech = (watch('tech') as string[]) || [];
  const gallery = (watch('gallery') as { url: string; publicId: string }[]) || [];

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/projects/${id}`)
        .then((res) => res.json())
        .then((data) => { reset(data); setIsLoading(false); });
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

  const addTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && techInput.trim()) {
      e.preventDefault();
      const tag = techInput.trim().replace(/,$/, '');
      if (tag && !tech.includes(tag)) setValue('tech', [...tech, tag]);
      setTechInput('');
    }
  };

  const onSubmit = async (data: any) => {
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${id}`;
    const method = isNew ? 'POST' : 'PATCH';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('Project saved!', 'success');
        setTimeout(() => { router.push('/admin/projects'); router.refresh(); }, 800);
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
      <h1 className="text-2xl font-bold mb-8">{isNew ? 'New Project' : 'Edit Project'}</h1>

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
          <input {...register('summary')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} rows={10} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium mb-1">Tech Stack</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tech.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">
                {tag}
                <button type="button" onClick={() => setValue('tech', tech.filter((t) => t !== tag))} className="text-neutral-400 hover:text-red-500 leading-none">×</button>
              </span>
            ))}
          </div>
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={addTech}
            className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
            placeholder="Type a tech and press Enter or comma"
          />
          <p className="text-xs text-neutral-500 mt-1">Press Enter or , to add each tag</p>
        </div>

        <ImageUploader
          label="Cover Image"
          currentImage={coverImage}
          onUpload={(img) => setValue('coverImage', img)}
        />
        {errors.coverImage && <p className="text-red-500 text-xs mt-1">Cover image is required</p>}

        {/* Gallery */}
        <div>
          <label className="block text-sm font-medium mb-2">Gallery Images</label>
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {gallery.map((img) => (
                <div key={img.publicId} className="relative group aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <Image 
                    src={img.url} 
                    alt="" 
                    fill 
                    sizes="(max-width: 768px) 33vw, 200px"
                    className="object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => setValue('gallery', gallery.filter((g) => g.publicId !== img.publicId))}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >×</button>
                </div>
              ))}
            </div>
          )}
          <ImageUploader
            label="Add Gallery Image"
            onUpload={(img) => setValue('gallery', [...gallery, img])}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Impact</label>
          <textarea {...register('impact')} rows={3} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" placeholder="e.g. 3× faster load time, 50% more conversions" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Live URL</label>
            <input {...register('liveUrl')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Repo URL</label>
            <input {...register('repoUrl')} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register('featured')} id="featured" className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm font-medium">Featured on Homepage</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input type="number" {...register('order', { valueAsNumber: true })} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-neutral-200 rounded-lg font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
