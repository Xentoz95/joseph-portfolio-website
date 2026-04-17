'use client';

/**
 * Media Upload Component with Drag & Drop
 *
 * Upload images or videos via drag & drop or click to select.
 * Uses direct browser-to-Cloudinary upload for large files.
 */

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, Film, Loader2, Check, Link2 } from 'lucide-react';
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
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB

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

    // Validate file size
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      toast({
        title: 'Error',
        description: isVideo
          ? 'Video must be less than 1GB'
          : 'Image must be less than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get signature from our server
      abortControllerRef.current = new AbortController();
      const signatureResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: new URLSearchParams({
          fileType: isVideo ? 'video' : 'image',
          folder: 'portfolio/media',
          fileName: file.name,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!signatureResponse.ok) {
        const errorData = await signatureResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get upload signature');
      }

      const signatureData = await signatureResponse.json();

      // Upload directly to Cloudinary using XMLHttpRequest for progress tracking
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.apiKey);
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('signature', signatureData.signature);
      formData.append('folder', signatureData.folder);
      formData.append('resource_type', signatureData.resourceType);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              setProgress(100);
              onChange(result.secure_url);
              toast({
                title: 'Success',
                description: 'File uploaded successfully',
              });
              resolve();
            } catch {
              reject(new Error('Invalid response from Cloudinary'));
            }
          } else {
            try {
              const errorResult = JSON.parse(xhr.responseText);
              reject(new Error(errorResult.error?.message || `Upload failed with status ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${signatureData.resourceType}/upload`;
        xhr.open('POST', uploadUrl);
        xhr.send(formData);
      });

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      toast({
        title: 'Upload Failed',
        description: message,
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

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
      toast({
        title: 'Success',
        description: 'URL set successfully',
      });
    }
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
    (value?.includes('cloudinary.com') && value.includes('/video/'));

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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg border p-4 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <Progress value={progress} className="w-full max-w-xs" />
          <p className="text-sm text-muted-foreground mt-2">
            Uploading... {progress}%
          </p>
        </div>
      ) : showUrlInput ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg border p-4 z-10">
          <Link2 className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">Enter media URL</p>
          <div className="flex gap-2 w-full max-w-xs">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 text-sm rounded-md border bg-background"
              autoFocus
            />
            <Button onClick={handleUrlSubmit} size="sm">Add</Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(false)}
            className="mt-2"
          >
            Cancel
          </Button>
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
            {type === 'video'
              ? 'Videos up to 1GB'
              : type === 'image'
                ? 'Images up to 50MB'
                : 'Images up to 50MB, videos up to 1GB'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowUrlInput(true);
            }}
            className="mt-2"
          >
            <Link2 className="h-4 w-4 mr-1" />
            Or use URL
          </Button>
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