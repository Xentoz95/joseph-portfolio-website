'use client';

/**
 * Image Upload Component
 *
 * Component for uploading images to Cloudinary
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = 'portfolio',
  aspectRatio = 'portrait',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - accept all image types
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 50MB for all image types)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Image must be less than 50MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        try {
          // Upload to server using JSON (more reliable than FormData for base64)
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: base64,
              folder: folder,
              fileType: 'image',
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const result = await response.json();

          clearInterval(progressInterval);
          setProgress(100);

          onChange(result.secureUrl);
          toast.success('Image uploaded successfully');

          setTimeout(() => {
            setUploading(false);
            setProgress(0);
          }, 500);
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setUploading(false);
      setProgress(0);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    onRemove?.();
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  if (value) {
    return (
      <div className={`relative group ${aspectRatioClasses[aspectRatio]} ${className}`}>
        <img
          src={value}
          alt="Upload"
          className="w-full h-full object-cover rounded-lg border"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {uploading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg border p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <Progress value={progress} className="w-full max-w-xs" />
          <p className="text-sm text-muted-foreground mt-2">
            Uploading... {progress}%
          </p>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-full bg-muted border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/80 transition-colors p-4"
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Click to upload an image
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            All image types up to 50MB
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
