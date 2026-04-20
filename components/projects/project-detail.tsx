'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Play, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailProps {
  src: string;
  alt: string;
  title: string;
  allMedia?: string[]; // Optional array of all media items for gallery navigation
  currentIndex?: number; // Current index in the allMedia array when opening
}

export function ProjectDetail({ src, alt, title, allMedia = [], currentIndex = 0 }: ProjectDetailProps) {
  const [viewing, setViewing] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(currentIndex);

  const mediaItems = allMedia.length > 0 ? allMedia : [src];

  const isVideo = (mediaSrc: string) => {
    if (!mediaSrc) return false;
    return mediaSrc.includes('video') ||
      mediaSrc.endsWith('.mp4') ||
      mediaSrc.endsWith('.webm') ||
      mediaSrc.endsWith('.mov') ||
      (mediaSrc.includes('cloudinary.com') && mediaSrc.includes('/video/'));
  };

  const goToPrevious = useCallback(() => {
    setMediaIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }, [mediaItems.length]);

  const goToNext = useCallback(() => {
    setMediaIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }, [mediaItems.length]);

  useEffect(() => {
    if (!viewing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setViewing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewing, goToPrevious, goToNext]);

  const openViewer = (index: number = currentIndex) => {
    setMediaIndex(index);
    setViewing(true);
  };

  return (
    <>
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer group"
        onClick={() => openViewer(0)}
      >
        {isVideo(src) ? (
          <>
            <video
              src={src}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-16 h-16 text-white" />
            </div>
          </>
        ) : src ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <span className="flex items-center gap-2 text-white text-sm font-medium">
                <ZoomIn className="w-4 h-4" />
                View Full Size
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No preview available
          </div>
        )}

        {mediaItems.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3 h-3" />
              {mediaItems.length} items
            </span>
          </div>
        )}
      </div>

      {/* Viewer Dialog */}
      <Dialog open={viewing} onOpenChange={setViewing}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>

          {/* Close button */}
          <button
            onClick={() => setViewing(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          {mediaItems.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next button */}
          {mediaItems.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Counter */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
              {mediaIndex + 1} / {mediaItems.length}
            </div>
          )}

          {/* Media Content */}
          {mediaItems[mediaIndex] && (
            mediaItems[mediaIndex].includes('video') || isVideo(mediaItems[mediaIndex]) ? (
              <video
                src={mediaItems[mediaIndex]}
                controls
                autoPlay
                className="w-full h-full max-h-[85vh] object-contain"
              />
            ) : (
              <div className="relative w-full h-full max-h-[85vh]">
                <Image
                  src={mediaItems[mediaIndex]}
                  alt={alt}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
