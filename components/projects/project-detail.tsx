'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Play, X, ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ProjectDetailProps {
  src: string;
  alt: string;
  title: string;
  allMedia?: string[];
  currentIndex?: number;
}

/**
 * Check if a source is a video
 */
function isVideoSrc(mediaSrc: string): boolean {
  if (!mediaSrc) return false;
  return mediaSrc.includes('video') ||
    mediaSrc.endsWith('.mp4') ||
    mediaSrc.endsWith('.webm') ||
    mediaSrc.endsWith('.mov') ||
    (mediaSrc.includes('cloudinary.com') && mediaSrc.includes('/video/'));
}

/**
 * Get Cloudinary video poster URL
 */
function getVideoPosterUrl(videoSrc: string): string | null {
  if (!videoSrc.includes('cloudinary.com') || !videoSrc.includes('/video/')) {
    return null;
  }
  try {
    // Generate poster from first frame
    return videoSrc.replace('/video/upload/', '/video/upload/f_jpg,so_0,w_1280/');
  } catch {
    return null;
  }
}

export function ProjectDetail({ src, alt, title, allMedia = [], currentIndex = 0 }: ProjectDetailProps) {
  const [viewing, setViewing] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(currentIndex);
  const mediaViewerRef = useRef<HTMLDivElement>(null);
  const mediaContentRef = useRef<HTMLDivElement>(null);
  const mediaElementRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);

  const mediaItems = allMedia.length > 0 ? allMedia : [src];
  const currentMedia = mediaItems[mediaIndex];
  const isCurrentVideo = isVideoSrc(currentMedia || '');
  const posterUrl = isCurrentVideo ? getVideoPosterUrl(currentMedia || '') : null;

  // Build all media items with type info
  const getMediaType = (mediaSrc: string) => isVideoSrc(mediaSrc) ? 'video' : 'image';

  const goToPrevious = useCallback(() => {
    setMediaIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }, [mediaItems.length]);

  const goToNext = useCallback(() => {
    setMediaIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }, [mediaItems.length]);

  const toggleFullscreen = useCallback(async () => {
    // Exit fullscreen if already in fullscreen
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    // Request fullscreen on the actual media element (img or video)
    const mediaEl = mediaElementRef.current;
    if (mediaEl) {
      try {
        await mediaEl.requestFullscreen();
      } catch (err) {
        console.warn('Fullscreen request failed:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!viewing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        setViewing(false);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewing, goToPrevious, goToNext, toggleFullscreen]);

  // Reset index when media changes
  useEffect(() => {
    setMediaIndex(currentIndex);
  }, [currentIndex]);

  const openViewer = (index: number) => {
    setMediaIndex(index);
    setViewing(true);
  };

  const closeViewer = () => {
    setViewing(false);
  };

  return (
    <>
      {/* Thumbnail/Preview */}
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer group"
        onClick={() => openViewer(currentIndex)}
      >
        {isVideoSrc(src) ? (
          <>
            <video
              src={src}
              poster={posterUrl || undefined}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 rounded text-white text-xs font-medium flex items-center gap-1">
              <Play className="w-3 h-3 fill-white" />
              VIDEO
            </div>
          </>
        ) : src ? (
          <>
            {/* Use regular img tag for external URLs (Cloudinary) to ensure click works */}
            {src.includes('cloudinary.com') || src.startsWith('http') ? (
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover cursor-pointer"
              />
            ) : (
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                unoptimized={src.includes('cloudinary.com')}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
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
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm font-medium">
            {mediaItems.length} items - Click to view
          </div>
        )}
      </div>

      {/* Fullscreen Media Viewer Modal */}
      {viewing && (
        <div
          ref={mediaViewerRef}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeViewer}
        >
          {/* Close button */}
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Fullscreen toggle button (for images) */}
          {getMediaType(currentMedia || '') === 'image' && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="absolute top-4 right-16 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Toggle Fullscreen"
              title="Toggle Fullscreen (F)"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          )}

          {/* Previous button */}
          {mediaItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next button */}
          {mediaItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Counter */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/50 rounded-full text-white text-sm font-medium">
              {mediaIndex + 1} of {mediaItems.length}
            </div>
          )}

          {/* Media Content - click to toggle play for video */}
          <div
            ref={mediaContentRef}
            className="max-w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia && (
              getMediaType(currentMedia) === 'video' ? (
                <video
                  ref={(el) => { if (el) mediaElementRef.current = el; }}
                  src={currentMedia}
                  poster={getVideoPosterUrl(currentMedia) || undefined}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                /* Use regular img tag for external URLs (Cloudinary) to avoid Next.js Image issues */
                currentMedia.includes('cloudinary.com') || currentMedia.startsWith('http') ? (
                  <img
                    ref={(el) => { if (el) mediaElementRef.current = el; }}
                    src={currentMedia}
                    alt={alt || title}
                    className="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open image in new tab for native fullscreen
                      window.open(currentMedia, '_blank');
                    }}
                  />
                ) : (
                  <div className="relative w-full h-full max-h-[90vh] aspect-video" onClick={(e) => { e.stopPropagation(); window.open(currentMedia, '_blank'); }}>
                    <Image
                      src={currentMedia}
                      alt={alt || title}
                      fill
                      className="object-contain cursor-zoom-out"
                      quality={100}
                      priority
                      unoptimized={currentMedia.includes('cloudinary.com')}
                    />
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
