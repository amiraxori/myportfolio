'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

type FormData = z.infer<typeof leadSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Error submitting form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-12 bg-neutral-50 dark:bg-neutral-900 rounded-2xl">
        <h3 className="text-2xl font-bold mb-4">Thank you!</h3>
        <p className="text-neutral-600 dark:text-neutral-400">Your message has been received. I will get back to you shortly.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            {...register('name')}
            className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-transparent`}
            placeholder="Amir Shrestha"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            {...register('email')}
            className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-transparent`}
            placeholder="youremail@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="hidden">
        <label>Website</label>
        <input {...register('website' as any)} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Company (Optional)</label>
          <input
            {...register('company')}
            className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
            placeholder="Hamrobazar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Package interested in</label>
          <select
            {...register('package')}
            className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
          >
            <option value="">Select a package</option>
            <option value="static">Static Site (NPR 10k+)</option>
            <option value="dynamic-cms">Dynamic + CMS (NPR 25k+)</option>
            <option value="ecommerce">E-commerce (NPR 450k+)</option>
            <option value="custom">Custom Development</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          className={`w-full p-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-transparent`}
          placeholder="Tell me about your project..."
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-blue-600 text-white dark:bg-blue-500 rounded-lg font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
