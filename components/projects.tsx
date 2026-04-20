'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { about } from '@/data';
import { ExternalLink, Github, ArrowRight, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Project type matching local JSON
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  thumbnail: string;
  hero: string;
  gallery: string[];
  alt: string;
  featured: boolean;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  published: boolean;
}

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web' },
  { value: 'system', label: 'Systems' },
  { value: 'dashboard', label: 'Dashboards' },
  { value: 'design', label: 'Design' },
  { value: 'video', label: 'Videos' },
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  const filteredProjects = selectedCategory === 'all'
    ? projects.filter(p => p.published)
    : projects.filter(p => p.published && p.category === selectedCategory);

  const featuredProjects = filteredProjects.filter(p => p.featured).slice(0, 6);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : filteredProjects.slice(0, 6);

  // Get all thumbnails for navigation
  const allThumbnails = displayProjects.map(p => p.thumbnail).filter(Boolean);

  const openFullscreen = (thumbnail: string) => {
    const index = allThumbnails.indexOf(thumbnail);
    setFullscreenIndex(index >= 0 ? index : 0);
    setFullscreenImage(thumbnail);
  };

  const goToPreviousImage = () => {
    const newIndex = fullscreenIndex === 0 ? allThumbnails.length - 1 : fullscreenIndex - 1;
    setFullscreenIndex(newIndex);
    setFullscreenImage(allThumbnails[newIndex]);
  };

  const goToNextImage = () => {
    const newIndex = fullscreenIndex === allThumbnails.length - 1 ? 0 : fullscreenIndex + 1;
    setFullscreenIndex(newIndex);
    setFullscreenImage(allThumbnails[newIndex]);
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-card relative overflow-hidden">
      {/* Brand Watermark Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/brand/4.png"
          alt=""
          fill
          className="object-cover opacity-[0.05] grayscale"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn delay={100} className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
          Featured Projects
        </FadeIn>
        <FadeIn delay={200} className="text-lg text-muted-foreground mb-8 block">
          A selection of recent work showcasing web, system, and dashboard solutions
        </FadeIn>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, index) => (
              <FadeIn key={project.id} delay={index * 100}>
                <div className="bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden cursor-zoom-in" onClick={() => { if (project.thumbnail) openFullscreen(project.thumbnail); }}>
                    <Image
                      src={project.thumbnail || '/images/placeholder.png'}
                      alt={project.alt || project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-1 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Links */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-border/50">
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects found in this category.</p>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 border border-primary/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-primary">{about.stats.projects}+</h4>
              <p className="text-foreground/80">Web & System Projects</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-primary">{about.stats.clients}+</h4>
              <p className="text-foreground/80">Happy Clients & Teams</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-primary">{about.stats.years}+</h4>
              <p className="text-foreground/80">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          {allThumbnails.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next button */}
          {allThumbnails.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Counter */}
          {allThumbnails.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
              {fullscreenIndex + 1} / {allThumbnails.length}
            </div>
          )}

          <img
            src={fullscreenImage}
            alt="Fullscreen preview"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
