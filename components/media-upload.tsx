'use client';

/**
 * Media Upload Component
 *
 * Provides a Cloudinary-powered upload widget for media management.
 * Features drag-and-drop, multiple file selection, and progress tracking.
 */

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface MediaUploadProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  onUploadError?: (error: Error) => void;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  uploadPreset?: string;
  folder?: string;
}

export function MediaUpload({
  onUploadComplete,
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  multiple = true,
  maxFiles = 10,
  className,
  uploadPreset = 'unsigned_upload',
  folder = 'portfolio',
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `Invalid file type: ${file.type}. Accepted formats: ${acceptedFormats.join(', ')}`;
      }
      if (file.size > maxSize) {
        return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`;
      }
      return null;
    },
    [acceptedFormats, maxSize]
  );

  const uploadToCloudinary = useCallback(
    async (file: File): Promise<UploadedFile> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }

      const data = await response.json();

      return {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    },
    [uploadPreset, folder]
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files).slice(0, maxFiles);
      const errors: string[] = [];
      const validFiles: File[] = [];

      // Validate files
      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      }

      if (errors.length > 0) {
        onUploadError?.(new Error(errors.join('\n')));
      }

      if (validFiles.length === 0) {
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const uploadedFiles: UploadedFile[] = [];

        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          const progress = Math.round(((i + 1) / validFiles.length) * 100);
          setUploadProgress(progress);

          const uploadedFile = await uploadToCloudinary(file);
          uploadedFiles.push(uploadedFile);
        }

        onUploadComplete(uploadedFiles);
      } catch (error) {
        const uploadError = error instanceof Error ? error : new Error('Upload failed');
        onUploadError?.(uploadError);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [maxFiles, validateFile, uploadToCloudinary, onUploadComplete, onUploadError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  return (
    <div className={cn('w-full', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-colors',
          'hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900',
          isDragging && 'border-blue-500 bg-slate-50 dark:bg-slate-900',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          type="file"
          id="media-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          accept={acceptedFormats.join(',')}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-sm font-medium">Uploading... {uploadProgress}%</p>
              <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Upload className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  {multiple ? 'Drop files here or click to upload' : 'Drop a file or click to upload'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {acceptedFormats.join(', ').toUpperCase()} • Max {Math.round(maxSize / 1024 / 1024)}MB
                  {multiple && ` • Up to ${maxFiles} files`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Media Item Component
 *
 * Displays an uploaded media item with remove option.
 */
export interface MediaItemProps {
  file: UploadedFile;
  onRemove?: () => void;
  className?: string;
}

export function MediaItem({ file, onRemove, className }: MediaItemProps) {
  return (
    <div
      className={cn(
        'relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700',
        className
      )}
    >
      <img
        src={file.url}
        alt={file.publicId}
        className="w-full h-32 object-cover"
        loading="lazy"
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-white p-2 text-xs truncate">
        {file.publicId.split('/').pop()}
      </div>
    </div>
  );
}

/**
 * Media Gallery Component
 *
 * Displays a grid of uploaded media items.
 */
export interface MediaGalleryProps {
  files: UploadedFile[];
  onRemove?: (publicId: string) => void;
  className?: string;
}

export function MediaGallery({ files, onRemove, className }: MediaGalleryProps) {
  if (files.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8', className)}>
        <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-sm text-slate-500 dark:text-slate-400">No files uploaded</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {files.map((file) => (
        <MediaItem
          key={file.publicId}
          file={file}
          onRemove={onRemove ? () => onRemove(file.publicId) : undefined}
        />
      ))}
    </div>
  );
}
