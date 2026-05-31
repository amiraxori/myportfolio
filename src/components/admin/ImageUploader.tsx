'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUpload: (data: { url: string; publicId: string }) => void;
  currentImage?: { url: string; publicId: string };
  label?: string;
}

export default function ImageUploader({ onUpload, currentImage, label }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage?.url || null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get signature
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = { timestamp };
      
      const sigResponse = await fetch('/api/admin/uploads/signature', {
        method: 'POST',
        body: JSON.stringify({ paramsToSign }),
      });
      const { signature, apiKey, cloudName } = await sigResponse.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const uploadData = await uploadResponse.json();

      if (uploadData.secure_url) {
        setPreview(uploadData.secure_url);
        onUpload({
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
          {preview ? (
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              sizes="128px"
              className="object-cover" 
            />
          ) : (
            <span className="text-xs text-neutral-400 text-center px-2">No image</span>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 dark:file:bg-neutral-800 dark:file:text-neutral-300 hover:file:bg-neutral-200"
        />
      </div>
    </div>
  );
}
