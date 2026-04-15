'use client';

/**
 * Media Upload Component with Drag & Drop
 *
 * Upload images or videos via drag & drop or click to select
 */

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, Film, Loader2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MediaUploadProps {
  value?: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video' | 'any';
  aspectRatio?: 'square' | 'video' | 'portrait' | 'any';
  className?: string;
}

export function MediaUpload({
  value,
  onChange,
  type = 'any',
  aspectRatio = 'any',
  className = '',
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Determine if it's a video
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    // Validate file type
    if (type === 'image' && !isImage) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }
    if (type === 'video' && !isVideo) {
      toast({
        title: 'Error',
        description: 'Please select a video file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (50MB max for media)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File must be less than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        // Faster progress simulation
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) {
              clearInterval(progressInterval);
              return 85;
            }
            return prev + 15;
          });
        }, 100);

        try {
          // Upload to server
          const formData = new FormData();
          formData.append('file', base64);
          formData.append('folder', 'portfolio/media');
          formData.append('fileType', isVideo ? 'video' : 'image');

          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to upload file');
          }

          const result = await response.json();

          clearInterval(progressInterval);
          setProgress(100);

          onChange(result.secureUrl);
          toast({
            title: 'Success',
            description: 'File uploaded successfully',
          });

          setTimeout(() => {
            setUploading(false);
            setProgress(0);
          }, 500);
        } catch (error) {
          clearInterval(progressInterval);
          console.error('Upload error:', error);
          toast({
            title: 'Upload Failed',
            description: error instanceof Error ? error.message : 'Failed to upload file',
            variant: 'destructive',
          });
          setUploading(false);
          setProgress(0);
        }
      };

      reader.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to read file',
          variant: 'destructive',
        });
        setUploading(false);
        setProgress(0);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [type]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
  };

  const aspectRatioClasses = {
    square: 'aspect-square max-h-64',
    video: 'aspect-video max-h-80',
    portrait: 'aspect-[3/4] max-h-80',
    any: 'min-h-[150px] max-h-80',
  };

  const isVideo = value?.includes('video') ||
    value?.endsWith('.mp4') ||
    value?.endsWith('.webm') ||
    value?.endsWith('.mov') ||
    value?.includes('cloudinary.com') && value.includes('/video/');

  if (value) {
    return (
      <div className={`relative group ${aspectRatio !== 'any' ? aspectRatioClasses[aspectRatio] : ''} ${className}`}>
        {isVideo ? (
          <video
            src={value}
            controls
            className="w-full h-full object-contain rounded-lg border bg-muted"
          />
        ) : (
          <img
            src={value}
            alt="Upload"
            className="w-full h-full object-contain rounded-lg border bg-muted"
          />
        )}
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
        <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1">
          <Check className="h-3 w-3" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatio !== 'any' ? aspectRatioClasses[aspectRatio] : ''} ${className}`}>
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
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            flex flex-col items-center justify-center w-full h-full min-h-[150px] bg-muted border-2 border-dashed rounded-lg cursor-pointer transition-colors p-4
            ${dragOver ? 'border-primary bg-primary/10' : 'hover:bg-muted/80'}
          `}
        >
          {type === 'video' || type === 'any' ? (
            <Film className="h-10 w-10 text-muted-foreground mb-2" />
          ) : (
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          )}
          <p className="text-sm text-muted-foreground text-center">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {type === 'video' ? 'Video files up to 50MB' : type === 'image' ? 'Images up to 50MB' : 'Images or videos up to 50MB'}
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
    </div>
  );
}
